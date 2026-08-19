'use client';
import { farmers } from '@/data/users';
import { Star, Shield, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  // Show a few "favorited" farmers
  const favorites = farmers.filter(f => ['farmer-001', 'farmer-002', 'farmer-004', 'farmer-008', 'farmer-010'].includes(f.id));

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Saved Farmers</h1>
          <p className="page-subtitle">{favorites.length} farmers saved for quick reorder</p>
        </div>
      </div>

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {favorites.map((farmer, i) => (
          <motion.div
            key={farmer.id}
            className="glass-card"
            style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="avatar avatar-lg">{farmer.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{farmer.name}</span>
                {farmer.kycStatus === 'verified' && (
                  <span className="verified-badge"><Shield size={10} /> Verified</span>
                )}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <MapPin size={10} /> {farmer.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" /> {farmer.rating}
                </span>
                <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{farmer.crops?.slice(0, 3).join(', ')}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                {farmer.totalOrders} orders • {farmer.fulfillmentRate}% fulfilled
              </div>
            </div>
            <button className="btn btn-icon btn-ghost" style={{ alignSelf: 'start' }}>
              <Heart size={18} fill="#ef4444" color="#ef4444" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
