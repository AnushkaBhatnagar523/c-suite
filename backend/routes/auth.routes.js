const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// router.post('/register', authController.register); // Disabled for security - use seeding scripts if needed
router.post('/login', authController.login);

module.exports = router;
