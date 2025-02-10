#include <Wire.h>
#include <RTClib.h>
#include <DHT.h>
#include <MQ135.h>
#include <SD.h>
#include <SPI.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

// --- Pin Configuration ---
const int dhtPin = 4;
const int MQ135_PIN = 32;
const int rainSensorPin = 33;
const int BATTERY_PIN = 35;
const int chipSelect = 5;  // SD card module CS pin

#define DHTTYPE DHT11
#define BATTERY_MAX_VOLTAGE 4.2
#define BATTERY_MIN_VOLTAGE 3.0

float R0 = 349.78;
#define RLOAD 10000

// --- Sensitivity Parameters ---
#define PARA_PM25 0.10
#define PARA_PM10 0.20
#define PARA_CO 0.0013
#define PARA_SO2 0.00003
#define PARA_NO2 0.000012
#define PARA_O3 0.00002

// CO₂ sensitivity parameters for MQ135
#define PARA_CO2 3.6020682  
#define PARB_CO2 0.769034857  

DHT dht(dhtPin, DHTTYPE);
MQ135 gasSensor(MQ135_PIN);
RTC_DS3231 rtc;

int fileIndex = 1;  // Used to generate file names like data1.csv, data2.csv...
int serialNumber = 1;  // Serial number for each row of data
File dataFile;

// --- Utility Functions ---
float calculatePPM(float rs, float para) {
  return para * (rs / R0);
}

float calculateCO2(float rs) {
  return PARA_CO2 * pow((rs / R0), PARB_CO2);
}

float getBatteryPercentage(float voltage) {
  if (voltage >= BATTERY_MAX_VOLTAGE) return 100.0;
  if (voltage <= BATTERY_MIN_VOLTAGE) return 0.0;
  return ((voltage - BATTERY_MIN_VOLTAGE) / (BATTERY_MAX_VOLTAGE - BATTERY_MIN_VOLTAGE)) * 100.0;
}

int calculateAQI(float concentration, const float breakpoints[][2], const int aqiValues[][2]) {
  for (int i = 0; i < 6; i++) {
    if (concentration >= breakpoints[i][0] && concentration <= breakpoints[i][1]) {
      float cLow = breakpoints[i][0];
      float cHigh = breakpoints[i][1];
      int aqiLow = aqiValues[i][0];
      int aqiHigh = aqiValues[i][1];

      return aqiLow + ((concentration - cLow) * (aqiHigh - aqiLow) / (cHigh - cLow));
    }
  }
  return -1;
}

void createNewFile() {
  String fileName;
  while (true) {
    fileName = "/data" + String(fileIndex) + ".csv";
    if (!SD.exists(fileName)) {
      break;
    }
    fileIndex++;
  }

  dataFile = SD.open(fileName.c_str(), FILE_WRITE);
  if (dataFile) {
    dataFile.println("Sl/No,Date,Time,Temperature,Humidity,CO_ppb,SO2_ppb,NO2_ppb,O3_ppb,CO2_ppm,PM2.5_ug/m3,PM10_ug/m3,AQI_PM2.5,AQI_PM10,Overall_AQI,Battery_Percentage,Rain_Detected");
    dataFile.close();
    Serial.printf("New file created: %s\n", fileName.c_str());
  } else {
    Serial.println("Failed to create new CSV file!");
  }
  serialNumber = 1;
}

void writeDataToCSV(float temperature, float humidity, float co, float so2, float no2, float o3, float co2, float pm25, float pm10, int aqiPM25, int aqiPM10, int overallAQI, float batteryPercentage, bool isRaining) {
  String fileName = "/data" + String(fileIndex - 1) + ".csv";
  dataFile = SD.open(fileName.c_str(), FILE_APPEND);

  if (dataFile) {
    char dateBuffer[11];
    char timeBuffer[9];
    DateTime now = rtc.now();
    sprintf(dateBuffer, "%04d-%02d-%02d", now.year(), now.month(), now.day());
    sprintf(timeBuffer, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());

    dataFile.printf("%d,%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%d,%d,%d,%.2f,%s\n",
                    serialNumber++, dateBuffer, timeBuffer,
                    temperature, humidity, co, so2, no2, o3, co2, pm25, pm10,
                    aqiPM25, aqiPM10, overallAQI, batteryPercentage, isRaining ? "Yes" : "No");
    dataFile.close();
  } else {
    Serial.printf("Error: Failed to open %s for appending!\n", fileName.c_str());
  }
}

void logSensorTask(void *parameter) {
  const float pm25Breakpoints[6][2] = {{0.0, 12.0}, {12.1, 35.4}, {35.5, 55.4}, {55.5, 150.4}, {150.5, 250.4}, {250.5, 500.4}};
  const float pm10Breakpoints[6][2] = {{0.0, 54.0}, {55.0, 154.0}, {155.0, 254.0}, {255.0, 354.0}, {355.0, 424.0}, {425.0, 604.0}};
  const int aqiValues[6][2] = {{0, 50}, {51, 100}, {101, 150}, {151, 200}, {201, 300}, {301, 500}};

  for (;;) {
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT11 sensor!");
      vTaskDelay(pdMS_TO_TICKS(2000));
      continue;
    }

    int mq135Value = analogRead(MQ135_PIN);
    float volts = (mq135Value / 4095.0) * 3.3;
    float rs = RLOAD * ((3.3 - volts) / volts);

    float pm25 = calculatePPM(rs, PARA_PM25);
    float pm10 = calculatePPM(rs, PARA_PM10);
    float co = calculatePPM(rs, PARA_CO) * 1000;
    float so2 = calculatePPM(rs, PARA_SO2) * 1000;
    float no2 = calculatePPM(rs, PARA_NO2) * 1000;
    float o3 = calculatePPM(rs, PARA_O3) * 1000;
    float co2 = calculateCO2(rs);

    int aqiPM25 = calculateAQI(pm25, pm25Breakpoints, aqiValues);
    int aqiPM10 = calculateAQI(pm10, pm10Breakpoints, aqiValues);
    int overallAQI = max(aqiPM25, aqiPM10);

    float batteryVoltage = analogRead(BATTERY_PIN) * (3.3 / 4095.0) * 2;
    float batteryPercentage = getBatteryPercentage(batteryVoltage);

    int rainValue = analogRead(rainSensorPin);
    float rainVolts = (rainValue / 4095.0) * 3.3;
    bool isRaining = rainVolts > 2.0;

    // Print data to Serial Monitor
    Serial.printf("%d | Date: %04d-%02d-%02d | Time: %02d:%02d:%02d | Temp: %.2f°C | Humidity: %.2f%% | CO: %.2f ppb | SO2: %.2f ppb | NO2: %.2f ppb | O3: %.2f ppb | CO2: %.2f ppm | PM2.5: %.2f ug/m³ | PM10: %.2f ug/m³ | AQI: %d | Battery: %.2f%% | Rain: %s\n",
                  serialNumber, rtc.now().year(), rtc.now().month(), rtc.now().day(),
                  rtc.now().hour(), rtc.now().minute(), rtc.now().second(),
                  temperature, humidity, co, so2, no2, o3, co2, pm25, pm10, overallAQI, batteryPercentage, isRaining ? "Yes" : "No");

    writeDataToCSV(temperature, humidity, co, so2, no2, o3, co2, pm25, pm10, aqiPM25, aqiPM10, overallAQI, batteryPercentage, isRaining);
    vTaskDelay(pdMS_TO_TICKS(2000));
  }
}

void fileManagementTask(void *parameter) {
  for (;;) {
    createNewFile();
    vTaskDelay(pdMS_TO_TICKS(360000));  // 6 minutes delay
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(MQ135_PIN, INPUT);
  pinMode(rainSensorPin, INPUT);
  pinMode(BATTERY_PIN, INPUT);

  dht.begin();
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }

  if (rtc.lostPower()) {
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  if (!SD.begin(chipSelect)) {
    Serial.println("Failed to initialize SD card!");
    while (1);
  }

  Serial.println("System initialized.");
  createNewFile();

  xTaskCreatePinnedToCore(logSensorTask, "LogSensorTask", 8192, NULL, 2, NULL, 0);
  xTaskCreatePinnedToCore(fileManagementTask, "FileManagementTask", 16384, NULL, 1, NULL, 0);
}

void loop() {
  // Empty - FreeRTOS tasks handle everything
}
