const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiry.controller');
const authenticateToken = require('../middlewares/auth.middleware');

// Public route to submit
router.post('/submit', enquiryController.submitEnquiry);

// Protected routes to manage
router.get('/', authenticateToken, enquiryController.getAllEnquiries);
router.put('/:id/status', authenticateToken, enquiryController.updateStatus);
router.delete('/:id', authenticateToken, enquiryController.deleteEnquiry);

module.exports = router;
