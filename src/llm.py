import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

def get_chain():
    """Return a LangChain chain using Google Gemini for stock analysis explanations."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY"),
        temperature=0.7,
    )

    prompt = ChatPromptTemplate.from_template(
        """You are an expert AI stock market analyst. A user is asking about a stock.

Stock Analysis Context:
- Prediction Direction: {direction}
- RSI (14-day): {rsi}
- Daily Returns: {returns}
- 10-day Moving Average: {ma10}
- 50-day Moving Average: {ma50}

User Question: {question}

Please provide a concise, insightful answer (3-5 sentences) explaining what these indicators mean for this stock. 
Use plain language that a retail investor can understand. Be specific about the numbers provided."""
    )

    chain = prompt | llm | StrOutputParser()
    return chain