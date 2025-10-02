const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection to a local mongodb database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to the database");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    port: process.env.PORT || 3000,
    connectDB
};