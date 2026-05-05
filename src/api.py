from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .data_loader import load_stock_data
from .features import add_features
from .model import train_model
from .llm import get_chain
import logging

app = FastAPI(title="AI Stock Analyst API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    ticker: str

class ExplainRequest(BaseModel):
    ticker: str
    question: str

@app.post("/analyze")
async def analyze_stock(req: AnalyzeRequest):
    ticker = req.ticker.upper()
    try:
        df = load_stock_data(ticker)
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
            "ticker": ticker,
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
        logging.error(f"Error analyzing {ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain")
async def explain_stock(req: ExplainRequest):
    ticker = req.ticker.upper()
    try:
        df = load_stock_data(ticker)
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
        logging.error(f"Error explaining {ticker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
