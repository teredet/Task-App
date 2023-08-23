import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { userRouter } from '../src/routers/user.js';
import { taskRouter } from '../src/routers/task.js';
import { User } from '../src/db/models/user.js';


const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

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

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
})


test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'Artem',
            email: 'artem@test.test',
            password: 'testpass'
        })
        .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user.id);
    expect(user).not.toBeNull();
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);

    // Validate new token
    const user = await User.findById(response.body.user.id);
    expect(user.tokens[0].token).toBe(user.tokens[1].token);
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: "wrongpass"
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    // Assert that the database was changed correctly
    console.log(response.body)
    const user = await User.findById(response.body.id);
    expect(user).toBeNull();
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})