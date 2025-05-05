import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        console.log('body', req.body);
        console.log('path', req.file);
        console.log('id', req.user._id);
        const existing = await Subscription.findOne({ user: req.user._id, name: req.body.name });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Subscription already exists' });
        }

        const subscriptionLogoURL = req.file?.path;
        const subscription = await Subscription.create({ ...req.body, user: req.user._id, subLogo: subscriptionLogoURL })

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // console.log("Route - req.user._id:", req.user?._id);
        // console.log("Route - req.user._id:", req.user?.id);
        if (req.params.id !== req.user.id) {
            const error = new Error('You are not the owner of this account')
            error.status = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id })
        res.status(200).json({ success: true, data: subscriptions })
    } catch (error) {
        next(error)
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const updates = { ...req.body }
        if (updates.startDate && !updates.renewalDate) {
            const renewDate = new Date(updates.startDate);

            // You need to fetch the frequency if not passed in body
            const sub = await Subscription.findById(req.params.id);
            const frequency = updates.frequency || sub?.frequency;
            const renewalPeriod = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                quarterly: 90,
                yearly: 365,
            };
            renewDate.setDate(renewDate.getDate() + renewalPeriod[frequency])
            updates.renewalDate = renewDate;
        } 
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true } // Return the updated document and validate
        );
        if (!updatedSubscription) {
            const error = new Error("Subscription not found")
            // error.message = "No subscription found";  //directly pass or give the message this way
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: updatedSubscription })
    } catch (error) {
        next(error)
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }
        const publicId = subscription.subLogo; // Assuming you're storing it like this
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
        const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id)

        res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
    } catch (error) {
        next(error)
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error("Subscription not found")
            error.status = 404;
            throw error;
        }
        subscription.status = "cancelled";
        await subscription.save();
        res.status(200).json({ success: true, message: "Subscription cancelled succesfully", data: subscription })
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptionRenewalDetails = async (req, res, next) => {
    try {
        const userSubscriptions = await Subscription.find({ user: req.user._id })
        if (!userSubscriptions.length) {
            return res.status(404).json({
                success: false,
                message: "No subscriptions found",
            });
        }
        const renewalDetails = userSubscriptions.map(sub => {
            if (!sub.expiryDate) {
                return {
                    subscriptionId: sub._id,
                    name: sub.name,
                    expiryDate: null,
                    daysLeft: null,
                    isExpired: null,
                    message: 'No Expiry Date set'
                }
            }
            const today = dayjs();
            const expiryDate = dayjs(sub.expiryDate);
            const daysLeft = expiryDate.diff(today, "day");

            return {
                subscriptionId: sub._id,
                name: sub.name,
                expiryDate: sub.expiryDate,
                price: sub.price,
                daysLeft: daysLeft > 0 ? daysLeft : 0,
                isExpired: daysLeft <= 0,
            };
        })
        res.status(200).json({
            success: true,
            message: "Subscription renewal details retrieved successfully",
            data: renewalDetails,
        });
    } catch (error) {
        next(error);
    }
}