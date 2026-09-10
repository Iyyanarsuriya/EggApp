import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Key, User, Phone, MapPin, ShieldAlert, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const {
    authModalOpen,
    authModalView,
    authRedirectPath,
    closeAuthModal,
    switchAuthView,
    login,
    register
  } = useAuth();

  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: 'Chennai',
    postal_code: '600028'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset errors on view or modal open change
  useEffect(() => {
    setError('');
  }, [authModalView, authModalOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setRegisterData({ ...registerData, phone: cleanDigits });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(loginEmail, loginPassword);
      closeAuthModal();
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else if (authRedirectPath) {
        navigate(authRedirectPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (registerData.phone && registerData.phone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...registerData,
        phone: registerData.phone ? `+91 ${registerData.phone}` : ''
      };
      const newUser = await register(payload);
      closeAuthModal();
      if (newUser.role === 'admin') {
        navigate('/admin');
      } else if (authRedirectPath) {
        navigate(authRedirectPath);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div
        className={`relative w-full ${
          authModalView === 'signup' ? 'max-w-lg' : 'max-w-md'
        } bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-8 text-left transition-all duration-300 transform`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header & Segmented Tab Switcher */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            {authModalView === 'signup' ? <UserPlus size={24} /> : <LogIn size={24} />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
            {authModalView === 'signup' ? 'Create an Account' : 'Welcome to Egg Haven'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {authModalView === 'signup'
              ? 'Join to order fresh farm eggs directly to your home'
              : 'Sign in to access your orders and fast checkout'}
          </p>

          {/* Segmented Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mt-5">
            <button
              type="button"
              onClick={() => switchAuthView('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                authModalView === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchAuthView('signup')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                authModalView === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-4 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {authModalView === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md hover:shadow-lg transition-all text-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Account'}
            </button>

            <div className="text-center text-xs text-slate-500 pt-2">
              New to Egg Haven?{' '}
              <button
                type="button"
                onClick={() => switchAuthView('signup')}
                className="text-primary hover:text-primary-dark font-bold underline transition-colors"
              >
                Create an account
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="e.g. Karthik Raja"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Mobile (10 Digits)
                </label>
                <div className="flex items-stretch">
                  <span className="inline-flex items-center gap-1 px-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl font-semibold text-xs text-slate-700 select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  placeholder="Door no, Street, Landmark"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={registerData.city}
                  onChange={handleRegisterChange}
                  placeholder="Chennai"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  maxLength={6}
                  value={registerData.postal_code}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      postal_code: e.target.value.replace(/\D/g, '').slice(0, 6)
                    })
                  }
                  placeholder="600028"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md hover:shadow-lg transition-all text-sm mt-3 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create My Account'}
            </button>

            <div className="text-center text-xs text-slate-500 pt-1">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchAuthView('login')}
                className="text-primary hover:text-primary-dark font-bold underline transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
