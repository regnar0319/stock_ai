import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { TrendingUp, TrendingDown, Activity, DollarSign, Target } from "lucide-react";

export function PredictionCard({ data }) {
  if (!data) return null;

  const isUp = data.prediction === "UP";
  const PredictionIcon = isUp ? TrendingUp : TrendingDown;
  const predictionColor = isUp ? "text-success bg-success/10 border-success/20" : "text-danger bg-danger/10 border-danger/20";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Prediction for {data.ticker}</span>
          <span className={`flex items-center gap-2 px-3 py-1 rounded-full border ${predictionColor} font-bold`}>
            {data.prediction} <PredictionIcon size={20} />
          </span>
        </CardTitle>
      </CardHeader>
      
      <div className="flex-1 grid grid-cols-2 gap-4 mt-2">
        <IndicatorBox 
          icon={<Activity size={18} />}
          label="RSI (14)" 
          value={data.indicators.rsi} 
          subtext={data.indicators.rsi > 70 ? "Overbought" : data.indicators.rsi < 30 ? "Oversold" : "Neutral"}
        />
        <IndicatorBox 
          icon={<DollarSign size={18} />}
          label="Returns" 
          value={data.indicators.returns}
          valueColor={parseFloat(data.indicators.returns) >= 0 ? "text-success" : "text-danger"}
        />
        <IndicatorBox 
          icon={<Target size={18} />}
          label="MA (10)" 
          value={`$${data.indicators.ma10}`}
        />
        <IndicatorBox 
          icon={<Target size={18} />}
          label="MA (50)" 
          value={`$${data.indicators.ma50}`}
        />
      </div>
    </Card>
  );
}

function IndicatorBox({ label, value, icon, subtext, valueColor = "text-slate-100" }) {
  return (
    <div className="flex flex-col p-4 rounded-xl bg-slate-100/50 dark:bg-dark-bg/50 border border-slate-200 dark:border-dark-border">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 text-sm font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`text-xl font-bold ${valueColor}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-slate-400 mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
}
