import express from 'express';

import { Task } from '../db/models/task.js';


const router = new express.Router();

router.post("/tasks", async (req, res) => {
    try {
        const user = new Task(req.body);
        const saveRes = await user.save();
        res.status(201).send(saveRes);   
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(400).send({"Error": e.message});
    }
});

router.get('/tasks', async (_req, res) => {
    try {
        const allTasks = await Task.find({});  
        res.send(allTasks); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const resTask = await Task.findById(req.params.id);  
        if (!resTask) return res.status(404).send();
        res.send(resTask); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({error: "Invalid updates!"})
    try {
        const updTask = await Task.findById(req.params.id); 
        updates.forEach((update) => updTask[update] = req.body[update]);
        const updRes = await updTask.save();
        // const updTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});  
        if (!updTask) return res.status(404).send();
        res.send(updTask); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await User.findByIdAndDelete(req.params.id);  
        if (!deletedTask) return res.status(404).send();
        res.send(deletedTask); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
})

export {router as taskRouter};