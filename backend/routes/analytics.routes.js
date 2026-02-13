const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// Public route for tracking
router.post('/track', analyticsController.trackPageView);

// Admin routes for viewing analytics
router.get('/summary', analyticsController.getAnalyticsSummary);
router.get('/popular', analyticsController.getPopularContent);

module.exports = router;
