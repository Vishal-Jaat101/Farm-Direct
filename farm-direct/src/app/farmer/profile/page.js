'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Star, Shield, MapPin, Calendar, Wheat, Award, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FarmerProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="stagger-children">
      {/* Profile Card */}
      <motion.div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-4)' }}>
          {user.name.charAt(0)}
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{user.name}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
          <MapPin size={14} /> {user.location}
        </p>

        {/* Verified badge */}
        {user.kycStatus === 'verified' && (
          <div className="verified-badge" style={{ justifyContent: 'center', marginTop: 8 }}>
            <Shield size={14} /> Verified Farmer
          </div>
        )}

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'var(--space-4)' }}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={18} className={s <= Math.round(user.rating) ? 'star-filled' : 'star-empty'} fill={s <= Math.round(user.rating) ? '#fbbf24' : 'none'} />
            ))}
          </div>
          <span style={{ fontWeight: 700 }}>{user.rating}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>({user.totalRatings} ratings)</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <div className="kpi-card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
          <span className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{user.totalOrders}</span>
          <span className="kpi-label" style={{ fontSize: 'var(--text-xs)' }}>Orders</span>
        </div>
        <div className="kpi-card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
          <span className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{user.fulfillmentRate}%</span>
          <span className="kpi-label" style={{ fontSize: 'var(--text-xs)' }}>Fulfillment</span>
        </div>
        <div className="kpi-card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
          <span className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{user.yearsActive}yr</span>
          <span className="kpi-label" style={{ fontSize: 'var(--text-xs)' }}>Active</span>
        </div>
      </div>

      {/* Details */}
      <div className="glass-card" style={{ marginTop: 'var(--space-4)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Wheat size={14} /> Crops</span>
            <span style={{ fontWeight: 600 }}>{user.crops?.join(', ')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Farm Size</span>
            <span style={{ fontWeight: 600 }}>{user.farmSize}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> Member Since</span>
            <span style={{ fontWeight: 600 }}>{new Date(user.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Phone</span>
            <span style={{ fontWeight: 600 }}>{user.phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Award size={14} /> KYC</span>
            <span className={`status-chip status-chip-${user.kycStatus === 'verified' ? 'complete' : 'pending'}`}>
              {user.kycStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="glass-card" style={{ marginTop: 'var(--space-4)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>About</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{user.bio}</p>
        </div>
      )}

      {/* Logout */}
      <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-6)' }} onClick={handleLogout}>
        <LogOut size={18} /> Switch Role / Logout
      </button>
    </div>
  );
}
