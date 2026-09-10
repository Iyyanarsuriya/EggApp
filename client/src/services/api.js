const API_URL = import.meta.env.VITE_API_URL || '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('egg_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with the request');
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (userData) => request('/users/profile', { method: 'PUT', body: userData }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.featured) query.append('featured', 'true');
    if (params.sort) query.append('sort', params.sort);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${queryString}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (data) => request('/products', { method: 'POST', body: data }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: orderData }),
  getMyOrders: () => request('/orders/myorders'),
  getOrderById: (id) => request(`/orders/${id}`),
  getAllOrders: () => request('/orders'),
  updateOrderStatus: (id, statusData) => request(`/orders/${id}/status`, { method: 'PUT', body: statusData }),

  // Users (Admin)
  getAllUsers: () => request('/users'),
  updateUserRole: (id, role) => request(`/users/${id}/role`, { method: 'PUT', body: { role } })
};

export default api;
