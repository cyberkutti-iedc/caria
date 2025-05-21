## File: main.py
from preprocessing import load_data_from_folder, preprocess_data
from train import build_lstm_model
from save_model import save_model, load_model
from test import evaluate_model
from plot import plot_results
import numpy as np
import pandas as pd
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# Load and process data
folder_path = "path_to_your_data_folder"
df = load_data_from_folder(folder_path)
if df is not None:
    feature_columns = ['Temperature', 'Humidity', 'CO_ppb', 'SO2_ppb', 'NO2_ppb', 'O3_ppb', 'CO2_ppm', 'PM2.5_ug/m3', 'PM10_ug/m3']
    target_column = 'CO2_ppm'
    processed_data_path = "processed_data.csv"

    X, y, scaler = preprocess_data(df, feature_columns, target_column, save_path=processed_data_path)
    
    # Split data into training and testing
    split = int(0.8 * len(X))
    X_train, X_test = np.array(X[:split]), np.array(X[split:])
    y_train, y_test = np.array(y[:split]), np.array(y[split:])
    
    # Train the model
    model = build_lstm_model((X_train.shape[1], X_train.shape[2]))
    model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test))
    
    # Save the model
    save_model(model, "lstm_model.h5")
    
    # Load and evaluate the model
    model = load_model("lstm_model.h5")
    y_pred = evaluate_model(model, X_test, y_test)
    
    # Plot results
    plot_results(y_test, y_pred, target_column)
