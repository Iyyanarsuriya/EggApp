import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Truck, CreditCard, Banknote, QrCode, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Checkout = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { cartItems, cartSubtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const discountAmount = location.state?.discountAmount || 0;
  const finalPayable = Math.max(0, grandTotal - discountAmount);

  const cleanInitialPhone = (user?.phone || '').replace(/^\+91\s*/, '');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: cleanInitialPhone,
    shipping_address: user?.address || '',
    city: user?.city || 'Chennai',
    postal_code: user?.postal_code || '600028',
    delivery_slot: 'Morning (7:00 AM - 10:00 AM)',
    payment_method: 'COD',
    notes: 'Please deliver fresh morning cartons.'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Your basket is empty</h2>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-md"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: cleanDigits });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.shipping_address || !formData.city || !formData.postal_code || !formData.phone) {
      setError('Please provide complete delivery details');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/checkout' } });
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url
        })),
        shipping_address: formData.shipping_address,
        city: formData.city,
        postal_code: formData.postal_code,
        phone: formData.phone ? `+91 ${formData.phone}` : '',
        payment_method: formData.payment_method,
        delivery_slot: formData.delivery_slot,
        notes: formData.notes
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        clearCart();
        navigate('/my-orders', { state: { newOrderId: res.order.id } });
      } else {
        setError(res.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Basket
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading mb-1">
          Secure Checkout
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mb-8">
          Schedule fresh delivery directly from regional pasture co-operatives
        </p>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-8 flex items-center justify-between flex-wrap gap-4 shadow-sm">
            <div>
              <strong className="text-amber-900 font-bold block text-sm sm:text-base">Already have an account?</strong>
              <div className="text-xs sm:text-sm text-amber-800 mt-0.5">
                Sign in to use your saved addresses and track live orders.
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login', '/checkout')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Sign In Now
            </button>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Delivery & Payment Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Delivery Address Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5 font-heading flex items-center gap-2">
                  <Truck size={20} className="text-primary" /> 1. Delivery Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                        Contact Mobile Number
                      </label>
                      <div className="flex items-stretch">
                        <span className="inline-flex items-center gap-1 px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl font-semibold text-xs sm:text-sm text-slate-700 select-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                        Delivery Time Slot
                      </label>
                      <select
                        name="delivery_slot"
                        value={formData.delivery_slot}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="Morning (7:00 AM - 10:00 AM)">Morning (7:00 AM - 10:00 AM)</option>
                        <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                        <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                      Street Address / Door No.
                    </label>
                    <input
                      type="text"
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. No. 42, 2nd Main Road, Gandhi Nagar"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                        City / Town
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. Chennai"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                        Postal PIN Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        maxLength={6}
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="e.g. 600028"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="e.g. Ring bell, leave on front porch"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5 font-heading flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" /> 2. Payment Method
                </h3>

                <div className="flex flex-col gap-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      formData.payment_method === 'COD'
                        ? 'border-primary bg-amber-500/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === 'COD'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Banknote size={24} className="text-amber-700 shrink-0" />
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-900">Cash on Delivery (COD)</div>
                      <div className="text-xs text-slate-500">Pay upon receiving your fresh egg carton</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      formData.payment_method === 'UPI'
                        ? 'border-primary bg-amber-500/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="UPI"
                      checked={formData.payment_method === 'UPI'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <QrCode size={24} className="text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-900">UPI / Instant Digital Pay</div>
                      <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, BHIM UPI</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      formData.payment_method === 'CARD'
                        ? 'border-primary bg-amber-500/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="CARD"
                      checked={formData.payment_method === 'CARD'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <CreditCard size={24} className="text-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-900">Credit or Debit Card / Net Banking</div>
                      <div className="text-xs text-slate-500">RuPay, Visa, MasterCard, Indian Banks</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-5 font-heading">
                Items in Order
              </h3>

              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto mb-6 pr-1 divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-primary">{item.quantity}x</span>
                      <span className="max-w-[170px] truncate text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{(Number(item.price) * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Fee breakdown */}
              <div className="border-t border-slate-200 pt-4 flex flex-col gap-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">₹{cartSubtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cold-Chain Delivery</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
                  <span className="font-bold text-base sm:text-lg text-slate-900 font-heading">Total to Pay</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                    ₹{finalPayable.toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark active:scale-[0.99] shadow-md hover:shadow-lg transition-all text-sm sm:text-base mt-6 mb-4 disabled:opacity-50"
              >
                {loading ? 'Confirming Harvest Order...' : 'Confirm & Place Order'}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>100% Satisfaction or Freshness Replacement</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
