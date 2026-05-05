import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function StockChart({ data }) {
  if (!data || !data.chartData) {
    return (
      <Card className="h-full min-h-[300px] flex items-center justify-center border-dashed">
        <div className="text-slate-500 text-center">
          <p className="font-medium">No Data Available</p>
          <p className="text-sm">Search for a stock to view its chart</p>
        </div>
      </Card>
    );
  }

  const isUp = data.prediction === "UP";
  const strokeColor = isUp ? "#10b981" : "#ef4444"; // success or danger color

  return (
    <Card className="h-full flex flex-col min-h-[350px]">
      <CardHeader>
        <CardTitle>{data.ticker} Price History</CardTitle>
      </CardHeader>
      <div className="flex-1 w-full h-full min-h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#1e293b", 
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9"
              }}
              itemStyle={{ color: strokeColor }}
              formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, "Price"]}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={strokeColor} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: strokeColor, stroke: "#1e293b", strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
