from data_loader import load_stock_data
from features import add_features
from model import train_model
from llm import get_chain
import streamlit as st

st.set_page_config(page_title="AI Stock Analyst", layout="wide")
st.title("AI Stock Analyst")



ticker=st.text_input("Enter stock ticker(AAPL,TSLA,MSFT...etc): ").upper()

if st.button("Test Button"):
    st.write("Button clicked ✅")
    st.write("Ticker:", ticker)

if  st.button("Analyze"):
    df=load_stock_data(ticker)
    df=add_features(df)

    features=['Open', 'High', 'Low', 'Close', 'returns', 'rsi', 'ma_10', 'ma_50', 'volatility']
    x=df[features]
    y=df["target"]

    model=train_model(x,y)

    latest=df.iloc[-1]
    x_latest=latest[features].values.reshape(1,-1)

    presdiction=model.predict(x_latest)[0]
    direction="UP" if presdiction==1 else "DOWN"

    st.subheader(f"Prediction for {ticker}: {direction}")

    chain=get_chain()

    question = st.text_area("Ask something about this stock")


if st.button("Explain Prediction"):
            

        response = chain.invoke({
            "question": question,
            "direction": direction,
            "rsi": round(latest['rsi'], 2),
            "returns": round(latest['returns'], 4),
            "ma10": round(latest['ma_10'], 2),
            "ma50": round(latest['ma_50'], 2)
        })

        st.write("AI Explanation:")
        st.write(response)



