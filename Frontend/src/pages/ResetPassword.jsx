import React from 'react'
import axios from '../utils/axiosClient';
import { useState } from "react";


const ResetPassword = ({ email, otp }) => {
    const [password, setPassword] = useState('');

    const handleReset = async () => {
        if (!password) return alert('Enter a new password');
        try {
            const res = await axios.post('/user/reset-password', { email_id: email, otp, newPassword: password });
            if (res.data) {
                alert('Password reset successful! Please login with your new password.');
            } else {
                alert('Failed to reset password');
            }
        } catch (error) {
            alert('Error resetting password');
        }
    };

    return (
        <div>
            <p className="mb-2 text-center">Reset password for {email}</p>
            <input
                type="password"
                className="input input-bordered w-full "
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleReset} className="btn btn-primary w-full">
                Reset Password
            </button>
        </div>
    );
};


export default ResetPassword