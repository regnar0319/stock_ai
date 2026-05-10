import yfinance as yf
import pandas as pd
import logging
import os
from datetime import datetime, timedelta
import numpy as np

logger = logging.getLogger(__name__)

def load_stock_data(ticker):
    """Load 2 years of daily stock data using Ticker.history()."""
    try:
        logger.info(f"Fetching data for ticker: {ticker}")
        tk = yf.Ticker(ticker)
        # Fetch 2 years of daily data
        df = tk.history(period="2y", interval="1d")
        
        logger.info(f"Retrieved {len(df)} rows for {ticker}, columns: {list(df.columns)}")
        
        if df.empty:
            logger.warning(f"No data returned for ticker: {ticker}, attempting fallback for demo...")
            # If on Render and no data, use demo data
            if "RENDER" in os.environ or "RENDER_EXTERNAL_URL" in os.environ:
                return _generate_demo_data(ticker)
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
        # Try fallback demo data if on Render
        if "RENDER" in os.environ or "RENDER_EXTERNAL_URL" in os.environ:
            logger.info(f"Using demo data fallback for {ticker}")
            return _generate_demo_data(ticker)
        return pd.DataFrame()

def _generate_demo_data(ticker):
    """Generate demo stock data for Render environment."""
    logger.info(f"Generating demo data for {ticker}")
    try:
        # Generate 2 years of daily data (approximately 501 trading days)
        dates = pd.date_range(end=datetime.now(), periods=501, freq='D')
        
        # Generate realistic OHLCV data
        np.random.seed(hash(ticker) % 2**32)  # Deterministic seed based on ticker
        base_price = np.random.uniform(50, 300)
        prices = base_price + np.cumsum(np.random.normal(0, 2, 501))
        prices = np.maximum(prices, 10)  # Ensure positive prices
        
        df = pd.DataFrame({
            'Date': dates,
            'Open': prices + np.random.uniform(-5, 5, 501),
            'High': prices + np.abs(np.random.uniform(0, 10, 501)),
            'Low': prices - np.abs(np.random.uniform(0, 10, 501)),
            'Close': prices,
            'Volume': np.random.uniform(1000000, 50000000, 501).astype(int),
        })
        
        df.set_index('Date', inplace=True)
        df = df.reset_index()
        
        logger.info(f"Generated {len(df)} rows of demo data for {ticker}")
        return df
    except Exception as e:
        logger.error(f"Error generating demo data: {str(e)}")
        return pd.DataFrame()

