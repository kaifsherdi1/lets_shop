import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import api from '../utils/api';
import toast from 'react-hot-toast';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const code = otp.join('');

    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        code,
        type: 'registration'
      });

      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const response = await api.post('/auth/resend-otp', {
        email,
        type: 'registration'
      });
      toast.success(response.data.message);
      setTimer(60);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <AuthLayout title="Verify Your Email" subtitle={`We've sent a 6-digit code to ${email}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white transition-all"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {timer > 0 ? (
                `Resend code in ${timer}s`
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default OtpVerification;
