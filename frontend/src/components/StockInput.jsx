import React, { useState } from "react";
import { Search } from "lucide-react";
import { Spinner } from "./ui/Spinner";

export function StockInput({ onAnalyze, isLoading }) {
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState("");

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
    onAnalyze(cleanTicker);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
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
        <button
          type="submit"
          disabled={isLoading || !ticker.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 md:px-6 text-white bg-primary hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading ? <Spinner size={18} className="text-white" /> : null}
          <span>{isLoading ? "Analyzing..." : "Analyze"}</span>
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger animate-in fade-in slide-in-from-top-1">{error}</p>}
    </form>
  );
}
