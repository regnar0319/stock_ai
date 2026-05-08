import yfinance as yf
import pandas as pd

def load_stock_data(ticker):
    df = yf.download(ticker, period="2y", interval="1d", auto_adjust=True)
    # Flatten multi-level columns (yfinance may return them depending on version)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df = df.reset_index()
    return df

