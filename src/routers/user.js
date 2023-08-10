import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';

import { User } from '../db/models/user.js';
import { auth } from '../middleware/auth.js';


const router = new Router();

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
        const deletedUser = await req.user.deleteOne();
        res.send(deletedUser.getPublicProfile());
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/^.*\.(png|jpg|jpeg)$/)) {
            return cb(new Error('File must be a .png, .jpg or .jpeg'));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer)
                                .resize({ width: 250, height: 250 })
                                .png()
                                .toBuffer();

        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error();

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        console.log("Error: " + e.message);
        res.status(500).send({ "Error": e.message });
    }
})

export { router as userRouter };