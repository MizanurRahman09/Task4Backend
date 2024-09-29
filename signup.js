const express = require('express');
const db = require('./db');

const router = express.Router();

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sqlCheck = "SELECT * FROM users WHERE email = ?";
    const sqlInsert = "INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, 'active')";

    db.query(sqlCheck, [email], (err, results) => {
        if (err) {
            console.error('Signup check error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length > 0 && results[0].status === 'blocked') {
            console.log('Blocked user trying to signup again:', email);
            return res.status(403).json({ success: false, message: 'Blocked users cannot register again' });
        }
        db.query(sqlInsert, [name, email, password], (err, data) => {
            if (err) {
                console.error('Signup error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            console.log('User signed up successfully:', data);
            return res.status(200).json({ success: true, message: 'Signup successful' });
        });
    });
});
module.exports = router;
