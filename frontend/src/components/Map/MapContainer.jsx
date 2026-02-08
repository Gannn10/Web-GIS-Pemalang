/**
 * =========================================
 * MAP CONTAINER COMPONENT (UPDATED)
 * =========================================
 * Menggunakan Global Context
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Import Context Hook
import { useWisataContext } from '../../context/WisataContext'; 

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons (Sama seperti sebelumnya)
const wisataIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component untuk auto-center map
function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || 13);
        }
    }, [center, zoom, map]);
    return null;
}

// Komponen Utama (Sekarang tanpa props data!)
const MapComponent = ({ onMarkerClick }) => { // onMarkerClick masih oke kalau mau custom action di parent
    
    // AMBIL DATA DARI CONTEXT
    const { mapData, userLocation } = useWisataContext();

    const defaultCenter = [
        parseFloat(import.meta.env.VITE_MAP_DEFAULT_LAT) || -6.8947,
        parseFloat(import.meta.env.VITE_MAP_DEFAULT_LNG) || 109.3772
    ];
    const defaultZoom = parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 11;

    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(defaultZoom);

    // Effect untuk update center peta saat data berubah
    useEffect(() => {
        if (userLocation) {
            setMapCenter([userLocation.latitude, userLocation.longitude]);
            setMapZoom(13);
        } else if (mapData.length > 0) {
            // Center ke wisata pertama jika ada hasil pencarian/filter
            const firstWisata = mapData[0];
            if (firstWisata.latitude && firstWisata.longitude) {
                setMapCenter([firstWisata.latitude, firstWisata.longitude]);
                // Jika cuma 1 hasil (misal pencarian spesifik), zoom in
                if (mapData.length === 1) setMapZoom(15);
            }
        }
    }, [userLocation, mapData]);

    return (
        <div className="h-full w-full rounded-lg overflow-hidden shadow-xl">
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapController center={mapCenter} zoom={mapZoom} />
                
                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={[userLocation.latitude, userLocation.longitude]}
                        icon={userIcon}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong className="text-blue-600">📍 Lokasi Anda</strong>
                                <p className="text-xs text-gray-600 mt-1">
                                    Akurasi: ±{Math.round(userLocation.accuracy || 0)}m
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                
                {/* Wisata Markers Loop dari Context Data */}
                {mapData.map((wisata) => (
                    <Marker
                        key={wisata.wisata_id}
                        position={[wisata.latitude, wisata.longitude]}
                        icon={wisataIcon}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(wisata)
                        }}
                    >
                        <Popup maxWidth={300}>
                            <div className="p-2">
                                {wisata.foto_utama && (
                                    <img 
                                        src={wisata.foto_utama} 
                                        alt={wisata.nama_wisata}
                                        className="w-full h-32 object-cover rounded mb-2"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                )}
                                <h3 className="font-bold text-lg text-gray-800">
                                    {wisata.nama_wisata}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    📍 {wisata.kecamatan}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    🏷️ {wisata.nama_kategori}
                                </p>
                                <p className="text-sm font-semibold text-green-600 mb-1">
                                    💰 Rp {wisata.harga_tiket === 0 
                                        ? 'Gratis' 
                                        : wisata.harga_tiket?.toLocaleString('id-ID')
                                    }
                                </p>
                                {wisata.jarak_km && (
                                    <p className="text-sm font-bold text-blue-600">
                                        🎯 {wisata.jarak_km} km dari Anda
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;