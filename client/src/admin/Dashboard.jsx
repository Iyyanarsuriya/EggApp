import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Package, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    lowStockCount: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.getAllOrders(),
          api.getProducts(),
          api.getAllUsers()
        ]);

        const orders = ordersRes.orders || [];
        const products = productsRes.products || [];
        const users = usersRes.users || [];

        const totalRevenue = orders.reduce((sum, ord) => sum + Number(ord.total_amount || 0), 0);
        const lowStockCount = products.filter((p) => p.stock < 30).length;

        setMetrics({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: users.length,
          lowStockCount
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Error loading admin dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <Loader text="Loading Farm Admin Analytics..." />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-14 bg-page min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Admin Header & Nav Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-purple inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                <ShieldCheck size={14} /> Admin Headquarters
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark tracking-tight font-heading">
              Egg Shop Operations Center
            </h1>
          </div>

          {/* Quick Admin Tab Links */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
            <Link to="/admin" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors whitespace-nowrap">
              Dashboard Overview
            </Link>
            <Link to="/admin/products" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Manage Inventory
            </Link>
            <Link to="/admin/orders" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Order Fulfillment
            </Link>
            <Link to="/admin/users" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              User Accounts
            </Link>
          </div>
        </div>

        {/* Low stock alert banner */}
        {metrics.lowStockCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-amber-800">
              <AlertTriangle size={24} className="text-amber-600 flex-shrink-0" />
              <div className="text-sm sm:text-base">
                <strong className="font-bold">Stock Alert:</strong> {metrics.lowStockCount} egg {metrics.lowStockCount === 1 ? 'variety is' : 'varieties are'} running below 30 cartons.
              </div>
            </div>
            <Link to="/admin/products" className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-900 border border-amber-400 rounded-lg hover:bg-amber-100 transition-colors">
              Restock Now
            </Link>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {/* Card 1: Revenue */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Revenue
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark font-heading">
              ₹{metrics.totalRevenue.toFixed(0)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
              <TrendingUp size={14} /> +18.4% this week
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark font-heading">
              {metrics.totalOrders}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              All morning deliveries
            </div>
          </div>

          {/* Card 3: Products */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Egg Varieties
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Package size={20} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark font-heading">
              {metrics.totalProducts}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Across 6 farm categories
            </div>
          </div>

          {/* Card 4: Customers */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Registered Users
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-dark font-heading">
              {metrics.totalUsers}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Verified breakfast lovers
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark font-heading">Recent Customer Orders</h2>
              <p className="text-sm text-slate-500">Latest orders received for morning drop-offs</p>
            </div>
            <Link to="/admin/orders" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-primary-dark border border-primary/40 rounded-xl hover:bg-primary-light transition-colors">
              Manage All Orders <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-dark">#{ord.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-dark">{ord.user_name || 'Customer'}</div>
                      <div className="text-xs text-slate-400">{ord.user_email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-dark font-heading">
                      ₹{Number(ord.total_amount).toFixed(0)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ord.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.order_status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                        {ord.payment_method} ({ord.payment_status})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/admin/orders" className="inline-block px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
