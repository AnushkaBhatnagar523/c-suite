const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

exports.register = function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role || 'admin';

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) return res.status(500).json({ message: err.message });

        db.run(
            'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role],
            function (err) {
                if (err) {
                    if (err.message.indexOf('UNIQUE') !== -1) {
                        return res.status(400).json({ message: 'Username already exists' });
                    }
                    return res.status(500).json({ message: err.message });
                }
                res.status(201).json({ message: 'Admin registered successfully' });
            }
        );
    });
};

exports.login = function (req, res) {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    console.log("Login attempt:", username);

    db.get('SELECT * FROM admin_users WHERE username = ?', [username], function (err, user) {
        if (err) return res.status(500).json({ message: err.message });

        console.log("User from DB:", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password_hash, function (err, isMatch) {
            if (err) return res.status(500).json({ message: err.message });

            console.log("Password match:", isMatch);

            if (!isMatch) {
                console.log("Password incorrect");
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, username: user.username, role: user.role });
        });
    });
};
