package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

// FirebaseConfig holds Firebase environment variables
type FirebaseConfig struct {
	APIKey            string
	AuthDomain        string
	DatabaseURL       string
	ProjectID         string
	StorageBucket     string
	MessagingSenderID string
	AppID             string
	MeasurementID     string
}

// Load environment variables
func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ Warning: No .env file found. Using system env variables.")
	}
}

// GetFirebaseConfig loads Firebase settings from environment
func GetFirebaseConfig() FirebaseConfig {
	loadEnv()

	return FirebaseConfig{
		APIKey:            os.Getenv("FIREBASE_API_KEY"),
		AuthDomain:        os.Getenv("FIREBASE_AUTH_DOMAIN"),
		DatabaseURL:       os.Getenv("FIREBASE_DATABASE_URL"),
		ProjectID:         os.Getenv("FIREBASE_PROJECT_ID"),
		StorageBucket:     os.Getenv("FIREBASE_STORAGE_BUCKET"),
		MessagingSenderID: os.Getenv("FIREBASE_MESSAGING_SENDER_ID"),
		AppID:             os.Getenv("FIREBASE_APP_ID"),
		MeasurementID:     os.Getenv("FIREBASE_MEASUREMENT_ID"),
	}
}

// PrintFirebaseConfig (For Debugging)
func PrintFirebaseConfig() {
	config := GetFirebaseConfig()
	fmt.Printf("✅ Firebase Config: %+v\n", config)
}
