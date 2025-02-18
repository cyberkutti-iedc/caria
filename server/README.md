# Caria

Caria is an innovative low-cost carbon footprint monitoring and AI prediction system. This project integrates real-time data collection, AI-driven analytics, and user-friendly monitoring solutions, combining cutting-edge hardware and software technologies.

---

## 🚀 Features
- **Real-Time Monitoring**: Track carbon footprint data with precision and speed.
- **AI Predictions**: Leverage artificial intelligence to analyze trends and forecast carbon emissions.
- **Cross-Platform Integration**:
  - **Web Interface**: Built with **React.js** and **TypeScript** for seamless monitoring and data visualization.
  - **Hardware Device**: Powered by **ESP32-C3** for efficient and reliable data collection.
- **Cloud Storage**: Uses **Firebase** as a robust and scalable database solution.
- **Extensibility**: Explore additional features and experiments in other branches.

---

## 🛠️ Tech Stack
### Frontend:
- **React.js** (with **TypeScript**)
- **Tailwind CSS** for styling and responsive design

### Backend:
- **Firebase** (for real-time database and storage)
- **Python** (for AI and data processing)

### Hardware:
- **ESP32-C3** microcontroller
- Code written in **C/C++**

### AI/ML:
- Python-based AI models to predict carbon emissions and trends.

---

## 🌟 How It Works
1. **Data Collection**: ESP32-C3 collects environmental data in real-time.
2. **Data Storage**: Data is uploaded to Firebase for storage and processing.
3. **AI Predictions**: AI models analyze the data for insights and predictions.
4. **User Interface**: A React-based web application displays real-time data and AI predictions.

---

## 🔥 Getting Started
### Prerequisites
- Node.js and npm/yarn installed
- ESP32-C3 setup (including required libraries)
- Firebase account and project set up

### Clone the Repository
```bash
git clone https://github.com/yourusername/caria.git
cd caria
```

### Install Dependencies
#### Frontend:
```bash
cd web
npm install
```

#### Hardware:
Install required ESP32 libraries using Arduino IDE or PlatformIO.

#### Backend/AI:
Set up Python environment:
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: .\env\Scripts\activate
pip install -r requirements.txt
```

### Run the Project
#### Start the Web Application:
```bash
npm start
```

