'use client';
import { useState } from 'react';
import { farmers, buyers } from '@/data/users';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, XCircle, Eye, MapPin, Phone, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminKYCPage() {
  const [farmerList, setFarmerList] = useState(farmers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionSuccess, setActionSuccess] = useState('');

  const pendingFarmers = farmerList.filter(f => f.kycStatus === 'pending');
  const verifiedFarmers = farmerList.filter(f => f.kycStatus === 'verified');
  const rejectedFarmers = farmerList.filter(f => f.kycStatus === 'rejected');

  const displayed = filter === 'pending'
    ? pendingFarmers
    : filter === 'verified'
    ? verifiedFarmers
    : filter === 'rejected'
    ? rejectedFarmers
    : farmerList;

  const handleApprove = (id) => {
    setFarmerList(prev => prev.map(f => f.id === id ? { ...f, kycStatus: 'verified' } : f));
    setActionSuccess(`KYC approved for ${farmerList.find(f => f.id === id)?.name}`);
    setSelectedUser(null);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleReject = (id) => {
    setFarmerList(prev => prev.map(f => f.id === id ? { ...f, kycStatus: 'rejected' } : f));
    setActionSuccess(`KYC rejected for ${farmerList.find(f => f.id === id)?.name}`);
    setSelectedUser(null);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">KYC Verification Queue</h1>
          <p className="page-subtitle">Verify farmer and buyer identities, Aadhaar, and land records</p>
        </div>
        {actionSuccess && (
          <div style={{ background: 'var(--status-complete-bg)', color: 'var(--status-complete)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            ✓ {actionSuccess}
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="kpi-card" onClick={() => setFilter('pending')} style={{ cursor: 'pointer', borderColor: filter === 'pending' ? 'var(--amber-500)' : undefined }}>
          <span className="kpi-label">Pending Verification</span>
          <span className="kpi-value" style={{ background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {pendingFarmers.length}
          </span>
          <span className="kpi-change" style={{ color: 'var(--amber-400)' }}>Action required</span>
        </div>
        <div className="kpi-card" onClick={() => setFilter('verified')} style={{ cursor: 'pointer', borderColor: filter === 'verified' ? 'var(--green-500)' : undefined }}>
          <span className="kpi-label">Verified Accounts</span>
          <span className="kpi-value">{verifiedFarmers.length}</span>
          <span className="kpi-change kpi-change-up">Active trust badges</span>
        </div>
        <div className="kpi-card" onClick={() => setFilter('rejected')} style={{ cursor: 'pointer', borderColor: filter === 'rejected' ? 'var(--status-error)' : undefined }}>
          <span className="kpi-label">Flagged / Rejected</span>
          <span className="kpi-value" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {rejectedFarmers.length}
          </span>
          <span className="kpi-change" style={{ color: 'var(--status-error)' }}>Needs resubmission</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ maxWidth: 460 }}>
        {['all', 'pending', 'verified', 'rejected'].map(t => (
          <button
            key={t}
            className={`tab ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t} ({t === 'all' ? farmerList.length : t === 'pending' ? pendingFarmers.length : t === 'verified' ? verifiedFarmers.length : rejectedFarmers.length})
          </button>
        ))}
      </div>

      {/* Verification Queue Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Crops & Land</th>
              <th>KYC Status</th>
              <th>Submitted</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((farmer) => (
              <tr key={farmer.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                      {farmer.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{farmer.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>ID: {farmer.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{farmer.phone}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    <MapPin size={12} /> {farmer.location}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{farmer.crops?.join(', ') || 'N/A'}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{farmer.farmSize}</div>
                </td>
                <td>
                  <span className={`status-chip status-chip-${farmer.kycStatus === 'verified' ? 'complete' : farmer.kycStatus === 'rejected' ? 'error' : 'pending'}`}>
                    {farmer.kycStatus}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {new Date(farmer.memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedUser(farmer)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <Eye size={14} /> Review Documents
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">KYC Document Audit</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Applicant: {selectedUser.name} ({selectedUser.id})</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Farmer Info */}
              <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Phone:</span> <strong style={{ marginLeft: 6 }}>{selectedUser.phone}</strong></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Location:</span> <strong style={{ marginLeft: 6 }}>{selectedUser.location}</strong></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Farm Size:</span> <strong style={{ marginLeft: 6 }}>{selectedUser.farmSize}</strong></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Language:</span> <strong style={{ marginLeft: 6 }}>{selectedUser.language.toUpperCase()}</strong></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>FPO Affiliation:</span> <strong style={{ marginLeft: 6 }}>{selectedUser.fpoId || 'Independent'}</strong></div>
                  <div><span style={{ color: 'var(--text-tertiary)' }}>Rating:</span> <strong style={{ marginLeft: 6 }}>{selectedUser.rating || 'New'} ★</strong></div>
                </div>
              </div>

              {/* Simulated ID Proof Documents */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Submitted Proof Documents</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div style={{ border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                    <FileText size={32} color="var(--green-400)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Aadhaar Card (Front/Back)</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>Masked UID: ****-****-9182</div>
                    <span className="badge" style={{ marginTop: 8 }}>Automated OCR Passed</span>
                  </div>

                  <div style={{ border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', textAlign: 'center' }}>
                    <FileText size={32} color="var(--amber-400)" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>7/12 Land Registry Excerpt</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>Survey No: 142/A, {selectedUser.location}</div>
                    <span className="badge-amber" style={{ display: 'inline-flex', marginTop: 8 }}>Land Record Matched</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={() => handleApprove(selectedUser.id)}
                >
                  <CheckCircle2 size={18} /> Approve & Verify
                </button>
                <button
                  className="btn btn-danger btn-lg"
                  style={{ flex: 1 }}
                  onClick={() => handleReject(selectedUser.id)}
                >
                  <XCircle size={18} /> Reject KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
