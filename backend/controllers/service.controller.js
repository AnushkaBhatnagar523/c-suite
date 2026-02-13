const db = require('../database/db');

// Public: Get all services
exports.getAllServices = (req, res) => {
    db.all('SELECT * FROM services', [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

// Public: Get service by slug
exports.getServiceBySlug = (req, res) => {
    const { slug } = req.params;
    db.get('SELECT * FROM services WHERE slug = ?', [slug], (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!row) return res.status(404).json({ message: 'Service not found' });
        res.json(row);
    });
};

// Admin: Create service
exports.createService = (req, res) => {
    const { service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description } = req.body;
    const sql = `INSERT INTO services (service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, message: 'Service created successfully' });
    });
};

// Admin: Update service
exports.updateService = (req, res) => {
    const { id } = req.params;
    const { service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description } = req.body;
    const sql = `UPDATE services SET service_name = ?, slug = ?, description = ?, applicable_acts = ?, sub_services = ?, meta_title = ?, meta_description = ? WHERE id = ?`;
    db.run(sql, [service_name, slug, description, applicable_acts, sub_services, meta_title, meta_description, id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Service not found' });
        res.json({ message: 'Service updated successfully' });
    });
};

// Admin: Delete service
exports.deleteService = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM services WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Service not found' });
        res.json({ message: 'Service deleted successfully' });
    });
};
