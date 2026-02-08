/**
 * =========================================
 * HEADER COMPONENT
 * =========================================
 * Header utama website dengan logo dan navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo & Title */}
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
                        <div className="text-4xl">🏝️</div>
                        <div>
                            <h1 className="text-2xl font-bold">Pariwisata Pemalang</h1>
                            <p className="text-sm text-blue-100">Explore Kabupaten Pemalang</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link 
                            to="/" 
                            className="hover:text-blue-200 transition font-medium"
                        >
                            🏠 Beranda
                        </Link>
                        <Link 
                            to="/about" 
                            className="hover:text-blue-200 transition font-medium"
                        >
                            ℹ️ Tentang
                        </Link>
                        
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-2xl">
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;