'use client';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByBuyer } from '@/data/orders';
import { ArrowDownRight, ArrowUpRight, Lock, Download, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function PaymentsPage() {
  const { user } = useAuth();
  if (!user) return null;

  const orders = getOrdersByBuyer(user.id);
  const totalSpent = orders.filter(o => ['payment_released', 'closed'].includes(o.status)).reduce((s, o) => s + o.totalAmount, 0);
  const escrowHeld = orders.filter(o => ['escrow_held', 'picked_up', 'in_transit', 'delivered'].includes(o.status)).reduce((s, o) => s + o.totalAmount, 0);

  const transactions = orders
    .filter(o => o.status !== 'draft' && o.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(o => ({
      id: o.id,
      crops: o.items.map(i => i.crop).join(', '),
      amount: o.totalAmount,
      date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      status: o.status,
      isEscrow: ['escrow_held', 'picked_up', 'in_transit', 'delivered', 'confirmed', 'requested'].includes(o.status),
      isPaid: ['payment_released', 'closed'].includes(o.status),
    }));

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments & Invoices</h1>
          <p className="page-subtitle">Track spending and download invoices</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <motion.div className="kpi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="kpi-label">Total Spent</span>
          <span className="kpi-value">{formatCurrency(totalSpent)}</span>
        </motion.div>
        <motion.div className="kpi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={12} /> In Escrow</span>
          <span className="kpi-value" style={{ background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {formatCurrency(escrowHeld)}
          </span>
        </motion.div>
        <motion.div className="kpi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="kpi-label">Total Orders</span>
          <span className="kpi-value">{user.totalOrders}</span>
        </motion.div>
      </div>

      {/* Transaction History */}
      <h2 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Transaction History</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Items</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{tx.id}</td>
                <td>{tx.crops}</td>
                <td style={{ color: 'var(--text-tertiary)' }}>{tx.date}</td>
                <td>
                  {tx.isPaid && <span className="status-chip status-chip-complete">Paid</span>}
                  {tx.isEscrow && <span className="status-chip status-chip-pending"><Lock size={10} /> Escrow</span>}
                  {!tx.isPaid && !tx.isEscrow && <span className="status-chip status-chip-error">{tx.status}</span>}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(tx.amount)}</td>
                <td>
                  {tx.isPaid && (
                    <button className="btn btn-ghost btn-sm" title="Download Invoice">
                      <Download size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
