# FraudGuard

FraudGuard is a machine-learning based credit card fraud detection application.

The project takes basic transaction information and sends it to a trained ML model. The model returns a fraud prediction and a probability score, which is then displayed through a simple web interface.

The main goal of this project is to show how a machine learning model can be connected to a real web application and deployed online.

## Live Demo

- Frontend: https://fraudguard-frontend-qpgm.onrender.com
- Backend API: https://fraudguard-g3w1.onrender.com

> Note: Render free services may take a few seconds to wake up after being inactive.

## What the project does

A user enters transaction details such as:

- Transaction time
- Transaction amount

FraudGuard sends these values to the backend API.

The backend passes the data to the trained machine learning model and returns:

- Fraud / legitimate prediction
- Fraud probability

The frontend then displays the result in a clear format.

For example:

- **Transaction is Legitimate** with a low fraud probability
- **Potential Fraud Detected** when the model considers the transaction suspicious

## Features

- Simple and clean transaction analysis interface
- Machine learning based fraud prediction
- Fraud probability score
- Separate frontend and backend
- REST API communication between frontend and ML service
- Deployed online using Render
- Responsive interface
- Basic error handling and reset functionality

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend / ML API

- Python
- Flask
- Gunicorn
- Scikit-learn
- NumPy
- Pandas

### Deployment

- Render
- GitHub

## Project Structure

```text
fraudguard/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── app.py
    ├── model/
    ├── requirements.txt
    └── ...
```

The exact file names can differ depending on the current version of the project.

## How it works

```text
User
  |
  v
React Frontend
  |
  | Transaction data
  v
Python REST API
  |
  v
Machine Learning Model
  |
  | Prediction + probability
  v
Backend Response
  |
  v
React UI
  |
  v
Fraud / Legitimate Result
```

## Running the project locally

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd fraudguard
```

### 2. Start the backend

Go to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the API:

```bash
python app.py
```

If the project uses Gunicorn for local execution, you can also use:

```bash
gunicorn app:app
```

The API should then be available at the local address shown by the application.

### 3. Start the frontend

Open another terminal and move to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## API communication

The frontend communicates with the Python backend through HTTP requests.

A typical prediction request contains transaction values such as:

```json
{
  "time": 50000,
  "amount": 500
}
```

The backend processes the values and returns a prediction similar to:

```json
{
  "prediction": 0,
  "fraud_probability": 0.565
}
```

The exact request and response fields depend on the current backend implementation.

## Machine Learning

The ML part of FraudGuard is trained to identify patterns associated with fraudulent transactions.

The model does not simply decide based on the transaction amount. It uses the features provided to it during training and produces a prediction based on the learned patterns.

The application then converts the model output into a user-friendly result.

### Important note

This project is intended for learning and demonstration purposes. It should not be treated as a production banking fraud detection system.

Real-world fraud detection systems normally use many additional signals, such as:

- Merchant information
- Device information
- Location
- Transaction history
- Customer behaviour
- Time and frequency patterns
- Authentication signals
- Risk rules and multiple ML models

## Deployment

The project is deployed using Render.

The deployment is split into two services:

1. **FraudGuard ML API**  
   Runs the Python machine learning backend.

2. **FraudGuard Frontend**  
   Serves the React/Vite application.

When code is pushed to the connected GitHub repository, Render can rebuild and deploy the updated service.

## Screenshots

Add screenshots of the application here.

Example:

```text
docs/
└── screenshots/
    ├── home.png
    ├── legitimate-result.png
    └── fraud-result.png
```

Then reference them in this README:

```markdown
![FraudGuard Dashboard](docs/screenshots/home.png)
```

## Example

### Legitimate transaction

A transaction with normal input values may return:

```text
Transaction is Legitimate
Fraud Probability: 1.89%
```

### Potentially fraudulent transaction

A transaction with different input values may return:

```text
Potential Fraud Detected
Fraud Probability: 56.50%
```

These values are examples from the application UI and should not be interpreted as real banking risk scores.

## Why I built this project

I built FraudGuard to understand the complete process of connecting a machine learning model to a web application.

Instead of keeping the ML model as a standalone Python script, this project exposes it through an API and connects that API to a React frontend.

This helped me practice:

- Machine learning model integration
- REST APIs
- React frontend development
- Frontend-backend communication
- JSON data handling
- Deployment
- Git and GitHub workflow

## Future Improvements

Some improvements that could make the project more realistic are:

- Add more transaction features
- Add transaction history
- Store predictions in a database
- Add user authentication
- Add an admin dashboard
- Display fraud trends using charts
- Improve model evaluation
- Add precision, recall and F1-score reporting
- Add proper input validation
- Add API authentication
- Add automated testing
- Improve the model with a larger and more representative dataset

## Disclaimer

FraudGuard is an educational project and is not intended to make real financial or banking decisions.

The predictions shown by the application are generated by a machine learning model and should not be considered professional financial or security advice.

## Author

**Sreshta**

GitHub: <your-github-profile-url>
