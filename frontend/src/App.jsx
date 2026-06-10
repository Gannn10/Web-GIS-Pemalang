import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/**
 * ============================================================================
 * 1. LAZY LOADING COMPONENTS
 * ============================================================================
 * Menggunakan fitur lazy loading agar halaman hanya di-download (di-render) 
 * saat user mengunjunginya. Ini membuat loading awal aplikasi menjadi super cepat.
 */
const Home = lazy(() => import('./pages/Home'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Login = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const DetailWisata = lazy(() => import('./pages/DetailWisata'));

/**
 * ============================================================================
 * 2. PROTECTED ROUTE (PENGAMAN HALAMAN ADMIN)
 * ============================================================================
 * Komponen ini bertugas mencegat siapa saja yang mencoba masuk ke halaman /admin.
 * Jika tidak punya 'token' (belum login), akan otomatis ditendang ke /admin/login.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

/**
 * ============================================================================
 * 3. FALLBACK LOADER (ANIMASI LOADING TRANSISI)
 * ============================================================================
 * Tampilan yang muncul sementara saat halaman Lazy Load sedang dalam proses download.
 */
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

/**
 * ============================================================================
 * 4. KOMPONEN UTAMA (APP ROUTER)
 * ============================================================================
 */
function App() {
  return (
    <Router>
      <div className="app-container font-sans text-gray-800">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* --- RUTE PUBLIK (Bisa diakses siapa saja) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<MapPage />} />
            <Route path="/wisata/:id" element={<DetailWisata />} />

            {/* --- RUTE ADMIN (Khusus Pengelola) --- */}
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;