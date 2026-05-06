import { useState } from "react";
import { StockInput } from "./components/StockInput";
import { PredictionCard } from "./components/PredictionCard";
import { StockChart } from "./components/StockChart";
import { AIExplanation } from "./components/AIExplanation";
import { analyzeStock } from "./services/api";
import { TrendingUp } from "lucide-react";

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (ticker) => {
    setIsAnalyzing(true);
    setError("");
    setStockData(null);

    try {
      const data = await analyzeStock(ticker);
      setStockData(data);
    } catch (err) {
      setError(err.message || "Failed to analyze stock. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-10 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            AI Stock Analyst
          </h1>
        </header>

        <main className="flex flex-col gap-6">
          {/* Top Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Input + Prediction */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-slate-100">Analyze Stock</h2>
                <StockInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                    {error}
                  </div>
                )}
              </div>

              {stockData && (
                <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both flex-1">
                  <PredictionCard data={stockData} />
                </div>
              )}
            </div>

            {/* Right Column: Chart */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex-1 animate-in slide-in-from-bottom-4 duration-500 fade-in delay-150 fill-mode-both">
                <StockChart data={stockData} />
              </div>
            </div>
          </section>

          {/* Bottom Section: AI Explanation */}
          <section className="animate-in slide-in-from-bottom-4 duration-500 fade-in delay-300 fill-mode-both">
            <AIExplanation 
              ticker={stockData?.ticker} 
              isAnalyzed={!!stockData} 
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
