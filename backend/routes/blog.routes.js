const express = require('express');
const publicRouter = express.Router();
const adminRouter = express.Router();
const blogController = require('../controllers/blog.controller');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Public routes
publicRouter.get('/', blogController.getAllBlogs);
publicRouter.get('/categories', blogController.getCategories);
publicRouter.get('/slug/:slug', blogController.getBlogBySlug);

// Admin routes
adminRouter.get('/', blogController.getAdminBlogs);
adminRouter.post('/', upload.single('blogImage'), blogController.createBlog);
adminRouter.put('/:id', blogController.updateBlog);
adminRouter.delete('/:id', blogController.deleteBlog);

module.exports = { publicRouter, adminRouter };
