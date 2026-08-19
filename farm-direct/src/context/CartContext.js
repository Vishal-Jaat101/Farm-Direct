'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((listing, quantity) => {
    setItems(prev => {
      const existing = prev.find(i => i.listingId === listing.id);
      if (existing) {
        return prev.map(i =>
          i.listingId === listing.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, {
        listingId: listing.id,
        farmerId: listing.farmerId,
        crop: listing.crop,
        variety: listing.variety,
        unitPrice: listing.price,
        unit: listing.unit,
        quantity,
        image: listing.images?.[0],
        grade: listing.grade,
      }];
    });
  }, []);

  const updateQuantity = useCallback((listingId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.listingId !== listingId));
    } else {
      setItems(prev => prev.map(i =>
        i.listingId === listingId ? { ...i, quantity } : i
      ));
    }
  }, []);

  const removeItem = useCallback((listingId) => {
    setItems(prev => prev.filter(i => i.listingId !== listingId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totalAmount, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
