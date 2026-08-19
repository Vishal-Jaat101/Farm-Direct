'use client';
import { marketPrices } from '@/data/prices';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PriceReferencePage() {
  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 4 }}>
        Market Prices
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Reference prices from nearby mandis — updated today
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {marketPrices.map((item, index) => {
          const TrendIcon = item.trend === 'up' ? TrendingUp : item.trend === 'down' ? TrendingDown : Minus;
          const trendColor = item.trend === 'up' ? 'var(--status-complete)' : item.trend === 'down' ? 'var(--status-error)' : 'var(--text-tertiary)';

          return (
            <motion.div
              key={item.cropId}
              className="glass-card"
              style={{ padding: 'var(--space-4)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontWeight: 700 }}>{item.crop}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor, fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  <TrendIcon size={16} />
                  {item.weekChange > 0 ? '+' : ''}{item.weekChange}%
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--green-400)' }}>
                  ₹{item.avgPrice}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                  /{item.unit} avg
                </span>
              </div>

              {/* Mini price history bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40, marginBottom: 'var(--space-3)' }}>
                {item.history.map((h, i) => {
                  const max = Math.max(...item.history.map(x => x.price));
                  const min = Math.min(...item.history.map(x => x.price));
                  const range = max - min || 1;
                  const height = ((h.price - min) / range) * 30 + 10;
                  const isLast = i === item.history.length - 1;

                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1, height, borderRadius: 3,
                        background: isLast
                          ? 'linear-gradient(to top, var(--green-600), var(--green-400))'
                          : 'var(--bg-tertiary)',
                      }}
                    />
                  );
                })}
              </div>

              {/* Mandi prices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {item.prices.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{p.mandi}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{p.price}/{item.unit}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                <span>Low: ₹{item.minPrice}</span>
                <span>High: ₹{item.maxPrice}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
