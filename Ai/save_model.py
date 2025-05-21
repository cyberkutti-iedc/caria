## File: save_model.py
import tensorflow as tf

def save_model(model, model_path):
    model.save(model_path)

def load_model(model_path):
    return tf.keras.models.load_model(model_path)