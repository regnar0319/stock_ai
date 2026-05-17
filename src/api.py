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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_ticker(ticker: str, market: str) -> str:
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

# FIXED: Added market data requirement to the Pydantic template
class ExplainRequest(BaseModel):
    ticker: str
    market: str = "US"
    question: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_stock(req: AnalyzeRequest):
    ticker = req.ticker.upper()
    market = req.market
    formatted_ticker = format_ticker(ticker, market)
    try:
        df = load_stock_data(formatted_ticker)
        if df.empty:
            raise HTTPException(status_code=404, detail=f"Stock symbol '{ticker}' not found in {market} market.")
            
        df = add_features(df)
        if df.empty:
            raise HTTPException(status_code=400, detail="Insufficient data history to compute financial features.")
            
        features = ['Open', 'High', 'Low', 'Close', 'returns', 'rsi', 'ma_10', 'ma_50', 'volatility']
        x = df[features]
        y = df["target"]
        
        model = train_model(x, y)
        latest = df.iloc[-1]
        x_latest = latest[features].values.reshape(1, -1)
        
        prediction = int(model.predict(x_latest)[0])
        direction = "UP" if prediction == 1 else "DOWN"
        
        last_30 = df.tail(30)
        chart_data = []
        for idx, row in last_30.iterrows():
            date_str = str(row['Date']) if 'Date' in row.index else str(idx)
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
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
async def explain_stock(req: ExplainRequest):
    ticker = req.ticker.upper()
    market = req.market 
    formatted_ticker = format_ticker(ticker, market)
    try:
        df = load_stock_data(formatted_ticker)
        if df.empty:
            raise HTTPException(status_code=404, detail="Stock data could not be parsed for context extraction.")
            
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
            "ma10": round(float(latest['ma_10']), 2),
            "ma50": round(float(latest['ma_50']), 2)
        })
        
        return {"explanation": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Processor Error: {str(e)}")

frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    if frontend_dist.exists():
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
    return {"detail": "Frontend assets unavailable"}