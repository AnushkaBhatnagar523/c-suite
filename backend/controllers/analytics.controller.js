const db = require('../database/db');

// Track page view
exports.trackPageView = (req, res) => {
    const { page, referrer, userAgent } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    const sql = `INSERT INTO analytics (page, referrer, user_agent, ip_address) VALUES (?, ?, ?, ?)`;
    db.run(sql, [page, referrer, userAgent, ip], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Page view tracked' });
    });
};

// Get analytics summary
exports.getAnalyticsSummary = (req, res) => {
    const days = parseInt(req.query.days) || 7;
    const date = new Date();
    date.setDate(date.getDate() - days);
    const startDate = date.toISOString();

    const queries = {
        totalViews: `SELECT COUNT(*) as count FROM analytics WHERE created_at >= ?`,
        uniqueVisitors: `SELECT COUNT(DISTINCT ip_address) as count FROM analytics WHERE created_at >= ?`,
        topPages: `SELECT page, COUNT(*) as views FROM analytics WHERE created_at >= ? GROUP BY page ORDER BY views DESC LIMIT 10`,
        recentViews: `SELECT page, created_at FROM analytics WHERE created_at >= ? ORDER BY created_at DESC LIMIT 20`
    };

    const results = {};

    db.get(queries.totalViews, [startDate], (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        results.totalViews = row.count;

        db.get(queries.uniqueVisitors, [startDate], (err, row) => {
            if (err) return res.status(500).json({ message: err.message });
            results.uniqueVisitors = row.count;

            db.all(queries.topPages, [startDate], (err, rows) => {
                if (err) return res.status(500).json({ message: err.message });
                results.topPages = rows;

                db.all(queries.recentViews, [startDate], (err, rows) => {
                    if (err) return res.status(500).json({ message: err.message });
                    results.recentViews = rows;
                    results.period = `Last ${days} days`;

                    res.json(results);
                });
            });
        });
    });
};

// Get popular content
exports.getPopularContent = (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const days = parseInt(req.query.days) || 30;
    const date = new Date();
    date.setDate(date.getDate() - days);
    const startDate = date.toISOString();

    const sql = `
        SELECT page, COUNT(*) as views 
        FROM analytics 
        WHERE created_at >= ? AND page LIKE '/blog%'
        GROUP BY page 
        ORDER BY views DESC 
        LIMIT ?
    `;

    db.all(sql, [startDate, limit], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};
