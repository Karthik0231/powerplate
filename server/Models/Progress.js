const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    mealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NutritionistMealPlan',
        required: true
    },
    nutritionist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutritionist',
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    measurements: {
        waist: Number,
        chest: Number,
        arms: Number,
        thighs: Number
    },
    photos: [{
        type: String
    }],
    notes: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);