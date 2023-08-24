import request from 'supertest';

import app from './app.js';
import { User } from '../src/db/models/user.js';
import { userOneId, userOne, setupDb } from './db.js';


beforeEach(setupDb) 

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

test('Should update valid user field', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Anna'
        })
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toBe('Anna');
})

test('Should not update invalid user field', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'London'
        })
        .expect(400)
})

test('Should delete account for user', async () => {
    const response = await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    // Assert that the database was changed correctly
    const user = await User.findById(response.body.id);
    expect(user).toBeNull();
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
})

