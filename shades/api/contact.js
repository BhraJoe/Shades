import { readData, writeData, paths } from '../server/database.js';

const { MESSAGES_FILE } = paths;

// POST contact message
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const messages = await readData(MESSAGES_FILE);

        messages.push({
            id: messages.length + 1,
            name,
            email,
            subject,
            message,
            created_at: new Date().toISOString()
        });

        await writeData(MESSAGES_FILE, messages);
        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
}
