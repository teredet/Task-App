import express from 'express';

import { Task } from '../db/models/task.js';
import { User } from '../db/models/user.js';
import { auth } from '../middleware/auth.js';


const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        const saveRes = await task.save();
        res.status(201).send(saveRes);
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(400).send({ "Error": e.message });
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        const allTasks = await Task.find({ 
            owner: req.user._id 
        });

        // or 
        const userTasks = (await req.user.populate('tasks')).tasks;
        console.log(userTasks);

        res.send(allTasks);
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            owner: req.user._id 
        })
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({ error: "Invalid updates!" })
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!task) return res.status(404).send();
        updates.forEach((update) => task[update] = req.body[update]);
        const updRes = await task.save();
        res.send(updRes);
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!deletedTask) return res.status(404).send();
        res.send(deletedTask);
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
})

export { router as taskRouter };