import os
import pandas as pd
import time
import sys
from itertools import cycle
from threading import Thread, Event
from sklearn.preprocessing import MinMaxScaler

def loading_animation(event):
    chars = cycle("|/-\\")
    while not event.is_set():
        sys.stdout.write(f'\rProcessing Data... {next(chars)}')
        sys.stdout.flush()
        time.sleep(0.1)
    sys.stdout.write('\rProcessing Complete!     \n')

def load_data_from_folder(folder_path):
    data_frames = []
    for root, _, files in os.walk(folder_path):  # Recursively search subfolders
        for f in files:
            if f.startswith("data") and f.endswith(".csv"):
                file_path = os.path.join(root, f)
                if os.stat(file_path).st_size == 0:
                    print(f"Skipping empty file: {file_path}")
                    continue
                try:
                    df = pd.read_csv(file_path)
                    if df.empty or df.columns[0] == "":
                        print(f"Skipping invalid file: {file_path}")
                        continue
                    data_frames.append(df)
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
                    continue
    return pd.concat(data_frames, ignore_index=True) if data_frames else None

def preprocess_data(df, save_path="processed_data.csv"):
    feature_cols = ['Sl/No', 'Date', 'Time', 'Temperature', 'Humidity', 'CO_ppb', 'SO2_ppb', 'NO2_ppb', 'O3_ppb', 'CO2_ppm', 'PM2.5_ug/m3', 'PM10_ug/m3', 'AQI_PM2.5', 'AQI_PM10', 'Overall_AQI', 'Rain_Detected']
    df = df[feature_cols]  # Select only required columns
    df = df.sort_values(by=['Date', 'Time'])  # Ensure chronological order
    df.fillna(method='ffill', inplace=True)  # Forward fill missing values
    
    df.to_csv(save_path, index=False)  # Save processed data
    return df

if __name__ == "__main__":
    folder_path = os.getcwd()  # Use the current location
    df = load_data_from_folder(folder_path)
    
    if df is not None:
        stop_event = Event()
        loader_thread = Thread(target=loading_animation, args=(stop_event,))
        loader_thread.start()
        
        try:
            processed_df = preprocess_data(df)
            print("Processed data saved successfully!")
        except ValueError as ve:
            print(f"Data processing error: {ve}")
        
        stop_event.set()
        loader_thread.join()
    else:
        print("No valid data files found. Please check the CSV files.")