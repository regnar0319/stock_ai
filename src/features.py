import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

def add_features(df):
    df = df.copy()
    try:
        df['returns'] = df['Close'].pct_change()
        df["ma_10"] = df["Close"].rolling(window=10).mean()
        df["ma_50"] = df["Close"].rolling(window=50).mean()

        df["volatility"] = df["Close"].rolling(window=10).std()

        delta = df["Close"].diff()
        gain = delta.where(delta > 0, 0).rolling(window=14).mean()
        loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
        
        # Avoid division by zero
        rs = gain / loss.replace(0, np.nan)
        df["rsi"] = 100 - (100 / (1 + rs))
        
        df["target"] = (df["Close"].shift(-1) > df["Close"]).astype(int)

        result = df.dropna()
        logger.info(f"Features added. Rows after dropna: {len(result)}")
        
        if len(result) < 50:  # Need at least 50 rows for meaningful analysis
            logger.warning(f"Not enough data rows after feature engineering: {len(result)}")
            return pd.DataFrame()
            
        return result
    except Exception as e:
        logger.error(f"Error adding features: {type(e).__name__}: {str(e)}")
        return pd.DataFrame()
