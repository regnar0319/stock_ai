from sklearn.ensemble import RandomForestClassifier

def train_model(x,y):
    model=RandomForestClassifier(n_estimators=200)
    model.fit(x,y)
    return model