/*
 * ===========================================================
 * Project Name: Environment Monitoring System
 * ===========================================================
 * Author: Team of Innova Palas (2024-25)
 * -----------------------------------------------------------
 * Hardware: ESP32 Wrover Module, DHT11, MQ135, SD Card Module,
 *           RTC DS3231, Rain Sensor
 * -----------------------------------------------------------
 * Purpose: Monitor environmental conditions, including temperature,
 *          humidity, gas concentrations (CO2, NO2, NH3), rain status,
 *          and battery level. Logs data locally on an SD card and
 *          pushes it remotely to a Firebase Realtime Database.
 * ===========================================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <SD.h>
#include <SPI.h>
#include <DHT.h>
#include <MQ135.h>
#include <RTClib.h>

// Firebase Token & RTDB Helper Functions
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ----------------- PIN CONFIGURATION -----------------
const int dhtPin        = 4;
const int MQ135_PIN     = 32;
const int rainSensorPin = 34;
const int batteryPin    = 35;
const int greenLedPin   = 26;
const int redLedPin     = 27;
const int buzzerPin     = 2;
const int sdCardCsPin   = 5;

#define DHTTYPE DHT11

// ----------------- CALIBRATION CONSTANTS FOR MQ135 -----------------
#define ATMOCO2 397.13  // Average CO2 ppm concentration in air
#define RZERO 5804.99    // Calibration resistance in fresh air
#define RLOAD 10.0       // Load resistance on the board

// ----------------- GAS SENSITIVITY CURVES -----------------
#define PARA_CO2 116.6020682  // Calibration factor for CO2 curve
#define PARB_CO2 -2.769034857 // Calibration exponent for CO2 curve
#define PARA_NH3 102.2        // Calibration factor for NH3 curve
#define PARB_NH3 -2.5         // Calibration exponent for NH3 curve
#define PARA_NO2 104.0        // Calibration factor for NO2 curve
#define PARB_NO2 -2.1         // Calibration exponent for NO2 curve

// ----------------- WIFI CONFIGURATION -----------------
#define WIFI_SSID       "IEDC 2"
#define WIFI_PASSWORD   "iedc@@2025"

// ----------------- FIREBASE CONFIGURATION -----------------
#define API_KEY         "AIzaSyCcOqPg-pDV8Bh0CeTuWNY2ZCHT5p-zr-E"
#define DATABASE_URL    "https://caria-9c751-default-rtdb.firebaseio.com"
#define FIREBASE_EMAIL  "ceoiedcsnmimt@gmail.com"
#define FIREBASE_PASSWORD "12345678"

// ----------------- GLOBAL OBJECTS -----------------
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;
DHT dht(dhtPin, DHTTYPE);
MQ135 mq135_sensor(MQ135_PIN);
RTC_DS3231 rtc;

// Timers
unsigned long previousSensorReadMillis   = 0;
unsigned long previousWiFiCheckMillis    = 0;
unsigned long previousCsvFileRotationMillis = 0;
const unsigned long sensorReadInterval   = 3000;   // 3 seconds for SD card logging
const unsigned long wifiRetryInterval    = 10000;  // Wait 10 seconds before switching modes
const unsigned long csvRotationInterval  = 480000; // 8 minutes to switch CSV files

// Global counters and states
int lineCounter = 1;
int currentCsvIndex = 1;
bool isWifiConnected = false;
bool sdCardWritingStatus = false;
bool errorStatus = false;

// File handler
File dataFile;

// ----------------- FUNCTION PROTOTYPES -----------------
void setupStatusIndicators();
void startupLEDAnimation();
void buzzerStartup();
void wifiConnectedIndicator();
void buzzerWifiConnected();
void dataSentIndicator();
void buzzerDataSent();
bool attemptSignInOrSignUp();
void retrieveFirebaseIndex();
void readAndStoreSensorData();
void writeToSdCard(String data);
void pushDataToFirebase();
void uploadSdCardData();
float getBatteryPercentage();
bool isRaining();
bool connectWiFi();
void rotateCsvFile();
String getCurrentCsvFile();
void updateFirebaseStatus(bool wifi, bool sdStatus, bool errors);
float getPPMFromResistance(float resistance, float para, float parb);
void show_startup_banner();

// -------------------------------------------------------
void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("[INFO] Initializing Environment Monitoring System...\n\n");
  show_startup_banner();
  setupStatusIndicators();
  startupLEDAnimation();
  buzzerStartup();

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC module. Halting...");
    digitalWrite(redLedPin, HIGH);
    delay(2000);
    while (1);
  }

  if (rtc.lostPower()) {
    Serial.println("RTC lost power. Setting time to compile time...");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // Initialize SD card
  if (!SD.begin(sdCardCsPin)) {
    Serial.println("SD Card initialization failed!");
    errorStatus = true;
  } else {
    sdCardWritingStatus = true;
    rotateCsvFile();  // Create or open a new CSV file
  }

  // Connect to WiFi and setup Firebase
  isWifiConnected = connectWiFi();
  if (isWifiConnected) {
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    config.token_status_callback = tokenStatusCallback;
    config.signer.test_mode = true;

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    if (attemptSignInOrSignUp()) {
      Serial.println("Firebase authentication succeeded.");
      retrieveFirebaseIndex();
    } else {
      Serial.println("Firebase authentication failed.");
      errorStatus = true;
    }
  }
  updateFirebaseStatus(isWifiConnected, sdCardWritingStatus, errorStatus);
}

void loop() {
  unsigned long currentMillis = millis();

  // Rotate CSV file every 8 minutes
  if (currentMillis - previousCsvFileRotationMillis >= csvRotationInterval) {
    previousCsvFileRotationMillis = currentMillis;
    rotateCsvFile();
  }

  // Read and store sensor data every 3 seconds
  if (currentMillis - previousSensorReadMillis >= sensorReadInterval) {
    previousSensorReadMillis = currentMillis;
    readAndStoreSensorData();
  }

  // Handle WiFi connection and data upload
  if (WiFi.status() == WL_CONNECTED) {
    if (!isWifiConnected) {
      isWifiConnected = true;
      wifiConnectedIndicator();
    }
    pushDataToFirebase();  // Push data if WiFi is connected
  } else {
    if (isWifiConnected && (currentMillis - previousWiFiCheckMillis >= wifiRetryInterval)) {
      previousWiFiCheckMillis = currentMillis;
      isWifiConnected = false;  // Switch to offline mode
    }
  }
  updateFirebaseStatus(isWifiConnected, sdCardWritingStatus, errorStatus);
}

// -------------------------------------------------------
//               FUNCTION DEFINITIONS
// -------------------------------------------------------
bool attemptSignInOrSignUp() {
  if (Firebase.signUp(&config, &auth, FIREBASE_EMAIL, FIREBASE_PASSWORD)) {
    Serial.println("Firebase sign-up successful or token reused.");
    return true;
  } else {
    Serial.printf("Firebase sign-up failed: %s\n", config.signer.signupError.message.c_str());
    return false;
  }
}

void retrieveFirebaseIndex() {
  if (Firebase.RTDB.getJSON(&fbdo, "caria")) {
    FirebaseJson jsonResponse = fbdo.jsonObject();
    size_t count = jsonResponse.iteratorBegin();
    Serial.printf("Firebase index: %d\n", count);
  } else {
    Serial.printf("Error retrieving index: %s\n", fbdo.errorReason().c_str());
  }
}

void pushDataToFirebase() {
  uploadSdCardData();  // Upload any stored data from SD
}

void uploadSdCardData() {
  for (int i = 1; i <= currentCsvIndex; i++) {
    String filePath = "/data" + String(i) + ".csv";
    if (SD.exists(filePath)) {
      dataFile = SD.open(filePath, FILE_READ);
      while (dataFile.available()) {
        String csvLine = dataFile.readStringUntil('\n');
        json.clear();
        json.set("csv_data", csvLine);
        if (!Firebase.RTDB.pushJSON(&fbdo, "caria/" + WiFi.macAddress() + "/data", &json)) {
          Serial.printf("Failed to push data: %s\n", fbdo.errorReason().c_str());
        } else {
          Serial.println("Data uploaded successfully.");
        }
      }
      dataFile.close();
    }
  }
}

void readAndStoreSensorData() {
  DateTime now = rtc.now();
  float humidity = dht.readHumidity();
  float temperatureC = dht.readTemperature();
  float airQualityPPM = mq135_sensor.getPPM();
  float resistance = mq135_sensor.getResistance();
  
  // CO2 concentration
  float co2 = getPPMFromResistance(resistance, PARA_CO2, PARB_CO2);
  // NO2 concentration
  float no2 = getPPMFromResistance(resistance, PARA_NO2, PARB_NO2);
  // NH3 concentration (ammonia)
  float nh3 = getPPMFromResistance(resistance, PARA_NH3, PARB_NH3);
  float atmosphereQuality = airQualityPPM * 1.1;  // Example composite metric
  float batteryVoltage = getBatteryPercentage();
  bool rainStatus = isRaining();
  String deviceId = WiFi.macAddress();

  if (isnan(humidity) || isnan(temperatureC) || isnan(airQualityPPM)) {
    Serial.println("Invalid sensor readings. Skipping data logging.");
    return;
  }

  String csvLine = String(lineCounter) + "," +
                   String(now.year()) + "-" + String(now.month()) + "-" + String(now.day()) + "," +
                   String(now.hour()) + ":" + String(now.minute()) + ":" + String(now.second()) + "," +
                   String(humidity) + "," + String(temperatureC) + "," + String(airQualityPPM) + "," +
                   String(co2) + "," + String(no2) + "," + String(nh3) + "," + String(atmosphereQuality) + "," +
                   (rainStatus ? "true" : "false") + "," + String(batteryVoltage) + "," + deviceId + "\n";

  writeToSdCard(csvLine);
  lineCounter++;
}

void writeToSdCard(String data) {
  dataFile = SD.open(getCurrentCsvFile(), FILE_APPEND);
  if (dataFile) {
    dataFile.print(data);
    dataFile.close();
  } else {
    Serial.println("Error opening SD file.");
    sdCardWritingStatus = false;
    errorStatus = true;
  }
}

void rotateCsvFile() {
  currentCsvIndex++;
  String csvFilename = getCurrentCsvFile();
  dataFile = SD.open(csvFilename, FILE_WRITE);
  if (dataFile) {
    dataFile.println("Sl/No,Date,Time,Humidity,Temperature,Air Quality (PPM),CO2 (ppm),NO2 (ppm),NH3 (ppm),Atmosphere Quality,Rain Status,Battery Voltage,Device ID");
    dataFile.close();
  }
}

String getCurrentCsvFile() {
  return "/data" + String(currentCsvIndex) + ".csv";
}

void updateFirebaseStatus(bool wifi, bool sdStatus, bool errors) {
  json.clear();
  json.set("device_id", WiFi.macAddress());
  json.set("battery_status", getBatteryPercentage());
  json.set("email_id", FIREBASE_EMAIL);
  json.set("sd_card_status", sdStatus ? "true" : "false");
  json.set("error_status", errors ? "true" : "false");

  Firebase.RTDB.setJSON(&fbdo, "caria/" + WiFi.macAddress() + "/status", &json);
}

float getPPMFromResistance(float resistance, float para, float parb) {
  return para * pow((resistance / RZERO), parb);
}

float getBatteryPercentage() {
  int analogValue = analogRead(batteryPin);
  float voltage = (analogValue / 4095.0) * 3.7;
  float percentage = (voltage / 3.7) * 100;
  return (percentage > 100) ? 100 : percentage;
}

bool isRaining() {
  int rainSensorValue = analogRead(rainSensorPin);
  float voltage = (rainSensorValue / 4095.0) * 3.3;
  return (voltage > 2.0);
}

bool connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  for (int i = 0; i < 20; i++) {
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nWiFi connected.");
      return true;
    }
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connection failed.");
  return false;
}

// -------------------------------------------------------
//               LED & BUZZER INDICATIONS
// -------------------------------------------------------
void show_startup_banner() {
    Serial.println("===========================================================\n");
    Serial.println("|                 ENVIRONMENT MONITORING SYSTEM           |\n");
    Serial.println("|                Team of Innova Palas (2024-25)           |\n");
    Serial.println("===========================================================\n");
}
void setupStatusIndicators() {
  pinMode(greenLedPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(greenLedPin, LOW);
  digitalWrite(redLedPin, LOW);
  digitalWrite(buzzerPin, LOW);
}

void startupLEDAnimation() {
  for (int i = 0; i < 5; i++) {
    digitalWrite(redLedPin, HIGH);
    digitalWrite(greenLedPin, LOW);
    delay(300);
    digitalWrite(redLedPin, LOW);
    digitalWrite(greenLedPin, HIGH);
    delay(300);
  }
  digitalWrite(redLedPin, LOW);
  digitalWrite(greenLedPin, LOW);
}

void buzzerStartup() {
  for (int i = 0; i < 2; i++) {
    digitalWrite(buzzerPin, HIGH);
    delay(100);
    digitalWrite(buzzerPin, LOW);
    delay(100);
  }
}

void wifiConnectedIndicator() {
  digitalWrite(redLedPin, HIGH);
  delay(200);
  digitalWrite(redLedPin, LOW);
}

void buzzerWifiConnected() {
  digitalWrite(buzzerPin, HIGH);
  delay(100);
  digitalWrite(buzzerPin, LOW);
}

void dataSentIndicator() {
  digitalWrite(greenLedPin, HIGH);
  delay(100);
  digitalWrite(greenLedPin, LOW);
}

void buzzerDataSent() {
  digitalWrite(buzzerPin, HIGH);
  delay(50);
  digitalWrite(buzzerPin, LOW);
}
