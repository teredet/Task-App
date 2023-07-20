import { connection } from '../mongoose.js';


const taskSchema = connection.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

export const Task = connection.model('Task', taskSchema);