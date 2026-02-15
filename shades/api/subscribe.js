import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC4dKfC5dBxKx2y3z4v8w0n6p9q1r5t7u9",
    authDomain: "cityshades.firebaseapp.com",
    projectId: "cityshades",
    storageBucket: "cityshades.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// POST subscribe to newsletter
export default async function handler(req, res) {
    // GET - fetch all subscribers
    if (req.method === 'GET') {
        try {
            const snapshot = await getDocs(collection(db, 'subscribers'));
            const subscribers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return res.status(200).json(subscribers);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            return res.status(500).json({ error: 'Failed to fetch subscribers' });
        }
    }

    // POST - subscribe to newsletter
    if (req.method === 'POST') {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // Check if already subscribed
            const q = query(collection(db, 'subscribers'), where('email', '==', email));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                return res.status(400).json({ error: 'Already subscribed' });
            }

            // Add new subscriber
            await addDoc(collection(db, 'subscribers'), {
                email,
                created_at: new Date().toISOString()
            });

            res.status(200).json({ success: true, message: 'Successfully subscribed' });
        } catch (error) {
            console.error('Error subscribing:', error);
            res.status(500).json({ error: 'Failed to subscribe' });
        }
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
}
