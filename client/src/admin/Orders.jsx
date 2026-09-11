import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle2, Clock, Truck, XCircle, Search, Filter, ShieldCheck, MapPin } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.getAllOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, { order_status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'All' || ord.order_status === filterStatus;
    const matchesSearch =
      ord.id.toString().includes(searchTerm) ||
      (ord.user_name && ord.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ord.shipping_address && ord.shipping_address.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-8 md:py-14 bg-page min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                Admin Orders
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark tracking-tight font-heading">
              Order Fulfillment & Logistics
            </h1>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
            <Link to="/admin" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <Link to="/admin/daily-prices" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Rates
            </Link>
            <Link to="/admin/products" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Manage Inventory
            </Link>
            <Link to="/admin/orders" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors whitespace-nowrap">
              Order Fulfillment
            </Link>
            <Link to="/admin/users" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              User Accounts
            </Link>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <Loader text="Loading live orders..." />
        ) : filteredOrders.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-center gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg sm:text-xl font-bold text-dark font-heading">
                        Order #{ord.id}
                      </h3>
                      <span className="text-xs text-slate-400">
                        Placed on {new Date(ord.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
                      <MapPin size={15} className="text-primary flex-shrink-0" />
                      <span>{ord.shipping_address}, {ord.city} ({ord.postal_code}) • Tel: {ord.phone}</span>
                    </div>
                  </div>

                  {/* Status Dropdown Controller */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Fulfillment:
                    </span>
                    <select
                      value={ord.order_status}
                      disabled={updatingId === ord.id}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border bg-white outline-none cursor-pointer ${
                        ord.order_status === 'Delivered' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' :
                        ord.order_status === 'Processing' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                        ord.order_status === 'Shipped' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' :
                        ord.order_status === 'Cancelled' ? 'border-rose-500 text-rose-700 bg-rose-50' :
                        'border-amber-500 text-amber-700 bg-amber-50'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing / Packed</option>
                      <option value="Shipped">Shipped in Van</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items & Financial Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 items-center">
                  {/* Items List */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Carton Items
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-700">
                          <span><strong className="text-dark">{it.quantity}x</strong> {it.name}</span>
                          <span className="text-slate-500 font-medium">₹{(Number(it.price) * it.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer and Delivery Notes */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs sm:text-sm space-y-1">
                    <div className="text-slate-700">
                      <strong className="text-slate-900">Recipient:</strong> {ord.user_name} ({ord.user_email || 'No email provided'})
                    </div>
                    <div className="text-slate-700">
                      <strong className="text-slate-900">Slot:</strong> {ord.delivery_slot}
                    </div>
                    {ord.notes && (
                      <div className="text-amber-800 bg-amber-100/60 p-2 rounded-lg mt-1.5">
                        <strong>Notes:</strong> {ord.notes}
                      </div>
                    )}
                  </div>

                  {/* Payment & Total */}
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment ({ord.payment_method})
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-dark font-heading my-1">
                      ₹{Number(ord.total_amount).toFixed(0)}
                    </div>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ord.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <h3 className="text-lg font-bold text-dark mb-1">No matching orders found</h3>
            <p className="text-sm text-slate-500">Try choosing a different status filter or clearing search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
