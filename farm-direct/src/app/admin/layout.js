'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, UserCheck, ListChecks, AlertTriangle, LogOut, Leaf, Shield } from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/kyc', icon: UserCheck, label: 'KYC Queue', badge: 2 },
  { href: '/admin/listings', icon: ListChecks, label: 'Listings' },
  { href: '/admin/disputes', icon: AlertTriangle, label: 'Disputes', badge: 2 },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Leaf size={20} color="#4ade80" />
          </div>
          <div className="sidebar-logo-text">Farm<span>Direct</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-full)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', width: 'fit-content' }}>
          <Shield size={12} color="#f87171" />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#f87171' }}>Admin Panel</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Operations</div>
          {navItems.map(item => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                {item.label}
                {item.badge && <span className="link-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </div>

        <div className="sidebar-spacer" />

        {user && (
          <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div className="avatar">{user.name.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{user.department}</div>
              </div>
            </div>
            <button className="sidebar-link" onClick={() => { logout(); router.push('/'); }} style={{ width: '100%' }}>
              <LogOut size={18} /> Switch Role
            </button>
          </div>
        )}
      </aside>
      <main className="page-with-sidebar" style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
