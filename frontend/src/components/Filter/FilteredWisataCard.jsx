/**
 * =========================================
 * FILTERED WISATA CARD
 * =========================================
 */

import React from 'react';
import { formatRupiah, formatNumber, getCategoryIcon, getDistanceBadgeColor } from '../../utils/helpers';

const FilteredWisataCard = ({ wisata, showDistance, rank }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Distance Rank (jika GPS aktif) */}
            {showDistance && rank && (
                <div className={`${getDistanceBadgeColor(wisata.jarak_km)} px-4 py-2 flex items-center justify-between`}>
                    <span className="font-bold">#{rank}</span>
                    <span className="font-bold text-lg">{wisata.jarak_km} km</span>
                </div>
            )}

            <div className="p-4">
                <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                            src={wisata.foto_utama || 'https://via.placeholder.com/150?text=No+Image'}
                            alt={wisata.nama_wisata}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 mb-1">
                            {wisata.nama_wisata}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                            📍 {wisata.kecamatan}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            {getCategoryIcon(wisata.nama_kategori)} {wisata.nama_kategori}
                        </p>

                        {showDistance && (
                            <p className="text-sm font-bold text-blue-600 mb-2">
                                🎯 <strong>{wisata.jarak_km} km</strong> dari Anda
                            </p>
                        )}

                        <p className="text-sm font-semibold text-green-600 mb-1">
                            💰 {formatRupiah(wisata.harga_tiket)}
                        </p>

                        {wisata.pengunjung_2024 !== undefined && (
                            <p className="text-xs text-gray-600">
                                👥 {formatNumber(wisata.pengunjung_2024)} pengunjung (2024)
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilteredWisataCard;