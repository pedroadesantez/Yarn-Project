const API_BASE = '/api'

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    const config = {
      credentials: 'include', // Send cookies with requests
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Auth endpoints
  auth = {
    register: (data) => this.post('/auth/register', data),
    login: (data) => this.post('/auth/login', data),
    logout: () => this.post('/auth/logout'),
    me: () => this.get('/auth/me'),
    updateProfile: (data) => this.put('/auth/profile', data),
  }

  // Products endpoints
  products = {
    list: (params) => {
      const query = new URLSearchParams(params).toString()
      return this.get(`/products${query ? `?${query}` : ''}`)
    },
    detail: (id) => this.get(`/products/${id}`),
    addReview: (productId, review) => this.post(`/products/${productId}/reviews`, review),
  }

  // Cart endpoints
  cart = {
    view: () => this.get('/cart'),
    add: (item) => this.post('/cart', item),
    update: (item) => this.put('/cart', item),
  }

  // Wishlist endpoints
  wishlist = {
    add: (productId) => this.post('/wishlist', { productId }),
    remove: (productId) => this.delete(`/wishlist?productId=${productId}`),
  }

  // Orders endpoints
  orders = {
    list: () => this.get('/orders'),
    checkout: (data) => this.post('/orders/checkout', data),
    pay: (orderId, paymentData) => this.post(`/orders/${orderId}/pay`, paymentData),
    track: (orderId) => this.get(`/orders/${orderId}`),
  }

  // Categories
  categories = {
    list: () => this.get('/categories'),
  }

  // Blog
  blog = {
    list: () => this.get('/posts'),
    detail: (id) => this.get(`/posts/${id}`),
  }

  // FAQs
  faqs = {
    list: () => this.get('/faqs'),
  }

  // Admin endpoints
  admin = {
    analytics: () => this.get('/admin/analytics'),
    products: {
      upsert: (product) => this.post('/admin/products', product),
      delete: (id) => this.delete(`/admin/products/${id}`),
    },
    categories: {
      list: () => this.get('/admin/categories'),
      create: (category) => this.post('/admin/categories', category),
    },
    coupons: {
      list: () => this.get('/admin/coupons'),
      create: (coupon) => this.post('/admin/coupons', coupon),
    },
    blog: {
      list: () => this.get('/admin/posts'),
      create: (post) => this.post('/admin/posts', post),
    },
    users: {
      list: () => this.get('/admin/users'),
    },
    orders: {
      list: () => this.get('/admin/orders'),
      updateStatus: (orderId, status) => this.put(`/admin/orders/${orderId}`, { status }),
    },
    settings: {
      get: () => this.get('/admin/settings'),
      update: (settings) => this.put('/admin/settings', settings),
    },
    upload: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return this.request('/admin/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    },
  }
}

export const api = new APIClient()
export default api
