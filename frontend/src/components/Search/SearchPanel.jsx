/**
 * =========================================
 * SEARCH PANEL COMPONENT (UPDATED)
 * =========================================
 * Panel pencarian dengan Global Context
 */

import React, { useState, useEffect } from 'react';
import { wisataService } from '../../services/api';
import { debounce } from '../../utils/helpers';
import SearchResultCard from './SearchResultCard';
// Import Context Hook
import { useWisataContext } from '../../context/WisataContext';

const SearchPanel = () => { // Tidak perlu props onResultsUpdate lagi
    
    // AMBIL SETTER DARI CONTEXT
    const { setMapData } = useWisataContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debounced search
    useEffect(() => {
        const debouncedSearch = debounce(async () => {
            if (searchTerm.length >= 2) {
                await performSearch();
            } else {
                setResults([]);
                // Jika search kosong, jangan update mapData di sini
                // Biarkan parent/context handle reset kalau user klik 'clear' atau menu lain
            }
        }, 500);

        debouncedSearch();
    }, [searchTerm]);

    const performSearch = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await wisataService.search(searchTerm);
            const searchResults = response.data.data;
            
            setResults(searchResults);
            
            // UPDATE GLOBAL MAP DATA
            // Ini akan otomatis mengubah marker di peta!
            setMapData(searchResults);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal melakukan pencarian');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                {/* Search Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        🔍 Pencarian Destinasi
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Cari destinasi wisata berdasarkan nama atau lokasi
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Cari destinasi... (contoh: Pantai Widuri)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                        🔍
                    </div>
                    {loading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Results UI (Sama seperti sebelumnya) */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        ❌ {error}
                    </div>
                )}

                {searchTerm.length >= 2 && !loading && results.length === 0 && !error && (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-600">
                            Tidak ada destinasi wisata dengan kata kunci "{searchTerm}"
                        </p>
                    </div>
                )}

                {results.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            📝 Hasil Pencarian ({results.length} ditemukan)
                        </h3>
                        <div className="space-y-4">
                            {results.map((wisata) => (
                                <SearchResultCard key={wisata.wisata_id} wisata={wisata} />
                            ))}
                        </div>
                    </div>
                )}

                {searchTerm.length < 2 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏝️</div>
                        <p className="text-gray-600">
                            Ketik minimal 2 karakter untuk mulai mencari
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPanel;