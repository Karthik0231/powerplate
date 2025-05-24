const mongoose = require('mongoose');

const consultancyRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    nutritionist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutritionist',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    responseMessage: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ConsultancyRequest', consultancyRequestSchema);