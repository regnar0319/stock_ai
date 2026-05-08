import yfinance as yf
import pandas as pd

def load_stock_data(ticker):
    """Load 2 years of daily stock data using Ticker.history() for compatibility with all yfinance versions."""
    tk = yf.Ticker(ticker)
    df = tk.history(period="2y", interval="1d")
    if df.empty:
        return df
    # Normalize column names (strip whitespace, ensure standard casing)
    df.columns = [c.strip() for c in df.columns]
    df = df.reset_index()
    return df

