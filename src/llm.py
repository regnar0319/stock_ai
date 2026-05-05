from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
from typer import prompt

def get_chain():
    template= """
    You are an AI financial analyst.

    User question: {question}

    Model prediction: {direction}

    Indicators:
    - RSI: {rsi}
    - Returns: {returns}
    - MA10: {ma10}
    - MA50: {ma50}

    Explain clearly:
    - What this means
    - Whether signal is strong or weak
    """

    prompt=PromptTemplate(
    input_variables=["question", "direction", "rsi", "returns", "ma10", "ma50"],
    template=template
    )

    llm=Ollama(model="llama3")

    return prompt | llm