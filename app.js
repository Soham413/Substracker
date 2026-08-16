import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import paymentRouter from './routes/payment.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import { arcjetMiddleware } from './middlewares/arcjet.middleware.js';
import cors from 'cors';

const app = express();

// 1. Enable trust proxy FIRST so Express correctly resolves client IP behind reverse proxies (Render, Cloudflare, Vercel)
app.set('trust proxy', true);

// 2. App-level middlewares
app.use(express.json()); // to handle JSON request bodies
app.use(express.urlencoded({ extended: true })); // for form data receiving
app.use(cors());
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/payments', paymentRouter);
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`server running on port ${PORT}`);
  await connectToDatabase();
});

export default app;
