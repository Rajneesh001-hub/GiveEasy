const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@giveeasy.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create admin user
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@giveeasy.com',
            password: 'adminpassword123', // You should change this later
            role: 'admin',
        });

        console.log(`Admin created successfully: ${admin.email}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
