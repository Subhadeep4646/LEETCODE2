const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema=new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId:{
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code:{
        type: String,
        required: true,
    },
    language:{
        type: String,
        required: true,
        enum: ['javascript', 'python', 'java', 'cpp', 'c', 'ruby', 'go', 'php'],
    },
    status:{
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error'],
        default: 'pending'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    runtime:{
        type: Number,
        default: 0
    },
    memory:{
        type: Number,
        default: 0
    },
    errorMessage:{
        type: String,
        default: ''
    },
    testCasesPassed:{
        type: Number,
        default: 0
    },
    totalTestCases:{
        type: Number,
        default: 0
    }
});

submissionSchema.index({ userId: 1, problemId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
