'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cropTypes } from '@/data/listings';
import { marketPrices } from '@/data/prices';
import { Camera, ArrowLeft, ArrowRight, Check, Upload, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['Photo', 'Crop', 'Quantity', 'Price', 'Review'];

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [grade, setGrade] = useState('A');
  const [cropSearch, setCropSearch] = useState('');
  const [posted, setPosted] = useState(false);

  const units = ['kg', 'quintal', 'ton', 'bag', 'dozen', 'crate'];
  const grades = ['A+', 'A', 'B+', 'B', 'C'];

  // Get market price for selected crop
  const marketRef = selectedCrop ? marketPrices.find(p => p.cropId === selectedCrop.id) : null;

  const filteredCrops = cropSearch
    ? cropTypes.filter(c => c.name.toLowerCase().includes(cropSearch.toLowerCase()))
    : cropTypes;

  const canNext = () => {
    if (step === 0) return photo;
    if (step === 1) return selectedCrop;
    if (step === 2) return quantity > 0;
    if (step === 3) return price > 0;
    return true;
  };

  const handlePost = () => {
    setPosted(true);
    setTimeout(() => router.push('/farmer'), 2000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  if (posted) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--green-500), var(--green-700))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 'var(--space-6)',
          }}
        >
          <Check size={40} color="white" />
        </motion.div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 8 }}>
          Listing Posted! 🎉
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your {selectedCrop?.name} is now visible to buyers.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-icon btn-ghost" onClick={() => step > 0 ? setStep(step - 1) : router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>New Listing</h1>
      </div>

      {/* Step Progress */}
      <div className="step-progress">
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div className={`step-dot ${i < step ? 'completed' : ''} ${i === step ? 'active' : ''}`} />
            {i < STEPS.length - 1 && (
              <div className={`step-connector ${i < step ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
        Step {step + 1}: {STEPS[step]}
      </p>

      {/* Step Content */}
      <div className="step-wizard">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 0: Photo */}
            {step === 0 && (
              <div>
                {!photo ? (
                  <label className="camera-capture-zone" style={{ cursor: 'pointer' }}>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                    <div className="camera-icon">
                      <Camera size={36} color="#4ade80" />
                    </div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 8 }}>
                      Take a photo of your produce
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                      Tap to open camera or upload an image
                    </p>
                  </label>
                ) : (
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                    <img src={photo} alt="Produce" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                    <button
                      onClick={() => setPhoto(null)}
                      className="btn btn-secondary btn-sm"
                      style={{ position: 'absolute', bottom: 12, right: 12 }}
                    >
                      <Upload size={14} /> Retake
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Crop Type */}
            {step === 1 && (
              <div>
                <div className="search-bar" style={{ marginBottom: 'var(--space-4)' }}>
                  <Search size={18} className="search-icon" />
                  <input
                    placeholder="Search crop type..."
                    value={cropSearch}
                    onChange={(e) => setCropSearch(e.target.value)}
                  />
                </div>
                <div className="crop-grid">
                  {filteredCrops.map((crop) => (
                    <div
                      key={crop.id}
                      className={`crop-item ${selectedCrop?.id === crop.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCrop(crop)}
                    >
                      <span className="crop-item-emoji">{crop.emoji}</span>
                      <span className="crop-item-name">{crop.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Quantity */}
            {step === 2 && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-8)' }}>
                  How much {selectedCrop?.name}?
                </h3>

                <div className="numeric-stepper" style={{ justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                  <button className="numeric-stepper-btn" onClick={() => setQuantity(Math.max(1, quantity - (unit === 'quintal' || unit === 'ton' ? 1 : 10)))}>
                    −
                  </button>
                  <input
                    className="numeric-stepper-value"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    style={{ background: 'transparent', border: 'none', textAlign: 'center' }}
                  />
                  <button className="numeric-stepper-btn" onClick={() => setQuantity(quantity + (unit === 'quintal' || unit === 'ton' ? 1 : 10))}>
                    +
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                  {units.map(u => (
                    <button
                      key={u}
                      className={`filter-chip ${unit === u ? 'active' : ''}`}
                      onClick={() => setUnit(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Grade:</span>
                  {grades.map(g => (
                    <button
                      key={g}
                      className={`filter-chip ${grade === g ? 'active' : ''}`}
                      onClick={() => setGrade(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Price */}
            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                  Set your price per {unit}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 'var(--space-6)' }}>
                  <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-secondary)' }}>₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    style={{
                      fontSize: 'var(--text-4xl)', fontWeight: 800, width: 180,
                      textAlign: 'center', color: 'var(--green-400)',
                      background: 'transparent', border: 'none',
                    }}
                  />
                </div>

                {/* Market price reference band */}
                {marketRef && (
                  <div className="glass-card" style={{ padding: 'var(--space-4)', textAlign: 'left' }}>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Market Reference — Nearby Mandi Prices
                    </p>
                    <div className="price-band">
                      <div
                        className="price-band-fill"
                        style={{ left: 0, width: '100%' }}
                      />
                      {price > 0 && (
                        <div
                          className="price-band-marker"
                          style={{
                            left: `${Math.min(100, Math.max(0, ((price - marketRef.minPrice) / (marketRef.maxPrice - marketRef.minPrice)) * 100))}%`
                          }}
                        />
                      )}
                    </div>
                    <div className="price-band-labels">
                      <span>₹{marketRef.minPrice}/{marketRef.unit}</span>
                      <span style={{ color: 'var(--green-400)', fontWeight: 600 }}>Avg: ₹{marketRef.avgPrice}</span>
                      <span>₹{marketRef.maxPrice}/{marketRef.unit}</span>
                    </div>
                    <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {marketRef.prices.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          <span>{p.mandi}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{p.price}/{marketRef.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                  Review your listing
                </h3>

                <div className="glass-card" style={{ marginBottom: 'var(--space-4)' }}>
                  {photo && (
                    <img src={photo} alt="Produce" style={{
                      width: '100%', height: 200, objectFit: 'cover',
                      borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)',
                    }} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Crop</span>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {selectedCrop?.emoji} {selectedCrop?.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Quantity</span>
                      <span style={{ fontWeight: 600 }}>{quantity} {unit}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Grade</span>
                      <span className="badge">{grade}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Price</span>
                      <span style={{ fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--green-400)' }}>
                        ₹{price}/{unit}
                      </span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Total Value</span>
                      <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>
                        ₹{(price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-8)' }}>
          {step > 0 && (
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(step - 1)}>
              <ArrowLeft size={18} /> Back
            </button>
          )}
          {step < 4 ? (
            <button
              className="btn btn-primary"
              style={{ flex: 1, opacity: canNext() ? 1 : 0.5 }}
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn btn-accent btn-lg" style={{ flex: 1 }} onClick={handlePost}>
              <Check size={20} /> Post Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
