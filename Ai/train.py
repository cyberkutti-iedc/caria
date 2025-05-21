import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

def load_processed_data(file_path="processed_data.csv"):
    df = pd.read_csv(file_path)
    feature_cols = ['Temperature', 'Humidity', 'CO_ppb', 'SO2_ppb', 'NO2_ppb', 'O3_ppb', 'CO2_ppm', 'PM2.5_ug/m3', 'PM10_ug/m3']
    target_col = 'CO2_ppm'  # Example target for prediction
    
    scaler = MinMaxScaler()
    df[feature_cols] = scaler.fit_transform(df[feature_cols])
    
    return df, feature_cols, target_col, scaler

def prepare_data(df, feature_cols, target_col, seq_length=30):
    sequences, targets = [], []
    for i in range(len(df) - seq_length):
        sequences.append(df[feature_cols].iloc[i:i+seq_length].values)
        targets.append(df[target_col].iloc[i+seq_length])
    
    X = np.array(sequences)
    y = np.array(targets)
    return X, y

def build_rnn_model(input_shape):
    model = Sequential([
        SimpleRNN(50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        SimpleRNN(50, return_sequences=False),
        Dropout(0.2),
        Dense(25, activation='relu'),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    accuracy = (1 - (mae / np.mean(y_test))) * 100
    print(f'MAE: {mae}, MSE: {mse}, Accuracy: {accuracy:.2f}%')
    return accuracy

if __name__ == "__main__":
    data_file = "processed_data.csv"
    df, feature_cols, target_col, scaler = load_processed_data(data_file)
    X, y = prepare_data(df, feature_cols, target_col)
    
    # Split data into training and testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Early stopping to prevent overfitting
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    
    # Train the model
    model = build_rnn_model((X_train.shape[1], X_train.shape[2]))
    history = model.fit(X_train, y_train, epochs=25, batch_size=16, validation_data=(X_test, y_test), callbacks=[early_stopping])
    
    # Evaluate the model
    accuracy = evaluate_model(model, X_test, y_test)
    
    # Save the trained model if accuracy is good
    if accuracy > 94:  # Adjust threshold as needed
        model.save("rnn_model2.h5")
        print("Model trained successfully and saved!")
    else:
        print("Model needs improvement, try tuning hyperparameters.")
