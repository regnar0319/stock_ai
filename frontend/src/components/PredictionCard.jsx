import { TrendingUp, TrendingDown, Activity, DollarSign, Target, BarChart2 } from "lucide-react";

export function PredictionCard({ data }) {
  if (!data) return null;

  const isUp = data.prediction === "UP";
  const rsi = data.indicators.rsi;
  const rsiStatus = rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral";
  const rsiColor = rsi > 70 ? "#f59e0b" : rsi < 30 ? "#f43f5e" : "#10b981";

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#e2e8f0" }}>
              {data.ticker}
            </h3>
            {data.market && (
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Market: {data.market}</span>
            )}
          </div>
          <span className={isUp ? "badge-up" : "badge-down"} style={{ fontSize: "0.9rem" }}>
            {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {data.prediction}
          </span>
        </div>

        {/* Prediction confidence bar */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Signal Strength</span>
            <span style={{ fontSize: "0.75rem", color: isUp ? "#10b981" : "#f43f5e", fontWeight: 600 }}>
              {isUp ? "Bullish" : "Bearish"}
            </span>
          </div>
          <div style={{
            height: "6px", borderRadius: "999px",
            background: "rgba(31,45,69,0.8)", overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: isUp ? "72%" : "28%",
              borderRadius: "999px",
              background: isUp
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #f43f5e, #fb7185)",
              transition: "width 1s ease"
            }} />
          </div>
        </div>
      </div>

      {/* Indicators grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <IndicatorBox
          icon={<Activity size={16} />}
          label="RSI (14)"
          value={rsi}
          subtext={rsiStatus}
          valueColor={rsiColor}
          accent="#6366f1"
        />
        <IndicatorBox
          icon={<DollarSign size={16} />}
          label="Returns"
          value={data.indicators.returns}
          valueColor={parseFloat(data.indicators.returns) >= 0 ? "#10b981" : "#f43f5e"}
          accent={parseFloat(data.indicators.returns) >= 0 ? "#10b981" : "#f43f5e"}
        />
        <IndicatorBox
          icon={<Target size={16} />}
          label="MA (10)"
          value={`$${data.indicators.ma10}`}
          accent="#a855f7"
        />
        <IndicatorBox
          icon={<BarChart2 size={16} />}
          label="MA (50)"
          value={`$${data.indicators.ma50}`}
          accent="#a855f7"
        />
      </div>
    </div>
  );
}

function IndicatorBox({ label, value, icon, subtext, valueColor = "#f1f5f9", accent = "#6366f1" }) {
  return (
    <div className="indicator-box">
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        color: accent, marginBottom: "10px", fontSize: "0.75rem", fontWeight: 500
      }}>
        {icon}
        <span style={{ color: "#94a3b8" }}>{label}</span>
      </div>
      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: valueColor, lineHeight: 1 }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "5px" }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
