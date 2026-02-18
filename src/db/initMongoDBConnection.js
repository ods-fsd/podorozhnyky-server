import mongoose from 'mongoose';

export const initMongoDBConnection = async () => {
    try {
        const {
            MONGODB_USER,
            MONGODB_PASSWORD,
            MONGODB_URL,
            MONGODB_DB
        } = process.env;

        const connectionString = `${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

        await mongoose.connect(connectionString);
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};