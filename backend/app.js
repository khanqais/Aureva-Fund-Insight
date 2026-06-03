const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();
connectDB();
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/funds', require('./routes/fundsRoutes'));
app.get('/', (req, res) => {
    res.json({ message: 'Aureva Fund Insight Tracker API is running' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
