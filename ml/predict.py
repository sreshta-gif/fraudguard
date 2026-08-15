import json
import sys
import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "fraud_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))



# Read transaction data from Node.js
data = json.loads(sys.stdin.read())

# Convert input to DataFrame
df = pd.DataFrame([data])

# Scale Time and Amount exactly as done during training
# Scale Time and Amount
df[["Time", "Amount"]] = scaler.transform(
    df[["Time", "Amount"]]
)

# Make prediction
prediction = model.predict(df)[0]

# Get fraud probability
probability = model.predict_proba(df)[0][1]

# Return result
result = {
    "prediction": int(prediction),
    "fraud": bool(prediction == 1),
    "fraud_probability": round(float(probability), 4)
}

print(json.dumps(result))