import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    // Cek apakah user sudah login (ada token)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Kalau tidak ada token, tendang balik ke login
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Hapus token dan data user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Kembali ke login
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar Admin Sederhana */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel 🛡️</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Logout
                </button>
            </nav>

            {/* Konten Dashboard */}
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">👋</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Selamat Datang, Admin!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Ini adalah halaman Dashboard. Nanti di sini Anda bisa mengelola (CRUD) data wisata.
                    </p>
                    
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg inline-block">
                        🚧 Fitur CRUD Wisata akan dikembangkan selanjutnya.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;