const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Multer setup for memory storage (diskStorage is not supported on Vercel)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .pdf format allowed!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get Current User (Me)
router.get('/me', authenticateToken, async (req, res) => {
    const client = await req.db.connect();
    try {
        const result = await client.query('SELECT id, employee_id, full_name, email, role, idea_pdf_url, designation, primary_technology, customer_name, customer_country FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) return res.sendStatus(404);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// Upload Idea PDF
router.post('/upload-idea', authenticateToken, upload.single('ideaPdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    const client = await req.db.connect();
    try {
        const fileUrl = `/uploads/${req.file.filename}`;

        await client.query('UPDATE users SET idea_pdf_url = $1 WHERE id = $2', [fileUrl, req.user.id]);

        res.json({ message: 'File uploaded successfully', fileUrl });
    } catch (err) {
        console.error(err);
        fs.unlinkSync(req.file.path); // Cleanup file if DB update fails
        res.status(500).json({ error: 'Database update failed' });
    } finally {
        client.release();
    }
});

module.exports = router;
