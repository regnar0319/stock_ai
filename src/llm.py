from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
from typer import prompt

def get_chain():
    class Dummy:
        def invoke(self, x):
            return "AI explanation disabled"
    return Dummy()