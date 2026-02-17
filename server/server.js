import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import database from './db.js';

import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.set('trust proxy', 1);

app.get('/players', async (req, res) => {
    const { data, error } = await database
        .from('players')
        .select(`
            *,
            rules!created_by(count)
        `);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

app.get('/players/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await database
        .from('players')
        .select(`
            *,
            profiles (*),
            rules (*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.json(data);
});

app.post('/players', (req, res) => {

});

app.patch('/players/:id', (req, res) => {

});

const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // (5 MINUTES)
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, error: 'Too many login attempts. Try again later' },
    keyGenerator: (req) => req.ip,
});

app.post('/admin/login', loginRateLimiter, async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('Received login request from ip: ' + ip);

    const { password } = req.body;

    const match = await bcrypt.compare(password, process.env.HASH_PASSWORD);
    if (!match) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    res.json({ token });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});