'use client';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByFarmer } from '@/data/orders';
import { ArrowUpRight, ArrowDownRight, Lock, CheckCircle2, Wallet as WalletIcon } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function WalletPage() {
  const { user } = useAuth();
  if (!user) return null;

  const orders = getOrdersByFarmer(user.id);
  const paidOrders = orders.filter(o => ['payment_released', 'closed'].includes(o.status));
  const escrowOrders = orders.filter(o => ['escrow_held', 'picked_up', 'in_transit', 'delivered'].includes(o.status));

  const totalEarnings = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
  const escrowHeld = escrowOrders.reduce((s, o) => s + o.totalAmount, 0);
  const availableBalance = 85000; // simulated

  const transactions = [
    { id: 1, type: 'credit', label: 'Payment — Tomato (Order #001)', amount: 9000, date: '14 Aug' },
    { id: 2, type: 'credit', label: 'Payment — Wheat (Order #018)', amount: 70000, date: '04 May' },
    { id: 3, type: 'escrow', label: 'Escrow — Onion (Order #002)', amount: 16000, date: '15 Aug', status: 'in transit' },
    { id: 4, type: 'escrow', label: 'Escrow — Grape (Order #006)', amount: 4250, date: '15 Aug', status: 'picked up' },
    { id: 5, type: 'withdrawal', label: 'Bank Transfer — SBI ****4210', amount: -50000, date: '10 Aug' },
    { id: 6, type: 'credit', label: 'Payment — Mango (prev season)', amount: 24000, date: '17 May' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>Wallet</h1>

      {/* Balance Card */}
      <motion.div
        className="glass-card"
        style={{
          padding: 'var(--space-6)', marginBottom: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15), rgba(5, 46, 22, 0.8))',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
          <WalletIcon size={20} color="var(--green-400)" />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>Available Balance</span>
        </div>
        <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--green-400)', marginBottom: 'var(--space-4)' }}>
          {formatCurrency(availableBalance)}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Lock size={10} /> In Escrow
            </div>
            <div style={{ fontWeight: 700, color: 'var(--amber-400)' }}>{formatCurrency(escrowHeld)}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Total Earned</div>
            <div style={{ fontWeight: 700 }}>{formatCurrency(user.totalEarnings)}</div>
          </div>
        </div>
        <button className="btn btn-accent" style={{ marginTop: 'var(--space-4)', width: '100%' }}>
          Withdraw to Bank
        </button>
      </motion.div>

      {/* Transactions */}
      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Recent Transactions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            className="glass-card"
            style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: tx.type === 'credit' ? 'var(--status-complete-bg)' : tx.type === 'escrow' ? 'var(--status-pending-bg)' : 'var(--status-error-bg)',
              }}>
                {tx.type === 'credit' ? <ArrowDownRight size={16} color="var(--status-complete)" /> :
                 tx.type === 'escrow' ? <Lock size={16} color="var(--status-pending)" /> :
                 <ArrowUpRight size={16} color="var(--status-error)" />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{tx.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {tx.date} {tx.status ? `• ${tx.status}` : ''}
                </div>
              </div>
            </div>
            <span style={{
              fontWeight: 700,
              color: tx.type === 'credit' ? 'var(--status-complete)' : tx.type === 'withdrawal' ? 'var(--status-error)' : 'var(--amber-400)',
            }}>
              {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
