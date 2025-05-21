import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.losses import MeanSquaredError
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt
from train import load_processed_data, prepare_data

def load_trained_model(model_path="rnn_model.h5"):
    custom_objects = {"mse": MeanSquaredError()}
    return tf.keras.models.load_model(model_path, custom_objects=custom_objects)

def evaluate_model(model, X_test, y_test, dates):
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    accuracy = (1 - (mae / np.mean(y_test))) * 100
    print(f'MAE: {mae}, MSE: {mse}, Accuracy: {accuracy:.2f}%')
    return y_pred, accuracy, dates[-len(y_pred):]

def plot_results(dates, y_test, y_pred, target_col):
    plt.figure(figsize=(12, 6))
    plt.plot(dates, y_test, label='Actual', linestyle='dashed')
    plt.plot(dates, y_pred, label='Predicted')
    plt.legend()
    plt.xlabel('Date & Time')
    plt.xticks(rotation=45)
    plt.ylabel(target_col)
    plt.title(f'Actual vs Predicted {target_col}')
    plt.show()

def predict_next_day(model, df, feature_cols, target_col, next_date):
    last_30_days = df[feature_cols].iloc[-30:].values.reshape(1, 30, len(feature_cols))
    predicted_value = model.predict(last_30_days)[0][0]
    print(f'Predicted average {target_col} for {next_date}: {predicted_value:.2f}')
    return predicted_value

if __name__ == "__main__":
    data_file = "processed_data.csv"
    model_path = "rnn_model.h5"

    df, feature_cols, target_col, scaler = load_processed_data(data_file)
    X, y = prepare_data(df, feature_cols, target_col)
    dates = df['Date'] + ' ' + df['Time']

    # Split into test set (same as in train.py)
    test_size = int(0.2 * len(X))  # 20% test set
    X_test, y_test = X[-test_size:], y[-test_size:]
    test_dates = dates[-test_size:]

    model = load_trained_model(model_path)
    y_pred, accuracy, test_dates = evaluate_model(model, X_test, y_test, test_dates)
    
    print("Testing Complete! Accuracy:", accuracy, "%")
    plot_results(test_dates, y_test, y_pred, target_col)
    
    # Predict the next day's average
    next_date = input("Enter the next date (YYYY-MM-DD) to predict average: ")
    predict_next_day(model, df, feature_cols, target_col, next_date)
