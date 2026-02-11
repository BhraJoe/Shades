import { readData, writeData, paths } from '../server/database.js';

const { SUBSCRIBERS_FILE } = paths;

// POST subscribe to newsletter
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const subscribers = await readData(SUBSCRIBERS_FILE);

        const existing = subscribers.find(s => s.email === email);
        if (existing) {
            return res.status(400).json({ error: 'Already subscribed' });
        }

        subscribers.push({
            id: subscribers.length + 1,
            email,
            created_at: new Date().toISOString()
        });

        await writeData(SUBSCRIBERS_FILE, subscribers);
        res.status(200).json({ success: true, message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
}
