const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port for deployment
const PORT = process.env.PORT || 5001;

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "FraudGuard Credit Card Fraud Detection API is running"
    });
});

// Fraud prediction
app.post("/predict", (req, res) => {
    const transaction = req.body;

    if (!transaction || Object.keys(transaction).length === 0) {
        return res.status(400).json({
            error: "Transaction data is required"
        });
    }

    const pythonScript = path.join(__dirname, "..", "ml", "predict.py");

    const pythonProcess = spawn("python3", [
        pythonScript,
        JSON.stringify(transaction)
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.error("Python error:", errorOutput);

            return res.status(500).json({
                error: "Fraud prediction failed",
                details: errorOutput
            });
        }

        try {
            const result = JSON.parse(output);

            res.json(result);
        } catch (error) {
            console.error("Invalid Python response:", output);

            res.status(500).json({
                error: "Invalid prediction response"
            });
        }
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`FraudGuard backend running on port ${5001}`);
});