def get_chain():
    class Dummy:
        def invoke(self, x):
            return "AI explanation disabled"
    return Dummy()