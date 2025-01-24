import express, { Request, Response } from 'express';
import { ref, get } from 'firebase/database';
import { db } from './config/firebaseConfig';

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Express server!');
});

// Fetch /temp/ value from Firebase Realtime Database
app.get('/temp', async (req: Request, res: Response) => {
    try {
        const tempRef = ref(db, '/temp');
        const snapshot = await get(tempRef);
        const tempValue = snapshot.val();
        res.json({ temp: tempValue });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});