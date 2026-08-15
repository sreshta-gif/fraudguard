import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

import joblib


# 1. Load dataset
data = pd.read_csv("creditcard.csv")

print("Dataset loaded")
print("Shape:", data.shape)


# 2. Separate features and target
X = data.drop("Class", axis=1)
y = data["Class"]


# 3. Scale the Time and Amount columns
scaler = StandardScaler()

X[["Time", "Amount"]] = scaler.fit_transform(
    X[["Time", "Amount"]]
)


# 4. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# 5. Create model
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)


# 6. Train model
print("Training model...")

model.fit(X_train, y_train)

print("Model training completed")


# 7. Make predictions
y_pred = model.predict(X_test)


# 8. Evaluate model
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# 9. Save model
joblib.dump(model, "fraud_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\nModel saved successfully!")