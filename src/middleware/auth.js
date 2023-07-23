import jwt from 'jsonwebtoken';

import { User } from '../db/models/user.js';
import { JWT_SECRET_KEY } from '../settings.js';


export async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error();

        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}