/**
 * =========================================
 * LOCATION PANEL COMPONENT
 * =========================================
 * Panel untuk fitur rekomendasi terdekat dengan GPS
 */

import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { haversineService } from '../../services/api';
import RecommendationCard from './RecommendationCard';

const LocationPanel = ({ onLocationUpdate, onRecommendationsUpdate }) => {
    const { location, error: gpsError, loading: gpsLoading, requestLocation } = useGeolocation();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        if (location) {
            setPermissionGranted(true);
            onLocationUpdate(location);
            fetchRecommendations(location);
        }
    }, [location]);

    const fetchRecommendations = async (userLocation) => {
        setLoading(true);
        setError(null);

        try {
            const response = await haversineService.getRecommendations(
                userLocation.latitude,
                userLocation.longitude,
                5
            );

            setRecommendations(response.data.recommendations);
            onRecommendationsUpdate(response.data.recommendations);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengambil rekomendasi');
        } finally {
            setLoading(false);
        }
    };

    const handleEnableGPS = () => {
        requestLocation();
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                {!permissionGranted ? (
                    // GPS Prompt
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                            <div className="text-6xl mb-4">📍</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Aktifkan Lokasi GPS Anda
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Untuk mendapatkan rekomendasi destinasi wisata terdekat 
                                dari posisi Anda saat ini
                            </p>

                            {gpsError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                    ❌ {gpsError}
                                </div>
                            )}

                            <button
                                onClick={handleEnableGPS}
                                disabled={gpsLoading}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {gpsLoading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                                        Mengambil Lokasi...
                                    </span>
                                ) : (
                                    '🎯 Aktifkan GPS'
                                )}
                            </button>

                            <p className="text-xs text-gray-500 mt-4">
                                ℹ️ Browser akan meminta izin akses lokasi Anda
                            </p>
                        </div>
                    </div>
                ) : (
                    // Recommendations View
                    <div>
                        {/* User Location Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                                <span className="text-xl mr-2">📍</span>
                                Lokasi Anda Saat Ini
                            </h3>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>Latitude: {location.latitude.toFixed(6)}</p>
                                <p>Longitude: {location.longitude.toFixed(6)}</p>
                                <p>Akurasi: ±{Math.round(location.accuracy)} meter</p>
                            </div>
                            <button
                                onClick={handleEnableGPS}
                                disabled={gpsLoading}
                                className="mt-3 text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {gpsLoading ? '⏳ Memperbarui...' : '🔄 Perbarui Lokasi'}
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
                                    <p className="text-gray-600">Menghitung jarak...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                ❌ {error}
                            </div>
                        )}

                        {/* Recommendations List */}
                        {!loading && recommendations.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="text-3xl mr-2">🎯</span>
                                    5 Destinasi Terdekat
                                </h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Diurutkan berdasarkan jarak terdekat menggunakan Algoritma Haversine
                                </p>

                                <div className="space-y-4">
                                    {recommendations.map((wisata, index) => (
                                        <RecommendationCard
                                            key={wisata.wisata_id}
                                            wisata={wisata}
                                            rank={index + 1}
                                        />
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-600 text-center">
                                        💡 <strong>Info:</strong> Jarak dihitung menggunakan Great Circle Distance 
                                        (garis lurus di permukaan bumi). Jarak tempuh aktual mungkin lebih jauh.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && recommendations.length === 0 && !error && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-gray-600">
                                    Tidak ada destinasi wisata ditemukan
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationPanel;