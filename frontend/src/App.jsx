import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Time: 0,
    Amount: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkFraud = async () => {
    setLoading(true);
    setResult(null);

    try {
      /*
       * The ML model expects:
       * Time + V1...V28 + Amount
       *
       * V1-V28 are hidden from the user because
       * they are anonymized PCA features.
       */
      const transactionData = {
        Time: Number(formData.Time),

        V1: 0,
        V2: 0,
        V3: 0,
        V4: 0,
        V5: 0,
        V6: 0,
        V7: 0,
        V8: 0,
        V9: 0,
        V10: 0,
        V11: 0,
        V12: 0,
        V13: 0,
        V14: 0,
        V15: 0,
        V16: 0,
        V17: 0,
        V18: 0,
        V19: 0,
        V20: 0,
        V21: 0,
        V22: 0,
        V23: 0,
        V24: 0,
        V25: 0,
        V26: 0,
        V27: 0,
        V28: 0,

        Amount: Number(formData.Amount),
      };

      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        error: "Backend connection failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Time: 0,
      Amount: 0,
    });

    setResult(null);
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">🛡️</div>

          <div>
            <h1>FraudGuard</h1>
            <p>AI-Powered Credit Card Fraud Detection</p>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          ML System Online
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        {/* HERO */}
        <section className="hero-card">
          <div className="hero-icon">
            🔐
          </div>

          <div>
            <h2>Transaction Security Analysis</h2>

            <p>
              Analyze a credit card transaction using our machine
              learning fraud detection model.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className="card">

          <div className="section-header">
            <div>
              <h2>Transaction Details</h2>
              <p>
                Enter the basic transaction information below.
              </p>
            </div>

            <div className="secure-badge">
              🔒 Secure Analysis
            </div>
          </div>

          <div className="divider"></div>

          <div className="form-grid">

            {/* TIME */}
            <div className="form-group">
              <label htmlFor="Time">
                Transaction Time
              </label>

              <div className="input-wrapper">
                <span className="input-icon">🕒</span>

                <input
                  id="Time"
                  name="Time"
                  type="number"
                  min="0"
                  value={formData.Time}
                  onChange={handleChange}
                  placeholder="Enter transaction time"
                />
              </div>

              <small>
                Time elapsed since the first transaction in the dataset.
              </small>
            </div>

            {/* AMOUNT */}
            <div className="form-group">
              <label htmlFor="Amount">
                Transaction Amount
              </label>

              <div className="input-wrapper">
                <span className="currency">₹</span>

                <input
                  id="Amount"
                  name="Amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.Amount}
                  onChange={handleChange}
                  placeholder="Enter transaction amount"
                />
              </div>

              <small>
                Enter the amount associated with the transaction.
              </small>
            </div>

          </div>

          {/* MODEL INFO */}
          <div className="model-info">
            <div className="model-info-icon">
              🤖
            </div>

            <div>
              <strong>AI Model Protection</strong>

              <p>
                FraudGuard analyzes anonymized transaction features
                internally using the trained machine learning model.
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="actions">

            <button
              className="fraud-button"
              onClick={checkFraud}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Transaction...
                </>
              ) : (
                <>
                  🔍 Check for Fraud
                </>
              )}
            </button>

            <button
              className="reset-button"
              onClick={resetForm}
              disabled={loading}
            >
              ↻ Reset
            </button>

          </div>

        </section>

        {/* RESULT */}
        {result && !result.error && (
          <section
            className={`result-card ${
              result.fraud ? "fraud-result" : "safe-result"
            }`}
          >

            <div className="result-icon">
              {result.fraud ? "🚨" : "✅"}
            </div>

            <div className="result-content">

              <h2>
                {result.fraud
                  ? "Potential Fraud Detected"
                  : "Transaction is Legitimate"}
              </h2>

              <p>
                {result.fraud
                  ? "This transaction has been identified as potentially fraudulent."
                  : "This transaction is predicted to be legitimate."}
              </p>

              <div className="probability">
                <span>Fraud Probability</span>

                <strong>
                  {(Number(result.fraud_probability) * 100).toFixed(2)}%
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* ERROR */}
        {result?.error && (
          <section className="error-card">

            <div className="error-icon">
              ⚠️
            </div>

            <div>
              <h2>Backend Connection Failed</h2>

              <p>
                FraudGuard could not connect to the prediction server.
              </p>

              <div className="error-command">
                <strong>Start the backend:</strong>

                <code>
                  cd ~/Desktop/credit-card-fraud-detection/backend
                  <br />
                  node server.js
                </code>
              </div>
            </div>

          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer>
        <span>FraudGuard © 2026</span>

        <span>
          AI-Based Transaction Security
        </span>
      </footer>

    </div>
  );
}

export default App;