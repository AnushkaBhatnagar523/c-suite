const express = require('express');
const publicRouter = express.Router();
const adminRouter = express.Router();
const serviceController = require('../controllers/service.controller');

// Public routes
publicRouter.get('/', serviceController.getAllServices);
publicRouter.get('/:slug', serviceController.getServiceBySlug);

// Admin routes
adminRouter.post('/', serviceController.createService);
adminRouter.put('/:id', serviceController.updateService);

module.exports = { publicRouter, adminRouter };
