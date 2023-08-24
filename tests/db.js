import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { User } from '../src/db/models/user.js';


const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'examplepass',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET_KEY)
    }]
}

async function setupDb() {
    await User.deleteMany();
    await new User(userOne).save();
}

export { userOneId, userOne, setupDb }