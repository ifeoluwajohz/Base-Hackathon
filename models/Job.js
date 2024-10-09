const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true

    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    location: {
        type: String
    },
    stillAvailable: {
        type: Boolean,
        default: true // Default to true when a job is created
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model('job', jobSchema);
module.exports = Job;
