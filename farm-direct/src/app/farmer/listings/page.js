'use client';
import { useAuth } from '@/context/AuthContext';
import { getListingsByFarmer } from '@/data/listings';
import Link from 'next/link';
import { PlusCircle, Edit, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function MyListingsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const listings = getListingsByFarmer(user.id);
  const active = listings.filter(l => l.status === 'active');
  const inactive = listings.filter(l => l.status !== 'active');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>My Listings</h1>
        <Link href="/farmer/listings/new" className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> New
        </Link>
      </div>

      {/* Active Listings */}
      <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Active ({active.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
        {active.map((listing) => (
          <motion.div key={listing.id} className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }} whileHover={{ scale: 1.01 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>
              {listing.cropId === 'tomato' ? '🍅' : listing.cropId === 'onion' ? '🧅' : listing.cropId === 'grape' ? '🍇' : '🌾'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{listing.crop}</span>
                <span className="badge">{listing.grade}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '4px 0' }}>
                {listing.variety} • {listing.availableQuantity}/{listing.quantity} {listing.unit} left
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: 'var(--green-400)' }}>
                  {formatCurrency(listing.price)}/{listing.unit}
                </span>
                {listing.organic && <span className="organic-badge">🌿 Organic</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Inactive */}
      {inactive.length > 0 && (
        <>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Past ({inactive.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {inactive.map((listing) => (
              <div key={listing.id} className="glass-card" style={{ padding: 'var(--space-4)', opacity: 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{listing.crop} — {listing.variety}</span>
                  <span className={`status-chip ${listing.status === 'sold' ? 'status-chip-complete' : 'status-chip-error'}`}>
                    {listing.status}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {listing.quantity} {listing.unit} @ {formatCurrency(listing.price)}/{listing.unit}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
