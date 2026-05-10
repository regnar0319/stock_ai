import yfinance as yf
import pandas as pd
import logging

logger = logging.getLogger(__name__)

def load_stock_data(ticker):
    """Load 2 years of daily stock data using Ticker.history() for compatibility with all yfinance versions."""
    try:
        logger.info(f"Fetching data for ticker: {ticker}")
        tk = yf.Ticker(ticker)
        df = tk.history(period="2y", interval="1d")
        
        if df.empty:
            logger.warning(f"No data returned for ticker: {ticker}")
            return df
        
        logger.info(f"Successfully fetched {len(df)} rows for {ticker}")
        # Normalize column names (strip whitespace, ensure standard casing)
        df.columns = [c.strip() for c in df.columns]
        df = df.reset_index()
        return df
    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {str(e)}")
        # Return empty DataFrame to trigger 404 in API
        return pd.DataFrame()

