'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sprout, TrendingUp, Shield, Truck, Star, Users, ArrowRight, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Farmers', value: '847+', icon: Users },
  { label: 'Orders Completed', value: '8,500+', icon: Truck },
  { label: 'Farmer Price Share', value: '62%', icon: TrendingUp },
  { label: 'Avg Rating', value: '4.5★', icon: Star },
];

const features = [
  {
    icon: Sprout,
    title: 'Direct from Farm',
    desc: 'Eliminate middlemen. Buy directly from verified farmers and FPOs across India.',
  },
  {
    icon: Shield,
    title: 'Escrow Protection',
    desc: 'Your payment is held safely until delivery is confirmed. Both sides are protected.',
  },
  {
    icon: TrendingUp,
    title: 'Fair Pricing',
    desc: 'Real-time mandi price references ensure transparent, fair pricing for everyone.',
  },
  {
    icon: Truck,
    title: 'Tracked Delivery',
    desc: 'End-to-end logistics tracking from farm pickup to your doorstep.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRoleSelect = (role) => {
    login(role);
    router.push(`/${role}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #16a34a, #052e16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Leaf size={28} color="#4ade80" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Farm<span style={{ color: 'var(--green-400)' }}>Direct</span>
            </span>
          </div>

          <h1 className="landing-title">
            From Farm to Buyer,<br />
            <span className="highlight">No Middlemen.</span>
          </h1>

          <p className="landing-subtitle">
            The trusted marketplace connecting Indian farmers directly with retailers,
            restaurants, and consumers. Fresher produce, fairer prices, complete traceability.
          </p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center',
              marginBottom: '48px', padding: '20px 32px',
              background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)',
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--green-400)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 style={{
              fontSize: 'var(--text-xl)', fontWeight: 600,
              marginBottom: '24px', color: 'var(--text-secondary)',
            }}>
              Choose your portal to explore
            </h2>
            <div className="role-cards">
              <div className="role-card" onClick={() => handleRoleSelect('farmer')}>
                <div className="role-card-icon">🌾</div>
                <div className="role-card-title">I&apos;m a Farmer</div>
                <div className="role-card-desc">
                  List your produce, manage orders, track payments and see market prices.
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--green-400)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  Enter as Ramesh <ArrowRight size={16} />
                </div>
              </div>

              <div className="role-card" onClick={() => handleRoleSelect('buyer')}>
                <div className="role-card-icon">🛒</div>
                <div className="role-card-title">I&apos;m a Buyer</div>
                <div className="role-card-desc">
                  Browse produce, order directly from farmers, track deliveries and manage invoices.
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--green-400)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  Enter as Metro Fresh <ArrowRight size={16} />
                </div>
              </div>

              <div className="role-card" onClick={() => handleRoleSelect('admin')}>
                <div className="role-card-icon">⚙️</div>
                <div className="role-card-title">Admin Panel</div>
                <div className="role-card-desc">
                  Monitor platform health, verify KYC, moderate listings and resolve disputes.
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--green-400)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  Enter as Vikram <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center', fontSize: 'var(--text-3xl)', fontWeight: 800,
            marginBottom: 48, letterSpacing: '-0.02em',
          }}
        >
          Why <span style={{ color: 'var(--green-400)' }}>FarmDirect</span>?
        </motion.h2>
        <div className="grid-4" style={{ maxWidth: 1000, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ textAlign: 'center', padding: '32px 24px' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={24} color="#4ade80" />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px', textAlign: 'center',
        borderTop: '1px solid var(--border-primary)',
        color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Leaf size={18} color="var(--green-600)" />
          <span style={{ fontWeight: 700 }}>FarmDirect</span>
        </div>
        <p>Empowering farmers, connecting buyers. Built with ❤️ for Indian agriculture.</p>
        <p style={{ marginTop: 8, fontSize: 'var(--text-xs)' }}>
          © 2026 FarmDirect Technologies Pvt. Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
