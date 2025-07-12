const mongoose = require('mongoose');
const JsonDatabase = require('../models/JsonDatabase');

let database = null;
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mongodb';

const connectDB = async () => {
    try {
        if (DATABASE_TYPE === 'json') {
            // Use JSON file database for shared hosting
            database = new JsonDatabase();
            console.log('📁 JSON Database initialized successfully');
            return database;
        } else {
            // Use MongoDB for production
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/royal_earning_bot';
            
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            
            console.log('🍃 MongoDB connected successfully');
            return null; // Return null for MongoDB (use Mongoose models)
        }
    } catch (error) {
        console.error('Database connection error:', error);
        console.log('🔄 Falling back to JSON database...');
        
        // Fallback to JSON database if MongoDB fails
        database = new JsonDatabase();
        console.log('📁 JSON Database initialized as fallback');
        return database;
    }
};

const getDatabase = () => {
    return database;
};

const isJsonDatabase = () => {
    return database !== null;
};

module.exports = { connectDB, getDatabase, isJsonDatabase };

