import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const {
    cartItems,
    cartCount,
    totalEggs,
    freeDeliveryThresholdEggs = 30,
    isFreeDelivery,
    cartSubtotal,
    deliveryFee,
    grandTotal,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'EGGFRESH10') {
      setDiscountPercent(10);
      setCouponMessage('Coupon applied! 10% discount added.');
    } else {
      setCouponMessage('Invalid coupon code. Try EGGFRESH10');
      setDiscountPercent(0);
    }
  };

  const discountAmount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2));
  const finalTotal = Math.max(0, Number((grandTotal - discountAmount).toFixed(2)));

  const remainingEggsForFreeDelivery = Math.max(0, freeDeliveryThresholdEggs - totalEggs);
  const progressPercent = Math.min(100, Math.round((totalEggs / freeDeliveryThresholdEggs) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6 text-amber-700">
            <ShoppingBag size={38} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 font-heading">
            Your Basket is Empty
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm sm:text-base">
            Looks like you haven't added any fresh farm eggs to your basket yet. Explore our delicious varieties!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
          >
            Browse Farm Eggs <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Clear Action */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading mb-1">
              Shopping Basket
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              You have {cartCount} {cartCount === 1 ? 'carton' : 'cartons'} in your basket
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-semibold text-xs sm:text-sm transition-colors py-1.5 px-3 rounded-lg hover:bg-rose-50"
          >
            <Trash2 size={16} /> Clear Basket
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2 flex-wrap gap-2">
            <div>
              {isFreeDelivery ? (
                <span className="text-emerald-600 inline-flex items-center gap-1.5 font-bold">
                  <CheckCircle2 size={18} /> You unlocked FREE delivery! ({totalEggs} eggs in basket) • 30+ முட்டைகள் இலவச டெலிவரி
                </span>
              ) : (
                <span className="text-slate-700">
                  Add <strong className="text-slate-900">{remainingEggsForFreeDelivery} more egg{remainingEggsForFreeDelivery > 1 ? 's' : ''}</strong> for <strong className="text-emerald-600">FREE Delivery</strong> (Above 30 Eggs) • 30 முட்டைகளுக்கு மேல் இலவசம்
                </span>
              )}
            </div>
            <span className="text-slate-500 font-medium">
              {totalEggs} / 30 Eggs ({progressPercent}%)
            </span>
          </div>

          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isFreeDelivery ? 'bg-emerald-500' : 'bg-primary'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-bold text-sm transition-colors"
              >
                <ArrowLeft size={16} /> Continue Shopping Eggs
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5 font-heading">
              Order Summary
            </h3>

            {/* Subtotals */}
            <div className="flex flex-col gap-3.5 mb-6 text-sm sm:text-base">
              <div className="flex justify-between text-slate-600">
                <span>Carton Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal.toFixed(0)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Cold-Chain Delivery</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
                <span className="font-bold text-base sm:text-lg text-slate-900 font-heading">Total Amount</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  ₹{finalTotal.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. EGGFRESH10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase tracking-wider"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <div className={`text-xs mt-2 font-semibold ${discountPercent > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {couponMessage}
                </div>
              )}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout', { state: { discountPercent, discountAmount, finalTotal } })}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark active:scale-[0.99] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base mb-4"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Safe Checkout • Freshness Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
