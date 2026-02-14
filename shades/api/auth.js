import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readData, paths } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const { USERS_FILE } = paths;

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Parse URL to get path and query
function parseUrl(url) {
    if (!url) return { path: '', query: '' };
    // Remove query string if present
    const [path, query] = url.split('?');
    // Also handle Vercel's routing where path might be just /auth/login
    const cleanPath = path?.replace('/api', '') || '';
    return { path: cleanPath, query };
}

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        return res.status(200).end();
    }

    setCorsHeaders(res);

    const { path } = parseUrl(req.url || req.uri || '');

    console.log('Auth API - Path:', path, 'Method:', req.method);

    // POST /api/auth/login
    if (path === '/api/auth/login' || path === '/auth/login') {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        try {
            const { username, password } = req.body || {};

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password required' });
            }

            console.log('Login attempt for:', username);
            const users = await readData(USERS_FILE);
            console.log('Users loaded:', users.length);

            const user = Array.isArray(users) ? users.find(u => u.username === username) : null;
            console.log('Found user:', user ? user.username : 'not found');

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const passwordMatch = bcrypt.compareSync(password, user.password_hash);
            console.log('Password match:', passwordMatch);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/auth/me
    if (path === '/api/auth/me' || path === '/auth/me') {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        try {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            const users = await readData(USERS_FILE);
            const user = Array.isArray(users) ? users.find(u => u.id === decoded.id) : null;

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    // Default - not found
    return res.status(404).json({ error: 'Not found' });
}
