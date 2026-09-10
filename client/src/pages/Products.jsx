import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const categories = [
  { key: 'All', label: 'All Eggs', tamil: 'அனைத்து முட்டைகள்', img: '/images/white_egg.png' },
  { key: 'White Egg', label: 'White Egg', tamil: 'வெள்ளை முட்டை', img: '/images/white_egg.png' },
  { key: 'Country Hen', label: 'Country Egg', tamil: 'நாட்டுக் கோழி', img: '/images/country_egg.png' },
  { key: 'Duck Egg', label: 'Duck Egg', tamil: 'வாத்து முட்டை', img: '/images/duck_egg.jpg' },
  { key: 'Quail Egg', label: 'Quail Egg', tamil: 'காடை முட்டை', img: '/images/quail_egg.jpg' }
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({
          category: selectedCategory
        });
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Show each tab one image only based on the selected tab
  // If 'All', show 1 representative product for each category tab
  // If a specific category tab is selected, show 1 product only for that tab
  const displayedProducts = selectedCategory === 'All'
    ? Array.from(
        products.reduce((map, p) => {
          if (!map.has(p.category)) {
            map.set(p.category, p);
          }
          return map;
        }, new Map()).values()
      )
    : products.slice(0, 1);

  return (
    <div className="py-8 sm:py-14 bg-page min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Page Title & Intro */}
        <div className="mb-8 sm:mb-10">
          <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider mb-2">
            Daily Harvest Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark font-heading tracking-tight mb-2">
            All Fresh Egg Collections
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl">
            Browse our fresh range of daily white table eggs, free-range country eggs, duck eggs, and speckled quail eggs delivered straight to your door.
          </p>
        </div>



        {/* Category Filter Pills with Tab Egg Thumbnail Image */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-200/80 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 border-2 border-primary shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-6 h-6 rounded-full object-cover border border-amber-400/60 shadow-2xs shrink-0"
                />
                <span>{cat.label}</span>
                <span className="text-xs opacity-75 font-normal">
                  ({cat.tamil})
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid - Displaying one image only based on tab */}
        {loading ? (
          <Loader text="Selecting pristine eggs from co-op storage..." />
        ) : displayedProducts.length > 0 ? (
          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-5">
              Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'variety' : 'varieties'} (1 image based on tab)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="text-4xl mb-3">🥚</div>
            <h3 className="text-xl font-bold text-dark font-heading mb-1.5">No Eggs Matched Your Search</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Try clearing your filters or search keywords to view all our varieties.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
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
