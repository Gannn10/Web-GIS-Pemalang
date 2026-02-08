/**
 * =========================================
 * RECOMMENDATION CARD
 * =========================================
 */

import React from 'react';
import { formatRupiah, getDistanceBadgeColor, getCategoryIcon, calculateEstimatedTime } from '../../utils/helpers';

const RecommendationCard = ({ wisata, rank }) => {
    const badgeColor = getDistanceBadgeColor(wisata.jarak_km);

    return (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            {/* Rank Badge */}
            <div className={`${badgeColor} px-4 py-2 flex items-center justify-between`}>
                <span className="font-bold text-lg">
                    #{rank} Terdekat
                </span>
                <span className="font-bold text-2xl">
                    {wisata.jarak_km} km
                </span>
            </div>

            <div className="p-4">
                <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
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
                        <h4 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                            {wisata.nama_wisata}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                            📍 {wisata.kecamatan}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            {getCategoryIcon(wisata.kategori)} {wisata.kategori}
                        </p>
                        <p className="text-sm font-semibold text-green-600 mb-2">
                            💰 {formatRupiah(wisata.harga_tiket)}
                        </p>

                        {/* Distance Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                            <p className="text-xs text-blue-800 font-medium">
                                🚗 Estimasi: {calculateEstimatedTime(wisata.jarak_km)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {wisata.statistik_pengunjung && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                            👥 Pengunjung 2024: <strong>{wisata.statistik_pengunjung.tahun_2024?.toLocaleString('id-ID') || 0}</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationCard;