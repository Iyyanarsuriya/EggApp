import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, ShieldCheck, UserCheck, Search, Check } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.getAllUsers();
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await api.updateUserRole(userId, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
      setFeedback(`User #${userId} role updated to ${nextRole}`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.city && u.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-8 md:py-14 bg-page min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                Admin User Accounts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark tracking-tight font-heading">
              Registered Customers & Staff
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
            <Link to="/admin/orders" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
              Order Fulfillment
            </Link>
            <Link to="/admin/users" className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors whitespace-nowrap">
              User Accounts
            </Link>
          </div>
        </div>

        {feedback && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-semibold">
            <Check size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Search Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, email, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Total Users: <span className="text-dark font-bold">{users.length}</span>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <Loader text="Loading user directory..." />
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[580px] text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4 text-right">Role Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-dark">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-500">{u.phone || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {u.city ? `${u.city} (${u.postal_code || ''})` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          {u.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
