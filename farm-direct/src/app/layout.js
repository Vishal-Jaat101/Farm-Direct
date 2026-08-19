import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'FarmDirect — Farm to Buyer Marketplace',
  description: 'FarmDirect connects farmers directly with buyers, eliminating middlemen for fairer prices and fresher produce. Browse, order, and track farm-fresh produce across India.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
