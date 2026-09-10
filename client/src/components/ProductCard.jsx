import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Plus, Check, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const packPcs = parseInt(product.pack_size, 10) || 1;
  const rawPieceRate = Number(product.price) / packPcs;
  const perPieceRate = rawPieceRate % 1 === 0 ? rawPieceRate.toFixed(0) : rawPieceRate.toFixed(2);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative group">
      {/* Image & Badges */}
      <Link
        to={`/products/${product.id}`}
        className="relative block h-[210px] overflow-hidden bg-slate-100"
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/90 backdrop-blur-xs text-amber-800 shadow-xs">
            {product.category}
          </span>
          {product.is_featured ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/90 backdrop-blur-xs text-emerald-800 shadow-xs">
              Top Pick
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-2.5 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
          {product.pack_size}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-dark">{product.rating || '4.9'}</span>
            <span className="text-slate-400 text-xs">({product.num_reviews || '24'})</span>
            <span className={`ml-auto text-xs font-semibold ${product.stock > 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-dark font-heading leading-snug group-hover:text-primary-dark transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer info: Price & Actions (Buy Option before Add to Cart) */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 gap-2">
          <div className="shrink-0">
            <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-amber-700">
              Per Piece
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-dark font-heading leading-tight">
              ₹{perPieceRate} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">/ pc</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              ₹{Number(product.price).toFixed(0)} ({product.pack_size})
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Buy Option (Before Add to Cart) */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Instant Buy Now"
            >
              <Zap size={14} className="fill-current" />
              <span>Buy</span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 ${
                added
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              } ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Add to cart"
            >
              {added ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="hidden xs:inline">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
