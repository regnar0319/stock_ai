import { useState } from "react";
import { Search, Globe } from "lucide-react";
import { Spinner } from "./ui/Spinner";

export function StockInput({ onAnalyze, isLoading }) {
  const [ticker, setTicker] = useState("");
  const [market, setMarket] = useState("US");
  const [error, setError] = useState("");

  const MARKETS = [
    { label: "🇺🇸 US", value: "US" },
    { label: "🇮🇳 India", value: "India" },
    { label: "🇬🇧 UK", value: "UK" },
    { label: "🇯🇵 Japan", value: "Japan" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();

    if (!cleanTicker) {
      setError("Please enter a stock ticker");
      return;
    }
    if (!/^[A-Z0-9.^-]+$/.test(cleanTicker)) {
      setError("Invalid ticker format.");
      return;
    }

    setError("");
    onAnalyze({ ticker: cleanTicker, market });
  };

  const inputStyle = {
    background: "rgba(10,15,30,0.8)",
    border: "1px solid rgba(31,45,69,0.9)",
    borderRadius: "12px",
    color: "#f1f5f9",
    padding: "14px 16px 14px 46px",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>

        {/* Ticker input */}
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <div style={{
            position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
            color: "#475569", pointerEvents: "none", display: "flex", alignItems: "center"
          }}>
            <Search size={18} />
          </div>
          <input
            id="ticker-input"
            type="text"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value.toUpperCase());
              if (error) setError("");
            }}
            style={inputStyle}
            placeholder="Enter ticker (e.g. AAPL, TSLA)..."
            disabled={isLoading}
            onFocus={e => {
              e.target.style.borderColor = "#6366f1";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(31,45,69,0.9)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Market selector */}
        <div style={{ position: "relative", flex: "0 0 150px" }}>
          <div style={{
            position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
            color: "#475569", pointerEvents: "none", display: "flex", alignItems: "center"
          }}>
            <Globe size={16} />
          </div>
          <select
            id="market-select"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            disabled={isLoading}
            style={{
              ...inputStyle,
              padding: "14px 12px 14px 36px",
              appearance: "none",
              cursor: "pointer",
            }}
            onFocus={e => {
              e.target.style.borderColor = "#6366f1";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(31,45,69,0.9)";
              e.target.style.boxShadow = "none";
            }}
          >
            {MARKETS.map(m => (
              <option key={m.value} value={m.value} style={{ background: "#111827" }}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Analyze button */}
        <button
          id="analyze-btn"
          type="submit"
          disabled={isLoading || !ticker.trim()}
          style={{
            flex: "0 0 auto",
            padding: "14px 28px",
            background: isLoading || !ticker.trim()
              ? "rgba(99,102,241,0.4)"
              : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: isLoading || !ticker.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: isLoading || !ticker.trim() ? "none" : "0 4px 16px rgba(99,102,241,0.4)",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => {
            if (!isLoading && ticker.trim()) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.6)";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = isLoading || !ticker.trim() ? "none" : "0 4px 16px rgba(99,102,241,0.4)";
          }}
        >
          {isLoading ? <Spinner size={18} /> : null}
          <span>{isLoading ? "Analyzing..." : "Analyze"}</span>
        </button>
      </div>

      {error && (
        <p style={{
          marginTop: "10px", color: "#f43f5e", fontSize: "0.825rem",
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          ⚠ {error}
        </p>
      )}
    </form>
  );
}
