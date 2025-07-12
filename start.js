#!/usr/bin/env node

// Startup script for cPanel/shared hosting environments
// This file helps with Node.js app deployment on shared hosting

const path = require('path');
const fs = require('fs');

// Set environment variables for production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.DATABASE_TYPE = process.env.DATABASE_TYPE || 'json';

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

// Start the main application
require('./app.js');

