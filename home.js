const express = require('express');
const db = require('./db');

const router = express.Router();

router.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        return res.status(200).json(data);
    });
});

router.delete('/users', (req, res) => {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid or empty userIds array' });
    }

    const sqlDelete = "DELETE FROM users WHERE id IN (?)";

    db.query(sqlDelete, [userIds], (err, result) => {
        if (err) {
            console.error('Delete users error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log('Users deleted successfully:', result);
        return res.status(200).json({ success: true, message: 'Users deleted successfully' });
    });
});

router.put('/users/block', (req, res) => {
    const { userIds } = req.body;
    const sqlUpdate = "UPDATE users SET status = 'blocked' WHERE id IN (?)";

    db.query(sqlUpdate, [userIds], (err, result) => {
        if (err) {
            console.error('Block users error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log('Users blocked successfully');
        return res.status(200).json({ success: true, message: 'Users blocked successfully' });
    });
});

router.put('/users/unblock', (req, res) => {
    const { userIds } = req.body;
    const sqlUpdate = "UPDATE users SET status = 'active' WHERE id IN (?)";

    db.query(sqlUpdate, [userIds], (err, result) => {
        if (err) {
            console.error('Unblock users error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        console.log('Users unblocked successfully');
        return res.status(200).json({ success: true, message: 'Users unblocked successfully' });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ success: true, message: 'Logout successful' });
    });
});

module.exports = router;