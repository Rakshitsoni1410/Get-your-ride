const mongoose = require('mongoose');

// Function to connect to MongoDB
function connectDb() {
    mongoose.connect(process.env.DB_CONNECT
        )
    .then(() => {
        console.log(' MongoDB connected');
    })
    .catch(err => console.log(err));
    
}

module.exports = connectDb;
