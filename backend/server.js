const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🏝️ Pemalang Tourism API',
        version: '1.0.0',
        status: 'Running'
    });
});

// Import routes (akan kita buat nanti)
const wisataRoutes = require('./routes/wisataRoutes');
const haversineRoutes = require('./routes/haversineRoutes');
const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');

app.use('/api/wisata', wisataRoutes);
app.use('/api/haversine', haversineRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/kategori', kategoriRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME}\n`);
});