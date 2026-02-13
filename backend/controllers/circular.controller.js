const db = require('../database/db');

// Public: Get all circulars
exports.getAllCirculars = (req, res) => {
    db.all('SELECT * FROM circulars ORDER BY issued_date DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

// Public: Get circular by id
exports.getCircularById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM circulars WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!row) return res.status(404).json({ message: 'Circular not found' });
        res.json(row);
    });
};

// Admin: Create circular
exports.createCircular = (req, res) => {
    const { title, authority, reference_no, issued_date, summary, pdf_url } = req.body;
    const sql = `INSERT INTO circulars (title, authority, reference_no, issued_date, summary, pdf_url) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [title, authority, reference_no, issued_date, summary, pdf_url], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, message: 'Circular created successfully' });
    });
};

// Admin: Update circular
exports.updateCircular = (req, res) => {
    const { id } = req.params;
    const { title, authority, reference_no, issued_date, summary, pdf_url } = req.body;
    const sql = `UPDATE circulars SET title = ?, authority = ?, reference_no = ?, issued_date = ?, summary = ?, pdf_url = ? WHERE id = ?`;
    db.run(sql, [title, authority, reference_no, issued_date, summary, pdf_url, id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Circular not found' });
        res.json({ message: 'Circular updated successfully' });
    });
};

// Admin: Delete circular
exports.deleteCircular = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM circulars WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Circular not found' });
        res.json({ message: 'Circular deleted successfully' });
    });
};
