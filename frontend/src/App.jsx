import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout & Components
import Header from './components/Layout/Header';
import Taskbar from './components/Layout/Taskbar';
import Footer from './components/Layout/Footer';
import MapComponent from './components/Map/MapContainer';
import SearchPanel from './components/Search/SearchPanel';
import LocationPanel from './components/Location/LocationPanel';
import CategoryFilterPanel from './components/Filter/CategoryFilterPanel';

// Import Halaman Admin
import Login from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard'; 

// Import Context Hook
import { useWisataContext } from './context/WisataContext';

// Komponen Konten Utama (WebGIS untuk User Umum)
const MainContent = () => {
    const { activeMenu, setActiveMenu, resetFilter } = useWisataContext();

    const handleMenuChange = (menuId) => {
        setActiveMenu(menuId);
        if (menuId === 'search') {
            resetFilter();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <Taskbar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
            
            <main className="flex-1 container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
                    {/* Left Panel */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
                        {activeMenu === 'search' && <SearchPanel />}
                        {activeMenu === 'location' && <LocationPanel />}
                        {activeMenu === 'filter' && <CategoryFilterPanel />}
                    </div>

                    {/* Right Panel - Map */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
                        <MapComponent />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. Route untuk User Umum (WebGIS) */}
                <Route path="/" element={<MainContent />} />

                {/* 2. Route untuk Halaman Login Admin */}
                <Route path="/admin/login" element={<Login />} />

                {/* 3. Route untuk Dashboard Admin (SUDAH DITAMBAHKAN) */}
                <Route path="/admin/dashboard" element={<Dashboard />} />

                {/* 4. Route 404 (Opsional: Kalau user akses halaman ngawur) */}
                <Route path="*" element={
                    <div className="h-screen flex items-center justify-center text-2xl font-bold">
                        404 - Halaman Tidak Ditemukan
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;