import yfinance as yf
import pandas as pd

def load_stock_data(ticker):
    
    df=yf.download(ticker,period="2y", interval="1d")
    df=df.reset_index()
    return df

