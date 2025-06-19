import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WebVitalsDisplay from "./WebVitalsDisplay";
import { onFCP, onLCP } from "web-vitals";
import type { Metric } from "web-vitals";
import beforeImgAsset from './assets/Without Web worker.png';
import afterImgAsset from './assets/With Web worker.png';
import Tesseract from 'tesseract.js';

function MetricInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type="number" step="any" value={value} onChange={e => onChange(e.target.value)} className="w-full border rounded px-2 py-1" />
    </div>
  );
}

function MetricCompareTable({ before, after }: { before: any, after: any }) {
  const metrics = ["FCP", "LCP", "TBT", "TTI"];
  function getColor(b: number, a: number, better: 'less'|'more') {
    if (isNaN(b) || isNaN(a)) return 'text-gray-500';
    if (b === a) return 'text-gray-700';
    if (better === 'less') return a < b ? 'text-green-600' : 'text-red-600';
    return a > b ? 'text-green-600' : 'text-red-600';
  }
  return (
    <table className="w-full mt-4 border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Metric</th>
          <th className="p-2 border">Before</th>
          <th className="p-2 border">After</th>
          <th className="p-2 border">Difference</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map(m => {
          const b = parseFloat(before[m] || '');
          const a = parseFloat(after[m] || '');
          const diff = isNaN(b) || isNaN(a) ? '' : (a - b).toFixed(2);
          const better = m === 'FCP' || m === 'LCP' || m === 'TBT' || m === 'TTI' ? 'less' : 'more';
          return (
            <tr key={m}>
              <td className="p-2 border font-semibold">{m}</td>
              <td className="p-2 border">{before[m]}</td>
              <td className={"p-2 border " + getColor(b, a, better)}>{after[m]}</td>
              <td className={"p-2 border " + getColor(b, a, better)}>{diff}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Dashboard() {
  const [d, setD] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [beforeImg, setBeforeImg] = useState<string | null>(beforeImgAsset);
  const [afterImg, setAfterImg] = useState<string | null>(afterImgAsset);
  const [beforeMetrics, setBeforeMetrics] = useState({ FCP: '1200', LCP: '1900', TBT: '400', TTI: '1900' });
  const [afterMetrics, setAfterMetrics] = useState({ FCP: '1100', LCP: '1900', TBT: '0', TTI: '1900' });
  const [showCompare, setShowCompare] = useState(false);
  const [webVitals, setWebVitals] = useState<any>({});
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    // Web Worker for heavy calculations
    const workerCode = () => {
      self.onmessage = () => {
        let t = 0;
        for (let i = 0; i < 1e9; i++) { t += i; }
        // @ts-ignore
        self.postMessage(t);
      };
    };
    try {
      const code = workerCode.toString();
      const blob = new Blob([`(${code})()`], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = (e) => {
        setD(e.data);
        worker.terminate();
      };
      worker.onerror = (e) => {
        setError("Worker error: " + e.message);
        worker.terminate();
      };
      worker.postMessage('start');
    } catch (err) {
      setError("Failed to create worker: " + (err instanceof Error ? err.message : String(err)));
    }
    // web-vitals subscriptions for auto-filling "After"
    onFCP((metric: Metric) => setWebVitals((m: any) => ({ ...m, FCP: metric.value })));
    onLCP((metric: Metric) => setWebVitals((m: any) => ({ ...m, LCP: metric.value })));
    // TTI directly not available, but LCP can be used as an approximation
    // TBT cannot be obtained directly, leaving manual input
  }, []);
  useEffect(() => {
    // Automatically fill web-vitals values in afterMetrics
    setAfterMetrics(m => ({
      FCP: webVitals.FCP ? webVitals.FCP.toFixed(2) : m.FCP,
      LCP: webVitals.LCP ? webVitals.LCP.toFixed(2) : m.LCP,
      // TTI: using LCP as an approximation if field is empty
      TTI: (!m.TTI || m.TTI === '') && webVitals.LCP ? webVitals.LCP.toFixed(2) : m.TTI,
      TBT: m.TBT
    }));
  }, [webVitals.FCP, webVitals.LCP]);
  useEffect(() => {
    async function runOcrAndFill() {
      setOcrLoading(true);
      try {
        // Helper to extract metrics from OCR text
        function extractMetrics(text: string) {
          console.log('OCR text:', text); // Debug output
          const fcp = /First\s*Contentful\s*Paint\s*([\d.,]+)\s*s?/i.exec(text)?.[1]
            || /FCP\s*([\d.,]+)\s*s?/i.exec(text)?.[1];
          const lcp = /Largest\s*Contentful\s*Paint\s*([\d.,]+)\s*s?/i.exec(text)?.[1];
          // Improved TBT extraction:
          const tbtMatch = /Total\s*Blocking\s*Time[^\d]*([\d.,]+)\s*ms/i.exec(text)
            || /Total\s*Blocking\s*Time[\s\S]{0,30}?([\d.,]+)\s*ms/i.exec(text);
          const tbtFallback = /METRICS[\s\S]{0,100}?([\d.,]+)\s*ms/i.exec(text)
            || /([\d.,]+)\s*ms/i.exec(text);
          const tbt = tbtMatch?.[1] || tbtFallback?.[1] || '';
          const tti = /Time\s*to\s*Interactive\s*([\d.,]+)\s*s?/i.exec(text)?.[1] || lcp;
          return {
            FCP: fcp ? (parseFloat(fcp.replace(',', '.')) * 1000).toFixed(0) : '',
            LCP: lcp ? (parseFloat(lcp.replace(',', '.')) * 1000).toFixed(0) : '',
            TBT: tbt ? tbt.replace(',', '.') : '',
            TTI: tti ? (parseFloat(tti.replace(',', '.')) * 1000).toFixed(0) : ''
          };
        }
        // OCR for before image
        const beforeRes = await Tesseract.recognize(beforeImgAsset, 'eng');
        const beforeMetricsParsed = extractMetrics(beforeRes.data.text);
        setBeforeMetrics(m => ({
          FCP: beforeMetricsParsed.FCP || m.FCP,
          LCP: beforeMetricsParsed.LCP || m.LCP,
          TBT: beforeMetricsParsed.TBT || m.TBT,
          TTI: beforeMetricsParsed.TTI || m.TTI
        }));
        // OCR for after image
        const afterRes = await Tesseract.recognize(afterImgAsset, 'eng');
        const afterMetricsParsed = extractMetrics(afterRes.data.text);
        setAfterMetrics(m => ({
          FCP: afterMetricsParsed.FCP || m.FCP,
          LCP: afterMetricsParsed.LCP || m.LCP,
          TBT: afterMetricsParsed.TBT || m.TBT,
          TTI: afterMetricsParsed.TTI || m.TTI
        }));
      } catch (e) {
        // If OCR fails, keep default values
      }
      setOcrLoading(false);
    }
    runOcrAndFill();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181e27] text-white">
      <h2 className="text-2xl font-bold mb-4">Dashboard (Web Worker)</h2>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      <div className="text-3xl mb-8">{d === null && !error ? 'Calculating...' : d}</div>
      {/* Improved Web Vitals block */}

      {/* Instructions and screenshot comparison */}
      <div className="bg-white text-black rounded p-4 w-full max-w-3xl mt-8 shadow-md">
        <h3 className="font-bold mb-2">How to compare metrics before and after Web Worker:</h3>
        <ol className="list-decimal pl-6 mb-2">
          <li>Open DevTools → Lighthouse.</li>
          <li>On the page <b>without Web Worker</b> (or with a heavy loop on the main thread), run the audit and save a screenshot of the results.</li>
          <li>On this page (with Web Worker), run Lighthouse again and save a screenshot.</li>
          <li>Compare the values of <b>TBT</b>, <b>TTI</b>, <b>FCP</b>, <b>LCP</b> — they should improve.</li>
        </ol>
        <div className="flex flex-col md:flex-row gap-8 mt-6 items-start justify-center">
          <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow border flex flex-col items-center">
            <label className="block font-semibold mb-1">Before Web Worker</label>
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setBeforeImg(url);
              }
            }} />
            {beforeImg && <img src={beforeImg} alt="Before Web Worker" className="mt-2 rounded shadow max-h-64" />}
          </div>
          <div className="flex flex-col items-center justify-center mx-2 my-4 md:my-0">
            <span className="text-3xl">⇄</span>
            <span className="text-gray-500 text-xs">or</span>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow border flex flex-col items-center">
            <label className="block font-semibold mb-1">After Web Worker</label>
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setAfterImg(url);
              }
            }} />
            {afterImg && <img src={afterImg} alt="After Web Worker" className="mt-2 rounded shadow max-h-64" />}
          </div>
        </div>
        {/* Manual metrics comparison block */}
        <div className="mt-8">
          <h4 className="font-semibold mb-2">Compare metrics manually:</h4>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow border">
              <div className="font-semibold mb-2">Before Web Worker</div>
              <MetricInput label="FCP (ms)" value={beforeMetrics.FCP} onChange={v => setBeforeMetrics(m => ({ ...m, FCP: v }))} />
              <MetricInput label="LCP (ms)" value={beforeMetrics.LCP} onChange={v => setBeforeMetrics(m => ({ ...m, LCP: v }))} />
              <MetricInput label="TBT (ms)" value={beforeMetrics.TBT} onChange={v => setBeforeMetrics(m => ({ ...m, TBT: v }))} />
              <MetricInput label="TTI (ms)" value={beforeMetrics.TTI} onChange={v => setBeforeMetrics(m => ({ ...m, TTI: v }))} />
            </div>
            <div className="flex flex-col items-center justify-center mx-2 my-4 md:my-0">
              <span className="text-3xl">⇄</span>
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow border">
              <div className="font-semibold mb-2">After Web Worker</div>
              <MetricInput label="FCP (ms)" value={afterMetrics.FCP} onChange={v => setAfterMetrics(m => ({ ...m, FCP: v }))} />
              <MetricInput label="LCP (ms)" value={afterMetrics.LCP} onChange={v => setAfterMetrics(m => ({ ...m, LCP: v }))} />
              <MetricInput label="TBT (ms)" value={afterMetrics.TBT} onChange={v => setAfterMetrics(m => ({ ...m, TBT: v }))} />
              <MetricInput label="TTI (ms)" value={afterMetrics.TTI} onChange={v => setAfterMetrics(m => ({ ...m, TTI: v }))} />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => setShowCompare(true)}>
            Compare
          </button>
          {showCompare && <MetricCompareTable before={beforeMetrics} after={afterMetrics} />}
        </div>
      </div>
      {ocrLoading && <div className="text-yellow-300 mb-4">Extracting metrics from screenshots...</div>}
      <Link to="/" className="mt-8 underline text-blue-300">Back to Home</Link>
    </div>
  );
} 