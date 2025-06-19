import { useEffect, useState } from "react";
import { onFCP, onLCP, onTTFB, onCLS } from "web-vitals";
import type { Metric } from "web-vitals";

export default function WebVitalsDisplay() {
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    onFCP((metric: Metric) => setMetrics((m: any) => ({ ...m, fcp: metric.value })));
    onLCP((metric: Metric) => setMetrics((m: any) => ({ ...m, lcp: metric.value })));
    onTTFB((metric: Metric) => setMetrics((m: any) => ({ ...m, ttfb: metric.value })));
    onCLS((metric: Metric) => setMetrics((m: any) => ({ ...m, cls: metric.value })));
  }, []);

  return (
    <div className="bg-white text-black rounded p-4 w-full max-w-md mt-8 shadow-md">
      <h3 className="font-bold mb-2">Web Vitals:</h3>
      <ul className="list-disc pl-6">
        <li>First Contentful Paint: {metrics.fcp ? metrics.fcp.toFixed(2) + ' ms' : '...'}</li>
        <li>Largest Contentful Paint: {metrics.lcp ? metrics.lcp.toFixed(2) + ' ms' : '...'}</li>
        <li>Time to First Byte: {metrics.ttfb ? metrics.ttfb.toFixed(2) + ' ms' : '...'}</li>
        <li>CLS: {metrics.cls !== undefined ? metrics.cls : '0 (no layout shifts)'}</li>
      </ul>
    </div>
  );
} 