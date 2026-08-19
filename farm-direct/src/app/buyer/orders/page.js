'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByBuyer, ORDER_STEPS, getStepIndex } from '@/data/orders';
import { getFarmerById } from '@/data/users';
import { CheckCircle2, Clock, Truck, AlertTriangle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

function getStatusMeta(s) {
  const map = {
    requested: { color: 'pending', label: 'Requested', icon: Clock },
    confirmed: { color: 'pending', label: 'Confirmed', icon: Clock },
    escrow_held: { color: 'active', label: 'Payment Held', icon: CheckCircle2 },
    picked_up: { color: 'active', label: 'Picked Up', icon: Truck },
    in_transit: { color: 'active', label: 'In Transit', icon: Truck },
    delivered: { color: 'complete', label: 'Delivered', icon: CheckCircle2 },
    payment_released: { color: 'complete', label: 'Paid', icon: CheckCircle2 },
    closed: { color: 'complete', label: 'Closed', icon: CheckCircle2 },
    disputed: { color: 'error', label: 'Disputed', icon: AlertTriangle },
    under_review: { color: 'error', label: 'Under Review', icon: AlertTriangle },
    resolved: { color: 'complete', label: 'Resolved', icon: CheckCircle2 },
    cancelled: { color: 'error', label: 'Cancelled', icon: AlertTriangle },
  };
  return map[s] || { color: 'pending', label: s, icon: Clock };
}

export default function BuyerOrdersPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('active');

  if (!user) return null;
  const all = getOrdersByBuyer(user.id);

  const tabs = {
    active: all.filter(o => ['requested', 'confirmed', 'escrow_held', 'picked_up', 'in_transit'].includes(o.status)),
    delivered: all.filter(o => ['delivered', 'payment_released'].includes(o.status)),
    history: all.filter(o => ['closed', 'disputed', 'under_review', 'resolved', 'cancelled'].includes(o.status)),
  };

  const orders = tabs[tab];

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">{all.length} total orders</p>
        </div>
      </div>

      <div className="tabs" style={{ maxWidth: 500 }}>
        {[
          { key: 'active', label: `Active (${tabs.active.length})` },
          { key: 'delivered', label: `Delivered (${tabs.delivered.length})` },
          { key: 'history', label: `History (${tabs.history.length})` },
        ].map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={48} /></div>
          <div className="empty-state-title">No {tab} orders</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {orders.map((order, idx) => {
            const meta = getStatusMeta(order.status);
            const Icon = meta.icon;
            const stepIdx = getStepIndex(order.status);

            return (
              <motion.div
                key={order.id}
                className="glass-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
                      {order.items.map(i => i.crop).join(' + ')}
                    </span>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {order.id} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <span className={`status-chip status-chip-${meta.color}`}>
                    <Icon size={12} /> {meta.label}
                  </span>
                </div>

                {/* Items */}
                {order.items.map((item, i) => {
                  const farmer = getFarmerById(item.farmerId);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', padding: '6px 0', borderTop: i > 0 ? '1px solid var(--border-secondary)' : 'none' }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{item.crop}</span>
                        <span style={{ color: 'var(--text-tertiary)' }}> — {item.quantity} {item.unit} @ {formatCurrency(item.unitPrice)}/{item.unit}</span>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>from {farmer?.name}</div>
                      </div>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  );
                })}

                {/* Stepper for active orders */}
                {['confirmed', 'escrow_held', 'picked_up', 'in_transit', 'delivered', 'payment_released'].includes(order.status) && (
                  <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--border-secondary)', paddingTop: 'var(--space-3)' }}>
                    <div className="stepper">
                      {ORDER_STEPS.map((step, i) => {
                        let state = '';
                        if (i < stepIdx) state = 'completed';
                        else if (i === stepIdx) state = 'active';
                        return (
                          <div key={step.key} className={`stepper-step ${state}`}>
                            <div className="stepper-dot">
                              {state === 'completed' && <CheckCircle2 size={12} />}
                            </div>
                            <span className="stepper-label">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-secondary)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {order.deliveryPartner && `🚚 ${order.deliveryPartner}`}
                    {order.estimatedDelivery && ` • ETA: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--green-400)' }}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
