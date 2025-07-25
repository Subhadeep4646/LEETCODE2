const crypto = require("crypto");
const User= require('../models/user');
const sendEmail = require("../utils/sendEmail"); // your mail sending util
const bcrypt = require('bcrypt');



const RequestOtp = async (req, res) => {
    try {
        const { email_id } = req.body;

        const user = await User.findOne({ email_id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now

        await user.save();

        // Send OTP via email
        await sendEmail({
            to: user.email_id,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        });

        return res.status(200).json({ message: 'OTP sent to email' });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error });
    }
};
const VerifyOtp = async (req, res) => {
    try {
        const { email_id, otp } = req.body;

        const user = await User.findOne({ email_id });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        return res.status(200).json({ message: 'OTP verified successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error });
    }
};
const ResetPassword = async (req, res) => {
    try {
        const { email_id, otp, newPassword } = req.body;

        if(newPassword.length<6){
            return res.status(400).json({ message: 'password weak amd must be greater than 5' });
        }

        const user = await User.findOne({ email_id });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error });
    }
}

module.exports={RequestOtp,VerifyOtp,ResetPassword};