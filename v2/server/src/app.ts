import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from './config/firebaseConfig';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./caria-9c751-firebase-adminsdk-fbsvc-c38b833792.json'); // Update with the correct path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Ensure this is set in the .env file
});

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiter Setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Firebase Database References
const personalInfoRef = ref(db, '/personalInfo');
const metricsRef = ref(db, '/metrics');
const emissionsRef = ref(db, '/emissions');
const devicesRef = ref(db, '/devices');
const dataRef = ref(db, '/data');

// Authentication Middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.body.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

app.use(cors({ origin: '*', credentials: true }));  // Allow frontend requests

// API Endpoints
app.get('/api/data', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await get(dataRef);
    res.json(snapshot.val());
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/emissions', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await get(emissionsRef);
    res.json(snapshot.val());
  } catch (error) {
    console.error('Error fetching emissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.status(201).json({ uid: userRecord.uid, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required');
  }

  try {
    // Verify the user's credentials using Firebase Admin SDK
    const userRecord = await admin.auth().getUserByEmail(email);

    // Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ token: customToken, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).send('Invalid email or password');
  }
});



// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});