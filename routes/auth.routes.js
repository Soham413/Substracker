import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

// authRouter.post('/sign-up', (req, res) => res.send({ message: 'Sign up' }));
// authRouter.post('/sign-in', (req, res) => res.send({ message: 'Sign in' }))
// authRouter.post('/sign-out', (req, res) => res.send({ message: 'Sign out' }))

//using auth controllers
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', signOut)

export default authRouter;