'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Phone, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'role'
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['5', '4', '8', '2']);
  const [selectedRole, setSelectedRole] = useState('farmer');

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setStep('role');
  };

  const handleCompleteLogin = (roleToUse) => {
    const role = roleToUse || selectedRole;
    login(role);
    router.push(`/${role}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
        top: '20%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none'
      }} />

      <motion.div
        className="glass-card"
        style={{ maxWidth: 460, width: '100%', padding: 'var(--space-8)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #16a34a, #052e16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Leaf size={24} color="#4ade80" />
          </div>
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>
            Farm<span style={{ color: 'var(--green-400)' }}>Direct</span>
          </span>
        </div>

        {step === 'phone' && (
          <form onSubmit={handleSendOTP}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
              Direct Farm Marketplace
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              Enter your mobile number to get started with instant OTP
            </p>

            <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="input-label">Mobile Number</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  +91
                </span>
                <input
                  type="tel"
                  className="input-field"
                  style={{ flex: 1 }}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Send OTP Code <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
              Verify OTP Code
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              Sent 4-digit code to +91 {phone}
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx] || ''}
                  onChange={e => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="input-field"
                  style={{ width: 56, height: 56, textAlign: 'center', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--green-400)' }}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 12 }}>
              Verify &amp; Continue <CheckCircle2 size={18} />
            </button>

            <button type="button" className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={() => setStep('phone')}>
              Change Phone Number
            </button>
          </form>
        )}

        {step === 'role' && (
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
              Select Portal Demo
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              Choose which perspective you want to experience
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div
                className="glass-card"
                onClick={() => handleCompleteLogin('farmer')}
                style={{ cursor: 'pointer', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderColor: 'var(--border-primary)' }}
              >
                <div style={{ fontSize: '2rem' }}>🌾</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Farmer Portal</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Ramesh Patel • Nashik Grapes &amp; Vegetables</div>
                </div>
                <ArrowRight size={18} color="var(--green-400)" />
              </div>

              <div
                className="glass-card"
                onClick={() => handleCompleteLogin('buyer')}
                style={{ cursor: 'pointer', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
              >
                <div style={{ fontSize: '2rem' }}>🛒</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Buyer Portal</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Metro Fresh Retail • Institutional Procurement</div>
                </div>
                <ArrowRight size={18} color="var(--green-400)" />
              </div>

              <div
                className="glass-card"
                onClick={() => handleCompleteLogin('admin')}
                style={{ cursor: 'pointer', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
              >
                <div style={{ fontSize: '2rem' }}>⚙️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Admin Dashboard</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Vikram Desai • Ops, KYC &amp; Disputes</div>
                </div>
                <ArrowRight size={18} color="var(--green-400)" />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
