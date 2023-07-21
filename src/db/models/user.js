import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import { connection } from '../mongoose.js';
import {JWT_SECRET_KEY} from '../../settings.js';

const userSchema = connection.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain 'password'")                
            }
        }
    },  
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            } 
        }
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, JWT_SECRET_KEY);

    user.tokens = user.tokens.concat({ token });
    await user.save()

    return token;
};

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if (!user) throw new Error("Unable to login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Unable to login");

    return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});

export const User = connection.model('User', userSchema);