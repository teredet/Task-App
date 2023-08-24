import express from 'express';

import { userRouter } from '../src/routers/user.js';
import { taskRouter } from '../src/routers/task.js';


const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

export default app;