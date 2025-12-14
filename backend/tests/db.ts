import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
    // mongo = await MongoMemoryServer.create();
    // const uri = mongo.getUri();
    // Use local test database to avoid downloading binary
    const uri = 'mongodb://localhost:27017/sweetshop_test';
    await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
    if (mongoose.connection) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongo) {
        await mongo.stop();
    }
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};
