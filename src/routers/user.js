import express from 'express';

import { User } from '../db/models/user.js';
import { auth } from '../db/middleware/auth.js';


const router = new express.Router();

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        const saveRes = await user.save();   
        res.status(201).send({saveRes, token});   
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(400).send({"Error": e.message});
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e){
        console.log("Error: " + e.message);
        res.status(400).send({"Error": e.message});
    }
})

router.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find({}); 
        res.send(allUsers); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const resUser = await User.findById(req.params.id);  
        if (!resUser) return res.status(404).send();
        res.send(resUser); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({error: "Invalid updates!"})
    try {
        const updUser = await User.findById(req.params.id); 
        updates.forEach((update) => updUser[update] = req.body[update]);
        const updRes = await updUser.save();  
        if (!updRes) return res.status(404).send();
        res.send(updRes); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);  
        if (!deletedUser) return res.status(404).send();
        res.send(deletedUser); 
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({"Error": e.message});
    }
});

export {router as userRouter};