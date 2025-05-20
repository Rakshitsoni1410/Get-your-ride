// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.use(cors());
// app.use(express.json()); // Recommended to parse JSON requests
app.use(express.json()); // Increase the limit to 50mb
// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
// Export the app
module.exports = app;
