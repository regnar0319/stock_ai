import yfinance as yf
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def load_stock_data(ticker):
    """Load 2 years of daily stock data using Ticker.history()."""
    try:
        logger.info(f"Fetching data for ticker: {ticker}")
        tk = yf.Ticker(ticker)
        df = tk.history(period="2y", interval="1d")
        
        if df.empty:
            logger.warning(f"No data returned for ticker: {ticker}.")
            return pd.DataFrame() # Stop creating fake data out of nowhere!
        
        required_cols = ['Open', 'High', 'Low', 'Close']
        if not all(col in df.columns for col in required_cols):
            logger.error(f"Missing required columns.")
            return pd.DataFrame()
        
        df.columns = [c.strip() for c in df.columns]
        df = df.reset_index()
        return df
    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {str(e)}")
        return pd.DataFrame()