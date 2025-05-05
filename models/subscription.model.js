import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
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
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR'],
        default: 'INR'
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
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        // validate: {
        //     validator: (value) => {
        //         if (!this.startDate || !value) return false;
        //         return value > this.startDate;
        //     },
        //     message: 'Renewal date must be after start date'
        // }
    },
    subLogo: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    }
}, { timestamps: true })

subscriptionSchema.pre('save', function (next) {
    //if renewal date is not provided
    if (!this.renewalDate) {
        const renewalPeriod = {
            daily: 1,
            weeklt: 7,
            monthly: 30,
            quarterly: 90,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency])
        //1st Jan, monthly, 30 days, renewal = 31st Jan
    }
    //autp update status if renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;