import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sun } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import DailyPriceCard from '../components/DailyPriceCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.getProducts({ featured: true });
        if (res.success) {
          setFeaturedProducts(res.products);
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const categories = [
    { name: 'Country Hen', label: 'Country Egg', tamil: 'நாட்டுக் கோழி முட்டை', desc: '100% Free-Range Nattu Kozhi', icon: '🐓', count: '10 & 30 Packs' },
    { name: 'White Egg', label: 'White Egg', tamil: 'வெள்ளைக் கோழி முட்டை', desc: 'Fresh Daily Farm Table Protein', icon: '🥚', count: '12 & 30 Packs' },
    { name: 'Duck Egg', label: 'Duck Egg', tamil: 'பண்ணை வாத்து முட்டை', desc: 'Rich & Creamy Gourmet Taste', icon: '🦆', count: '6 Pcs Carton' },
    { name: 'Quail Egg', label: 'Quail Egg', tamil: 'சத்து நிறைந்த காடை முட்டை', desc: 'High Mineral Superfood', icon: '🪺', count: '18 Pcs Pack' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50/70 via-amber-50/30 to-page py-12 sm:py-20 lg:py-24 border-b border-slate-200/60 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Column Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-900 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-5 border border-amber-300/60 shadow-2xs">
                <Sun size={16} className="text-amber-600" /> Direct from Certified Pastures
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-[1.15] font-heading mb-5">
                Real Farm-Fresh Eggs, with Rich <span className="text-primary-dark underline decoration-amber-300 underline-offset-4">Golden Yolks</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Sourced exclusively from happy, cage-free and pasture-foraged birds. Hand-inspected, chilled to perfection, and delivered to your doorstep within 24 hours of harvest.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm sm:text-base shadow-md shadow-primary/20 transition-all active:scale-95"
                >
                  Explore Fresh Varieties <ArrowRight size={18} />
                </Link>
                <Link
                  to="/products?category=Country+Hen"
                  className="inline-flex items-center px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base border border-slate-200 transition-all shadow-xs"
                >
                  Country Hen / நாட்டுக் கோழி
                </Link>
              </div>

              {/* Live Everyday Egg Price (Managed by Admin) */}
              <DailyPriceCard />
            </div>

            {/* Right Column Image & Floating Cards */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 border-4 sm:border-6 border-white bg-slate-100">
                <img
                  src="/images/white_egg.png"
                  alt="Fresh farm white eggs"
                  className="w-full h-[240px] sm:h-[340px] lg:h-[420px] object-cover"
                />

                {/* Floating Badge 1 */}
                <div className="absolute top-3 sm:top-5 left-3 sm:left-5 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-lg border border-white/60 flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">🥚</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-dark leading-tight">Pure White Farm Eggs</div>
                    <div className="text-[10px] sm:text-xs text-slate-500">Clean daily fitness protein</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-lg border border-white/60 flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-dark leading-tight">100% Tested Safe</div>
                    <div className="text-[10px] sm:text-xs text-slate-500">UV cleaned & candled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
              Curated Farm Selections
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark font-heading tracking-tight mb-2">
              Choose Your Fresh Morning Harvest
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              From robust free-range heritage eggs to chef-grade quail eggs and jumbo catering cartons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center flex flex-col items-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-dark font-heading mb-0.5">
                  {cat.label || cat.name}
                </h3>
                <div className="text-xs sm:text-sm text-primary-dark font-bold mb-2">
                  {cat.tamil}
                </div>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                  {cat.desc}
                </p>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-slate-50/70 border-y border-slate-200/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-2">
                Featured Harvest
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-dark font-heading tracking-tight">Customer Favorites</h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary-dark font-bold text-xs sm:text-sm hover:bg-primary-light transition-colors"
            >
              View All 8 Varieties <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader text="Fetching today's farm collection..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Standard */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
              Farm to Fork Integrity
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark font-heading tracking-tight mb-2">
              Why Egg Haven Eggs Taste Better
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Standard grocery store eggs can be 3 to 6 weeks old before reaching the shelf. We operate a direct cold-chain network that delivers eggs laid yesterday.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-5 flex-shrink-0">
                <Feather size={26} />
              </div>
              <h3 className="text-lg font-bold text-dark font-heading mb-2">
                Ethical Pasture Roaming
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our partner hens graze openly under natural sunlight with unlimited access to fresh clover, wild seeds, and clean spring water.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 flex-shrink-0">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-lg font-bold text-dark font-heading mb-2">
                Natural Diets Only
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Zero synthetic food dyes, zero antibiotics, and zero growth hormones. Certified wholesome grains supplemented with cold-pressed flaxseed.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 flex-shrink-0">
                <Truck size={26} />
              </div>
              <h3 className="text-lg font-bold text-dark font-heading mb-2">
                Protected Cold-Chain
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Custom molded eco-pulp trays keep temperature consistent and protect shells during quick local transit directly to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Callout */}
      <section className="pb-12 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 lg:p-14 text-white flex flex-wrap items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-amber-300 text-amber-900 uppercase tracking-wider mb-3">
                Breakfast Elevated
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight mb-3">
                Taste the Golden Yolk Difference This Morning.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Order before 9:00 PM for fresh morning delivery by 7:00 AM. 100% dedicated pure egg farm network. Free delivery on orders above 30 eggs (30 முட்டைகளுக்கு மேல் இலவச டெலிவரி).
              </p>
            </div>

            <div>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-md shadow-primary/30 transition-all active:scale-95"
              >
                Shop Fresh Cartons Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
