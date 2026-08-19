'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getActiveListings, cropTypes } from '@/data/listings';
import { getFarmerById } from '@/data/users';
import { Search, Star, MapPin, Leaf as LeafIcon, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const sortOptions = [
  { value: 'freshness', label: 'Freshest' },
  { value: 'price-low', label: 'Price: Low' },
  { value: 'price-high', label: 'Price: High' },
  { value: 'rating', label: 'Top Rated' },
];

const cropFilters = ['All', 'Vegetable', 'Fruit', 'Grain', 'Spice', 'Oilseed', 'Plantation'];

export default function BuyerBrowsePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('freshness');
  const [organicOnly, setOrganicOnly] = useState(false);

  const allListings = getActiveListings();

  const filtered = useMemo(() => {
    let results = [...allListings];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(l =>
        l.crop.toLowerCase().includes(q) ||
        l.variety.toLowerCase().includes(q) ||
        getFarmerById(l.farmerId)?.location.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      const cropsInCat = cropTypes.filter(c => c.category === category).map(c => c.id);
      results = results.filter(l => cropsInCat.includes(l.cropId));
    }

    if (organicOnly) results = results.filter(l => l.organic);

    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    else if (sort === 'freshness') results.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));

    return results;
  }, [search, category, sort, organicOnly, allListings]);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Produce</h1>
          <p className="page-subtitle">{filtered.length} fresh listings from verified farmers</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 'var(--space-4)', maxWidth: 600 }}>
        <Search size={18} className="search-icon" />
        <input
          placeholder="Search crops, varieties, locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div className="filter-chips">
          {cropFilters.map(f => (
            <button
              key={f}
              className={`filter-chip ${category === f ? 'active' : ''}`}
              onClick={() => setCategory(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          className={`filter-chip ${organicOnly ? 'active' : ''}`}
          onClick={() => setOrganicOnly(!organicOnly)}
        >
          🌿 Organic
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field"
          style={{ padding: '8px 16px', minHeight: 36, fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-full)', maxWidth: 160 }}
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No listings found</div>
          <div className="empty-state-text">Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filtered.map((listing, i) => {
            const farmer = getFarmerById(listing.farmerId);
            const cropInfo = cropTypes.find(c => c.id === listing.cropId);

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
              >
                <Link href={`/buyer/produce/${listing.id}`}>
                  <div className="produce-card">
                    <div className="produce-card-image" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '4rem', position: 'relative',
                    }}>
                      {cropInfo?.emoji || '🌱'}
                      {listing.organic && (
                        <span className="organic-badge" style={{ position: 'absolute', top: 12, right: 12 }}>
                          🌿 Organic
                        </span>
                      )}
                      <span className="badge" style={{ position: 'absolute', top: 12, left: 12 }}>
                        {listing.grade}
                      </span>
                    </div>
                    <div className="produce-card-body">
                      <div className="produce-card-crop">{listing.crop}</div>
                      <div className="produce-card-variety">{listing.variety}</div>
                      <div className="produce-card-meta">
                        <div className="produce-card-price">
                          ₹{listing.price.toLocaleString('en-IN')}
                          <span className="produce-card-unit">/{listing.unit}</span>
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          {listing.availableQuantity} {listing.unit} avail
                        </span>
                      </div>
                    </div>
                    <div className="produce-card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                          {farmer?.name.charAt(0)}
                        </div>
                        <span>{farmer?.name.split(' ')[0]}</span>
                        {farmer?.kycStatus === 'verified' && <span style={{ color: '#60a5fa', fontSize: 10 }}>✓</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span>{farmer?.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
