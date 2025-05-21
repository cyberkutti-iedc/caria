
## File: plot.py
import matplotlib.pyplot as plt

def plot_results(y_test, y_pred, target_column):
    plt.figure(figsize=(12, 6))
    plt.plot(y_test, label='Actual', linestyle='dashed')
    plt.plot(y_pred, label='Predicted')
    plt.legend()
    plt.xlabel('Time')
    plt.ylabel(target_column)
    plt.title(f'Actual vs Predicted {target_column}')
    plt.show()