
import React, { useState } from 'react';
import axios from '../utils/axiosClient';
import VerifyOtp from './VerifyOtp';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return alert('Please enter your email');
    try {
      const res = await axios.post('/user/request-otp', { email_id: email });
      console.log(res.data);
      if (res.data) {
        alert('OTP sent to your email');
        setOtpSent(true);
      } else {
        alert('Failed to send OTP');
      }
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {!otpSent
              ? "Enter your email to receive a verification code"
              : "Check your email for the OTP"}
          </p>
        </div>

        {!otpSent ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-900 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSendOtp}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Send OTP
              </button>
            </div>
          </div>
        ) : (
          <VerifyOtp email={email} />
        )}

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};


export default ForgotPassword;