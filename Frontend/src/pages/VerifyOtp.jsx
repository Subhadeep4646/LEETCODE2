import { useState } from "react";
import ResetPassword from "./ResetPassword";
import axios from '../utils/axiosClient';

const VerifyOtp = ({ email }) => {
    const [otp, setOtp] = useState('');
    const [verified, setVerified] = useState(false);

    const handleVerifyOtp = async () => {
        if (!otp) return alert('Enter the OTP');
        try {
            const res = await axios.post('/user/verify-otp', { email_id: email, otp });
            console.log(res);
            if (res.data) {
                alert('OTP Verified! You can now reset your password.');
                setVerified(true);
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            alert('Error verifying OTP');
        }
    };

    if (verified) {
        return <ResetPassword email={email} otp={otp} />;
    }

    return (
        <div>
            <p className="mb-4 text-center text-amber-900">Enter OTP sent to {email}</p>
            <input
                type="text"
                className="input input-bordered w-full mb-4"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} className="btn btn-success w-full">
                Verify OTP
            </button>
        </div>
    );
};

export default VerifyOtp;