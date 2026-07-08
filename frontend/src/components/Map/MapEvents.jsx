import React, { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

export const MapResizer = ({ isSidebarOpen }) => {
    const map = useMap();
    useEffect(() => {
        const timeout = setTimeout(() => { map.invalidateSize(); }, 300);
        return () => clearTimeout(timeout);
    }, [isSidebarOpen, map]);
    return null;
};

export const MapCenterTracker = ({ isSelectingLoc, onCenterChange }) => {
    const map = useMapEvents({
        move() {
            if (isSelectingLoc) {
                const center = map.getCenter();
                onCenterChange([center.lat, center.lng]);
            }
        }
    });

    useEffect(() => {
        if (isSelectingLoc) {
            const center = map.getCenter();
            onCenterChange([center.lat, center.lng]);
        }
    }, [isSelectingLoc, map, onCenterChange]);

    return null;
};

export const MapEvents = ({ isSelectingLoc, onLocationSelected, onMapClick }) => {
    useMapEvents({
        click(e) {
            if (isSelectingLoc) {
                // Saat mode pilih manual, klik di mana saja akan menggeser peta ke titik tersebut
                e.target.flyTo(e.latlng, e.target.getZoom(), {
                    animate: true,
                    duration: 0.5
                });
            } else {
                if (onMapClick) onMapClick();
            }
        }
    });
    return null;
};

export const MapFlyer = ({ userLoc, selectedWisata }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedWisata?.latitude && selectedWisata?.longitude) {
            // Beri offset sedikit ke atas agar tidak tertutup kartu bawah
            const targetLat = parseFloat(selectedWisata.latitude);
            const targetLon = parseFloat(selectedWisata.longitude);

            // Geser sedikit ke bawah (target latitude dikurangi sedikit) 
            // agar marker muncul di area atas layar
            const offset = 0.012; 
            map.flyTo([targetLat - offset, targetLon], 12.5, {
                animate: true,
                duration: 2.0
            });
        }
    }, [selectedWisata, map]);

    useEffect(() => {
        if (userLoc) {
            map.flyTo([userLoc[0] - 0.010, userLoc[1]], 12, {
                animate: true,
                duration: 2.0
            });
        }
    }, [userLoc, map]);

    return null;
};

export const MapResetTrigger = ({ trigger }) => {
    const map = useMap();
    useEffect(() => {
        if (trigger > 0) {
            map.flyTo([-7.0125, 109.3772], 11, {
                animate: true,
                duration: 2.0
            });
        }
    }, [trigger, map]);
    return null;
};
