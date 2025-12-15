const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a campaign title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    ngo: {
        type: String,
        required: [true, 'Please provide NGO name'],
        trim: true,
    },
    upiId: {
        type: String,
        required: [true, 'Please provide a UPI ID (e.g. user@upi)'],
        trim: true,
        match: [/^[\w.-]+@[\w.-]+$/, 'Please provide a valid UPI ID'],
    },
    goalAmount: {
        type: Number,
        required: [true, 'Please provide a goal amount'],
        min: 0,
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=Campaign+Image',
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['education', 'healthcare', 'environment', 'poverty', 'disaster-relief', 'other'],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Virtual for progress percentage
campaignSchema.virtual('progressPercentage').get(function () {
    return this.goalAmount > 0 ? Math.round((this.currentAmount / this.goalAmount) * 100) : 0;
});

// Ensure virtuals are included in JSON
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
