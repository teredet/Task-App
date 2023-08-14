import mongoose from 'mongoose';

export const connection = await mongoose.connect(process.env.MONGODB_CONNECTION_URL);