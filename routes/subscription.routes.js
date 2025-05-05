
import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { cancelSubscription, createSubscription, deleteSubscription, getUserSubscriptionRenewalDetails, getUserSubscriptions, updateSubscription } from '../controllers/subscription.controller.js';
import upload from '../middlewares/multer.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ message: 'Get all subscriptions' }));
subscriptionRouter.get('/:id',(req, res) => res.send({ message: 'Get subscription details' }));
subscriptionRouter.post('/', authorize, upload.single('subLogo'), createSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.put('/cancel/:id', authorize, cancelSubscription);
subscriptionRouter.get('/upcoming-renewals', authorize, getUserSubscriptionRenewalDetails); 

export default subscriptionRouter;