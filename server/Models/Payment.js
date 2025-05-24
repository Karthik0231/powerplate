const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    mealPlanRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealPlan',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 500
    },
    referenceId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed','paid','rejected'],
        default: 'processing'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);