import { useState } from "react";
import { Search, Globe } from "lucide-react";
import { Spinner } from "./ui/Spinner";

export function StockInput({ onAnalyze, isLoading }) {
  const [ticker, setTicker] = useState("");
  const [market, setMarket] = useState("US");
  const [error, setError] = useState("");

  const MARKETS = [
    { label: "US", value: "US" },
    { label: "India", value: "India" },
    { label: "UK", value: "UK" },
    { label: "Japan", value: "Japan" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();

    if (!cleanTicker) {
      setError("Please enter a stock ticker");
      return;
    }

    if (!/^[A-Z]+$/.test(cleanTicker)) {
      setError("Invalid ticker format. Use letters only.");
      return;
    }

    setError("");
    onAnalyze({ ticker: cleanTicker, market });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value.toUpperCase());
              if (error) setError("");
            }}
            className="block w-full p-4 pl-12 text-sm md:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            placeholder="Enter stock ticker (e.g. AAPL, TSLA)..."
            disabled={isLoading}
          />
        </div>

        <div className="relative md:w-48">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <Globe size={18} />
          </div>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            disabled={isLoading}
            className="block w-full p-4 pl-11 text-sm md:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer"
          >
            {MARKETS.map(m => (
              <option key={m.label} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !ticker.trim()}
          className="px-6 md:px-8 py-4 text-white bg-primary hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? <Spinner size={18} className="text-white" /> : null}
          <span>{isLoading ? "Analyzing..." : "Analyze"}</span>
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger animate-in fade-in slide-in-from-top-1">{error}</p>}
    </form>
  );
}
