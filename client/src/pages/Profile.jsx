import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser, logout, isAdmin } = useAuth();

  const cleanInitialPhone = (user?.phone || '').replace(/^\+91\s*/, '');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: cleanInitialPhone,
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || ''
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: cleanDigits });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    if (formData.phone && formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        phone: formData.phone ? `+91 ${formData.phone}` : ''
      };
      const res = await api.updateProfile(payload);
      if (res.success) {
        updateUser(res.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-2">
            Account Settings
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading mb-1">
            Customer Profile
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Update your delivery addresses and contact information for future egg drops
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-amber-50/60 to-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8 flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl sm:text-2xl font-extrabold shadow-md shrink-0 font-heading">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">{user?.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isAdmin ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {user?.role || 'Customer'}
                </span>
              </div>
              <div className="text-slate-500 text-xs sm:text-sm mt-0.5">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 ml-auto sm:ml-0">
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ShoppingBag size={15} /> My Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ShieldCheck size={15} /> Admin Portal
              </Link>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 font-heading">
            Personal & Delivery Information
          </h3>

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <Check size={18} className="text-emerald-600 shrink-0" />
              <span>Profile details saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
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
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Email Address (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Default Shipping Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. No. 42, 2nd Cross, Gandhi Nagar"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Chennai"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="600028"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold text-xs sm:text-sm transition-colors py-2 px-3 rounded-lg hover:bg-rose-50 order-2 sm:order-1"
              >
                <LogOut size={16} /> Sign Out of Account
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark active:scale-[0.99] shadow-md hover:shadow-lg transition-all text-xs sm:text-sm disabled:opacity-50 order-1 sm:order-2"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
