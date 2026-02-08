/**
 * =========================================
 * CATEGORY FILTER PANEL
 * =========================================
 * Filter berdasarkan kategori + GPS
 */

import React, { useState, useEffect } from 'react';
import { kategoriService, wisataService } from '../../services/api';
import FilteredWisataCard from './FilteredWisataCard';

const CategoryFilterPanel = ({ userLocation, onFilterUpdate }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortBy, setSortBy] = useState('popularity');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchFilteredWisata();
        }
    }, [selectedCategory, userLocation, sortBy]);

    const fetchCategories = async () => {
        try {
            const response = await kategoriService.getAll();
            setCategories(response.data.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchFilteredWisata = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                kategori_id: selectedCategory,
                sort_by: sortBy
            };

            if (userLocation) {
                params.user_lat = userLocation.latitude;
                params.user_lon = userLocation.longitude;
            }

            const response = await wisataService.filter(params);
            setFilteredResults(response.data.data);
            onFilterUpdate(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal filter wisata');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        if (categoryId === selectedCategory) {
            setSelectedCategory(null);
            setFilteredResults([]);
            onFilterUpdate([]);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        🏷️ Filter Berdasarkan Kategori
                    </h2>
                    {userLocation && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 inline-block">
                            <span className="text-sm text-green-800 font-medium">
                                📍 GPS Aktif - Hasil diurutkan dari terdekat
                            </span>
                        </div>
                    )}
                </div>

                {/* Category Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {categories.map((category) => (
                        <button
                            key={category.kategori_id}
                            onClick={() => handleCategoryClick(category.kategori_id)}
                            className={`
                                p-4 rounded-xl border-2 transition-all duration-300 text-left
                                ${selectedCategory === category.kategori_id
                                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{category.icon_url}</span>
                                    <div>
                                        <h3 className={`font-bold ${
                                            selectedCategory === category.kategori_id 
                                                ? 'text-blue-700' 
                                                : 'text-gray-800'
                                        }`}>
                                            {category.nama_kategori}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {category.jumlah_wisata} destinasi
                                        </p>
                                    </div>
                                </div>
                                {selectedCategory === category.kategori_id && (
                                    <div className="text-blue-500 text-2xl">✓</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Sort Options (hanya jika GPS tidak aktif) */}
                {!userLocation && selectedCategory && (
                    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Urutkan berdasarkan:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="popularity">📊 Popularitas (Pengunjung Terbanyak)</option>
                            <option value="name">🔤 Nama (A-Z)</option>
                            <option value="price_low">💰 Harga Termurah</option>
                            <option value="price_high">💎 Harga Tertinggi</option>
                        </select>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600">Memuat data...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        ❌ {error}
                    </div>
                )}

                {/* Results */}
                {!loading && filteredResults.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            📍 Ditemukan {filteredResults.length} destinasi
                            {userLocation && ' (Diurutkan dari terdekat)'}
                        </h3>
                        <div className="space-y-4">
                            {filteredResults.map((wisata, index) => (
                                <FilteredWisataCard
                                    key={wisata.wisata_id}
                                    wisata={wisata}
                                    showDistance={!!userLocation}
                                    rank={userLocation ? index + 1 : null}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && selectedCategory && filteredResults.length === 0 && !error && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-600">
                            Tidak ada destinasi wisata dalam kategori ini
                        </p>
                    </div>
                )}

                {/* Prompt Select */}
                {!selectedCategory && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👆</div>
                        <p className="text-gray-600">
                            Pilih kategori wisata di atas untuk melihat hasil
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryFilterPanel;