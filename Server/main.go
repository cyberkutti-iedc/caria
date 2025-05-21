package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"time"

	"caria/deviceData"  // Updated to match package name in device.go
	"caria/sensorData"

	"github.com/rs/cors"
)

// Custom Not Found Handler
func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, `{"error": "Endpoint not found"}`, http.StatusNotFound)
}

// Check server connectivity to the internet
func checkInternetConnectivity() bool {
	_, err := net.DialTimeout("tcp", "8.8.8.8:53", 3*time.Second) // Google's DNS (8.8.8.8)
	if err != nil {
		log.Println("❌ No internet connection:", err)
		return false
	}
	return true
}

// Health Check Endpoint
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	isOnline := checkInternetConnectivity()

	w.Header().Set("Content-Type", "application/json")
	response := map[string]bool{"serverStatus": isOnline}
	json.NewEncoder(w).Encode(response)
}

// Setup API routes
func setupRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/sensors/json", logRequest(sensorData.GetSensorDataJSON))
	mux.HandleFunc("/api/sensors/csv", logRequest(sensorData.GetSensorDataCSV))
	mux.HandleFunc("/api/metrics", logRequest(sensorData.GetMetrics))
	mux.HandleFunc("/api/devices", logRequest(deviceData.GetAllDevices)) // Get all devices
	mux.HandleFunc("/api/device", logRequest(deviceData.GetDeviceByID))// Added endpoint for all devices
	mux.HandleFunc("/health", healthCheckHandler) 
	mux.HandleFunc("/", notFoundHandler)
}

// Middleware: Log requests
func logRequest(handlerFunc http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		handlerFunc(w, r)
		duration := time.Since(start)
		log.Printf("📡 %s %s [%dms]", r.Method, r.URL.Path, duration.Milliseconds())
	}
}

func main() {
	fmt.Println("🚀 Starting Sensor Data Server...")

	// Initialize Firebase for sensors and devices
	sensorData.InitializeDatabaseConnection()
	deviceData.InitializeDatabaseConnection()

	// Create a new ServeMux and setup routes
	mux := http.NewServeMux()
	setupRoutes(mux)

	// Configure CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Adjust if needed
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	// Start the server
	port := ":8080"
	fmt.Printf("🌍 Server is running at http://localhost%s\n", port)
	if err := http.ListenAndServe(port, corsHandler); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}
