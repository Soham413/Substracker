import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { addPayment, getPayments } from '../controllers/payment.controller.js';

const paymentRouter = Router()


paymentRouter.get('/', authorize, getPayments)
paymentRouter.post('/:id', authorize, addPayment)

export default paymentRouter