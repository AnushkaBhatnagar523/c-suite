const db = require('../database/db');

exports.submitEnquiry = (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const sql = `INSERT INTO enquiries (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, subject || 'General Inquiry', message], function (err) {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Failed to save enquiry' });
        }
        res.status(201).json({
            message: 'Inquiry received successfully',
            id: this.lastID
        });
    });
};

exports.getAllEnquiries = (req, res) => {
    db.all('SELECT * FROM enquiries ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run('UPDATE enquiries SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Status updated' });
    });
};
