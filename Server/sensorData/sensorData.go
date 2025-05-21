package sensorData

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	
	"sort"
	"strconv"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/db"
	"google.golang.org/api/option"
	"caria/config"
)

var firebaseDB *db.Ref

// Initialize Firebase Database Connection
func InitializeDatabaseConnection() {
	// Load Firebase Config
	firebaseConfig := config.GetFirebaseConfig()

	if firebaseConfig.DatabaseURL == "" {
		log.Fatalf("❌ Firebase Database URL is missing. Check your .env file or environment variables.")
	}

	// Firebase Setup
	opt := option.WithoutAuthentication()
	config := &firebase.Config{DatabaseURL: firebaseConfig.DatabaseURL}

	fmt.Println("🔍 Connecting to Firebase Database...")

	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		log.Fatalf("❌ Firebase Initialization Error: %v", err)
	}

	client, err := app.Database(context.Background())
	if err != nil {
		log.Fatalf("❌ Error getting Firebase Database client: %v", err)
	}

	firebaseDB = client.NewRef("/caria")
	fmt.Println("✅ Firebase Connected!")
}

// Predefined header order
var headers = []string{
	"Sl/No", "Date", "Time", "AQI_PM10", "AQI_PM2_5", "Battery_Percentage", "CO2_ppm",
	"CO_ppb", "Humidity_Percent", "NO2_ppb", "O3_ppb", "Overall_AQI", "PM10_ugm3",
	"PM2_5_ugm3", "Rain_Detected", "SO2_ppb", "Temperature_C",
}

// Fetch and sort sensor data
// Fetch and sort sensor data from Firebase
func fetchAndSortData(ctx context.Context) ([]map[string]interface{}, error) {
	var rawData map[string]interface{}

	// Fetch sensor data
	err := firebaseDB.Get(ctx, &rawData)
	if err != nil {
		return nil, fmt.Errorf("❌ Error fetching data from Firebase: %v", err)
	}

	// Extract and sort numeric keys
	var sortedKeys []int
	dataMap := make(map[int]map[string]interface{})

	for key, value := range rawData {
		if key == "lastEntry" {
			continue
		}

		if numKey, err := strconv.Atoi(key); err == nil {
			if entry, ok := value.(map[string]interface{}); ok {
				sortedKeys = append(sortedKeys, numKey)
				dataMap[numKey] = entry
			} else {
				log.Printf("⚠️ Skipping invalid entry at %s (not a map)", key)
			}
		} else {
			log.Printf("⚠️ Skipping invalid key: %s", key)
		}
	}

	sort.Ints(sortedKeys)

	// Format sorted data properly
	var sortedData []map[string]interface{}
	for _, key := range sortedKeys {
		entry := dataMap[key]
		formattedEntry := map[string]interface{}{"Sl/No": key} // Keep original Sl/No

		// Assign fields correctly
		for _, field := range headers {
			if field != "Sl/No" {
				if val, exists := entry[field]; exists {
					formattedEntry[field] = val
				} else {
					formattedEntry[field] = defaultValue(field)
				}
			}
		}

		sortedData = append(sortedData, formattedEntry)
	}

	return sortedData, nil
}


// API Handler: JSON Output
func GetSensorDataJSON(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	sortedData, err := fetchAndSortData(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sortedData)
}

// API Handler: CSV Output
func GetSensorDataCSV(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	sortedData, err := fetchAndSortData(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=sensor_data.csv")
	csvWriter := csv.NewWriter(w)
	defer csvWriter.Flush()

	csvWriter.Write(headers)
	for _, entry := range sortedData {
		var row []string
		for _, field := range headers {
			row = append(row, fmt.Sprintf("%v", entry[field]))
		}
		csvWriter.Write(row)
	}
}


// API Handler: Fetch and analyze emissions data
func GetMetrics(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	// Fetch sorted sensor data
	sortedData, err := fetchAndSortData(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Emission types to analyze
	emissions := []string{"CO2_ppm", "NO2_ppb", "CO_ppb", "SO2_ppb"}

	// Initialize min/max values
	emissionStats := []map[string]interface{}{}

	for _, emissionType := range emissions {
		var values []float64

		for _, entry := range sortedData {
			if val, ok := entry[emissionType].(float64); ok {
				values = append(values, val)
			} else if val, ok := entry[emissionType].(int); ok { // Handle integer values
				values = append(values, float64(val))
			}
		}

		if len(values) > 0 {
			minVal, maxVal := values[0], values[0]
			for _, v := range values {
				if v < minVal {
					minVal = v
				}
				if v > maxVal {
					maxVal = v
				}
			}

			emissionStats = append(emissionStats, map[string]interface{}{
				"type": emissionType,
				"min":  minVal,
				"max":  maxVal,
			})
		} else {
			emissionStats = append(emissionStats, map[string]interface{}{
				"type": emissionType,
				"min":  0,
				"max":  0,
			})
		}
	}

	// Respond with JSON
	responseJSON, err := json.MarshalIndent(map[string]interface{}{"emissionStats": emissionStats}, "", "  ")
	if err != nil {
		http.Error(w, "Error generating JSON", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}


// Default values for missing fields
func defaultValue(field string) interface{} {
	switch field {
	case "Rain_Detected":
		return "No"
	case "Date", "Time":
		return ""
	default:
		return 0
	}
}
