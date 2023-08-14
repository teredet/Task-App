import express from 'express';

import { userRouter } from './routers/user.js';
import { taskRouter } from './routers/task.js';

const app = express();

// global express moddleware
app.use((_req, res, next) => {
    if (process.env.MAINTENANCE_MODE === 'true') {
        res.status(503).send('Site is currently down. Check back soon.')
    } else next();
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(process.env.PORT, () => console.log(`Server is up on port: ${process.env.PORT}`));
