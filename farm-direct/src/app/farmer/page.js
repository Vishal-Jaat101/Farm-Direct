'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getListingsByFarmer } from '@/data/listings';
import { getOrdersByFarmer } from '@/data/orders';
import { PlusCircle, Package, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Truck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function getStatusColor(status) {
  const map = {
    requested: 'pending', confirmed: 'pending', escrow_held: 'active',
    picked_up: 'active', in_transit: 'active', delivered: 'complete',
    payment_released: 'complete', closed: 'complete', disputed: 'error',
    under_review: 'error', cancelled: 'error',
  };
  return map[status] || 'pending';
}

function getStatusLabel(status) {
  const map = {
    requested: 'New Request', confirmed: 'Confirmed', escrow_held: 'Payment Held',
    picked_up: 'Picked Up', in_transit: 'In Transit', delivered: 'Delivered',
    payment_released: 'Paid', closed: 'Closed', disputed: 'Disputed',
    under_review: 'Under Review', cancelled: 'Cancelled',
  };
  return map[status] || status;
}

function getStatusIcon(status) {
  const s = getStatusColor(status);
  if (s === 'complete') return <CheckCircle2 size={14} />;
  if (s === 'active') return <Truck size={14} />;
  if (s === 'error') return <AlertTriangle size={14} />;
  return <Clock size={14} />;
}

export default function FarmerHome() {
  const { user } = useAuth();
  if (!user) return null;

  const listings = getListingsByFarmer(user.id);
  const orders = getOrdersByFarmer(user.id);
  const activeListings = listings.filter(l => l.status === 'active');
  const pendingOrders = orders.filter(o => o.status === 'requested');
  const activeOrders = orders.filter(o => ['confirmed', 'escrow_held', 'picked_up', 'in_transit'].includes(o.status));
  const recentOrders = orders.slice(0, 5);

  // Simulated earnings
  const thisMonthEarnings = 85000;
  const lastMonthEarnings = 72000;
  const earningsChange = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1);

  return (
    <div className="stagger-children">
      {/* Greeting */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>
          Namaste, {user.name.split(' ')[0]} 🙏
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
          Here&apos;s your farm today
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <motion.div className="kpi-card" whileHover={{ scale: 1.02 }}>
          <span className="kpi-label">This Month</span>
          <span className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>
            {formatCurrency(thisMonthEarnings)}
          </span>
          <span className="kpi-change kpi-change-up" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={12} /> {earningsChange}% from last month
          </span>
        </motion.div>

        <motion.div className="kpi-card" whileHover={{ scale: 1.02 }}>
          <span className="kpi-label">Active Listings</span>
          <span className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>{activeListings.length}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {listings.length} total
          </span>
        </motion.div>

        <motion.div className="kpi-card" whileHover={{ scale: 1.02 }}>
          <span className="kpi-label">Pending Orders</span>
          <span className="kpi-value" style={{ fontSize: 'var(--text-2xl)', background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {pendingOrders.length}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            Need your confirmation
          </span>
        </motion.div>

        <motion.div className="kpi-card" whileHover={{ scale: 1.02 }}>
          <span className="kpi-label">Active Orders</span>
          <span className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>{activeOrders.length}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            In progress
          </span>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Link href="/farmer/listings/new" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
          <PlusCircle size={20} /> New Listing
        </Link>
        <Link href="/farmer/orders" className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
          <Package size={20} /> Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recent Orders</h2>
          <Link href="/farmer/orders" style={{ fontSize: 'var(--text-sm)', color: 'var(--green-400)', fontWeight: 600 }}>
            View all →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {recentOrders.map((order) => {
            const sc = getStatusColor(order.status);
            return (
              <motion.div
                key={order.id}
                className="glass-card"
                style={{ padding: 'var(--space-4)' }}
                whileHover={{ scale: 1.01 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {order.items.map(i => i.crop).join(', ')}
                  </span>
                  <span className={`status-chip status-chip-${sc}`}>
                    {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {order.items.map(i => `${i.quantity} ${i.unit}`).join(' + ')}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--green-400)' }}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
