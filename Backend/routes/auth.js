const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User (Multi-step form data)
router.post('/register', async (req, res) => {
    const client = await req.db.connect();
    try {
        const {
            // Employee Details
            employee_id, full_name, designation, primary_technology, experience_years, experience_months, skill_level,
            // Customer Details
            customer_name, customer_country, customer_pic_name, customer_pic_department, current_work_description,
            // AI Engagement
            ai_opportunity, customer_ai_adoption, product_business_line, worked_on_ai,
            // AI Skills
            ai_skill_level, ai_upskill_interest, ai_certification, ai_forge_core_business_view,
            // Account
            email, password
        } = req.body;

        // Validation
        if (!email || !password || !employee_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert into DB
        const query = `
      INSERT INTO users (
        employee_id, full_name, designation, primary_technology, experience_years, experience_months, skill_level,
        customer_name, customer_country, customer_pic_name, customer_pic_department, current_work_description,
        ai_opportunity, customer_ai_adoption, product_business_line, worked_on_ai,
        ai_skill_level, ai_upskill_interest, ai_certification, ai_forge_core_business_view,
        email, password_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING id, email, full_name, role
    `;

        const result = await client.query(query, [
            employee_id, full_name, designation, primary_technology, experience_years, experience_months, skill_level,
            customer_name, customer_country, customer_pic_name, customer_pic_department, current_work_description,
            ai_opportunity, customer_ai_adoption, product_business_line, worked_on_ai,
            ai_skill_level, ai_upskill_interest, ai_certification, ai_forge_core_business_view,
            email, password_hash
        ]);

        const user = result.rows[0];
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique constraint violation
            return res.status(409).json({ error: 'User already exists (email or employee ID)' });
        }
        const errorMessage = err.message || 'Server error during registration';
        res.status(500).json({ error: errorMessage });
    } finally {
        client.release();
    }
});

// Login User
router.post('/login', async (req, res) => {
    const client = await req.db.connect();
    try {
        const { email, password } = req.body;

        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        const errorMessage = err.message || 'Server error during login';
        res.status(500).json({ error: errorMessage });
    } finally {
        client.release();
    }
});

module.exports = router;
