from flask import Flask, request, jsonify
import tensorflow as tf
import joblib
import numpy as np
from flask_cors import CORS  # Importing CORS

# Load the model and scalers
model = tf.keras.models.load_model("carbon_footprint_model.h5")
scaler_X = joblib.load("scaler_X.pkl")
scaler_y = joblib.load("scaler_y.pkl")

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins (for development, you can change this to a specific domain later)
CORS(app)

@app.route('/')
def home():
    return "Welcome to the Carbon Footprint Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Getting the input JSON data
    # Example input: {"temperature": 25, "hour": 14, "minute": 30, "day_of_week": 2, "lag_1": 400, "lag_2": 390, "lag_3": 380}
    
    # Prepare features from input data
    features = np.array([[data['temperature'], data['hour'], data['minute'], 
                          data['day_of_week'], data['lag_1'], data['lag_2'], data['lag_3']]])

    # Normalize input features
    features_scaled = scaler_X.transform(features)
    features_scaled = np.reshape(features_scaled, (features_scaled.shape[0], 1, features_scaled.shape[1]))
    
    # Make prediction
    prediction_scaled = model.predict(features_scaled)
    prediction = scaler_y.inverse_transform(prediction_scaled)  # Inverse transform to get actual CO2 value
    
    # Return the prediction in JSON format
    return jsonify({"predicted_CO2": float(prediction[0][0])})

if __name__ == '__main__':
    app.run(debug=True)
