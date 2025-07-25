const express = require('express');

const otpRouter = express.Router();
const {RequestOtp,VerifyOtp,ResetPassword} =require('../controllers/OtpControllers')

otpRouter.post('/request-otp',RequestOtp );
otpRouter.post('/verify-otp',VerifyOtp);
otpRouter.post('/reset-password',ResetPassword);

module.exports = otpRouter;