import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { User } from '../src/db/models/user.js';
import { Task } from '../src/db/models/task.js';


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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Artem',
    email: 'artem@example.com',
    password: 'newExamplePass',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Thord task',
    completed: true,
    owner: userTwoId
}


async function setupDb() {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();

    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

export { userOne, userTwo, setupDb, taskOne, taskThree }