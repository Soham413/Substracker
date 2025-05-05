import mongoose from "mongoose";

//structure of the data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 6,
        maxLength: 255,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6,
    }
}, {timestamps: true}) //this is used to add created at, updated at automatically

const User = mongoose.model('User', userSchema)

export default User;