import mongoose from 'mongoose';

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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    toJSON: {virtuals: true}
});

export const Task = connection.model('Task', taskSchema);