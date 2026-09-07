import axios from 'axios';
import type { Category, Product, CreateProductPayload, AdminUser } from '../types';

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'https://swastik-backend.onrender.com';
const STORAGE_KEY_TOKEN = 'swastik_admin_token';
const STORAGE_KEY_USER = 'swastik_admin_user';
const STORAGE_KEY_API_URL = 'swastik_admin_api_url';

export const getBaseUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_API_URL;
};

export const setBaseUrl = (url: string) => {
  localStorage.setItem(STORAGE_KEY_API_URL, url.replace(/\/+$/, ''));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_USER);
};

export const getStoredUser = (): AdminUser | null => {
  const data = localStorage.getItem(STORAGE_KEY_USER);
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (user: AdminUser) => {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
};

export const apiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// API Service making live HTTP calls to Swastik Django Backend
export const apiService = {
  // 1. Dedicated Admin Login (POST /api/auth/admin/login/)
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    try {
      const res = await apiClient.post('/api/auth/admin/login/', { email, password });
      const { token, user } = res.data;
      setAuthToken(token);
      setStoredUser(user);
      return { token, user };
    } catch (err: any) {
      // Fallback to customer login endpoint if admin endpoint returns 404
      if (err.response?.status === 404) {
        const res = await apiClient.post('/api/auth/login/', { email, password });
        const { token, user } = res.data;
        setAuthToken(token);
        setStoredUser(user);
        return { token, user };
      }
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Please check your credentials.';
      throw new Error(message);
    }
  },

  // 2. Get Logged In Profile (GET /api/auth/me/)
  async getProfile(): Promise<AdminUser> {
    const res = await apiClient.get<AdminUser>('/api/auth/me/');
    setStoredUser(res.data);
    return res.data;
  },

  // 3. Logout (POST /api/auth/logout/)
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout/');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      removeAuthToken();
    }
  },

  // 4. Categories (GET /api/admin/categories/ or /api/categories/)
  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get<Category[]>('/api/admin/categories/');
      if (Array.isArray(res.data)) return res.data;
    } catch (err: any) {
      // If admin endpoint not permitted or 404, fallback to public categories list
      const publicRes = await apiClient.get<Category[]>('/api/categories/');
      if (Array.isArray(publicRes.data)) return publicRes.data;
    }
    return [];
  },

  // 5. Products List with Query Filters (GET /api/admin/products/ or /api/products/)
  async getProducts(params?: {
    sector?: string;
    category?: number;
    search?: string;
    in_stock?: boolean;
    subcategory?: string;
  }): Promise<Product[]> {
    const cleanParams: Record<string, any> = {};
    if (params?.sector && params.sector !== 'ALL') cleanParams.sector = params.sector;
    if (params?.category) cleanParams.category = params.category;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params?.in_stock !== undefined) cleanParams.in_stock = params.in_stock;
    if (params?.subcategory) cleanParams.subcategory = params.subcategory;

    try {
      const res = await apiClient.get<Product[]>('/api/admin/products/', { params: cleanParams });
      if (Array.isArray(res.data)) return res.data;
    } catch (err: any) {
      const res = await apiClient.get<Product[]>('/api/products/', { params: cleanParams });
      if (Array.isArray(res.data)) return res.data;
    }
    return [];
  },

  // 6. Get Single Product (GET /api/products/:id/)
  async getProduct(id: number): Promise<Product> {
    const res = await apiClient.get<Product>(`/api/products/${id}/`);
    return res.data;
  },

  // 7. Admin Create Product (POST /api/admin/products/)
  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const cleanPayload = {
      ...payload,
      category: Number(payload.category),
      image: payload.image?.trim() ? payload.image.trim() : null,
    };
    try {
      const res = await apiClient.post<Product>('/api/admin/products/', cleanPayload);
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.data && typeof err.response.data === 'object'
          ? Object.entries(err.response.data)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join(' | ')
          : null) ||
        err.message ||
        'Failed to create product on server.';
      throw new Error(message);
    }
  },

  // 8. Admin Update Product (PATCH /api/admin/products/:id/)
  async updateProduct(id: number, payload: Partial<CreateProductPayload>): Promise<Product> {
    const cleanPayload = {
      ...payload,
      ...(payload.category !== undefined ? { category: Number(payload.category) } : {}),
      ...(payload.image !== undefined ? { image: payload.image?.trim() ? payload.image.trim() : null } : {}),
    };
    try {
      const res = await apiClient.patch<Product>(`/api/admin/products/${id}/`, cleanPayload);
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.data && typeof err.response.data === 'object'
          ? Object.entries(err.response.data)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join(' | ')
          : null) ||
        err.message ||
        'Failed to update product on server.';
      throw new Error(message);
    }
  },

  // 9. Admin Delete Product (DELETE /api/admin/products/:id/)
  async deleteProduct(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/products/${id}/`);
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Failed to delete product on server.';
      throw new Error(message);
    }
  },

  // 10. Health Check (GET /health/ or GET /)
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const res = await apiClient.get('/health/');
      return res.data;
    } catch {
      const rootRes = await apiClient.get('/');
      return rootRes.data;
    }
  },
};
