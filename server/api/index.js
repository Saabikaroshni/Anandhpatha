const express = require('express');
const connectDB = require('../config/db');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); // Correct path to .env

const app = express();

// Connect to Database
connectDB();

// Init Middleware to parse JSON bodies
app.use(express.json({ extended: false }));

// A simple test route to confirm the API is working
app.get('/api/test', (req, res) => res.send('API is running successfully!'));

// Define Authentication Routes
app.use('/api', require('../routes/auth'));
// Add other routes here in the future, e.g.:
// app.use('/api/teacher', require('../routes/teacher'));

// --- This part is for LOCAL TESTING ONLY ---
// It allows your server to run on your computer. Vercel will ignore this.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
