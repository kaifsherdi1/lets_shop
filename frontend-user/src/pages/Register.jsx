import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import toast from 'react-hot-toast';

const inputStyle = {
  width: '100%', padding: '13px 16px',
  border: '1.5px solid var(--ul-gray2)', borderRadius: '10px',
  fontSize: '0.95rem', fontFamily: 'var(--font-primary)',
  outline: 'none', transition: 'border-color 0.3s ease',
  boxSizing: 'border-box', background: 'var(--ul-gray3)',
};

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => { e.target.style.borderColor = 'var(--ul-primary)'; e.target.style.background = '#fff'; };
  const blurStyle = (e) => { e.target.style.borderColor = 'var(--ul-gray2)'; e.target.style.background = 'var(--ul-gray3)'; };

  return (
    <AuthLayout title="Create Account" subtitle="Join LetsShop and start shopping">
      {error && (
        <div style={{
          background: '#fff5f5', border: '1.5px solid #feb2b2', borderRadius: '10px',
          padding: '12px 16px', color: '#c53030', fontSize: '0.88rem', fontWeight: 600,
          marginBottom: '20px',
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '7px', fontSize: '0.88rem' }}>Full Name</label>
          <input
            type="text" name="full_name" value={formData.full_name}
            onChange={handleChange} required placeholder="John Doe"
            style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Email + Phone */}
        <div className="row row-cols-sm-2 row-cols-1 ul-bs-row">
          <div className="col">
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '7px', fontSize: '0.88rem' }}>Email</label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="you@example.com"
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
          <div className="col">
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '7px', fontSize: '0.88rem' }}>Phone <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
            <input
              type="tel" name="phone" value={formData.phone}
              onChange={handleChange} placeholder="+91..."
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '7px', fontSize: '0.88rem' }}>Register as</label>
          <select
            name="role" value={formData.role} onChange={handleChange} required
            style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
            onFocus={focusStyle} onBlur={blurStyle}
          >
            <option value="customer">Customer</option>
            <option value="distributor">Distributor</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Passwords */}
        <div className="row row-cols-sm-2 row-cols-1 ul-bs-row">
          <div className="col">
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '7px', fontSize: '0.88rem' }}>Password</label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} required placeholder="••••••••"
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
          <div className="col">
            <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '7px', fontSize: '0.88rem' }}>Confirm</label>
            <input
              type="password" name="password_confirmation" value={formData.password_confirmation}
              onChange={handleChange} required placeholder="••••••••"
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="ul-btn"
          style={{ width: '100%', height: '52px', fontSize: '1rem', justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Creating Account...' : 'Create Account →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--ul-gray)', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--ul-primary)', fontWeight: 700 }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
