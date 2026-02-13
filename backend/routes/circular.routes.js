const express = require('express');
const publicRouter = express.Router();
const adminRouter = express.Router();
const circularController = require('../controllers/circular.controller');

// Public routes
publicRouter.get('/', circularController.getAllCirculars);
publicRouter.get('/:id', circularController.getCircularById);

// Admin routes
adminRouter.post('/', circularController.createCircular);
adminRouter.delete('/:id', circularController.deleteCircular);

module.exports = { publicRouter, adminRouter };
