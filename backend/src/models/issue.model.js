import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    issueId: {
        type: Number,
        required: true,
        unique: true,
    },
    number: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: false,
    },
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;