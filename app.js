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
import cors from 'cors'
// const port = 3000
const app = express();  

// app level middlewares and third party middlewares(installed to use)
app.use(express.json()); //to handle or to read request json data (from body)
app.use(express.urlencoded({extended: true})) //for formdata receiving
app.use(cors())
app.use(cookieParser()) //this takes access of cookie data(user data) coming from browser
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/payments', paymentRouter)
app.use(errorMiddleware);

app.listen(PORT, async() => {
  console.log(`server running on port ${PORT}`);
  await connectToDatabase() //connectToDatabase is async function
})

export default app;