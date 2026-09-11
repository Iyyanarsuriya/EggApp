import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Clock, Edit3, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DailyPriceCard = () => {
  const { isAdmin } = useAuth();
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await api.getDailyPrices();
      if (res.success && res.dailyPrices) {
        setDailyData(res.dailyPrices);
      }
    } catch (err) {
      console.error('Failed to load daily egg prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={13} className="text-emerald-600" />;
    if (trend === 'down') return <TrendingDown size={13} className="text-rose-600" />;
    return <Minus size={13} className="text-slate-400" />;
  };

  const getTrendBadge = (item) => {
    if (item.trend === 'up') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {getTrendIcon('up')} {item.change && item.change !== '0.00' ? item.change : '+₹0.10'}
        </span>
      );
    }
    if (item.trend === 'down') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {getTrendIcon('down')} {item.change && item.change !== '0.00' ? item.change : '-₹0.10'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
        {getTrendIcon('steady')} Steady
      </span>
    );
  };

  if (loading && !dailyData) {
    return (
      <div className="pt-6 sm:pt-8 border-t border-slate-200/80 mt-8 sm:mt-10 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200/70 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const getCategorySortRank = (item) => {
    const text = `${item.category || ''} ${item.name || ''}`.toLowerCase();
    if (text.includes('white')) return 1;
    if (text.includes('country') || text.includes('nattu')) return 2;
    if (text.includes('duck')) return 3;
    if (text.includes('quail') || text.includes('kaada') || text.includes('kada')) return 4;
    return 5;
  };

  const items = [...(dailyData?.items || [])].sort((a, b) => getCategorySortRank(a) - getCategorySortRank(b));

  return (
    <div className="pt-6 sm:pt-8 border-t border-slate-200/80 mt-8 sm:mt-10">
      {/* Live Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          {/* Pulsing Live Beacon */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-dark font-heading">
            Live Daily Farm Price
          </span>
          <span className="text-xs text-slate-400 font-normal hidden xs:inline">|</span>
          <span className="text-xs font-semibold text-amber-700 hidden xs:inline">
            இன்றைய சந்தை விலை
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-slate-500 bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
            <Clock size={12} className="text-primary-dark" /> {formatDate(dailyData?.date)}
          </span>

          {isAdmin && (
            <Link
              to="/admin/daily-prices"
              title="Update Today's Rates (Admin)"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-full transition-colors shadow-2xs"
            >
              <Edit3 size={12} /> Edit Rates
            </Link>
          )}
        </div>
      </div>

      {/* Grid of Variety Live Price Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white/90 hover:bg-white rounded-2xl p-3 sm:p-3.5 border border-amber-200/70 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Icon & Trend */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-lg sm:text-xl transform group-hover:scale-110 transition-transform">
                  {item.icon || '🥚'}
                </span>
                {getTrendBadge(item)}
              </div>

              {/* Egg Variety Name */}
              <div className="text-xs sm:text-sm font-bold text-dark leading-tight line-clamp-1">
                {item.name}
              </div>
              {item.tamil_name && (
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">
                  {item.tamil_name}
                </div>
              )}
            </div>

            {/* Price section */}
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-extrabold text-primary-dark font-heading">
                  ₹{Number(item.price_per_piece).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">/ pc</span>
              </div>

              <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center justify-between">
                <span>Tray (30):</span>
                <span className="font-bold text-slate-700">₹{Math.round(item.price_per_tray || item.price_per_piece * 30)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Source Subtext */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
          <span>
            {dailyData?.note || 'Official farm gate & Namakkal NECC benchmark rates updated daily.'}
          </span>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 font-bold text-primary-dark hover:text-primary transition-colors ml-auto"
        >
          Order At Fresh Rates <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default DailyPriceCard;
