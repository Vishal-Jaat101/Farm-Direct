'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDisputeById } from '@/data/disputes';
import { getOrderById } from '@/data/orders';
import { getBuyerById, getFarmerById } from '@/data/users';
import { ArrowLeft, Scale, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, MessageSquare, Image, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

export default function DisputeDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const dispute = getDisputeById(id);

  const [resolvedState, setResolvedState] = useState(dispute?.resolution || null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [farmerShare, setFarmerShare] = useState(dispute ? Math.round(dispute.amount * 0.7) : 0);
  const [selectedResolution, setSelectedResolution] = useState('partial');
  const [toast, setToast] = useState('');

  if (!dispute) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <div className="empty-state-title">Dispute case not found</div>
        <button className="btn btn-primary" onClick={() => router.push('/admin/disputes')}>Back to Queue</button>
      </div>
    );
  }

  const order = getOrderById(dispute.orderId);
  const buyer = getBuyerById(dispute.buyerId);
  const farmer = getFarmerById(dispute.farmerId);

  const handleResolve = (type) => {
    let outcome = {};
    if (type === 'full_release') {
      outcome = {
        type: 'full_release',
        farmerPayout: dispute.amount,
        buyerRefund: 0,
        note: resolutionNote || 'Full escrow amount released to farmer after review of dispatch proof.',
      };
    } else if (type === 'full_refund') {
      outcome = {
        type: 'full_refund',
        farmerPayout: 0,
        buyerRefund: dispute.amount,
        note: resolutionNote || 'Full refund issued to buyer due to severe quality defect / damaged goods.',
      };
    } else {
      const bRefund = dispute.amount - farmerShare;
      outcome = {
        type: 'partial_release',
        farmerPayout: farmerShare,
        buyerRefund: bRefund,
        note: resolutionNote || `Partial settlement: ₹${farmerShare.toLocaleString()} released to farmer, ₹${bRefund.toLocaleString()} refunded to buyer.`,
      };
    }

    setResolvedState(outcome);
    setToast('Dispute resolved! Escrow ledger updated and payouts queued.');
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <button className="btn btn-ghost" onClick={() => router.push('/admin/disputes')} style={{ marginBottom: 'var(--space-4)' }}>
        <ArrowLeft size={18} /> Back to Dispute Queue
      </button>

      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 className="page-title">{dispute.title}</h1>
            <span className={`status-chip status-chip-${resolvedState ? 'complete' : 'error'}`}>
              {resolvedState ? 'Resolved' : dispute.status}
            </span>
          </div>
          <p className="page-subtitle">Case #{dispute.id} • Order #{dispute.orderId} • Claim Type: <strong style={{ textTransform: 'capitalize' }}>{dispute.type}</strong></p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Escrow Held Under Dispute</div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--amber-400)' }}>
            {formatCurrency(dispute.amount)}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ background: 'var(--status-complete-bg)', color: 'var(--status-complete)', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-6)', border: '1px solid rgba(34,197,94,0.3)' }}>
          ✓ {toast}
        </div>
      )}

      {/* Grid of details */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Left: Buyer Claim & Evidence */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-secondary)' }}>
            <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{buyer?.name.charAt(0)}</div>
            <span style={{ fontWeight: 700 }}>Buyer Claim — {buyer?.name}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>Rating: {buyer?.rating}★</span>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Statement</div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontStyle: 'italic' }}>
              &ldquo;{dispute.buyerMessage}&rdquo;
            </p>
          </div>

          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Image size={12} /> Photographic & Receipt Evidence Submitted
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {dispute.evidencePhotos?.map((photo, i) => (
                <div key={i} style={{ border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>📸</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Inspection Photo #{i+1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Farmer Statement & Dispatch Record */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-secondary)' }}>
            <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{farmer?.name.charAt(0)}</div>
            <span style={{ fontWeight: 700 }}>Farmer Response — {farmer?.name}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{farmer?.fulfillmentRate}% fulfillment</span>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Farmer Explanation</div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', background: 'var(--bg-tertiary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontStyle: 'italic' }}>
              &ldquo;{dispute.farmerResponse}&rdquo;
            </p>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Order Details Verified:</div>
            <div>• Produce: {order?.items?.map(i => `${i.crop} (${i.quantity} ${i.unit})`).join(', ')}</div>
            <div>• Logistics Partner: {order?.deliveryPartner || 'Third-Party Freight'}</div>
            <div>• Tracking ID: {order?.trackingId || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Adjudication Panel */}
      <div className="glass-card" style={{ border: '1px solid var(--border-primary)', padding: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Scale size={20} color="var(--green-400)" />
          Adjudication & Escrow Disbursement
        </h3>

        {resolvedState ? (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid var(--green-600)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green-400)', fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 8 }}>
              <CheckCircle2 size={20} /> Case Resolved and Enforced
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Farmer Payout:</span>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--green-400)' }}>{formatCurrency(resolvedState.farmerPayout)}</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Buyer Refund:</span>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--amber-400)' }}>{formatCurrency(resolvedState.buyerRefund)}</div>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <strong>Admin Ruling:</strong> {resolvedState.note}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <button
                className={`filter-chip ${selectedResolution === 'partial' ? 'active' : ''}`}
                onClick={() => setSelectedResolution('partial')}
              >
                ⚖️ Partial Release / Fair Split
              </button>
              <button
                className={`filter-chip ${selectedResolution === 'full_release' ? 'active' : ''}`}
                onClick={() => setSelectedResolution('full_release')}
              >
                ✓ Full Release to Farmer ({formatCurrency(dispute.amount)})
              </button>
              <button
                className={`filter-chip ${selectedResolution === 'full_refund' ? 'active' : ''}`}
                onClick={() => setSelectedResolution('full_refund')}
              >
                ✗ Full Refund to Buyer ({formatCurrency(dispute.amount)})
              </button>
            </div>

            {selectedResolution === 'partial' && (
              <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Farmer Share: <strong>{formatCurrency(farmerShare)}</strong>
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Buyer Refund: <strong>{formatCurrency(dispute.amount - farmerShare)}</strong>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={dispute.amount}
                  step="500"
                  value={farmerShare}
                  onChange={e => setFarmerShare(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--green-500)' }}
                />
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 4 }}>
                Resolution Rationale & Instructions
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Explain the settlement terms and quality audit findings..."
                value={resolutionNote}
                onChange={e => setResolutionNote(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-accent btn-lg"
                style={{ flex: 1 }}
                onClick={() => handleResolve(selectedResolution)}
              >
                <Scale size={18} /> Execute Binding Settlement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
