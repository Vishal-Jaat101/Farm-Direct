'use client';
import { useState } from 'react';
import Link from 'next/link';
import { disputes as initialDisputes } from '@/data/disputes';
import { getBuyerById, getFarmerById } from '@/data/users';
import { getOrderById } from '@/data/orders';
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert, ArrowRight, Eye, Scale, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function AdminDisputesPage() {
  const [disputeList, setDisputeList] = useState(initialDisputes);
  const [filter, setFilter] = useState('all');

  const openDisputes = disputeList.filter(d => d.status === 'open' || d.status === 'under_review');
  const resolvedDisputes = disputeList.filter(d => d.status === 'resolved');

  const displayed = filter === 'open'
    ? openDisputes
    : filter === 'resolved'
    ? resolvedDisputes
    : disputeList;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dispute Resolution Queue</h1>
          <p className="page-subtitle">Mediate quality claims, weight mismatches, and manage escrow disbursements</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="kpi-card" onClick={() => setFilter('open')} style={{ cursor: 'pointer', borderColor: filter === 'open' ? 'var(--status-error)' : undefined }}>
          <span className="kpi-label">Active Claims (Escrow Paused)</span>
          <span className="kpi-value" style={{ background: 'linear-gradient(135deg, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {openDisputes.length}
          </span>
          <span className="kpi-change" style={{ color: 'var(--status-error)' }}>SLA deadlines active</span>
        </div>

        <div className="kpi-card" onClick={() => setFilter('resolved')} style={{ cursor: 'pointer', borderColor: filter === 'resolved' ? 'var(--green-500)' : undefined }}>
          <span className="kpi-label">Resolved Disputes</span>
          <span className="kpi-value">{resolvedDisputes.length}</span>
          <span className="kpi-change kpi-change-up">100% fair settlement</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Platform Dispute Rate</span>
          <span className="kpi-value">1.8%</span>
          <span className="kpi-change kpi-change-up">Target &lt; 2.0%</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ maxWidth: 360, marginBottom: 'var(--space-6)' }}>
        {['all', 'open', 'resolved'].map(t => (
          <button
            key={t}
            className={`tab ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t} ({t === 'all' ? disputeList.length : t === 'open' ? openDisputes.length : resolvedDisputes.length})
          </button>
        ))}
      </div>

      {/* Disputes Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Case ID & Issue</th>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Farmer</th>
              <th>Disputed Amount</th>
              <th>Status</th>
              <th>SLA Deadline</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((d) => {
              const buyer = getBuyerById(d.buyerId);
              const farmer = getFarmerById(d.farmerId);

              return (
                <tr key={d.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={14} color={d.status === 'resolved' ? 'var(--status-complete)' : 'var(--status-error)'} />
                        {d.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                        Case: {d.id} • Type: <strong style={{ textTransform: 'capitalize' }}>{d.type}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{d.orderId}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{buyer?.name}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{farmer?.name}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--amber-400)' }}>{formatCurrency(d.amount)}</div>
                  </td>
                  <td>
                    <span className={`status-chip status-chip-${d.status === 'resolved' ? 'complete' : d.status === 'open' ? 'error' : 'pending'}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {new Date(d.slaDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/disputes/${d.id}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Scale size={14} /> Adjudicate Case
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
