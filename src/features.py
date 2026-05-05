import pandas as pd

def add_features(df):
    df=df.copy()
    df['returns'] = df['Close'].pct_change()
    df["ma_10"]= df["Close"].rolling(window=10).mean()
    df["ma_50"]= df["Close"].rolling(window=50).mean()

    df["volatility"]= df["Close"].rolling(window=10).std()

    delta=df["Close"].diff()
    gain=(delta.where(delta>0,0).rolling(window=14).mean())
    loss=(-delta.where(delta<0,0).rolling(window=14).mean())
    rs = gain / loss
    df["rsi"] = 100 - (100 / (1 + rs))
    
    df["target"] = (df["Close"].shift(-1) > df["Close"]).astype(int)

    return df.dropna()
