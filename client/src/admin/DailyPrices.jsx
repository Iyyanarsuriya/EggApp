import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Calendar,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const DailyPrices = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [marketTrend, setMarketTrend] = useState('Steady');
  const [items, setItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [updatedBy, setUpdatedBy] = useState('');

  const getCategorySortRank = (item) => {
    const text = `${item?.category || ''} ${item?.name || ''}`.toLowerCase();
    if (text.includes('white')) return 1;
    if (text.includes('country') || text.includes('nattu')) return 2;
    if (text.includes('duck')) return 3;
    if (text.includes('quail') || text.includes('kaada') || text.includes('kada')) return 4;
    return 5;
  };

  const sortItems = (itemList = []) => {
    return [...itemList].sort((a, b) => getCategorySortRank(a) - getCategorySortRank(b));
  };

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await api.getDailyPrices();
      if (res.success && res.dailyPrices) {
        const d = res.dailyPrices;
        setDate(d.date || new Date().toISOString().split('T')[0]);
        setNote(d.note || '');
        setMarketTrend(d.market_trend || 'Steady');
        setItems(sortItems(d.items || []));
        setLastUpdated(d.last_updated || '');
        setUpdatedBy(d.updated_by || '');
      }
    } catch (err) {
      console.error('Error fetching live rates for admin:', err);
      setFeedback({ type: 'error', message: 'Failed to load rates.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item[field] = value;

      // Auto-recalculate tray rate if piece price changes
      if (field === 'price_per_piece') {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          item.price_per_tray = Math.round(num * 30);
        }
      }

      updated[index] = item;
      return updated;
    });
  };

  const addItem = () => {
    const newItem = {
      id: `egg_${Date.now()}`,
      name: 'Special Farm Egg',
      tamil_name: 'சிறப்பு பண்ணை முட்டை',
      category: 'Country Hen',
      price_per_piece: 10.0,
      price_per_tray: 300.0,
      tray_size: '30 pcs',
      change: '0.00',
      trend: 'steady',
      icon: '🥚'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) {
      alert('You must keep at least one egg variety.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await api.updateDailyPrices({
        date,
        note,
        market_trend: marketTrend,
        items
      });

      if (res.success) {
        setFeedback({ type: 'success', message: "Live everyday prices updated and published to homepage!" });
        setLastUpdated(res.dailyPrices.last_updated);
        setUpdatedBy(res.dailyPrices.updated_by);
        setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      }
    } catch (err) {
      console.error('Error updating live rates:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to update rates.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Sync rates directly from database products catalog?')) {
      try {
        setLoading(true);
        const res = await api.getProducts();
        if (res.success && res.products) {
          const categoryMap = new Map();
          res.products.forEach((p) => {
            if (!categoryMap.has(p.category)) {
              categoryMap.set(p.category, p);
            }
          });

          const derivedItems = Array.from(categoryMap.values()).map((p) => {
            const packPcs = parseInt(p.pack_size, 10) || 1;
            const pieceRate = Number((Number(p.price) / packPcs).toFixed(2));
            const trayRate = Math.round(pieceRate * 30);
            const nameParts = p.name.split('|');
            const englishName = nameParts[0]?.trim() || p.name;
            const tamilName = nameParts[1]?.trim() || '';

            return {
              id: `egg_${p.id}`,
              name: englishName,
              tamil_name: tamilName,
              category: p.category,
              price_per_piece: pieceRate,
              price_per_tray: trayRate,
              tray_size: '30 pcs',
              change: '0.00',
              trend: 'steady',
              icon: p.category.toLowerCase().includes('country') ? '🐓' :
                    p.category.toLowerCase().includes('white') ? '🥚' :
                    p.category.toLowerCase().includes('duck') ? '🦆' :
                    p.category.toLowerCase().includes('quail') ? '🪺' : '🥚'
            };
          });

          setDate(new Date().toISOString().split('T')[0]);
          setNote('Live Farm Gate Wholesale & Retail Benchmark Rates');
          setMarketTrend('Steady');
          setItems(sortItems(derivedItems));
        }
      } catch (err) {
        console.error('Error resetting from products:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <Loader text="Loading Live Egg Prices..." />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-14 bg-page min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Admin Header & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-purple inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                <ShieldCheck size={14} /> Admin Headquarters
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark tracking-tight font-heading">
              Daily Live Egg Prices / சந்தை விலை
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage everyday live market egg rates displayed on the customer storefront.
            </p>
          </div>

          {/* Admin Nav Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
            <Link to="/admin" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <Link to="/admin/daily-prices" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span> Live Rates
            </Link>
            <Link to="/admin/products" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Inventory
            </Link>
            <Link to="/admin/orders" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Orders
            </Link>
            <Link to="/admin/users" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Users
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl mb-6 flex items-center gap-3 border shadow-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
            )}
            <div className="text-sm sm:text-base font-semibold">{feedback.message}</div>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left 2 Columns: Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Meta Settings */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                  <h2 className="text-lg sm:text-xl font-bold text-dark font-heading flex items-center gap-2">
                    <Calendar size={18} className="text-primary-dark" /> Market Session & Benchmark
                  </h2>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50"
                  >
                    <RotateCcw size={13} /> Sync from DB Products
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Rate Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-semibold text-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Overall Market Trend
                    </label>
                    <select
                      value={marketTrend}
                      onChange={(e) => setMarketTrend(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-semibold text-dark bg-white"
                    >
                      <option value="Rising">Rising ▲ (விலை உயர்வு)</option>
                      <option value="Steady">Steady = (சீரான விலை)</option>
                      <option value="Falling">Falling ▼ (விலை குறைவு)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Market Announcement & Sourcing Note
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Namakkal NECC Benchmark & Farm Gate Wholesale / Retail Rate"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-dark"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Appears under the rates widget on the homepage to build customer trust.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Variety Rates Table/Editor */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-dark font-heading flex items-center gap-2">
                      <DollarSign size={20} className="text-emerald-600" /> Egg Varieties & Pricing
                    </h2>
                    <p className="text-xs text-slate-500">
                      Set piece rate, 30-egg tray rate, and today's market fluctuation trend.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary-dark bg-primary-light/70 hover:bg-primary-light rounded-xl transition-colors border border-primary/20"
                  >
                    <Plus size={14} /> Add Egg Variety
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.icon || '🥚'}
                            onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                            className="w-9 h-9 text-center text-lg rounded-lg border border-slate-300 bg-white"
                            title="Variety Emoji Icon"
                          />
                          <div>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              placeholder="Variety Name"
                              className="font-bold text-sm text-dark bg-transparent border-b border-dashed border-slate-300 focus:border-primary focus:outline-none"
                            />
                            <input
                              type="text"
                              value={item.tamil_name || ''}
                              onChange={(e) => handleItemChange(index, 'tamil_name', e.target.value)}
                              placeholder="Tamil Label (e.g. வெள்ளை முட்டை)"
                              className="block text-xs text-slate-500 bg-transparent border-b border-dashed border-transparent hover:border-slate-300 focus:border-primary focus:outline-none mt-0.5"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          title="Remove variety"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {/* Price per piece */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                            Price / Egg (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
                            <input
                              type="number"
                              step="0.05"
                              min="0"
                              value={item.price_per_piece}
                              onChange={(e) => handleItemChange(index, 'price_per_piece', e.target.value)}
                              required
                              className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-sm font-extrabold text-dark focus:ring-2 focus:ring-primary/40 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Price per tray */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                            Tray Price (30 pcs)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={item.price_per_tray}
                              onChange={(e) => handleItemChange(index, 'price_per_tray', e.target.value)}
                              required
                              className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-dark focus:ring-2 focus:ring-primary/40 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Trend Direction */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                            Trend
                          </label>
                          <select
                            value={item.trend || 'steady'}
                            onChange={(e) => handleItemChange(index, 'trend', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-dark focus:ring-2 focus:ring-primary/40 focus:outline-none"
                          >
                            <option value="up">▲ Up</option>
                            <option value="steady">= Steady</option>
                            <option value="down">▼ Down</option>
                          </select>
                        </div>

                        {/* Change Amount */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                            Change (e.g. +0.10)
                          </label>
                          <input
                            type="text"
                            value={item.change || ''}
                            onChange={(e) => handleItemChange(index, 'change', e.target.value)}
                            placeholder="+0.10 / 0.00"
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-dark focus:ring-2 focus:ring-primary/40 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  to="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  <Eye size={16} /> View on Storefront
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm sm:text-base shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-60"
                >
                  <Save size={18} /> {saving ? 'Publishing...' : 'Save & Publish Live Rates'}
                </button>
              </div>
            </div>

            {/* Right Column: Live Storefront Preview */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" /> Live Preview for Customers
                  </span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 shadow-xs">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-extrabold uppercase text-dark font-heading">
                        Live Daily Farm Price
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {date}
                    </span>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {items.map((item, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{item.icon}</span>
                          <span className={`text-[10px] font-bold px-1 rounded ${
                            item.trend === 'up' ? 'text-emerald-700 bg-emerald-50' :
                            item.trend === 'down' ? 'text-rose-700 bg-rose-50' : 'text-slate-500 bg-slate-100'
                          }`}>
                            {item.change || '0.00'}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-dark line-clamp-1">{item.name}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{item.tamil_name}</div>
                        <div className="text-sm font-extrabold text-primary-dark font-heading mt-1">
                          ₹{Number(item.price_per_piece).toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">/pc</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Tray: ₹{Math.round(item.price_per_tray || item.price_per_piece * 30)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-500 leading-tight">
                    {note || 'Namakkal NECC Benchmark & Farm Gate Wholesale / Retail Rate'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700">Last Published:</span>{' '}
                    {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Just now'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Updated By:</span> {updatedBy || 'Admin'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyPrices;
