require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./database/db');

const authenticateToken = require('./middlewares/auth.middleware');

// Import Routes
const blogRoutes = require('./routes/blog.routes');
const circularRoutes = require('./routes/circular.routes');
const serviceRoutes = require('./routes/service.routes');
const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) or null (local files)
        if (!origin || origin === 'null') return callback(null, true);
        return callback(null, true); // Allow all other origins as well
    },
    credentials: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Public Routes
app.use('/api/blogs', blogRoutes.publicRouter);
app.use('/api/circulars', circularRoutes.publicRouter);
app.use('/api/services', serviceRoutes.publicRouter);

// Protected Content Management Routes
app.use('/api/manage/blogs', authenticateToken, blogRoutes.adminRouter);
app.use('/api/manage/circulars', authenticateToken, circularRoutes.adminRouter);
app.use('/api/manage/services', authenticateToken, serviceRoutes.adminRouter);

// Analytics Routes
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', version: '1.0.1_emergency' });
});

// EMERGENCY SETUP ROUTE (Delete after use)
app.get('/api/emergency-setup', async (req, res) => {
    const bcrypt = require('bcryptjs');
    const user = 'Aaradhya@gmail.com';
    const pass = 'Aaradhya123';
    const hash = await bcrypt.hash(pass, 10);

    db.run('DELETE FROM admin_users', [], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run('INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)', [user, hash, 'admin'], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Master admin created successfully on LIVE server', user: user });
        });
    });
});

// Stats Endpoint
app.get('/api/stats', (req, res) => {
    const stats = {};
    db.get('SELECT COUNT(*) as blogCount FROM blogs', (err, row) => {
        stats.blogs = row.blogCount;
        db.get('SELECT COUNT(*) as circularCount FROM circulars', (err, row) => {
            stats.circulars = row.circularCount;
            db.get('SELECT COUNT(*) as serviceCount FROM services', (err, row) => {
                stats.services = row.serviceCount;
                res.json(stats);
            });
        });
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
