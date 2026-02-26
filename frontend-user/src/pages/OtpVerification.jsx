import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authAPI } from '../api/auth';
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
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const code = otp.join('');
    try {
      await authAPI.verifyOtp({ email, code, type: 'registration' });
      toast.success('Email verified successfully!');
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
      await authAPI.resendOtp({ email, type: 'registration' });
      toast.success('New OTP sent to your email');
      setTimer(60);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const otpFilled = otp.join('').length === 6;

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center' }}>
        {/* OTP Boxes */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onFocus={e => e.target.select()}
              style={{
                width: '48px', height: '56px', textAlign: 'center',
                fontSize: '1.4rem', fontWeight: 800,
                border: `2px solid ${data ? 'var(--ul-primary)' : 'var(--ul-gray2)'}`,
                borderRadius: '12px', outline: 'none',
                background: data ? 'var(--ul-c4)' : '#fff',
                color: 'var(--ul-black)',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-primary)',
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <div style={{ textAlign: 'center' }}>
          {timer > 0 ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--ul-c4)', padding: '8px 20px', borderRadius: '999px',
              color: 'var(--ul-gray)', fontSize: '0.88rem', fontWeight: 600,
            }}>
              ⏳ Resend code in <strong style={{ color: 'var(--ul-primary)' }}>{timer}s</strong>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              style={{
                background: 'none', cursor: 'pointer',
                color: 'var(--ul-primary)', fontWeight: 700, fontSize: '0.9rem',
                padding: '8px 16px', borderRadius: '999px',
                border: '1.5px solid var(--ul-primary)',
              }}
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !otpFilled}
          className="ul-btn"
          style={{
            width: '100%', height: '52px', fontSize: '1rem', justifyContent: 'center',
            opacity: (isLoading || !otpFilled) ? 0.6 : 1,
            cursor: (isLoading || !otpFilled) ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify Email →'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default OtpVerification;
