import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './backend/src/models/User'; // Adjust path if necessary
import Sweet from './backend/src/models/Sweet'; // Adjust path if necessary
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Sweet.deleteMany({});
        console.log('Cleared existing Users and Sweets.');

        // 1. Create Admin User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });
        await adminUser.save();
        console.log('Admin user created: admin@example.com / password123');

        // 2. Create Sweets (based on image filenames)
        const sweets = [
            {
                name: 'Dry Fruit Laddu',
                description: 'Rich and nutritious laddu packed with premium dry fruits.',
                price: 15,
                category: 'Dry Fruit Sweets',
                stock: 50,
                image: '/sweets/Dry fruit Laddu.jpg',
                quantity: 50
            },
            {
                name: 'Gulab Jamun',
                description: 'Classic soft and spongy milk-solid balls soaked in rose scented sugar syrup.',
                price: 10,
                category: 'Syrup Sweets',
                stock: 100,
                image: '/sweets/Gulab jamun.jpg',
                quantity: 100
            },
            {
                name: 'Rasgulla',
                description: 'Soft and spongy cheese balls soaked in sugar syrup.',
                price: 10,
                category: 'Bengali Sweets',
                stock: 100,
                image: '/sweets/Rasgulla.jpg',
                quantity: 100
            },
            {
                name: 'Rasmalai',
                description: 'Creamy and milky dessert with soft paneer balls.',
                price: 12,
                category: 'Milk Sweets',
                stock: 80,
                image: '/sweets/Rasmalai.jpg',
                quantity: 80
            },
            {
                name: 'Chum Chum',
                description: 'Traditional Bengali sweet, oval shaped and garnished with coconut.',
                price: 11,
                category: 'Bengali Sweets',
                stock: 75,
                image: '/sweets/chum chum.jpg',
                quantity: 75
            },
            {
                name: 'Habshi Halwa',
                description: 'Dark, rich and chewy halwa made from milk and sprouted wheat.',
                price: 18,
                category: 'Halwa',
                stock: 40,
                image: '/sweets/habshi halwa.jpg',
                quantity: 40
            },
            {
                name: 'Jalebi',
                description: 'Crispy, orange coiled sweets soaked in sugar syrup.',
                price: 8,
                category: 'Traditional',
                stock: 150,
                image: '/sweets/jalebi.jpg',
                quantity: 150
            },
            {
                name: 'Kaju Katli',
                description: 'Diamond shaped sweet made with cashew nuts and sugar.',
                price: 20,
                category: 'Dry Fruit Sweets',
                stock: 60,
                image: '/sweets/kaju katli.jpg',
                quantity: 60
            },
            {
                name: 'Kalakand',
                description: 'Delicious milk cake with a granular texture.',
                price: 14,
                category: 'Milk Sweets',
                stock: 55,
                image: '/sweets/khalakan.jpg',
                quantity: 55
            },
            {
                name: 'Mysore Pak',
                description: 'Rich sweet made of ghee, sugar, and gram flour.',
                price: 13,
                category: 'Ghee Sweets',
                stock: 70,
                image: '/sweets/mysore pak.jpg',
                quantity: 70
            },
            {
                name: 'Sweet Laddu',
                description: 'Traditional round sweet balls.',
                price: 9,
                category: 'Traditional',
                stock: 120,
                image: '/sweets/sweet Laddu.jpg',
                quantity: 120
            },
        ];

        await Sweet.insertMany(sweets);
        console.log(`Seeded ${sweets.length} sweets.`);

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
