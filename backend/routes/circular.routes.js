const express = require('express');
const publicRouter = express.Router();
const adminRouter = express.Router();
const circularController = require('../controllers/circular.controller');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
    filename: (req, file, cb) => cb(null, 'circular-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDFs allowed'), false);
    }
});

// Public routes
publicRouter.get('/', circularController.getAllCirculars);
publicRouter.get('/:id', circularController.getCircularById);

// Admin routes
adminRouter.get('/', circularController.getAllCirculars);
adminRouter.post('/', upload.single('circularPdf'), circularController.createCircular);
adminRouter.delete('/:id', circularController.deleteCircular);

module.exports = { publicRouter, adminRouter };
