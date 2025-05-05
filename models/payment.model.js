import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    subscriptionId: {
        type: String,
        required: [true, 'SubscriptionId is required']
    },
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        minLength: [0, 'Price must be greater than 0'],
    },
    paidAt: {
        type: Date,
        required: [true, 'Date of payment is required']
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'education', 'other'],
        required: true
    },
    renewalDate: {
        type: Date,
        required: true,
    },
    subLogo: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const Payments = mongoose.model('Payments', paymentSchema);

export default Payments;    