'use client';
import { platformStats } from '@/data/prices';
import { TrendingUp, Users, ShoppingCart, Package, IndianRupee, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function formatCurrency(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + ' L';
  return '₹' + n.toLocaleString('en-IN');
}

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#6b7280'];

const kpis = [
  { label: 'Monthly GMV', value: formatCurrency(platformStats.monthlyGMV), change: '+18%', up: true, icon: IndianRupee },
  { label: 'Active Farmers', value: platformStats.activeFarmers.toString(), change: '+12%', up: true, icon: Users },
  { label: 'Monthly Orders', value: platformStats.monthlyOrders.toLocaleString(), change: '+15%', up: true, icon: Package },
  { label: 'Farmer Price Share', value: platformStats.avgFarmerPriceShare + '%', change: '+3%', up: true, icon: TrendingUp },
  { label: 'Repeat Order Rate', value: platformStats.repeatOrderRate + '%', change: '+5%', up: true, icon: ShoppingCart },
  { label: 'Dispute Rate', value: platformStats.disputeRate + '%', change: '-0.3%', up: false, icon: AlertTriangle },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Dashboard</h1>
          <p className="page-subtitle">Overview of FarmDirect marketplace health</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--status-complete-bg)', borderRadius: 'var(--radius-full)' }}>
          <Activity size={14} color="var(--status-complete)" />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-complete)' }}>All systems operational</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-3 stagger-children" style={{ marginBottom: 'var(--space-8)' }}>
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} className="kpi-card" whileHover={{ scale: 1.02 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="kpi-label">{kpi.label}</span>
              <kpi.icon size={18} color="var(--text-tertiary)" />
            </div>
            <span className="kpi-value">{kpi.value}</span>
            <span className={`kpi-change ${kpi.up && kpi.label !== 'Dispute Rate' ? 'kpi-change-up' : !kpi.up && kpi.label !== 'Dispute Rate' ? 'kpi-change-down' : kpi.label === 'Dispute Rate' ? 'kpi-change-up' : ''}`}>
              {kpi.change} this month
            </span>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        {/* GMV Trend */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>GMV Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={platformStats.gmvTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={v => formatCurrency(v)} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
                formatter={(v) => [formatCurrency(v), 'GMV']}
              />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trend */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Order Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={platformStats.ordersTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid-2">
        {/* Top Crops */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Top Crops by GMV</h3>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={platformStats.topCrops} dataKey="gmv" nameKey="crop" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {platformStats.topCrops.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              {platformStats.topCrops.map((c, i) => (
                <div key={c.crop} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{c.crop}</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(c.gmv)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {platformStats.recentActivity.map(a => {
              const iconMap = { order: '🛒', listing: '📦', payment: '💰', dispute: '⚠️', kyc: '🪪' };
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ fontSize: 'var(--text-base)' }}>{iconMap[a.type]}</span>
                  <div style={{ flex: 1 }}>
                    <span>{a.message}</span>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
