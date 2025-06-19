import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PricingSection from "./PricingSection";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const tasks = [
  { path: "/task1", label: "Task 1", icon: "💳" },
  { path: "/task2", label: "Task 2", icon: "📝" },
  { path: "/task3", label: "Task 3", icon: "📊" },
];

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181e27]">
      <h1 className="text-3xl font-bold text-slate-200 mb-12">Choose a task</h1>
      <div className="flex flex-row space-x-8">
        {tasks.map((task) => (
          <Link
            key={task.path}
            to={task.path}
            className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 hover:bg-slate-200 transition"
          >
            <span className="text-5xl mb-2">{task.icon}</span>
            <span className="font-semibold text-slate-600">{task.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Task1Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181e27]">
      <PricingSection />
      <Link to="/" className="mt-8 underline text-blue-300">Back to Home</Link>
    </div>
  );
}

function Task2Menu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#181e27]">
      <nav className="fixed top-0 left-0 w-full bg-white flex md:flex-row flex-col md:justify-between md:items-center text-black z-30">
        <div className="flex justify-between items-center w-full px-4 py-4 max-w-5xl">
          <span className="font-bold text-lg text-black">Logo</span>
          <button
            className="md:hidden px-4 py-2 border rounded"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
        <ul
          className={
            `menu gap-8 flex-col md:flex-row
            flex md:flex
            absolute md:static left-0 md:left-0 w-full md:w-auto bg-white transition-all duration-300 ease-in-out z-10
            text-black
            ${open ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-[150%] opacity-0 pointer-events-none'} md:translate-y-0 md:opacity-100 md:pointer-events-auto`
          }
          style={{
            top: 64,
            padding: typeof window !== 'undefined' && window.innerWidth >= 768 ? '0' : '1.5rem 2rem',
            justifyContent: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'center' : undefined,
            borderRadius: typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : '0 0 0.5rem 0.5rem',
            boxShadow: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <li className="py-2 px-4 hover:bg-slate-100 cursor-pointer">Home</li>
          <li className="py-2 px-4 hover:bg-slate-100 cursor-pointer">About</li>
          <li className="py-2 px-4 hover:bg-slate-100 cursor-pointer">Contact</li>
        </ul>
      </nav>
      <div className="flex-1" />
      <div className="flex justify-center pb-8">
        <Link to="/" className="underline text-blue-300">Back to Home</Link>
      </div>
    </div>
  );
}

function TaskStub({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181e27] text-white">
      <h2 className="text-3xl font-bold mb-4">{label}</h2>
      <p>Here will be the implementation of the task "{label}"</p>
      <Link to="/" className="mt-8 underline text-blue-300">Back to Home</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task1" element={<Task1Page />} />
        <Route path="/task2" element={<Task2Menu />} />
        <Route path="/task3" element={<Dashboard />} />
      </Routes>
    </Router>
  );
} 