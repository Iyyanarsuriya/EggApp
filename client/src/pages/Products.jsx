import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

// Default visual metadata for known egg categories
const categoryMeta = {
  'All': { label: 'All Eggs', tamil: 'அனைத்து முட்டைகள்', img: '/images/white_egg.png' },
  'White Egg': { label: 'White Egg', tamil: 'வெள்ளை முட்டை', img: '/images/white_egg.png' },
  'Country Hen': { label: 'Country Egg', tamil: 'நாட்டுக் கோழி', img: '/images/country_egg.png' },
  'Duck Egg': { label: 'Duck Egg', tamil: 'வாத்து முட்டை', img: '/images/duck_egg.jpg' },
  'Quail Egg': { label: 'Quail Egg', tamil: 'காடை முட்டை', img: '/images/quail_egg.jpg' }
};

const Products = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Used to extract all DB categories dynamically
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch all products once to dynamically extract categories present in DB
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const res = await api.getProducts();
        if (res.success) {
          setAllProducts(res.products || []);
        }
      } catch (e) {
        console.error('Error fetching categories overview:', e);
      }
    };
    loadAllProducts();
  }, []);

  // Fetch filtered products from database
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortBy && sortBy !== 'default') {
        params.sort = sortBy;
      }

      const res = await api.getProducts(params);
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Error fetching database products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProducts();
  };

  const handleCategoryClick = (catKey) => {
    setSelectedCategory(catKey);
    if (catKey === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catKey });
    }
  };

  // Build dynamic categories list from database records
  const dynamicCategories = useMemo(() => {
    const counts = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const list = [
      {
        key: 'All',
        label: 'All Eggs',
        tamil: 'அனைத்து முட்டைகள்',
        img: '/images/white_egg.png',
        count: allProducts.length
      }
    ];

    // Get unique categories found in the database
    const dbCategories = Object.keys(counts);
    dbCategories.forEach((cat) => {
      const meta = categoryMeta[cat] || {
        label: cat,
        tamil: '',
        img: '/images/country_egg.png'
      };
      list.push({
        key: cat,
        label: meta.label || cat,
        tamil: meta.tamil || '',
        img: meta.img || '/images/white_egg.png',
        count: counts[cat]
      });
    });

    return list;
  }, [allProducts]);

  return (
    <div className="py-6 sm:py-10 md:py-14 bg-page min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Page Title & Controls */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                Live Farm Catalog
              </span>
              {isAdmin && (
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-full border border-purple-200 transition-colors"
                >
                  <ShieldCheck size={13} /> Manage DB Items
                </Link>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark font-heading tracking-tight mb-2">
              Fresh Egg Varieties
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
              Real-time inventory direct from our cooperative pastures. Graded, sanitized, and packed fresh.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <Plus size={16} /> Add New Egg Variety
            </Link>
          )}
        </div>

        {/* Search & Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by variety name, pack size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40 text-dark bg-slate-50/50"
            />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                Find
              </button>
            )}
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal size={13} /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="default">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Dynamically populated from DB categories) */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 mb-6 sm:mb-8 border-b border-slate-200/80 scrollbar-none">
          {dynamicCategories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 border-2 border-primary shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-amber-400/60 shadow-2xs shrink-0"
                />
                <span>{cat.label}</span>
                {cat.tamil && (
                  <span className="text-[11px] sm:text-xs opacity-75 font-normal">
                    ({cat.tamil})
                  </span>
                )}
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid - Displaying all real database values */}
        {loading ? (
          <Loader text="Loading fresh eggs from database inventory..." />
        ) : products.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5 text-xs sm:text-sm text-slate-500 font-semibold">
              <div>
                Showing <span className="text-dark font-extrabold">{products.length}</span> {products.length === 1 ? 'variety' : 'varieties'} in stock
              </div>
              <div className="text-[11px] text-slate-400">
                Direct from live database inventory
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="text-4xl mb-3">🥚</div>
            <h3 className="text-xl font-bold text-dark font-heading mb-1.5">No Eggs Found in Database</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              No products match your current filters or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSortBy('default');
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-xs transition-all active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
