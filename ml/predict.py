import json
import sys
import os
import joblib
import pandas as pd

# ---------------------------------------
# Paths
# ---------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "fraud_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")


# ---------------------------------------
# Load ML model and scaler
# ---------------------------------------

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


# ---------------------------------------
# Read transaction data from Node.js
# ---------------------------------------

try:
    data = json.loads(sys.argv[1])
except (IndexError, json.JSONDecodeError):
    print(json.dumps({
        "error": "Invalid transaction data"
    }))
    sys.exit(1)


# ---------------------------------------
# Convert input to DataFrame
# ---------------------------------------

df = pd.DataFrame([data])


# ---------------------------------------
# Required columns
# ---------------------------------------

required_columns = [
    "Time",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
    "V18",
    "V19",
    "V20",
    "V21",
    "V22",
    "V23",
    "V24",
    "V25",
    "V26",
    "V27",
    "V28",
    "Amount"
]


# ---------------------------------------
# Check required columns
# ---------------------------------------

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    print(json.dumps({
        "error": "Missing required features",
        "missing": missing_columns
    }))
    sys.exit(1)


# ---------------------------------------
# Arrange columns in training order
# ---------------------------------------

df = df[required_columns]


# ---------------------------------------
# Scale Time and Amount
# ---------------------------------------

try:
    df[["Time", "Amount"]] = scaler.transform(
        df[["Time", "Amount"]]
    )
except Exception as error:
    print(json.dumps({
        "error": "Scaling failed",
        "details": str(error)
    }))
    sys.exit(1)


# ---------------------------------------
# ML Prediction
# ---------------------------------------

try:
    prediction = model.predict(df)[0]

    probability = model.predict_proba(df)[0][1]

except Exception as error:
    print(json.dumps({
        "error": "Model prediction failed",
        "details": str(error)
    }))
    sys.exit(1)


# ---------------------------------------
# Return result to Node.js
# ---------------------------------------

result = {
    "prediction": int(prediction),
    "fraud": bool(prediction == 1),
    "fraud_probability": round(float(probability), 4)
}

print(json.dumps(result))