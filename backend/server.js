const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "Credit Card Fraud Detection API is running"
    });
});


// ===============================
// PREDICTION ROUTE
// ===============================
app.post("/predict", (req, res) => {

    console.log("Prediction request received");

    // Python executable inside ML virtual environment
    const pythonPath = path.join(
        __dirname,
        "..",
        "ml",
        "venv",
        "bin",
        "python3"
    );

    // Python prediction file
    const scriptPath = path.join(
        __dirname,
        "..",
        "ml",
        "predict.py"
    );

    console.log("Python:", pythonPath);
    console.log("Script:", scriptPath);

    const python = spawn(pythonPath, [scriptPath]);

    let result = "";
    let error = "";

    // Send frontend data to Python
    python.stdin.write(JSON.stringify(req.body));
    python.stdin.end();


    // Receive Python output
    python.stdout.on("data", (data) => {
        result += data.toString();
    });


    // Receive Python errors
    python.stderr.on("data", (data) => {
        error += data.toString();
        console.error("Python Error:", data.toString());
    });


    // Python process finished
    python.on("close", (code) => {

        console.log("Python process exited with code:", code);

        if (code !== 0) {
            console.error("ML prediction failed:", error);

            return res.status(500).json({
                error: "ML prediction failed",
                details: error
            });
        }

        try {

            const prediction = JSON.parse(result);

            console.log("Prediction:", prediction);

            res.json(prediction);

        } catch (err) {

            console.error("Invalid ML response:", result);

            res.status(500).json({
                error: "Invalid ML response",
                details: result
            });
        }
    });
});


// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`FraudGuard backend running on port ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});