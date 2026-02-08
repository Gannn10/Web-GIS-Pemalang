/**
 * =========================================
 * API SERVICE (FINAL SKRIPSI VERSION)
 * =========================================
 * Jembatan penghubung antara Frontend React & Backend Express
 */

import axios from 'axios';

// 1. SETUP AXIOS INSTANCE
const api = axios.create({
    // Mengambil URL dari file .env (jika ada), kalau tidak pakai localhost default
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000, // 10 detik timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. REQUEST INTERCEPTOR (Pasang Token Admin Otomatis)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Tempelkan token di Header setiap kali request ke backend
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR (Handle Error Global)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika Error 401 (Unauthorized/Token Expired)
        if (error.response?.status === 401) {
            // Hapus token lama & paksa logout (opsional, hati-hati redirect loop)
            // localStorage.removeItem('token');
            // window.location.href = '/admin/login'; 
        }
        return Promise.reject(error);
    }
);

/**
 * =========================================
 * WISATA SERVICES
 * =========================================
 */
export const wisataService = {
    // Ambil Semua Wisata (Bisa juga terima params untuk search/filter manual)
    getAll: (params) => api.get('/wisata', { params }),

    // Ambil Wisata Terdekat (Fitur Utama PostGIS)
    // Params: lat, lon, radius (meter)
    getTerdekat: (lat, lon, radius = 5000) => 
        api.get('/wisata/terdekat', { 
            params: { lat, lon, radius } 
        }),

    // Ambil Detail 1 Wisata
    getById: (id) => api.get(`/wisata/${id}`),

    // Cari Wisata (Menggunakan endpoint getAll dengan param keyword)
    search: (keyword) => 
        api.get('/wisata', { 
            params: { keyword } 
        }),

    // Filter Kategori (Menggunakan endpoint getAll dengan param kategori_id)
    filterByCategory: (kategori_id) => 
        api.get('/wisata', { 
            params: { kategori_id } 
        }),

    // --- ADMIN CRUD ---
    create: (data) => api.post('/wisata', data),
    update: (id, data) => api.put(`/wisata/${id}`, data),
    delete: (id) => api.delete(`/wisata/${id}`),
};

/**
 * =========================================
 * KATEGORI SERVICES
 * =========================================
 */
export const kategoriService = {
    // Ambil daftar kategori + jumlah wisatanya
    getAll: () => api.get('/kategori'),
    
    // Ambil detail kategori
    getById: (id) => api.get(`/kategori/${id}`),
};

/**
 * =========================================
 * AUTH SERVICES (LOGIN ADMIN)
 * =========================================
 */
export const authService = {
    // Login Admin
    login: (username, password) => 
        api.post('/auth/login', { username, password }),

    // Cek User saya siapa (berdasarkan token)
    getMe: () => api.get('/auth/me'),

    // Logout (Client side only)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

/**
 * =========================================
 * HAVERSINE SERVICES (MANUAL CALCULATION)
 * =========================================
 * Hanya dipakai jika Anda ingin membandingkan PostGIS vs Manual di Skripsi
 */
export const haversineService = {
    // Ambil rekomendasi pakai rumus manual JS
    getRecommendations: (lat, lon) => 
        api.get('/haversine', { 
            params: { lat, lon } 
        }),
};

export default api;