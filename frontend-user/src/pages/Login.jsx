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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your LetsShop account">
      {error && (
        <div style={{
          background: '#fff5f5', border: '1.5px solid #feb2b2', borderRadius: '10px',
          padding: '12px 16px', color: '#c53030', fontSize: '0.88rem', fontWeight: 600,
          marginBottom: '20px',
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--ul-gray2)'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--ul-gray2)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="ul-btn"
          style={{
            width: '100%', height: '52px', fontSize: '1rem',
            justifyContent: 'center', marginTop: '4px',
            opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing In...' : 'Sign In →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--ul-gray)', fontSize: '0.9rem' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--ul-primary)', fontWeight: 700 }}>
          Create one free
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
