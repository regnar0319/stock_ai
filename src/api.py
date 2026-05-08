from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from .data_loader import load_stock_data
from .features import add_features
from .model import train_model
from .llm import get_chain
import logging
import os
from pathlib import Path

app = FastAPI(title="AI Stock Analyst API")

# Configure CORS for development and production
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add production origins if environment variable is set
import os
if "RENDER_EXTERNAL_URL" in os.environ:
    frontend_url = os.environ.get("RENDER_EXTERNAL_URL", "").replace(":8000", ":3000")
    if frontend_url:
        allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_ticker(ticker: str, market: str) -> str:
    """Format ticker based on market."""
    if market == "India":
        return ticker + ".NS"
    elif market == "UK":
        return ticker + ".L"
    elif market == "Japan":
        return ticker + ".T"
    return ticker

class AnalyzeRequest(BaseModel):
    ticker: str
    market: str = "US"

class ExplainRequest(BaseModel):
    ticker: str
    question: str

@app.get("/health")
async def health_check():
    """Health check endpoint for Render monitoring"""
    return {"status": "healthy", "service": "AI Stock Analyst API"}

@app.post("/analyze")
async def analyze_stock(req: AnalyzeRequest):
    ticker = req.ticker.upper()
    market = req.market
    formatted_ticker = format_ticker(ticker, market)
    try:
        df = load_stock_data(formatted_ticker)
        if df.empty:
            raise HTTPException(status_code=404, detail="Stock data not found.")
            
        df = add_features(df)
        
        features = ['Open', 'High', 'Low', 'Close', 'returns', 'rsi', 'ma_10', 'ma_50', 'volatility']
        x = df[features]
        y = df["target"]
        
        model = train_model(x, y)
        
        latest = df.iloc[-1]
        x_latest = latest[features].values.reshape(1, -1)
        
        prediction = int(model.predict(x_latest)[0])
        direction = "UP" if prediction == 1 else "DOWN"
        
        # Prepare chart data (last 30 days for example)
        last_30 = df.tail(30)
        chart_data = []
        for _, row in last_30.iterrows():
            date_str = str(row.get('Date', ''))
            chart_data.append({
                "date": date_str.split(" ")[0],
                "price": round(float(row['Close']), 2)
            })
            
        return {
            "ticker": formatted_ticker,
            "market": market,
            "prediction": direction,
            "indicators": {
                "rsi": round(float(latest['rsi']), 2),
                "returns": f"{round(float(latest['returns']) * 100, 2)}%",
                "ma10": round(float(latest['ma_10']), 2),
                "ma50": round(float(latest['ma_50']), 2),
            },
            "chartData": chart_data
        }
    except Exception as e:
        logging.error(f"Error analyzing {formatted_ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
async def explain_stock(req: ExplainRequest):
    ticker = req.ticker.upper()
    # For explain, we'll use US market by default or could extract from session
    market = "US"
    formatted_ticker = format_ticker(ticker, market)
    try:
        df = load_stock_data(formatted_ticker)
        df = add_features(df)
        
        features = ['Open', 'High', 'Low', 'Close', 'returns', 'rsi', 'ma_10', 'ma_50', 'volatility']
        x = df[features]
        y = df["target"]
        
        model = train_model(x, y)
        latest = df.iloc[-1]
        x_latest = latest[features].values.reshape(1, -1)
        prediction = int(model.predict(x_latest)[0])
        direction = "UP" if prediction == 1 else "DOWN"
        
        chain = get_chain()
        response = chain.invoke({
            "question": req.question,
            "direction": direction,
            "rsi": round(latest['rsi'], 2),
            "returns": round(latest['returns'], 4),
            "ma10": round(latest['ma_10'], 2),
            "ma50": round(latest['ma_50'], 2)
        })
        
        return {"explanation": response}
    except Exception as e:
        logging.error(f"Error explaining {formatted_ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Serve frontend - mount AFTER all API routes
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    """Serve index.html for SPA routing, fallback for missing routes"""
    if frontend_dist.exists():
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
    return {"detail": "Frontend not available"}
