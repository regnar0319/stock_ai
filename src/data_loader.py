import yfinance as yf
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def load_stock_data(ticker):
    """Load 2 years of daily stock data using Ticker.history() for compatibility with all yfinance versions."""
    try:
        logger.info(f"Fetching data for ticker: {ticker}")
        tk = yf.Ticker(ticker, ignore_tz=True)
        # Suppress progress bar and use shorter timeout for Render
        df = tk.history(period="2y", interval="1d", progress=False)
        
        logger.info(f"Retrieved {len(df)} rows for {ticker}, columns: {list(df.columns)}")
        
        if df.empty:
            logger.warning(f"No data returned for ticker: {ticker}")
            return pd.DataFrame()
        
        # Ensure required columns exist
        required_cols = ['Open', 'High', 'Low', 'Close']
        if not all(col in df.columns for col in required_cols):
            logger.error(f"Missing required columns. Got: {list(df.columns)}")
            return pd.DataFrame()
        
        logger.info(f"Successfully fetched {len(df)} rows for {ticker}")
        # Normalize column names (strip whitespace, ensure standard casing)
        df.columns = [c.strip() for c in df.columns]
        df = df.reset_index()
        return df
    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {type(e).__name__}: {str(e)}")
        # Return empty DataFrame to trigger 404 in API
        return pd.DataFrame()

