const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    tags: [{
        type: String,
        enum: [
          'array', 'string', 'linked list', 'tree', 'graph',
          'dynamic programming', 'greedy', 'backtracking',
          'sorting', 'searching',            // existing
          'hash table'                       // ← add this
        ],
        required: true
      }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    VisibleTestCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            required: true
        }
    }],
    HiddenTestCases: [{
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        }
    }],
    startCode: [
        {
            language:{
                type: String,
                enum: ['c', 'cpp', 'java', 'python', 'javascript'],
                required: true
            },
            initialCode: {
                type: String,
                required: true
            }   
        }
    ],
    ProblemCreator:{
        type:Schema.Types.ObjectId,
        required: true,
    },
    referenceSolutions: [{  
        language: {
            type: String,
            enum: ['c', 'cpp', 'java', 'python', 'javascript'],
            required: true
        },
        completeCode: {
            type: String,
            required: true
        },
    }],

});

const Problem = mongoose.model('Problem', problemSchema);

//"Problem" naam ka ek model class ban gaya.
//Yeh model MongoDB ke Problem collection se link ho gaya (Mongoose plural banata hai).
//Ab tum Problem ka use karke database me read/write kar sakte ho.


module.exports =Problem;