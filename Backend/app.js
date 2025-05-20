// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDb = require('./db/db');

const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.use(cors());
app.use(express.json()); // Recommended to parse JSON requests

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Export the app
module.exports = app;
