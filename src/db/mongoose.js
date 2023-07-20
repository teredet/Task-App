import mongoose from 'mongoose';


const connectionUrl = 'mongodb://127.0.0.1:27017/task-app';

export const connection = await mongoose.connect(connectionUrl);