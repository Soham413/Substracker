//controllers are used as handler function in the routes, after the endpoint of the routes

import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRY, JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next) => {
    console.log('body',req.body);
    
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //create new user
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create([
            { name, email, password: hashedPassword }], { session });
        const token = jwt.sign({ userId: user[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY })

        session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { token, user: user[0] }
        })
    }
    catch (error) {
        await session.abortTransaction();
        next(error);
    }
    finally{
        session.endSession();
    }
}

export const signIn = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if(!isValidPassword){
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
        res.status(201).json({
            success: true,
            message: 'User signed in successfully',
            data: { token, user: existingUser }
        })
    } catch (error) {
        
    }
}

export const signOut = (req, res, next) => {
    //sign out logic here
}