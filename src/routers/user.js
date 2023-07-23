import express from 'express';

import { User } from '../db/models/user.js';
import { auth } from '../middleware/auth.js';


const router = new express.Router();

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        const saveRes = await user.save();
        res.status(201).send({ user: saveRes.getPublicProfile(), token });
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(400).send({ "Error": e.message });
    }
});

router.get('/users', async (_req, res) => {
    try {
        const allUsers = await User.find({});
        res.send(allUsers);
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user: user.getPublicProfile(), token });
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(400).send({ "Error": e.message });
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send({ "Error": e.message });
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send({ "Error": e.message });
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user.getPublicProfile());
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({ error: "Invalid updates!" })
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        const updRes = await req.user.save();
        res.send(updRes.getPublicProfile());
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        res.send(deletedUser.getPublicProfile());
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

export { router as userRouter };