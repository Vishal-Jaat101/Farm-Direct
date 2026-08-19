'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getListingById, cropTypes } from '@/data/listings';
import { getFarmerById } from '@/data/users';
import { getMarketPrice } from '@/data/prices';
import { useCart } from '@/context/CartContext';
import { Star, Shield, MapPin, Calendar, ArrowLeft, ShoppingCart, MessageSquare, Clock, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function ProduceDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(10);
  const [added, setAdded] = useState(false);

  const listing = getListingById(id);
  if (!listing) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Listing not found</div>
        <button className="btn btn-primary" onClick={() => router.push('/buyer')}>Back to Browse</button>
      </div>
    );
  }

  const farmer = getFarmerById(listing.farmerId);
  const cropInfo = cropTypes.find(c => c.id === listing.cropId);
  const marketRef = getMarketPrice(listing.cropId);

  const handleAddToCart = () => {
    addItem(listing, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const daysUntilExpiry = Math.max(0, Math.ceil((new Date(listing.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Back button */}
      <button className="btn btn-ghost" onClick={() => router.back()} style={{ marginBottom: 'var(--space-4)' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
        {/* Left: Image */}
        <div>
          <motion.div
            className="carousel"
            style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', background: 'var(--bg-tertiary)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {cropInfo?.emoji || '🌱'}
          </motion.div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span className="badge">{listing.grade}</span>
            {listing.organic && <span className="organic-badge">🌿 Organic</span>}
            <span className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', fontSize: 'var(--text-xs)', fontWeight: 600, borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.12)', color: 'var(--amber-400)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Clock size={10} /> {daysUntilExpiry} days left
            </span>
          </div>
        </div>

        {/* Right: Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 4 }}>
            {listing.crop}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            {listing.variety}
          </p>

          {listing.description && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
              {listing.description}
            </p>
          )}

          {/* Price */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--green-400)' }}>
                {formatCurrency(listing.price)}
              </span>
              <span style={{ fontSize: 'var(--text-lg)', color: 'var(--text-tertiary)' }}>/{listing.unit}</span>
            </div>
            {marketRef && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={12} /> Market avg: ₹{marketRef.avgPrice}/{marketRef.unit}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="glass-card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Available</span>
              <span style={{ fontWeight: 700 }}>{listing.availableQuantity} {listing.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Min. Order</span>
              <span style={{ fontWeight: 700 }}>{listing.minOrderQty} {listing.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Harvest Date</span>
              <span style={{ fontWeight: 700 }}>{new Date(listing.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Radius</span>
              <span style={{ fontWeight: 700 }}>{listing.deliveryRadius} km</span>
            </div>
          </div>

          {/* Quantity selector and CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div className="numeric-stepper">
              <button className="numeric-stepper-btn" onClick={() => setQty(Math.max(listing.minOrderQty, qty - (listing.unit === 'quintal' ? 1 : 10)))}>−</button>
              <span className="numeric-stepper-value" style={{ fontSize: 'var(--text-xl)' }}>{qty}</span>
              <button className="numeric-stepper-btn" onClick={() => setQty(Math.min(listing.availableQuantity, qty + (listing.unit === 'quintal' ? 1 : 10)))}>+</button>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{listing.unit}</span>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Subtotal: <strong style={{ color: 'var(--green-400)' }}>{formatCurrency(listing.price * qty)}</strong>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
              <ShoppingCart size={20} /> {added ? 'Added! ✓' : 'Order Now'}
            </button>
            <button className="btn btn-secondary btn-lg">
              <MessageSquare size={20} /> Negotiate
            </button>
          </div>
        </motion.div>
      </div>

      {/* Farmer Profile */}
      {farmer && (
        <motion.div className="glass-card" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>About the Farmer</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="avatar avatar-lg">{farmer.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{farmer.name}</span>
                {farmer.kycStatus === 'verified' && (
                  <span className="verified-badge"><Shield size={12} /> Verified</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {farmer.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} fill="#fbbf24" color="#fbbf24" /> {farmer.rating} ({farmer.totalRatings})
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--green-400)' }}>{farmer.fulfillmentRate}%</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Fulfillment</div>
            </div>
          </div>
          {farmer.bio && (
            <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {farmer.bio}
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Years Active</div>
              <div style={{ fontWeight: 700 }}>{farmer.yearsActive}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total Orders</div>
              <div style={{ fontWeight: 700 }}>{farmer.totalOrders}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Farm Size</div>
              <div style={{ fontWeight: 700 }}>{farmer.farmSize}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
