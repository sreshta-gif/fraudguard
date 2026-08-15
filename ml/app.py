from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "fraud_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURES = [
    "Time",
    "V1", "V2", "V3", "V4", "V5", "V6", "V7",
    "V8", "V9", "V10", "V11", "V12", "V13", "V14",
    "V15", "V16", "V17", "V18", "V19", "V20", "V21",
    "V22", "V23", "V24", "V25", "V26", "V27", "V28",
    "Amount"
]


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "FraudGuard ML API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Transaction data is required"
            }), 400

        missing = [
            feature for feature in FEATURES
            if feature not in data
        ]

        if missing:
            return jsonify({
                "error": "Missing features",
                "missing": missing
            }), 400

        df = pd.DataFrame([[data[f] for f in FEATURES]], columns=FEATURES)

        df[["Time", "Amount"]] = scaler.transform(
            df[["Time", "Amount"]]
        )

        prediction = model.predict(df)[0]

        probability = model.predict_proba(df)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "fraud": bool(prediction == 1),
            "fraud_probability": round(float(probability), 4)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )