'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByFarmer } from '@/data/orders';
import { ORDER_STEPS, getStepIndex } from '@/data/orders';
import { getBuyerById } from '@/data/users';
import { CheckCircle2, Clock, Truck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function getStatusMeta(status) {
  const map = {
    requested: { color: 'pending', label: 'New Request', icon: Clock },
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
  return map[status] || { color: 'pending', label: status, icon: Clock };
}

function OrderStepper({ status }) {
  const currentStep = getStepIndex(status);

  return (
    <div className="stepper">
      {ORDER_STEPS.map((step, i) => {
        let state = '';
        if (i < currentStep) state = 'completed';
        else if (i === currentStep) state = 'active';

        return (
          <div key={step.key} className={`stepper-step ${state}`}>
            <div className="stepper-dot">
              {state === 'completed' && <CheckCircle2 size={14} />}
            </div>
            <span className="stepper-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function FarmerOrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedOrder, setExpandedOrder] = useState(null);

  if (!user) return null;

  const allOrders = getOrdersByFarmer(user.id);
  const tabs = {
    pending: allOrders.filter(o => ['requested', 'confirmed', 'escrow_held'].includes(o.status)),
    active: allOrders.filter(o => ['picked_up', 'in_transit'].includes(o.status)),
    completed: allOrders.filter(o => ['delivered', 'payment_released', 'closed', 'disputed', 'under_review', 'resolved', 'cancelled'].includes(o.status)),
  };

  const currentOrders = tabs[activeTab];

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
        Orders
      </h1>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'pending', label: `Pending (${tabs.pending.length})` },
          { key: 'active', label: `Active (${tabs.active.length})` },
          { key: 'completed', label: `Done (${tabs.completed.length})` },
        ].map(t => (
          <button
            key={t.key}
            className={`tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      {currentOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">No {activeTab} orders</div>
          <div className="empty-state-text">Orders will appear here as buyers place them.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {currentOrders.map((order) => {
            const meta = getStatusMeta(order.status);
            const buyer = getBuyerById(order.buyerId);
            const isExpanded = expandedOrder === order.id;
            const Icon = meta.icon;

            return (
              <motion.div
                key={order.id}
                className="glass-card"
                style={{ padding: 'var(--space-4)', cursor: 'pointer' }}
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                layout
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
                      {order.items.map(i => i.crop).join(' + ')}
                    </span>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {buyer?.name || 'Unknown Buyer'} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`status-chip status-chip-${meta.color}`}>
                      <Icon size={12} /> {meta.label}
                    </span>
                    {isExpanded ? <ChevronUp size={16} color="var(--text-tertiary)" /> : <ChevronDown size={16} color="var(--text-tertiary)" />}
                  </div>
                </div>

                {/* Summary row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {order.items.map(i => `${i.quantity} ${i.unit}`).join(' + ')}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--green-400)', fontSize: 'var(--text-lg)' }}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                {/* Expanded stepper */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid var(--border-secondary)', marginTop: 12, paddingTop: 12 }}>
                        {!['disputed', 'under_review', 'resolved', 'cancelled'].includes(order.status) && (
                          <OrderStepper status={order.status} />
                        )}
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 8 }}>
                          <p>📍 {order.deliveryAddress}</p>
                          {order.deliveryPartner && <p style={{ marginTop: 4 }}>🚚 {order.deliveryPartner} — {order.trackingId}</p>}
                        </div>
                        {order.status === 'requested' && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>✓ Accept</button>
                            <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>✗ Decline</button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
