import React, { createContext, useContext, useState, useEffect } from 'react';
import { wisataService } from '../services/api'; // Pastikan import service

const WisataContext = createContext();

export const useWisataContext = () => {
    const context = useContext(WisataContext);
    if (!context) {
        throw new Error('useWisataContext must be used within WisataProvider');
    }
    return context;
};

export const WisataProvider = ({ children }) => {
    // 1. State Global (Pindahan dari App.jsx)
    const [allWisata, setAllWisata] = useState([]);   // Data mentah dari DB
    const [mapData, setMapData] = useState([]);       // Data yang tampil di Peta (bisa kena filter)
    const [userLocation, setUserLocation] = useState(null);
    const [activeMenu, setActiveMenu] = useState('search');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Load Data Awal (Pindahan dari App.jsx)
    useEffect(() => {
        const fetchAllWisata = async () => {
            setLoading(true);
            try {
                const response = await wisataService.getAll();
                setAllWisata(response.data.data);
                setMapData(response.data.data); // Awalnya peta menampilkan semua
            } catch (err) {
                console.error('Error fetching wisata:', err);
                setError('Gagal memuat data wisata');
            } finally {
                setLoading(false);
            }
        };

        fetchAllWisata();
    }, []);

    // 3. Fungsi Helper untuk Reset Filter
    const resetFilter = () => {
        setMapData(allWisata);
    };

    const value = {
        allWisata,
        mapData, setMapData,       // Komponen lain bisa ubah isi peta lewat ini
        userLocation, setUserLocation,
        activeMenu, setActiveMenu,
        loading, setLoading,
        error, setError,
        resetFilter
    };

    return (
        <WisataContext.Provider value={value}>
            {children}
        </WisataContext.Provider>
    );
};