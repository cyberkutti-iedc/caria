package deviceData

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/db"
	"google.golang.org/api/option"
)

var firebaseDB *db.Ref

// DeviceInfo represents the structure of a device entry
type DeviceInfo struct {
	BatteryPercentage int    `json:"batteryPercentage"`
	Charging          bool   `json:"charging"`
	Controllers       int    `json:"controllers"`
	Cores             int    `json:"cores"`
	DeviceID          string `json:"deviceId"`
	Name              string `json:"name"`
	Online            bool   `json:"online"`
}

// Initialize Firebase Database Connection
func InitializeDatabaseConnection() {
	// Replace with your Firebase Database URL
	firebaseConfig := &firebase.Config{
		DatabaseURL: "https://caria-9c751-default-rtdb.firebaseio.com/",
	}

	opt := option.WithoutAuthentication()
	app, err := firebase.NewApp(context.Background(), firebaseConfig, opt)
	if err != nil {
		log.Fatalf("❌ Firebase Initialization Error: %v", err)
	}

	client, err := app.Database(context.Background())
	if err != nil {
		log.Fatalf("❌ Error getting Firebase Database client: %v", err)
	}

	firebaseDB = client.NewRef("/devices") // Reference to devices node
	fmt.Println("✅ Firebase Connected!")
}

// GetAllDevices Handler - Fetches All Devices
func GetAllDevices(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	var devices []DeviceInfo // Firebase returns an array, so use a slice

	err := firebaseDB.Get(ctx, &devices)
	if err != nil {
		http.Error(w, fmt.Sprintf("❌ Error fetching devices: %v", err), http.StatusInternalServerError)
		return
	}

	// Send JSON Response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(devices)
}

// GetDeviceByID Handler - Fetches a Specific Device
func GetDeviceByID(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	deviceIndex := r.URL.Query().Get("id") // Get "id" parameter

	var devices []DeviceInfo
	err := firebaseDB.Get(ctx, &devices)
	if err != nil {
		http.Error(w, fmt.Sprintf("❌ Error fetching devices: %v", err), http.StatusInternalServerError)
		return
	}

	// Convert string ID to int
	index, err := strconv.Atoi(deviceIndex)
	if err != nil || index < 0 || index >= len(devices) {
		http.Error(w, `{"error": "Invalid device ID"}`, http.StatusBadRequest)
		return
	}

	// Return specific device
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(devices[index])
}
