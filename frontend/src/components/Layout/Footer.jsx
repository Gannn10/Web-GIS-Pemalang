/**
 * =========================================
 * FOOTER COMPONENT (FIXED)
 * =========================================
 */

import React from 'react';
import { Link } from 'react-router-dom'; // 1. Wajib import ini

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">🏝️ Pariwisata Pemalang</h3>
                        <p className="text-gray-300 text-sm">
                            Sistem Informasi Geografis Pariwisata Kabupaten Pemalang
                            dengan fitur rekomendasi terdekat menggunakan Algoritma Haversine.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">📌 Menu</h3>
                        <ul className="space-y-2 text-sm">
                            {/* 2. Ganti tag <a> menjadi <Link> dan href menjadi to */}
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                                    Tentang
                                </Link>
                            </li>
                            
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">ℹ️ Informasi</h3>
                        <p className="text-gray-300 text-sm mb-2">
                            <strong>Dibuat oleh:</strong><br />
                            Muhammad Gani Ramadhani<br />
                            NIM: A11.2022.14223
                        </p>
                        <p className="text-gray-300 text-sm">
                            <strong>Universitas:</strong><br />
                            Universitas Dian Nuswantoro
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>© 2025 Pariwisata Kabupaten Pemalang. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;