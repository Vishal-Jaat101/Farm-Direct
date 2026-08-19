'use client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { getFarmerById } from '@/data/users';
import { Trash2, ShoppingCart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount, itemCount } = useCart();
  const router = useRouter();
  const [ordered, setOrdered] = useState(false);

  const handleCheckout = () => {
    setOrdered(true);
    setTimeout(() => {
      clearCart();
      router.push('/buyer/orders');
    }, 2500);
  };

  if (ordered) {
    return (
      <div className="empty-state" style={{ minHeight: '50vh' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <CheckCircle2 size={40} color="white" />
        </motion.div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 8 }}>Order Placed! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Payment held in escrow. The farmer will confirm shortly.</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="empty-state" style={{ minHeight: '50vh' }}>
        <div className="empty-state-icon">🛒</div>
        <div className="empty-state-title">Your cart is empty</div>
        <div className="empty-state-text">Browse produce and add items to get started.</div>
        <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => router.push('/buyer')}>
          Browse Produce
        </button>
      </div>
    );
  }

  // Group by farmer
  const byFarmer = {};
  items.forEach(item => {
    if (!byFarmer[item.farmerId]) byFarmer[item.farmerId] = [];
    byFarmer[item.farmerId].push(item);
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cart</h1>
          <p className="page-subtitle">{itemCount} item{itemCount > 1 ? 's' : ''} from {Object.keys(byFarmer).length} farmer{Object.keys(byFarmer).length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear all</button>
      </div>

      {Object.entries(byFarmer).map(([farmerId, farmerItems]) => {
        const farmer = getFarmerById(farmerId);
        const subtotal = farmerItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

        return (
          <div key={farmerId} className="glass-card" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-secondary)' }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{farmer?.name.charAt(0)}</div>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{farmer?.name}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>• {farmer?.location}</span>
            </div>

            {farmerItems.map(item => (
              <div key={item.listingId} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-secondary)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.crop}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{item.variety} • Grade {item.grade}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--green-400)', fontWeight: 600 }}>
                    {formatCurrency(item.unitPrice)}/{item.unit}
                  </div>
                </div>
                <div className="numeric-stepper" style={{ gap: 4 }}>
                  <button className="numeric-stepper-btn" style={{ width: 36, height: 36, fontSize: 'var(--text-base)' }} onClick={() => updateQuantity(item.listingId, item.quantity - 1)}>−</button>
                  <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                  <button className="numeric-stepper-btn" style={{ width: 36, height: 36, fontSize: 'var(--text-base)' }} onClick={() => updateQuantity(item.listingId, item.quantity + 1)}>+</button>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80 }}>
                  <div style={{ fontWeight: 700 }}>{formatCurrency(item.unitPrice * item.quantity)}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.listingId)}>
                  <Trash2 size={16} color="var(--status-error)" />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal from {farmer?.name.split(' ')[0]}</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        );
      })}

      {/* Total & Checkout */}
      <div className="glass-card" style={{ position: 'sticky', bottom: 'var(--space-4)', background: 'var(--bg-secondary)', border: '1px solid var(--green-800)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--green-400)' }}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
          💰 Payment will be held in escrow and released to farmer(s) upon delivery confirmation.
        </p>
        <button className="btn btn-accent btn-lg" style={{ width: '100%' }} onClick={handleCheckout}>
          Pay & Place Order <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
