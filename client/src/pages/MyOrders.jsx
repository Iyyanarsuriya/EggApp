import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight, Calendar, MapPin } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const MyOrders = () => {
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'processing':
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getTimelineStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <Loader text="Loading your farm order history..." />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner if just placed order */}
        {newOrderId && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-8 flex items-center gap-4 shadow-sm">
            <div className="text-emerald-600 shrink-0">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-emerald-900 font-bold text-sm sm:text-base mb-0.5">
                Order #{newOrderId} Placed Successfully!
              </h3>
              <p className="text-emerald-800 text-xs sm:text-sm">
                Your order has been transmitted to our poultry co-op. Your eggs will be hand-inspected and packed for scheduled morning delivery.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-2">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading mb-1">
            My Egg Deliveries
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Track the live progress of your farm-fresh morning orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">No Orders Found</h3>
            <p className="text-slate-500 text-sm sm:text-base mb-6">
              You haven't ordered any pasture-raised eggs yet. Start your morning right!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-md text-sm sm:text-base"
            >
              Browse Egg Varieties <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const currentStep = getTimelineStep(order.order_status);

              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-center gap-4 pb-5 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                          Order #{order.id}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeStyle(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </div>
                      <div className="flex gap-4 text-slate-500 text-xs sm:text-sm mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} /> {order.delivery_slot || 'Morning (7:00 AM - 10:00 AM)'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-auto sm:ml-0">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                        Total Paid
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                        ₹{Number(order.total_amount).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Timeline Tracker */}
                  <div className="my-6 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { step: 1, label: 'Order Received' },
                        { step: 2, label: 'Candled & Packed' },
                        { step: 3, label: 'Out in Chilled Van' },
                        { step: 4, label: 'Delivered Fresh' }
                      ].map((s) => {
                        const isDone = currentStep >= s.step;
                        return (
                          <div key={s.step} className="flex flex-col items-center text-center gap-1.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isDone ? '✓' : s.step}
                            </div>
                            <span className={`text-xs ${isDone ? 'font-bold text-slate-900' : 'text-slate-500 font-medium'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex flex-col gap-3 divide-y divide-slate-100">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="pt-3 first:pt-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=150&q=80'}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Qty: {item.quantity} × ₹{Number(item.price).toFixed(0)}
                            </div>
                          </div>
                        </div>

                        <div className="font-extrabold text-xs sm:text-sm text-slate-900 font-heading">
                          ₹{(Number(item.price) * item.quantity).toFixed(0)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination Info */}
                  <div className="mt-5 pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-500 flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} className="text-primary shrink-0" />
                      Delivering to: <strong className="text-slate-900">{order.shipping_address}, {order.city}</strong>
                    </span>
                    <span>
                      Payment: <strong className="text-slate-900">{order.payment_method} ({order.payment_status})</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
