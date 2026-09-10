import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Plus, Minus, Check, ArrowLeft, Award, Zap, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.getProductById(id);
        if (res.success) {
          setProduct(res.product);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24">
        <Loader text="Loading egg details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Product not found</h2>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-md"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to all egg varieties
        </Link>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Left Column - Big Image Card */}
          <div>
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md relative group">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-72 sm:h-96 md:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-sm shadow-sm">
                  {product.category}
                </span>
                {product.is_featured ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-sm shadow-sm">
                    Farm Favorite
                  </span>
                ) : null}
              </div>
            </div>

            {/* Farm Guarantees Mini Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4 sm:mt-6">
              <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                <div className="text-emerald-600 mb-1.5 flex justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">UV Cleaned</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">0% Pathogens</div>
              </div>

              <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                <div className="text-amber-500 mb-1.5 flex justify-center">
                  <Award size={22} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">High Protein</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">6-7g per egg</div>
              </div>

              <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                <div className="text-blue-600 mb-1.5 flex justify-center">
                  <Truck size={22} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Cushion Pack</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Zero breakage</div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details & Purchase */}
          <div>
            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-sm sm:text-base text-slate-900">{product.rating}</span>
              <span className="text-slate-500 text-xs sm:text-sm">
                ({product.num_reviews} verified customer reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight font-heading">
              {product.name}
            </h1>

            {/* Price & Pack Size */}
            {(() => {
              const packPcs = parseInt(product.pack_size, 10) || 1;
              const rawPieceRate = Number(product.price) / packPcs;
              const perPieceRate = rawPieceRate % 1 === 0 ? rawPieceRate.toFixed(0) : rawPieceRate.toFixed(2);

              return (
                <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <div className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-amber-700 mb-0.5">
                      Per Piece Rate
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                        ₹{perPieceRate}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        / piece
                      </span>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
                    Pack of {product.pack_size} • ₹{Number(product.price).toFixed(0)}
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ml-auto ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Sold Out'}
                  </span>
                </div>
              );
            })()}

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-heading">Harvest & Farm Notes</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Nutrition Facts Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8">
              <div className="font-bold text-xs sm:text-sm mb-3 text-slate-900 font-heading">
                Average Nutritional Profile (Per 50g Egg):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs">Protein</div>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base">6.3 g</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs">Calories</div>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base">72 kcal</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs">Vitamin D</div>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base">44 IU (11%)</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-xs">Omega-3</div>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base">180 mg</div>
                </div>
              </div>
            </div>

            {/* Quantity and Actions Row (Buy Option before Add to Cart) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              {/* Stepper */}
              <div className="inline-flex items-center justify-between sm:justify-start border-2 border-slate-200 rounded-xl bg-white shadow-sm shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-l-xl"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 py-2 font-bold text-base sm:text-lg min-w-[48px] text-center text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors rounded-r-xl disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Buy Now Option (Before Add to Cart) */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-[0.99] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={19} className="fill-current" />
                Buy Now • ₹{(Number(product.price) * quantity).toFixed(0)}
              </button>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-5 rounded-xl font-bold active:scale-[0.99] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  added
                    ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-400'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check size={19} className="text-emerald-700" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={19} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Extra assurance */}
            <div className="flex items-center gap-2 text-emerald-700 text-xs sm:text-sm font-semibold mt-4">
              <Check size={16} /> Eligible for next morning cold-chain drop-off.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
