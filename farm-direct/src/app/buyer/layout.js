'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Home, Search, ShoppingCart, Package, Heart, CreditCard, LogOut, Leaf, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/buyer', icon: Home, label: 'Browse' },
  { href: '/buyer/orders', icon: Package, label: 'Orders' },
  { href: '/buyer/favorites', icon: Heart, label: 'Saved' },
  { href: '/buyer/payments', icon: CreditCard, label: 'Payments' },
];

export default function BuyerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Leaf size={20} color="#4ade80" />
          </div>
          <div className="sidebar-logo-text">Farm<span>Direct</span></div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Marketplace</div>
          {navItems.map((item) => {
            const isActive = item.href === '/buyer'
              ? pathname === '/buyer'
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/buyer/cart"
            className={`sidebar-link ${pathname === '/buyer/cart' ? 'active' : ''}`}
          >
            <ShoppingCart size={18} />
            Cart
            {itemCount > 0 && <span className="link-badge">{itemCount}</span>}
          </Link>
        </div>

        <div className="sidebar-spacer" />

        {/* User profile */}
        {user && (
          <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div className="avatar">{user.name.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{user.type === 'institutional' ? user.businessType : 'Consumer'}</div>
              </div>
            </div>
            <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%' }}>
              <LogOut size={18} /> Switch Role
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="page-with-sidebar" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
