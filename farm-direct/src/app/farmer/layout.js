'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Package, TrendingUp, Wallet, User, Leaf } from 'lucide-react';

const navItems = [
  { href: '/farmer', icon: Home, label: 'Home' },
  { href: '/farmer/listings/new', icon: PlusCircle, label: 'New' },
  { href: '/farmer/orders', icon: Package, label: 'Orders', badge: true },
  { href: '/farmer/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/farmer/profile', icon: User, label: 'Profile' },
];

export default function FarmerLayout({ children }) {
  const pathname = usePathname();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      {/* Top header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-4)',
        borderBottom: '1px solid var(--border-primary)',
        position: 'sticky', top: 0, background: 'var(--bg-primary)',
        zIndex: 50, backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #16a34a, #052e16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={16} color="#4ade80" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
            Farm<span style={{ color: 'var(--green-400)' }}>Direct</span>
          </span>
        </div>
        <Link href="/farmer/prices" style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 'var(--text-xs)', color: 'var(--green-400)', fontWeight: 600,
          padding: '6px 12px', borderRadius: 'var(--radius-full)',
          background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
        }}>
          <TrendingUp size={14} /> Prices
        </Link>
      </header>

      {/* Page content */}
      <main className="page-with-bottom-nav" style={{ padding: 'var(--space-4)' }}>
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const isActive = item.href === '/farmer'
            ? pathname === '/farmer'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
