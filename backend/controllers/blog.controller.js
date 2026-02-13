const db = require('../database/db');
const { slugify, sanitizeHtml } = require('../utils/helpers');

// Public: Get all blogs with pagination, search, and filtering
exports.getAllBlogs = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let sql = "SELECT * FROM blogs WHERE status = 'published'";
    let countSql = "SELECT COUNT(*) as total FROM blogs WHERE status = 'published'";
    const params = [];
    const countParams = [];

    // Add search filter
    if (search) {
        sql += " AND (title LIKE ? OR content LIKE ? OR author LIKE ?)";
        countSql += " AND (title LIKE ? OR content LIKE ? OR author LIKE ?)";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
        countParams.push(searchParam, searchParam, searchParam);
    }

    // Add category filter
    if (category) {
        sql += " AND category = ?";
        countSql += " AND category = ?";
        params.push(category);
        countParams.push(category);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Get total count
    db.get(countSql, countParams, (err, countRow) => {
        if (err) return res.status(500).json({ message: err.message });

        const total = countRow.total;
        const totalPages = Math.ceil(total / limit);

        // Get paginated results
        db.all(sql, params, (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });

            res.json({
                data: rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        });
    });
};

// Public: Get single blog by slug
exports.getBlogBySlug = (req, res) => {
    const { slug } = req.params;
    db.get('SELECT * FROM blogs WHERE slug = ?', [slug], (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!row) return res.status(404).json({ message: 'Blog not found' });
        res.json(row);
    });
};

// Admin: Get all blogs (including drafts)
exports.getAdminBlogs = (req, res) => {
    db.all('SELECT * FROM blogs ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

// Admin: Create blog
exports.createBlog = (req, res) => {
    let { title, slug, content, category, author, status } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Auto-generate slug if title exists and slug is empty
    if (title && (!slug || slug.trim() === '')) {
        slug = slugify(title);
    }

    // Sanitize content
    content = sanitizeHtml(content);

    const sql = `INSERT INTO blogs (title, slug, content, image_url, category, author, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [title, slug, content, image_url, category, author, status || 'draft'], function (err) {
        if (err) {
            console.error('❌ Blog Creation Error:', err.message);
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Blog created successfully' });
    });
};

// Admin: Update blog
exports.updateBlog = (req, res) => {
    const { id } = req.params;
    let { title, slug, content, category, author, status } = req.body;

    if (title && (!slug || slug.trim() === '')) {
        slug = slugify(title);
    }
    content = sanitizeHtml(content);

    const sql = `UPDATE blogs SET title = ?, slug = ?, content = ?, category = ?, author = ?, status = ? WHERE id = ?`;
    db.run(sql, [title, slug, content, category, author, status, id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog updated successfully' });
    });
};

// Admin: Delete blog
exports.deleteBlog = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM blogs WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    });
};

// Public: Get all unique categories
exports.getCategories = (req, res) => {
    const sql = "SELECT DISTINCT category FROM blogs WHERE status = 'published' AND category IS NOT NULL AND category != '' ORDER BY category";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        const categories = rows.map(row => row.category);
        res.json(categories);
    });
};
