import Payments from '../models/payment.model.js';
import Subscription from '../models/subscription.model.js';

export const addPayment = async (req, res) => {
    try {
        const { paidAt, userId, renewalDate } = req.body;
        // console.log('from add paymment', startDate, userId, renewalDate);
        const subscription = await Subscription.findById(req.params.id);
        // console.log('subscription', subscription);

        if (!subscription) return res.status(404).json({ success: false, message: 'Subscription not found' });
        const { name, price, subLogo, frequency, category } = subscription
        // const renewDate = new Date(startDate);
        // const renewalPeriod = {
        //     daily: 1,
        //     weekly: 7,
        //     monthly: 30,
        //     quarterly: 90,
        //     yearly: 365,
        // };
        // renewDate.setDate(renewDate.getDate() + renewalPeriod[frequency])
        const payment = await Payments.create({
            userId,
            subscriptionId: req.params.id,
            name,
            price,
            paidAt,
            frequency,
            category,
            renewalDate,
            subLogo,
        });

        res.status(201).json({ success: true, data: payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getPayments = async (req, res) => {
    try {
        const userId = req.user._id;
        // console.log('userId', userId);
        
        const payments = await Payments.find({ userId: req.user._id })
            .sort({ paidAt: -1 });
        if (!payments) return res.status(404).json({ success: false, message: 'Payment history not found' });
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
