const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {Schema} = mongoose;

const userSchema = new Schema({
    firstname:{
        type: String,
        required: true,
        trim: true,
        minLength:3,
        maxlength: 50
    },
    lastname:{
        type: String,
        trim: true,
        minLength:3,
        maxlength: 50
    },
    email_id:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/,
        immutable: true
    },
    age:{
        type: Number,
        min: 14,
        max: 80
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved:{
        type: Array,
        default: [],
        ref: 'Problem'
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
});

userSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        // Delete all submissions related to this user
        await mongoose.model('Submission').deleteMany({ userId: doc._id });
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;








