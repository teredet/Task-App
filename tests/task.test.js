import request from 'supertest';

import app from './app.js';
import { Task } from '../src/db/models/task.js';
import { userOne, setupDb, taskOne, taskThree } from './db.js';


beforeEach(setupDb)

test('Should create task for user', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull()
})

test('Should return all tasks for user one', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toBe(2)
})

test("Should delete user's task", async () => {
    await request(app).delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const task = await Task.findById(taskOne._id);
    expect(task).toBeNull();
})

test("Should not delete someone else task", async () => {
    await request(app).delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(taskThree._id);
    expect(task).not.toBeNull();
}) 
