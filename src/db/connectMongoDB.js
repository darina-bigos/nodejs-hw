import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL is not set in environment variables');
    }

    await mongoose.connect(mongoUrl);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};
