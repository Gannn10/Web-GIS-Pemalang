import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy loading Pages
const Home = lazy(() => import('./pages/Home'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Login = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const DetailWisata = lazy(() => import('./pages/DetailWisata'));

// Komponen untuk melindungi Route Admin (Harus Login)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Jika tidak ada token, tendang kembali ke halaman login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Fallback Loading Component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container font-sans text-gray-800">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Halaman Publik */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<MapPage />} />
            <Route path="/wisata/:id" element={<DetailWisata />} />

            {/* Halaman Admin */}
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