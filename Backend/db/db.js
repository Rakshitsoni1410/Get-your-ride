const mongoose = require('mongoose');

function connectDb() {
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('✅ MongoDB connected');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });
}

module.exports = connectDb;
