/**
 * =========================================
 * CUSTOM HOOK: USE WISATA
 * =========================================
 * Hook untuk manage state wisata data
 */

import { useState, useEffect } from 'react';
import { wisataService } from '../services/api';

export const useWisata = () => {
    const [wisataList, setWisataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllWisata = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await wisataService.getAll();
            setWisataList(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memuat data wisata');
        } finally {
            setLoading(false);
        }
    };

    const searchWisata = async (keyword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await wisataService.search(keyword);
            setWisataList(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mencari wisata');
        } finally {
            setLoading(false);
        }
    };

    const filterWisata = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const response = await wisataService.filter(params);
            setWisataList(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal filter wisata');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllWisata();
    }, []);

    return {
        wisataList,
        loading,
        error,
        fetchAllWisata,
        searchWisata,
        filterWisata,
        setWisataList,
    };
};