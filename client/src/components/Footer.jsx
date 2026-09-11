import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Clock, Sparkles, CheckCircle2, Phone } from 'lucide-react';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800 pt-12 sm:pt-16 pb-10 mt-12 sm:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 sm:pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-primary flex-shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Laid Within 24 Hours</h4>
              <p className="text-slate-400 text-xs">Direct from regional pasture co-ops</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">0% Hormones & Antibiotics</h4>
              <p className="text-slate-400 text-xs">100% natural, vegetarian fed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-primary flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cold-Chain Delivery</h4>
              <p className="text-slate-400 text-xs">Carefully cushioned, zero breakages</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Freshness Guaranteed</h4>
              <p className="text-slate-400 text-xs">Instant replacement or refund</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 sm:py-12 border-b border-slate-800">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🥚</span>
              <span className="font-extrabold text-2xl text-white font-heading tracking-tight">
                Egg<span className="text-primary">Haven</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              Connecting wholesome family poultry farms with breakfast tables. Sourced ethically, tested stringently, delivered chilled and fresh.
            </p>
            <div className="inline-flex items-center gap-2 text-amber-200 text-xs font-semibold">
              <Heart size={15} className="fill-rose-500 text-rose-500" />
              <span>Nourishing over 15,000+ healthy homes</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-4 font-heading">Egg Collections</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li><Link to="/products?category=Country+Hen" className="hover:text-amber-300 transition-colors">Country Hen Eggs | நாட்டுக் கோழி முட்டை</Link></li>
              <li><Link to="/products?category=White+Egg" className="hover:text-amber-300 transition-colors">Farm White Eggs | பண்ணை வெள்ளை முட்டை</Link></li>
              <li><Link to="/products?category=Duck+Egg" className="hover:text-amber-300 transition-colors">Duck Eggs | பண்ணை வாத்து முட்டை</Link></li>
              <li><Link to="/products?category=Quail+Egg" className="hover:text-amber-300 transition-colors">Quail Eggs | காடை முட்டை</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-4 font-heading">Customer Care</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <a
                  href="tel:9489761481"
                  className="inline-flex items-center gap-2 text-amber-300 font-bold hover:text-amber-200 transition-colors"
                >
                  <Phone size={14} /> +91 9489761481
                </a>
              </li>
              <li><Link to="/my-orders" className="hover:text-amber-300 transition-colors">Track Your Order</Link></li>
              <li><a href="#faq" className="hover:text-amber-300 transition-colors">Egg Storage & Shelf-Life</a></li>
              <li><a href="#farms" className="hover:text-amber-300 transition-colors">Our Partner Poultry Farms</a></li>
              <li><a href="#contact" className="hover:text-amber-300 transition-colors">Wholesale & Restaurant Supply</a></li>
              <li><a href="#terms" className="hover:text-amber-300 transition-colors">Refund & Quality Guarantee</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-2 font-heading">Fresh Farm Updates</h4>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed">
              Subscribe to get exclusive morning harvest discounts and protein meal recipes.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs sm:text-sm">
                <CheckCircle2 size={18} className="flex-shrink-0" />
                <span>You're subscribed to harvest alerts!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Egg Haven Inc. All rights reserved. Crafted with care for wholesome wellness.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Security: 256-Bit SSL Encrypted</span>
            <span>Food Safety Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
