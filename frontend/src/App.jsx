import { useState, useEffect } from "react";
import { StockInput } from "./components/StockInput";
import { PredictionCard } from "./components/PredictionCard";
import { StockChart } from "./components/StockChart";
import { AIExplanation } from "./components/AIExplanation";
import { analyzeStock } from "./services/api";
import { TrendingUp, Activity, Zap } from "lucide-react";

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (tickerData) => {
    setIsAnalyzing(true);
    setError("");
    setStockData(null);

    try {
      const data = await analyzeStock(tickerData);
      setStockData(data);
    } catch (err) {
      setError(err.message || "Failed to analyze stock. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

        {/* ── Header ───────────────────────────────────────────── */}
        <header style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
              flexShrink: 0
            }}>
              <TrendingUp size={26} color="#fff" />
            </div>
            <div>
              <h1 style={{
                margin: 0, fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 800, letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 40%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                AI Stock Analyst
              </h1>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Powered by machine learning &amp; real-time market data
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: "24px", marginTop: "20px",
            padding: "14px 20px", borderRadius: "12px",
            background: "rgba(17,24,39,0.6)", border: "1px solid rgba(31,45,69,0.7)",
            flexWrap: "wrap"
          }}>
            {[
              { icon: <Activity size={14} />, label: "Live Market Data" },
              { icon: <Zap size={14} />, label: "AI-Powered Predictions" },
              { icon: <TrendingUp size={14} />, label: "4 Global Markets" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px", color: "#94a3b8", fontSize: "0.8rem" }}>
                <span style={{ color: "#6366f1" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </header>

        {/* ── Search Panel ──────────────────────────────────────── */}
        <div className="glass-card" style={{ padding: "28px", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 600, color: "#c7d2fe" }}>
            Analyze a Stock
          </h2>
          <StockInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
          {error && (
            <div style={{
              marginTop: "16px", padding: "12px 16px", borderRadius: "10px",
              background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)",
              color: "#f43f5e", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px"
            }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: stockData ? "360px 1fr" : "1fr",
          gap: "24px",
          alignItems: "start"
        }}>
          {/* Left: Prediction card */}
          {stockData && (
            <div className="animate-in">
              <PredictionCard data={stockData} />
            </div>
          )}

          {/* Right: Chart */}
          <div className={stockData ? "animate-in delay-150" : ""}>
            <StockChart data={stockData} />
          </div>
        </div>

        {/* ── AI Explanation ─────────────────────────────────────── */}
        {stockData && (
          <div className="animate-in delay-300" style={{ marginTop: "24px" }}>
            <AIExplanation ticker={stockData.ticker} market={stockData.market} isAnalyzed={!!stockData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
