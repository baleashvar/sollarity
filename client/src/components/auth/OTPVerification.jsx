import React, { useState } from 'react';

const OTPVerification = ({ email, onVerify, onResend }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onVerify(otp);
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest"
            maxLength={6}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={onResend}
          className="text-blue-600 hover:underline text-sm"
        >
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;