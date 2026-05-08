from data_loader import load_stock_data
from features import add_features
from model import train_model
from llm import get_chain
import streamlit as st

st.set_page_config(page_title="AI Stock Analyst", layout="wide")
st.title("AI Stock Analyst")

FEATURES = ['Open', 'High', 'Low', 'Close', 'returns', 'rsi', 'ma_10', 'ma_50', 'volatility']

def format_ticker(ticker, market):
    if market == "India":
        return ticker + ".NS"
    elif market == "UK":
        return ticker + ".L"
    elif market == "Japan":
        return ticker + ".T"
    return ticker

market = st.selectbox("Select Market", ["US", "India", "UK", "Japan"])
ticker = st.text_input("Enter stock ticker (AAPL, TSLA, MSFT...etc): ").upper()

# Session state to hold results across button clicks
if "result" not in st.session_state:
    st.session_state.result = None

if st.button("Analyze") and ticker:
    formatted = format_ticker(ticker, market)
    with st.spinner(f"Fetching data for {formatted}..."):
        df = load_stock_data(formatted)
        df = add_features(df)

        x = df[FEATURES]
        y = df["target"]

        model = train_model(x, y)

        latest = df.iloc[-1]
        x_latest = latest[FEATURES].values.reshape(1, -1)

        prediction = model.predict(x_latest)[0]
        direction = "UP" if prediction == 1 else "DOWN"

        st.session_state.result = {
            "direction": direction,
            "ticker": formatted,
            "rsi": round(latest['rsi'], 2),
            "returns": round(latest['returns'], 4),
            "ma10": round(latest['ma_10'], 2),
            "ma50": round(latest['ma_50'], 2),
        }

if st.session_state.result:
    r = st.session_state.result
    st.subheader(f"Prediction for {r['ticker']}: {r['direction']}")

    question = st.text_area("Ask something about this stock")

    if st.button("Explain Prediction"):
        if question.strip():
            chain = get_chain()
            response = chain.invoke({
                "question": question,
                "direction": r["direction"],
                "rsi": r["rsi"],
                "returns": r["returns"],
                "ma10": r["ma10"],
                "ma50": r["ma50"],
            })
            st.write("AI Explanation:")
            st.write(response)
        else:
            st.warning("Please enter a question first.")
