import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const totalItemPrice = (Number(item.price) * item.quantity).toFixed(2);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-sm transition-shadow">
      {/* Product Image & Info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-[200px]">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xl border border-slate-200 flex-shrink-0"
        />
        <div>
          <h4 className="text-base font-bold text-dark font-heading leading-tight mb-1">
            {item.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              {item.pack_size || '12 pcs'}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              ₹{Number(item.price).toFixed(0)} each
            </span>
          </div>
        </div>
      </div>

      {/* Quantity Selector & Item Total */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed border-slate-200">
        {/* Counter */}
        <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50/70 overflow-hidden shadow-2xs">
          <button
            onClick={handleDecrement}
            className="p-2 sm:px-2.5 text-slate-700 hover:bg-slate-200/70 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="px-3 py-1 font-bold text-sm sm:text-base text-dark min-w-[28px] text-center font-heading">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.stock && item.quantity >= item.stock}
            className="p-2 sm:px-2.5 text-slate-700 hover:bg-slate-200/70 transition-colors disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total */}
        <div className="min-w-[70px] text-right">
          <div className="text-lg sm:text-xl font-extrabold text-dark font-heading">
            ₹{totalItemPrice}
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Remove from cart"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
