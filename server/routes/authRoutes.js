const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- REGISTRATION ROUTE ---
// Endpoint: POST /api/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, schoolCode, grade } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user instance (password will be hashed by the model)
        user = new User({ name, email, password, role, schoolCode, grade });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- LOGIN ROUTE ---
// Endpoint: POST /api/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare submitted password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and sign a JSON Web Token (JWT)
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            'YOUR_SECRET_JWT_KEY', // IMPORTANT: Use a secret key from an environment variable
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the token back to the frontend
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
