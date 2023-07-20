import express from 'express';

import { userRouter } from './routers/user.js';
import { taskRouter } from './routers/task.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => console.log(`Server is up on port: ${PORT}`));

