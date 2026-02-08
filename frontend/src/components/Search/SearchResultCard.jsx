/**
 * =========================================
 * SEARCH RESULT CARD (REVISED)
 * =========================================
 */

import React from 'react';
import { formatRupiah, getCategoryIcon } from '../../utils/helpers';

// 👇 Tambahkan prop 'onClick' disini
const SearchResultCard = ({ wisata, onClick }) => {
    return (
        <div 
            // 👇 Tambahkan event handler ini agar peta bisa merespon klik
            onClick={() => onClick && onClick(wisata)}
            // 👇 Tambahkan 'cursor-pointer' agar user tahu ini bisa diklik
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
        >
            <div className="flex">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0">
                    <img
                        src={wisata.foto_utama || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={wisata.nama_wisata}
                        // Tambahkan sedikit efek zoom saat hover (opsional, biar keren)
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {wisata.nama_wisata}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <span>📍</span> {wisata.kecamatan}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        {getCategoryIcon(wisata.nama_kategori)} {wisata.nama_kategori}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                        💰 {formatRupiah(wisata.harga_tiket)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard;