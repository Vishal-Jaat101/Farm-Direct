'use client';
import { useState } from 'react';
import { listings as initialListings, cropTypes } from '@/data/listings';
import { getFarmerById } from '@/data/users';
import { getMarketPrice } from '@/data/prices';
import { Search, CheckCircle, AlertTriangle, Eye, ShieldAlert, Sparkles, Filter, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminListingsPage() {
  const [listings, setListings] = useState(initialListings);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleToggleStatus = (id) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'active' ? 'suspended' : 'active';
        showToast(`Listing ${id} marked as ${nextStatus}`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const filtered = listings.filter(l => {
    const farmer = getFarmerById(l.farmerId);
    const matchesSearch =
      l.crop.toLowerCase().includes(search.toLowerCase()) ||
      l.variety.toLowerCase().includes(search.toLowerCase()) ||
      farmer?.name.toLowerCase().includes(search.toLowerCase()) ||
      farmer?.location.toLowerCase().includes(search.toLowerCase());

    const matchesGrade = gradeFilter === 'All' || l.grade === gradeFilter;
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Listings Moderation</h1>
          <p className="page-subtitle">Inspect crop listings, audit pricing bands, and enforce quality standards</p>
        </div>
        {toast && (
          <div style={{ background: 'var(--status-complete-bg)', color: 'var(--status-complete)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            {toast}
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div className="search-bar" style={{ maxWidth: 360, flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search crop, variety, or farmer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="input-field"
            style={{ padding: '8px 14px', minHeight: 40, fontSize: 'var(--text-sm)' }}
          >
            <option value="All">All Grades</option>
            <option value="A+">Grade A+</option>
            <option value="A">Grade A</option>
            <option value="B+">Grade B+</option>
            <option value="B">Grade B</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ padding: '8px 14px', minHeight: 40, fontSize: 'var(--text-sm)' }}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Listing ID & Crop</th>
              <th>Farmer</th>
              <th>Quantity & Unit</th>
              <th>Listed Price</th>
              <th>Market Avg</th>
              <th>Price Deviation</th>
              <th>Grade</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(listing => {
              const farmer = getFarmerById(listing.farmerId);
              const crop = cropTypes.find(c => c.id === listing.cropId);
              const marketRef = getMarketPrice(listing.cropId);
              const marketAvg = marketRef ? marketRef.avgPrice : null;
              const deviation = marketAvg ? (((listing.price - marketAvg) / marketAvg) * 100).toFixed(0) : null;
              const isFlaggedPrice = deviation && Math.abs(deviation) > 35;

              return (
                <tr key={listing.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: '1.4rem' }}>{crop?.emoji || '🌱'}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{listing.crop}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{listing.variety} ({listing.id})</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{farmer?.name || 'Unknown'}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{farmer?.location}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{listing.quantity} {listing.unit}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{listing.availableQuantity} avail</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--green-400)' }}>₹{listing.price.toLocaleString('en-IN')}/{listing.unit}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                    {marketAvg ? `₹${marketAvg}/${listing.unit}` : 'N/A'}
                  </td>
                  <td>
                    {deviation ? (
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: isFlaggedPrice ? 'var(--status-error)' : deviation > 0 ? 'var(--amber-400)' : 'var(--status-complete)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {isFlaggedPrice && <AlertTriangle size={12} />}
                        {deviation > 0 ? `+${deviation}%` : `${deviation}%`}
                      </span>
                    ) : (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Standard</span>
                    )}
                  </td>
                  <td>
                    <span className="badge">{listing.grade}</span>
                    {listing.organic && <span className="organic-badge" style={{ marginLeft: 4 }}>Bio</span>}
                  </td>
                  <td>
                    <span className={`status-chip status-chip-${listing.status === 'active' ? 'complete' : listing.status === 'suspended' ? 'error' : 'pending'}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={`btn btn-sm ${listing.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleStatus(listing.id)}
                    >
                      {listing.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
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
