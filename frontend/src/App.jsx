import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages (Pastikan path ini sesuai dengan struktur folder kamu)
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import DetailWisata from './pages/DetailWisata';

// Komponen untuk melindungi Route Admin (Harus Login)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Jika tidak ada token, tendang kembali ke halaman login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container font-sans text-gray-800">
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
      </div>
    </Router>
  );
}

export default App;