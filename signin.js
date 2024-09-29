const express = require('express');
const db = require('./db');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sqlSelect = "SELECT * FROM users WHERE email = ? AND password = ?";
    const sqlUpdate = "UPDATE users SET logintime = CURRENT_TIMESTAMP WHERE email = ?";

    db.query(sqlSelect, [email, password], (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length > 0) {
            const user = results[0];
            if (user.status === 'blocked') {
                console.log('Login failed: User is blocked');
                return res.status(403).json({ success: false, message: 'User is blocked and cannot log in' });
            }
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            db.query(sqlUpdate, [email], (err, updateResult) => {
                if (err) {
                    console.error('Login time update error:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                console.log('Login successful:', user);
                return res.status(200).json({ success: true, message: 'Login successful', user });
            });
        } else {
            console.log('Login failed: Invalid credentials');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

module.exports = router;