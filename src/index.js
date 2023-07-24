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
