import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import database from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
            profiles (*)
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});