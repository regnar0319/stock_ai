import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BarChart2 } from "lucide-react";

export function StockChart({ data }) {
  if (!data || !data.chartData || data.chartData.length === 0) {
    return (
      <div className="glass-card" style={{
        minHeight: "340px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "12px", padding: "40px"
      }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <BarChart2 size={28} color="#6366f1" />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontWeight: 600, color: "#94a3b8" }}>No Chart Data Yet</p>
          <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "#475569" }}>
            Search for a stock above to view its 30-day price history
          </p>
        </div>
      </div>
    );
  }

  const isUp = data.prediction === "UP";
  const lineColor = isUp ? "#10b981" : "#f43f5e";
  const gradientId = isUp ? "chartGradientUp" : "chartGradientDown";

  const prices = data.chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#0f172a", border: "1px solid #1f2d45",
          borderRadius: "10px", padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
        }}>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>{label}</p>
          <p style={{ margin: "4px 0 0", fontSize: "1rem", fontWeight: 700, color: lineColor }}>
            ${parseFloat(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: "24px", minHeight: "340px", display: "flex", flexDirection: "column" }}>
      {/* Chart header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#e2e8f0" }}>
            {data.ticker} — 30-Day Price History
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
            Range: ${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)}
          </p>
        </div>
        <div style={{
          padding: "4px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 600,
          background: isUp ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
          color: lineColor, border: `1px solid ${isUp ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`
        }}>
          {isUp ? "▲" : "▼"} {(((prices[prices.length - 1] - prices[0]) / prices[0]) * 100).toFixed(2)}%
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chartData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,45,69,0.7)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#334155"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={35}
            />
            <YAxis
              stroke="#334155"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgPrice}
              stroke="rgba(99,102,241,0.4)"
              strokeDasharray="5 5"
              label={{ value: "Avg", fill: "#6366f1", fontSize: 10, position: "insideTopRight" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: lineColor, stroke: "#0a0f1e", strokeWidth: 2 }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
