import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Spinner } from "./ui/Spinner";
import { explainStock } from "../services/api";

export function AIExplanation({ ticker, market, isAnalyzed }) {
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
      const response = await explainStock(ticker, market, question);
      setExplanation(response);
    } catch (err) {
      console.error(err);
      setError("Failed to get explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAnalyzed) return null;

  return (
    <div className="glass-card" style={{ padding: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))",
          border: "1px solid rgba(168,85,247,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Sparkles size={18} color="#a855f7" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#e2e8f0" }}>
            AI Analyst
          </h3>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
            Ask anything about {ticker}
          </p>
        </div>
      </div>

      {/* Explanation bubble */}
      {explanation && (
        <div style={{
          display: "flex", gap: "14px", padding: "16px 18px",
          borderRadius: "14px", background: "rgba(10,15,30,0.6)",
          border: "1px solid rgba(31,45,69,0.8)", marginBottom: "16px"
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Bot size={18} color="#6366f1" />
            </div>
          </div>
          <div style={{
            flex: 1, color: "#cbd5e1", fontSize: "0.9rem",
            lineHeight: 1.7, whiteSpace: "pre-wrap"
          }}>
            {explanation}
          </div>
        </div>
      )}

      {/* Question input */}
      <form onSubmit={handleExplain} style={{ position: "relative" }}>
        <textarea
          id="ai-question-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (question.trim() && !isLoading) handleExplain(e);
            }
          }}
          placeholder={`Ask a question about ${ticker} (e.g. "Why is the RSI high?")`}
          disabled={isLoading}
          style={{
            width: "100%", minHeight: "100px", padding: "14px 52px 14px 16px",
            background: "rgba(10,15,30,0.8)", border: "1px solid rgba(31,45,69,0.9)",
            borderRadius: "14px", color: "#f1f5f9", fontSize: "0.9rem",
            fontFamily: "inherit", outline: "none", resize: "none",
            transition: "all 0.2s ease", boxSizing: "border-box"
          }}
          onFocus={e => {
            e.target.style.borderColor = "#a855f7";
            e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.12)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(31,45,69,0.9)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          id="ask-ai-btn"
          type="submit"
          disabled={isLoading || !question.trim()}
          style={{
            position: "absolute", right: "12px", bottom: "12px",
            width: "36px", height: "36px", borderRadius: "10px",
            background: isLoading || !question.trim()
              ? "rgba(168,85,247,0.3)"
              : "linear-gradient(135deg, #a855f7, #6366f1)",
            border: "none", cursor: isLoading || !question.trim() ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", transition: "all 0.2s ease",
            boxShadow: isLoading || !question.trim() ? "none" : "0 4px 12px rgba(168,85,247,0.35)"
          }}
        >
          {isLoading ? <Spinner size={16} /> : <Send size={16} />}
        </button>
      </form>

      <p style={{ margin: "8px 0 0", fontSize: "0.72rem", color: "#475569" }}>
        Press Enter to send · Shift+Enter for new line
      </p>

      {error && (
        <p style={{ marginTop: "10px", color: "#f43f5e", fontSize: "0.825rem" }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}