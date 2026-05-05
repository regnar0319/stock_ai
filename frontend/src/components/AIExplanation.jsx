import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import { Bot, Send, Sparkles } from "lucide-react";
import { Spinner } from "./ui/Spinner";
import { explainStock } from "../services/api";

export function AIExplanation({ ticker, isAnalyzed }) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError("");
    
    try {
      const response = await explainStock(ticker, question);
      setExplanation(response);
    } catch (err) {
      setError("Failed to get explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAnalyzed) {
    return null;
  }

  return (
    <Card className="mt-6 border-accent/30 shadow-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-accent" size={20} />
          <span>AI Analyst</span>
        </CardTitle>
      </CardHeader>

      <div className="flex flex-col gap-4">
        {explanation && (
          <div className="flex gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Bot size={18} className="text-primary" />
              </div>
            </div>
            <div className="flex-1 text-slate-200 text-sm leading-relaxed">
              {explanation}
            </div>
          </div>
        )}

        <form onSubmit={handleExplain} className="relative mt-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask a question about ${ticker} (e.g., "Why is the RSI so high?")`}
            className="w-full min-h-[100px] p-4 pr-14 text-sm text-slate-100 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-primary hover:bg-blue-600 text-white disabled:opacity-50 disabled:hover:bg-primary transition-colors flex items-center justify-center"
          >
            {isLoading ? <Spinner size={18} className="text-white" /> : <Send size={18} />}
          </button>
        </form>
        {error && <p className="text-sm text-danger mt-1">{error}</p>}
      </div>
    </Card>
  );
}
