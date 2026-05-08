// In production, use relative path; in development, use localhost
const API_BASE = import.meta.env.MODE === 'production' ? '' : "http://localhost:8000";

export async function analyzeStock(tickerData) {
  const { ticker, market } = tickerData;

  if (!ticker || !market) {
    throw new Error("Ticker and market are required");
  }

  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase(), market }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to analyze stock");
  }

  return response.json();
}

export async function explainStock(ticker, question) {
  if (!ticker || !question) {
    throw new Error("Ticker and question are required");
  }

  const response = await fetch(`${API_BASE}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticker: ticker.toUpperCase(), question }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to get explanation");
  }

  const data = await response.json();
  return data.explanation;
}
