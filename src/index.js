import express from 'express';

import { userRouter } from './routers/user.js';
import { taskRouter } from './routers/task.js';
import { MAINTENANCE_MODE, PORT } from './settings.js';

const app = express();

// global express moddleware
app.use((_req, res, next) => {
    if (MAINTENANCE_MODE) {
        res.status(503).send('Site is currently down. Check back soon.')
    } else next();
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(PORT, () => console.log(`Server is up on port: ${PORT}`));


import { User } from './db/models/user.js';

(async function test() {
    const user = await User.findById('64bd46da0c56ef2ffd688478').populate('tasks');
    console.log(user.tasks)
})()