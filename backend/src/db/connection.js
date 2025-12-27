import mongoose from 'mongoose';

export const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${mongoURI}.`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};