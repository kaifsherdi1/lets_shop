import React, { useState, useEffect } from 'react';
import PageBanner from '../components/layout/PageBanner';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  const [form, setForm] = useState({ name: '', full_name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/profile');
      setProfile(res.data.user);
      setForm({
        name: res.data.user.name || '',
        full_name: res.data.user.full_name || '',
        phone: res.data.user.phone || '',
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosInstance.put('/profile', form);
      setProfile(res.data.user);
      // Update React context + localStorage so Navbar avatar/name updates immediately
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.post('/profile/change-password', pwForm);
      toast.success('Password changed! Other sessions have been logged out.');
      setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.new_password?.[0] || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const roleColors = {
    admin:       '#e74c3c',
    manager:     '#9b59b6',
    accountant:  '#2980b9',
    hr:          '#16a085',
    distributor: '#d35400',
    agent:       '#f39c12',
    customer:    '#76b0ab',
  };

  return (
    <>
      <PageBanner title="My Profile" crumbs={[{ label: 'Profile' }]} />

      <section className="ul-section-spacing">
        <div className="ul-container">
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', border: '4px solid var(--ul-c3)', borderTopColor: 'var(--ul-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: 'var(--ul-gray)' }}>Loading profile…</p>
              </div>
            ) : (
              <>
                {/* Profile Card Header */}
                <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden', marginBottom: '24px' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--ul-primary) 0%, #4a8c87 100%)', padding: '32px 32px 60px', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '32px', width: '80px', height: '80px', background: '#fff', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--ul-primary)', fontFamily: 'var(--font-quicksand)' }}>
                      {profile?.full_name?.[0]?.toUpperCase() || profile?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div style={{ padding: '52px 32px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h2 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 800, color: 'var(--ul-black)', margin: '0 0 4px' }}>
                          {profile?.full_name || profile?.name}
                        </h2>
                        <p style={{ color: 'var(--ul-gray)', margin: '0 0 12px', fontSize: '0.9rem' }}>{profile?.email}</p>
                        <span style={{ padding: '4px 14px', borderRadius: '999px', background: `${roleColors[profile?.role] || '#76b0ab'}22`, color: roleColors[profile?.role] || '#76b0ab', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {profile?.role}
                        </span>
                      </div>
                      <span style={{ padding: '6px 14px', borderRadius: '999px', background: profile?.status === 'active' ? '#e6ffed' : '#fff5f5', color: profile?.status === 'active' ? '#276749' : '#c53030', fontWeight: 700, fontSize: '0.82rem' }}>
                        {profile?.status === 'active' ? '✅ Active' : '⚠️ ' + profile?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0', background: '#fff', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '24px' }}>
                  {[{ id: 'profile', label: '👤 Edit Profile' }, { id: 'password', label: '🔒 Change Password' }].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{ flex: 1, padding: '16px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', background: activeTab === tab.id ? 'var(--ul-primary)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--ul-gray)', transition: 'all 0.2s' }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Edit Profile Form */}
                {activeTab === 'profile' && (
                  <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '32px' }}>
                    <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '24px' }}>Edit Profile Information</h3>
                    <form onSubmit={handleProfileSave}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>Username</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="username"
                            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--ul-c2)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                            onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--ul-c2)'}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>Full Name</label>
                          <input
                            type="text"
                            value={form.full_name}
                            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                            placeholder="Your full name"
                            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--ul-c2)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--ul-c2)'}
                          />
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>Email Address</label>
                        <input
                          type="email"
                          value={profile?.email || ''}
                          disabled
                          style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--ul-c2)', borderRadius: '10px', fontSize: '0.95rem', background: '#f8f9fa', color: 'var(--ul-gray)', boxSizing: 'border-box', cursor: 'not-allowed' }}
                        />
                        <p style={{ color: 'var(--ul-gray)', fontSize: '0.78rem', marginTop: '6px' }}>Email cannot be changed. Contact support if needed.</p>
                      </div>
                      <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>Phone Number</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--ul-c2)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                          onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--ul-c2)'}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="ul-btn"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}
                      >
                        {saving ? 'Saving…' : '💾 Save Profile'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Change Password Form */}
                {activeTab === 'password' && (
                  <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '32px' }}>
                    <h3 style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px' }}>Change Password</h3>
                    <p style={{ color: 'var(--ul-gray)', fontSize: '0.88rem', marginBottom: '24px' }}>For security, all other active sessions will be logged out after changing your password.</p>
                    <form onSubmit={handlePasswordChange}>
                      {[
                        { key: 'current_password', label: 'Current Password', placeholder: 'Enter current password' },
                        { key: 'new_password', label: 'New Password', placeholder: 'Minimum 8 characters' },
                        { key: 'new_password_confirmation', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                      ].map(field => (
                        <div key={field.key} style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', fontWeight: 700, color: 'var(--ul-black)', marginBottom: '8px', fontSize: '0.88rem' }}>{field.label}</label>
                          <input
                            type="password"
                            value={pwForm[field.key]}
                            onChange={e => setPwForm(f => ({ ...f, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            required
                            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--ul-c2)', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = 'var(--ul-primary)'}
                            onBlur={e => e.target.style.borderColor = 'var(--ul-c2)'}
                          />
                        </div>
                      ))}
                      <button
                        type="submit"
                        disabled={saving}
                        className="ul-btn"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: saving ? 0.7 : 1, background: '#e74c3c' }}
                      >
                        {saving ? 'Changing…' : '🔒 Change Password'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
