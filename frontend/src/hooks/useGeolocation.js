/**
 * =========================================
 * CUSTOM HOOK: USE GEOLOCATION
 * =========================================
 * Hook untuk mendapatkan lokasi GPS user
 */

import { useState, useEffect } from 'react';

export const useGeolocation = (autoRequest = false) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const requestLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation tidak didukung oleh browser Anda');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
                setLoading(false);
            },
            (err) => {
                let errorMessage = 'Gagal mendapatkan lokasi';
                
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'Akses lokasi ditolak. Mohon aktifkan GPS di browser.';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'Informasi lokasi tidak tersedia.';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'Waktu permintaan lokasi habis.';
                        break;
                    default:
                        errorMessage = 'Terjadi kesalahan saat mengambil lokasi.';
                }
                
                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        if (autoRequest) {
            requestLocation();
        }
    }, [autoRequest]);

    return {
        location,
        error,
        loading,
        requestLocation,
    };
};