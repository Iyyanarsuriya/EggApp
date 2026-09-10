import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('egg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('egg_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            product_id: product.id,
            name: product.name,
            price: Number(product.price),
            pack_size: product.pack_size,
            image_url: product.image_url,
            category: product.category,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock || 99)
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock || 99) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // Helper to calculate total physical eggs in the cart based on pack size (e.g., 6, 10, 12, 18, 30 pcs)
  const getEggCountPerItem = (packSize) => {
    if (!packSize) return 12;
    const match = packSize.toString().match(/\d+/);
    return match ? parseInt(match[0], 10) : 12;
  };

  const totalEggs = cartItems.reduce(
    (acc, item) => acc + getEggCountPerItem(item.pack_size) * item.quantity,
    0
  );

  const freeDeliveryThresholdEggs = 30;
  const isFreeDelivery = totalEggs >= freeDeliveryThresholdEggs || cartItems.length === 0;
  const deliveryFee = isFreeDelivery ? 0 : 40.0;
  const grandTotal = cartSubtotal + deliveryFee;

  const value = {
    cartItems,
    cartCount,
    totalEggs,
    freeDeliveryThresholdEggs,
    isFreeDelivery,
    cartSubtotal: Number(cartSubtotal.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
