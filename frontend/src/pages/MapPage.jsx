import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Circle, useMapEvents, Polyline, useMap, ZoomControl } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Swal from 'sweetalert2';
import {
    Search, MapPin, Navigation, Info, Menu, X, Home, Layers,
    ChevronRight, Users, Map as MapIcon, Compass,
    Palmtree, Mountain, Landmark, Building2, Globe,
    CircleDot, Waves, SlidersHorizontal
} from 'lucide-react';

// Custom SVG Icons to avoid lucide-react version compatibility issues
const TreesIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 22v-6.5M14 22v-4M4.5 10a2.5 2.5 0 0 1 0-5 3 3 0 0 1 5.9-1A3 3 0 0 1 15 6a3 3 0 0 1 5.25 2.5A2.5 2.5 0 0 1 19.5 13h-15Z" /></svg>
);

const MosqueIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 22H2M12 22V13M12 9a4 4 0 0 1 4 4v9H8v-9a4 4 0 0 1 4-4Z" /><path d="M12 2v4M10 4h4" /></svg>
);

const FerrisWheelIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20M19.07 4.93 4.93 19.07M19.07 19.07 4.93 4.93" /></svg>
);

const UtensilsIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v4M12 2v20M17 22H7M12 18H7M21 2v9a2 2 0 0 1-2 2h-5M19 2v4" /></svg>
);

const LocateIcon = ({ size = 18, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>
);

import dataBatasPemalang from './pemalang.json';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = L.divIcon({
    className: 'custom-gps-dot',
    html: '<div class="gps-dot-container"><div class="gps-dot-ring"></div></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
});

// =============================================
// HELPER FUNCTIONS
// =============================================
const calculateHaversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getBadgeStyle = (kategori) => {
    const styles = {
        'Wisata Bahari': {
            bg: 'bg-blue-100 text-blue-700',
            dot: 'bg-blue-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/><path d="M2 12c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/><path d="M2 18c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/></svg>',
            color: '#3b82f6'
        },
        'Wisata Alam': {
            bg: 'bg-emerald-100 text-emerald-700',
            dot: 'bg-emerald-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.5M14 22v-4M4.5 10a2.5 2.5 0 0 1 0-5 3 3 0 0 1 5.9-1A3 3 0 0 1 15 6a3 3 0 0 1 5.25 2.5A2.5 2.5 0 0 1 19.5 13h-15Z"/></svg>',
            color: '#10b981'
        },
        'Wisata Buatan': {
            bg: 'bg-orange-100 text-orange-700',
            dot: 'bg-orange-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M19.07 4.93 4.93 19.07M19.07 19.07 4.93 4.93"/></svg>',
            color: '#f97316'
        },
        'Wisata Religi': {
            bg: 'bg-purple-100 text-purple-700',
            dot: 'bg-purple-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 22H2M12 22V13M12 9a4 4 0 0 1 4 4v9H8v-9a4 4 0 0 1 4-4Z"/><path d="M12 2v4M10 4h4"/></svg>',
            color: '#a855f7'
        },
        'Wisata Kuliner': {
            bg: 'bg-pink-100 text-pink-700',
            dot: 'bg-pink-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v4"/><path d="M12 2v20"/><path d="M17 22H7"/><path d="M12 18H7"/><path d="M21 2v9a2 2 0 0 1-2 2h-5"/><path d="M19 2v4"/></svg>',
            color: '#ec4899'
        },
    };
    return styles[kategori] || {
        bg: 'bg-gray-100 text-gray-600',
        dot: 'bg-gray-400',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
        color: '#6b7280'
    };
};

// Custom Marker Creator (Circular Badge Style with White Icons inside)
const createCustomIcon = (kategori, isActive = false, isDimmed = false) => {
    // Mapping warna background marker
    const colorMap = {
        'Wisata Bahari': '#3b82f6', // Blue
        'Wisata Alam': '#10b981',   // Emerald Green
        'Wisata Religi': '#a855f7', // Purple/Violet
        'Wisata Buatan': '#f97316', // Orange
        'Wisata Kuliner': '#ec4899', // Pink/Red
    };

    // Mapping SVG (white icon in center)
    const svgMap = {
        'Wisata Bahari': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/><path d="M2 12c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/><path d="M2 18c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/></svg>`,
        'Wisata Alam': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.5M14 22v-4M4.5 10a2.5 2.5 0 0 1 0-5 3 3 0 0 1 5.9-1A3 3 0 0 1 15 6a3 3 0 0 1 5.25 2.5A2.5 2.5 0 0 1 19.5 13h-15Z"/></svg>`,
        'Wisata Religi': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M12 2v12"/><path d="M8 6h8"/></svg>`,
        'Wisata Buatan': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M19.07 4.93 4.93 19.07M19.07 19.07 4.93 4.93"/></svg>`,
        'Wisata Kuliner': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v4"/><path d="M12 2v20"/><path d="M17 22H7"/><path d="M12 18H7"/><path d="M21 2v9a2 2 0 0 1-2 2h-5"/><path d="M19 2v4"/></svg>`,
    };

    const color = colorMap[kategori] || '#3b82f6';
    const svgIcon = svgMap[kategori] || `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>`;

    const scale = isActive ? 'scale(1.25)' : (isDimmed ? 'scale(0.85)' : 'scale(1)');
    const opacity = isDimmed ? '0.55' : '1';

    return L.divIcon({
        className: `custom-marker marker-drop-anim ${isActive ? 'marker-active' : ''}`,
        html: `
            <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; opacity: ${opacity}; transform: ${scale}; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: ${isActive ? '9999' : '100'};">
                <!-- Glowing Outer Ring (Active State) -->
                ${isActive ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 3px solid ${color}; opacity: 0.4; animation: gps-glow 1.5s infinite;"></div>` : ''}
                
                <!-- Circle Badge -->
                <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${color}; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 2;">
                    ${svgIcon}
                </div>
                
                <!-- Pin Tail -->
                <div style="position: absolute; bottom: 1px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 10px; height: 10px; background-color: ${color}; border-right: 2px solid white; border-bottom: 2px solid white; box-shadow: 2px 2px 4px rgba(0,0,0,0.15); z-index: 1;"></div>
            </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 36], // Anchor di ujung ekor pin
    });
};

// =============================================
// WISATA CARD COMPONENT (mirip referensi)
// =============================================
const WisataCard = ({ item, index, userLoc, activeRouteName, routeInfo, onCekJalur, formatDuration, onSelect }) => {
    const isActive = activeRouteName === item.nama_wisata;
    const badge = getBadgeStyle(item.nama_kategori);

    return (
        <div
            onClick={() => onSelect(item)}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer
            ${isActive
                    ? 'border-blue-500 bg-blue-50/40 shadow-[0_8px_25px_rgba(59,130,246,0.08)]'
                    : 'border-gray-100 bg-white hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]'}`}
        >
            <div className="flex items-center gap-3 px-3 py-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100/50 relative shadow-inner">
                    {item.foto_utama ? (
                        <img src={item.foto_utama} alt={item.nama_wisata}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50" dangerouslySetInnerHTML={{ __html: badge.icon }} />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black truncate leading-tight mb-1.5 ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                        {item.nama_wisata}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${badge.bg}`}>
                            {item.nama_kategori?.replace('Wisata ', '')}
                        </span>
                        {item.distance !== undefined && (
                            <span className="text-[9px] font-bold text-gray-400">
                                • {item.distance.toFixed(1)} km
                            </span>
                        )}
                    </div>
                </div>

                {/* Arrow */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${isActive ? 'bg-blue-500 text-white shadow-blue-200 shadow-md' : 'bg-gray-50 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-400'}`}>
                    <ChevronRight size={14} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};

// =============================================
// MAP HELPER COMPONENTS
// =============================================
const MapResizer = ({ isSidebarOpen }) => {
    const map = useMap();
    useEffect(() => {
        const timeout = setTimeout(() => { map.invalidateSize(); }, 300);
        return () => clearTimeout(timeout);
    }, [isSidebarOpen, map]);
    return null;
};

const MapEvents = ({ isSelectingLoc, onLocationSelected, onMapClick }) => {
    useMapEvents({
        click(e) {
            if (isSelectingLoc) {
                onLocationSelected([e.latlng.lat, e.latlng.lng]);
            } else {
                onMapClick();
            }
        }
    });
    return null;
};

const MapFlyer = ({ userLoc, selectedWisata }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedWisata?.latitude && selectedWisata?.longitude) {
            // Beri offset sedikit ke atas agar tidak tertutup kartu bawah
            const targetLat = parseFloat(selectedWisata.latitude);
            const targetLon = parseFloat(selectedWisata.longitude);

            // Geser sedikit ke bawah (target latitude dikurangi sedikit) 
            // agar marker muncul di area atas layar
            const offset = 0.005;
            map.flyTo([targetLat - offset, targetLon], 15, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedWisata, map]);

    useEffect(() => {
        if (userLoc) {
            map.flyTo([userLoc[0] - 0.005, userLoc[1]], 15, {
                animate: true,
                duration: 1.5
            });
        }
    }, [userLoc, map]);

    return null;
};

const ZoomLocateControls = ({ onLocate, onSelectManual, isSelectingLoc, userLoc }) => {
    const map = useMap();

    const handleFlyToUser = () => {
        if (userLoc) {
            map.flyTo([userLoc[0] - 0.005, userLoc[1]], 15, {
                animate: true,
                duration: 1.5
            });
        } else {
            onLocate();
        }
    };

    return (
        <div className="absolute bottom-6 right-[196px] z-[1000] flex flex-col gap-2.5 items-end transition-all duration-300">
            {/* Zoom Controls */}
            <div className="flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100/80 w-11">
                <button
                    onClick={() => map.zoomIn()}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-all border-b border-gray-100 text-lg font-bold"
                >
                    +
                </button>
                <button
                    onClick={() => map.zoomOut()}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-all text-lg font-bold"
                >
                    −
                </button>
            </div>

            {/* GPS Locate Button */}
            <button
                onClick={handleFlyToUser}
                className={`w-11 h-11 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all border border-gray-100/80 active:scale-95
                    ${userLoc ? 'text-blue-500 bg-blue-50/50 border-blue-100' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'}`}
                title="Lokasi Saya"
            >
                <Navigation size={16} className={userLoc ? "fill-blue-500 text-blue-500" : ""} strokeWidth={2.5} />
            </button>

            {/* Manual Pin Select Button */}
            <button
                onClick={onSelectManual}
                className={`w-11 h-11 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all border border-gray-100/80 active:scale-95
                    ${isSelectingLoc ? 'text-amber-500 bg-amber-50 border-amber-300' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'}`}
                title="Pilih Titik Manual"
            >
                <LocateIcon size={18} />
            </button>
        </div>
    );
};

// =============================================
// MAIN MAP PAGE COMPONENT
// =============================================
const MapPage = () => {
    const [wisataList, setWisataList] = useState([]);
    const [filteredWisata, setFilteredWisata] = useState([]);
    const [kategori, setKategori] = useState('');
    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchParams] = useSearchParams();

    // Efek Slide-in Otomatis setelah delay (khusus Desktop)
    useEffect(() => {
        if (window.innerWidth > 1024) {
            const timer = setTimeout(() => {
                setIsSidebarOpen(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const getSavedLoc = () => {
        try { const saved = localStorage.getItem('userLoc_skripsi'); if (saved) return JSON.parse(saved); } catch (e) { }
        return null;
    };

    const [userLoc, setUserLoc] = useState(getSavedLoc());
    const [radius, setRadius] = useState(() => {
        const savedRad = localStorage.getItem('userRad_skripsi');
        return savedRad ? parseInt(savedRad) : 15;
    });
    const [isSelectingLoc, setIsSelectingLoc] = useState(false);
    const [routePath, setRoutePath] = useState(null);
    const [activeRouteName, setActiveRouteName] = useState('');
    const [routeInfo, setRouteInfo] = useState(null);
    const [selectedWisata, setSelectedWisata] = useState(null);
    const [mapType, setMapType] = useState('streets');
    const [isMapLayersOpen, setIsMapLayersOpen] = useState(false);
    const [isListExpanded, setIsListExpanded] = useState(true);
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

    const centerPemalang = [-7.0125, 109.3772];
    const pemalangStyle = { 
        color: '#1e40af',       // Outline biru tua tegas
        weight: 2.5,            // Lebih tebal sedikit
        fillColor: '#3b82f6',   // Warna biru di dalam area
        fillOpacity: 0.05,      // Transparan default
        dashArray: '4, 4'       // Garis putus-putus untuk batas kabupaten
    };

    useEffect(() => { if (userLoc) localStorage.setItem('userLoc_skripsi', JSON.stringify(userLoc)); else localStorage.removeItem('userLoc_skripsi'); }, [userLoc]);
    useEffect(() => { localStorage.setItem('userRad_skripsi', radius.toString()); }, [radius]);

    useEffect(() => {
        const fetchWisata = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata`);
                const data = res.data.data || [];
                setWisataList(data);
                setFilteredWisata(data);
                const wisataId = searchParams.get('wisata');
                if (wisataId) {
                    const target = data.find(w => w.wisata_id == wisataId);
                    if (target) setSearch(target.nama_wisata);
                }
            } catch (error) { console.error('Gagal mengambil data:', error); }
        };
        fetchWisata();
    }, [searchParams]);

    // State untuk membedakan daftar di sidebar dan marker di peta
    const [mapWisata, setMapWisata] = useState([]);

    useEffect(() => {
        let result = wisataList;

        // Filter Dasar (Kategori & Search) - Berlaku untuk Peta & Sidebar
        if (kategori) result = result.filter(w => w.nama_kategori === kategori);
        if (search) result = result.filter(w => w.nama_wisata?.toLowerCase().includes(search.toLowerCase()));

        // Simpan hasil filter dasar untuk ditampilkan semua di PETA
        setMapWisata(result);

        // Filter Lanjutan (Radius) - Hanya berlaku untuk DAFTAR SIDEBAR
        if (userLoc) {
            const withDistance = result.map(w => {
                if (w.latitude && w.longitude)
                    return { ...w, distance: calculateHaversine(userLoc[0], userLoc[1], parseFloat(w.latitude), parseFloat(w.longitude)) };
                return { ...w, distance: null };
            }).filter(w => w.distance !== null && w.distance <= radius).sort((a, b) => a.distance - b.distance);

            setFilteredWisata(withDistance);
        } else {
            setFilteredWisata(result.map(w => ({ ...w, distance: undefined })));
        }
    }, [kategori, search, wisataList, userLoc, radius]);

    const getLocationGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => { setUserLoc([pos.coords.latitude, pos.coords.longitude]); setIsSelectingLoc(false); resetRoute(); },
                () => Swal.fire({
                    title: 'GPS Gagal',
                    text: 'Gunakan fitur "Pilih di Peta".',
                    icon: 'warning',
                    background: '#ffffff',
                    confirmButtonText: 'Siap, Mengerti',
                    confirmButtonColor: '#3b82f6',
                    padding: '2rem',
                    color: '#1f2937',
                    borderRadius: '32px',
                    customClass: {
                        title: 'font-black text-xl',
                        popup: 'rounded-[32px] shadow-2xl border-none',
                        confirmButton: 'rounded-2xl px-8 py-3 text-xs font-black uppercase tracking-widest'
                    }
                })
            );
        }
    };

    const handleLocationSelected = (coords) => { setUserLoc(coords); setIsSelectingLoc(false); resetRoute(); };
    const resetRoute = () => { setRoutePath(null); setActiveRouteName(''); setRouteInfo(null); };
    const clearLocation = () => { setUserLoc(null); resetRoute(); setIsSelectingLoc(false); };

    const getRoute = async (destLat, destLon, destName) => {
        if (!userLoc) return Swal.fire({
            title: 'Tentukan Titik Awal',
            text: 'Pilih lokasi Anda terlebih dahulu untuk mencari rute.',
            icon: 'info',
            background: '#ffffff',
            confirmButtonText: 'Pilih Lokasi',
            confirmButtonColor: '#3b82f6',
            padding: '2rem',
            color: '#1f2937',
            borderRadius: '32px',
            showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp animate__faster' },
            customClass: {
                title: 'font-black text-xl text-gray-900',
                popup: 'rounded-[32px] shadow-2xl border-none',
                confirmButton: 'rounded-2xl px-10 py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100'
            }
        });
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLoc[1]},${userLoc[0]};${parseFloat(destLon)},${parseFloat(destLat)}?overview=full&geometries=geojson`;
            const response = await axios.get(url);
            if (response.data.routes?.length > 0) {
                const routeData = response.data.routes[0];
                setRoutePath(routeData.geometry.coordinates.map(c => [c[1], c[0]]));
                setActiveRouteName(destName);
                setRouteInfo({ distance: (routeData.distance / 1000).toFixed(1), duration: Math.ceil(routeData.duration / 60) });
                if (window.innerWidth < 768) setIsSidebarOpen(false);
            }
        } catch {
            Swal.fire({
                title: 'Rute Gagal',
                text: 'Maaf, gagal mengambil data rute. Coba lagi nanti.',
                icon: 'error',
                background: '#ffffff',
                confirmButtonColor: '#ef4444',
                borderRadius: '32px',
                customClass: {
                    title: 'font-black text-xl text-gray-900',
                    popup: 'rounded-[32px] shadow-2xl border-none',
                    confirmButton: 'rounded-2xl px-10 py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100'
                }
            });
        }
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) return `${minutes} Menit`;
        const h = Math.floor(minutes / 60), m = minutes % 60;
        return `${h} Jam${m > 0 ? ` ${m} Menit` : ''}`;
    };

    const topWisata = [...wisataList].sort((a, b) => (b.pengunjung_2024 || 0) - (a.pengunjung_2024 || 0)).slice(0, 3);

    const KATEGORI_LIST = [
        { label: 'Semua', value: '', icon: <CircleDot size={14} />, color: 'text-blue-500' },
        { label: 'Bahari', value: 'Wisata Bahari', icon: <Waves size={14} />, color: 'text-sky-500' },
        { label: 'Alam', value: 'Wisata Alam', icon: <TreesIcon size={14} />, color: 'text-emerald-600' },
        { label: 'Religi', value: 'Wisata Religi', icon: <MosqueIcon size={14} />, color: 'text-purple-500' },
        { label: 'Buatan', value: 'Wisata Buatan', icon: <FerrisWheelIcon size={14} />, color: 'text-orange-500' },
    ];

    const mapTiles = {
        streets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        minimalist: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-sans relative">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; border-radius: 16px !important; overflow: hidden; margin-bottom: 24px !important; margin-right: 24px !important; }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out { background-color: white !important; color: #374151 !important; border-bottom: 1px solid #f3f4f6 !important; width: 40px !important; height: 40px !important; line-height: 40px !important; font-size: 18px !important; font-weight: bold !important; transition: all 0.2s !important; }
                .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover { background-color: #eff6ff !important; color: #2563eb !important; }
                .leaflet-control-zoom-out { border-bottom: none !important; }
                .leaflet-popup-content-wrapper { padding: 0 !important; border-radius: 20px !important; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important; border: none !important; }
                .leaflet-popup-content { margin: 0 !important; width: 280px !important; }
                .leaflet-popup-tip-container { display: none; }
                
                /* Custom User Popup Styles */
                .custom-user-popup .leaflet-popup-content-wrapper {
                    border-radius: 24px !important;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
                }
                .custom-user-popup .leaflet-popup-content {
                    width: 170px !important;
                }

                
                @keyframes marker-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
                }
                .marker-active {
                    animation: marker-pulse 2s infinite;
                    z-index: 9999 !important;
                }
                
                @keyframes marker-drop {
                    0% { transform: translateY(-100px); opacity: 0; }
                    60% { transform: translateY(10px); opacity: 1; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .marker-drop-anim {
                    animation: marker-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                /* GPS Blue Dot Styles */
                @keyframes gps-glow {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
                    70% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                .gps-dot-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                }
                .gps-dot-ring {
                    width: 14px;
                    height: 14px;
                    background-color: #3b82f6;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    animation: gps-glow 2s infinite;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }

                /* Flowing Nav Route Styles */
                @keyframes route-flow {
                    to { stroke-dashoffset: -20; }
                }
                .flowing-route {
                    stroke-dasharray: 8, 8;
                    animation: route-flow 1.2s linear infinite;
                }

                .custom-geojson-tooltip {
                    background: rgba(15, 23, 42, 0.9) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    color: white !important;
                    font-weight: 800 !important;
                    font-size: 10px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    padding: 6px 12px !important;
                    border-radius: 10px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }

                /* Menghilangkan kotak outline hitam (focus ring) pada elemen SVG/GeoJSON */
                .leaflet-interactive:focus,
                path:focus,
                svg:focus {
                    outline: none !important;
                }

            `}</style>

            <div className="flex flex-1 overflow-hidden relative w-full">

                {/* ===================== SIDEBAR ===================== */}
                <div className={`backdrop-blur-md bg-white/95 border border-gray-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-[2000] flex flex-col absolute transform transition-all duration-500 ease-in-out shrink-0 overflow-hidden
                    top-2 bottom-2 left-2 w-[calc(100vw-16px)] rounded-xl
                    md:top-2 md:bottom-2 md:left-2 md:w-[380px] md:rounded-[22px]
                    ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none'}`}
                >
                    {/* HEADER */}
                    <div className="px-6 py-5 border-b border-gray-100/80 bg-white/50 backdrop-blur-md sticky top-0 z-50 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20 transition-transform hover:rotate-6">
                                <MapPin className="text-white" size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 text-sm leading-tight uppercase tracking-wider">Peta Wisata</h2>
                                <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-0.5">Kabupaten Pemalang</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">

                        {/* Search and Kategori moved to floating layout on the Map */}

                        {/* TITIK AWAL */}
                        <div className="px-6 pt-6 pb-4">
                            {userLoc ? (
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden group">
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                                                    <Navigation size={12} fill="white" className="rotate-45" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">GPS Aktif</span>
                                            </div>
                                            <button onClick={clearLocation} className="text-[9px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-lg transition-colors border border-white/10">Hapus</button>
                                        </div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Radius Pencarian</span>
                                            <span className="text-xs font-black">{radius} km</span>
                                        </div>
                                        <input type="range" min="1" max="50" className="w-full accent-white cursor-pointer h-1 bg-white/20 rounded-lg appearance-none" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} />
                                        <div className="flex justify-between text-[8px] font-bold text-blue-200 mt-1.5 uppercase tracking-tighter"><span>1 km</span><span>50 km</span></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Tentukan Titik Awal</p>
                                    <div className="flex gap-2">
                                        <button onClick={getLocationGPS}
                                            className="flex-1 flex flex-col items-center justify-center gap-1.5 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] group"
                                        >
                                            <Compass size={16} className="group-hover:rotate-12 transition-transform" />
                                            <span className="text-[9px] font-black uppercase tracking-wider">GPS Otomatis</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsSelectingLoc(!isSelectingLoc); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                            className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all active:scale-[0.98]
                                                ${isSelectingLoc
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/15 animate-pulse'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-100'}`}
                                        >
                                            <MapPin size={16} />
                                            <span className="text-[9px] font-black uppercase tracking-wider">{isSelectingLoc ? 'Klik Peta' : 'Pilih Manual'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RINGKASAN */}
                        <div className="px-6 pb-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Ringkasan</p>
                            <div className="grid grid-cols-3 gap-2.5">
                                <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-3 text-center transition-all hover:bg-blue-50/60 shadow-sm">
                                    <p className="text-xl font-black text-blue-600 leading-none">{filteredWisata.length}</p>
                                    <p className="text-[8px] text-blue-400 font-black uppercase mt-1.5 tracking-wider">Destinasi</p>
                                </div>
                                <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-2xl p-3 text-center transition-all hover:bg-emerald-50/60 shadow-sm">
                                    <p className="text-xl font-black text-emerald-600 leading-none">5</p>
                                    <p className="text-[8px] text-emerald-400 font-black uppercase mt-1.5 tracking-wider">Kategori</p>
                                </div>
                                <div className={`rounded-2xl p-3 text-center transition-all border shadow-sm
                                    ${userLoc
                                        ? 'bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100/50'
                                        : 'bg-white border-gray-100 text-gray-400'}`}>
                                    <p className={`text-xs font-black uppercase tracking-tighter leading-none ${userLoc ? 'text-purple-600' : 'text-gray-400'}`}>
                                        {userLoc ? 'Aktif' : 'Off'}
                                    </p>
                                    <p className="text-[8px] text-gray-400 font-black uppercase mt-1.5 tracking-wider">GPS</p>
                                </div>
                            </div>
                        </div>

                        {/* HAVERSINE SIMULATOR PANEL */}
                        <div className="px-6 pb-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm transition-all hover:shadow-md">
                                <button
                                    onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
                                    className="w-full flex items-center justify-between font-black text-gray-800 text-[10px] uppercase tracking-[0.15em]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Compass size={15} className="text-blue-500" />
                                        Simulator Matematika GIS
                                    </span>
                                    <span className="text-blue-500 font-bold text-xs">{isSimulatorOpen ? 'Tutup' : 'Buka'}</span>
                                </button>

                                {isSimulatorOpen && (
                                    <div className="mt-3.5 pt-3.5 border-t border-gray-100/80 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {!userLoc ? (
                                            <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed">Tentukan titik awal GPS Anda terlebih dahulu untuk memulai simulasi rumus Haversine.</p>
                                        ) : !selectedWisata ? (
                                            <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed">Pilih atau klik salah satu destinasi wisata di peta/daftar untuk melihat simulasi perhitungan rumusnya.</p>
                                        ) : (
                                            <div className="space-y-2.5 font-mono text-[9px] text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto shadow-inner">
                                                {/* Window Controls */}
                                                <div className="flex items-center justify-between pb-2 border-b border-slate-900 mb-2">
                                                    <div className="flex gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    </div>
                                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-sans">Haversine Engine</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="pb-1.5 border-b border-slate-900">
                                                        <p className="font-bold text-slate-400 uppercase text-[8px] mb-1">Coordinates Input:</p>
                                                        <p><span className="text-rose-400">P1 (User)</span>: {userLoc[0].toFixed(5)}, {userLoc[1].toFixed(5)}</p>
                                                        <p><span className="text-emerald-400">P2 ({selectedWisata.nama_wisata.slice(0, 12)}...)</span>: {parseFloat(selectedWisata.latitude).toFixed(5)}, {parseFloat(selectedWisata.longitude).toFixed(5)}</p>
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-400 uppercase text-[8px] mb-1">1. Delta Lat & Lon (Radian):</p>
                                                        {(() => {
                                                            const lat1 = userLoc[0] * (Math.PI / 180);
                                                            const lat2 = parseFloat(selectedWisata.latitude) * (Math.PI / 180);
                                                            const lon1 = userLoc[1] * (Math.PI / 180);
                                                            const lon2 = parseFloat(selectedWisata.longitude) * (Math.PI / 180);
                                                            const dLat = lat2 - lat1;
                                                            const dLon = lon2 - lon1;
                                                            const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
                                                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                                            const d = 6371 * c;

                                                            return (
                                                                <>
                                                                    <p>dLat = {dLat.toFixed(6)} rad</p>
                                                                    <p>dLon = {dLon.toFixed(6)} rad</p>
                                                                    <p className="font-bold text-slate-400 uppercase text-[8px] mt-2.5 mb-1">2. Hitung Nilai 'a' (Haversine):</p>
                                                                    <p className="text-slate-500 break-all leading-normal">a = sin²(dLat/2) + cos(lat1)·cos(lat2)·sin²(dLon/2)</p>
                                                                    <p>a = <span className="text-amber-400">{a.toFixed(8)}</span></p>
                                                                    <p className="font-bold text-slate-400 uppercase text-[8px] mt-2.5 mb-1">3. Hitung Nilai 'c':</p>
                                                                    <p className="text-slate-500 leading-normal">c = 2 · atan2(√a, √(1-a))</p>
                                                                    <p>c = <span className="text-amber-400">{c.toFixed(8)}</span></p>
                                                                    <p className="font-bold text-slate-400 uppercase text-[8px] mt-2.5 mb-1">4. Hasil Akhir Jarak (R = 6371 km):</p>
                                                                    <p className="text-slate-500 leading-normal">d = R · c</p>
                                                                    <p className="text-cyan-400 font-bold text-xs mt-1">d = {d.toFixed(3)} km</p>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEMUA DESTINASI */}
                        <div className="px-6 pb-12">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Destinasi Populer</p>
                                <button
                                    onClick={() => setIsListExpanded(!isListExpanded)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-gray-700 transition-all active:scale-95"
                                >
                                    <ChevronRight size={15} className={`transition-transform duration-300 ${isListExpanded ? 'rotate-90' : ''}`} strokeWidth={2.5} />
                                </button>
                            </div>

                            {isListExpanded && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    {filteredWisata.length > 0 ? (
                                        <div className="space-y-2.5">
                                            {filteredWisata.map((item, index) => (
                                                <WisataCard key={item.wisata_id} item={item} index={index}
                                                    userLoc={userLoc} activeRouteName={activeRouteName} routeInfo={routeInfo}
                                                    onCekJalur={() => getRoute(item.latitude, item.longitude, item.nama_wisata)}
                                                    formatDuration={formatDuration}
                                                    onSelect={(w) => { setSelectedWisata(w); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100/80">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                                                <Search size={28} strokeWidth={1.5} />
                                            </div>
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Tidak ditemukan</p>
                                            <p className="text-[10px] text-gray-400 mt-1.5 font-bold">Coba kata kunci atau kategori lain</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===================== PETA ===================== */}
                <div className={`flex-1 relative z-0 ${isSelectingLoc ? 'cursor-crosshair' : ''}`}>

                    {/* Floating Search & Category Panel */}
                    <div className={`absolute top-2 z-[1000] transition-all duration-500 ease-in-out flex flex-col gap-2.5 w-[calc(100vw-16px)] md:w-auto
                        ${isSidebarOpen
                            ? 'left-2 md:left-[400px] opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
                            : 'left-2 opacity-100 pointer-events-auto'
                        }`}
                    >
                        {/* Search Bar Container */}
                        <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl p-1.5 border border-gray-100/80 flex items-center gap-2.5 transition-all hover:ring-4 hover:ring-blue-50/50 w-full max-w-[300px] md:max-w-[360px]">
                            {/* Toggle Sidebar Button */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 shrink-0
                                    ${isSidebarOpen ? 'bg-blue-50 text-blue-500' : 'bg-blue-500 text-white shadow-md shadow-blue-100 hover:bg-blue-600'}`}
                            >
                                <Menu size={16} strokeWidth={2.5} />
                            </button>

                            {/* Search Input */}
                            <div className="flex-1 flex items-center gap-2 px-1">
                                <Search size={15} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Cari destinasi, lokasi..."
                                    className="w-full bg-transparent text-xs font-bold text-gray-700 focus:outline-none placeholder-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-600 transition shrink-0">
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Pills Slider */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth w-full md:w-auto">
                            {KATEGORI_LIST.map((kat) => {
                                const isActive = kategori === kat.value;
                                return (
                                    <button
                                        key={kat.value}
                                        onClick={() => setKategori(kat.value)}
                                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-[14px] text-[10px] font-black uppercase tracking-wider transition-all duration-300 shrink-0 border shadow-sm active:scale-95
                                            ${isActive
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-400/20 scale-105'
                                                : 'bg-white text-gray-500 border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 hover:text-blue-600'
                                            }`}
                                    >
                                        <span className={`shrink-0 transition-transform ${isActive ? 'scale-110 text-white' : kat.color}`}>
                                            {kat.icon}
                                        </span>
                                        <span>{kat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tombol Atas Kanan */}
                    <div className="absolute top-6 right-6 z-[1000] flex flex-row items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setIsMapLayersOpen(!isMapLayersOpen)}
                                className="flex items-center gap-2.5 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] px-5 py-3 rounded-2xl text-xs font-black text-gray-700 hover:bg-gray-50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all active:scale-95 uppercase tracking-widest"
                            >
                                <Layers size={16} strokeWidth={3} />
                                Peta Dasar
                            </button>
                            {isMapLayersOpen && (
                                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl p-2 w-40 border border-gray-50 flex flex-col gap-1">
                                    {['streets', 'minimalist', 'satellite'].map(type => (
                                        <button key={type} onClick={() => { setMapType(type); setIsMapLayersOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors
                                                ${mapType === type ? 'bg-blue-50 text-blue-500' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                                        >
                                            {type === 'streets' ? 'Voyager' : type === 'minimalist' ? 'Minimalist' : 'Satellite'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/" className="flex items-center gap-2.5 bg-blue-500 shadow-[0_10px_25px_rgba(59,130,246,0.25)] px-5 py-3 rounded-2xl text-xs font-black text-white hover:bg-blue-600 transition-all hover:shadow-[0_12px_30px_rgba(59,130,246,0.35)] active:scale-95 uppercase tracking-widest">
                            <Home size={16} strokeWidth={3} />
                            Beranda
                        </Link>
                    </div>

                    {/* Instruksi pilih lokasi */}
                    {isSelectingLoc && (
                        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[1000] bg-gray-900/90 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl animate-bounce border border-gray-700 uppercase tracking-widest">
                            Klik area mana saja di Peta!
                        </div>
                    )}

                    {/* Floating Legend Card */}
                    <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-md rounded-[20px] p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-white/60 flex flex-col gap-2 w-40 transition-all duration-300">
                        <h4 className="text-[9px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                            <Layers size={11} className="text-blue-500" />
                            Legenda Peta
                        </h4>
                        <div className="flex flex-col gap-2">
                            {/* Bahari */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(59,130,246,0.18)] shrink-0">
                                    <Waves size={11} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">Bahari</span>
                            </div>

                            {/* Alam */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(16,185,129,0.18)] shrink-0">
                                    <TreesIcon size={11} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">Alam</span>
                            </div>

                            {/* Religi */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(168,85,247,0.18)] shrink-0">
                                    <MosqueIcon size={11} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">Religi</span>
                            </div>

                            {/* Buatan */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(249,115,22,0.18)] shrink-0">
                                    <FerrisWheelIcon size={11} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">Buatan</span>
                            </div>

                            {/* Kuliner */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(236,72,153,0.18)] shrink-0">
                                    <UtensilsIcon size={11} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">Kuliner</span>
                            </div>

                            {/* Batas Kabupaten */}
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                    <div className="w-5 h-[2px] bg-blue-600 rounded-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600">Batas Kabupaten</span>
                            </div>
                        </div>
                    </div>

                    <MapContainer center={centerPemalang} zoom={11} scrollWheelZoom={true} zoomControl={false} className="w-full h-full relative z-0">
                        <MapResizer isSidebarOpen={isSidebarOpen} />
                        <MapFlyer userLoc={userLoc} selectedWisata={selectedWisata} />
                        <TileLayer attribution='© OpenStreetMap' url={mapTiles[mapType]} />
                        <ZoomLocateControls
                            onLocate={() => getLocationGPS()}
                            onSelectManual={() => { setIsSelectingLoc(!isSelectingLoc); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                            isSelectingLoc={isSelectingLoc}
                            userLoc={userLoc}
                        />
                        <MapEvents isSelectingLoc={isSelectingLoc} onLocationSelected={handleLocationSelected} onMapClick={() => setSelectedWisata(null)} />

                        {dataBatasPemalang && (
                            <GeoJSON 
                                data={dataBatasPemalang} 
                                style={pemalangStyle} 
                            />
                        )}
                        {routePath && <Polyline positions={routePath} color="#3b82f6" weight={5} opacity={0.85} pathOptions={{ className: 'flowing-route' }} />}

                        {userLoc && (
                            <>
                                <Marker position={userLoc} icon={userIcon}>
                                    <Popup className="custom-user-popup" closeButton={false}>
                                        <div className="p-3.5 flex flex-col gap-2.5 items-center text-center">
                                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm shadow-blue-100/50 shrink-0">
                                                <MapPin size={16} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-wider leading-none">Titik Awal</h4>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Pilihan Anda</p>
                                            </div>
                                            <button 
                                                onClick={clearLocation}
                                                className="w-full py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all duration-200"
                                            >
                                                Hapus Titik
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle 
                                    center={userLoc} 
                                    radius={radius * 1000} 
                                    pathOptions={{ 
                                        color: '#2563eb',       // Biru solid lingkar luar
                                        fillColor: '#3b82f6',   // Biru terang area dalam
                                        fillOpacity: 0.08, 
                                        weight: 1.5, 
                                        dashArray: '8, 8'       // Gaya radar putus-putus
                                    }} 
                                />
                            </>
                        )}

                        {mapWisata.map((item) => {
                            if (!item.latitude || !item.longitude) return null;

                            // Cek apakah di dalam radius
                            const isInside = userLoc
                                ? calculateHaversine(userLoc[0], userLoc[1], parseFloat(item.latitude), parseFloat(item.longitude)) <= radius
                                : true;

                            const isActive = selectedWisata?.wisata_id === item.wisata_id;

                            return (
                                <Marker
                                    key={item.wisata_id}
                                    position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
                                    icon={createCustomIcon(item.nama_kategori, isActive, !isInside)}
                                    eventHandlers={{ click: () => setSelectedWisata(item) }}
                                >
                                </Marker>
                            );
                        })}
                    </MapContainer>

                    {/* BOTTOM DESTINATION CARD */}
                    {selectedWisata && (
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[500px] z-[3000] animate-in slide-in-from-bottom duration-500">
                            <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/50 p-4 relative group overflow-hidden">
                                <button onClick={() => setSelectedWisata(null)}
                                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-90 z-10"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>

                                <div className="flex gap-4">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-gray-100 shrink-0">
                                        <img src={selectedWisata.foto_utama} alt={selectedWisata.nama_wisata} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-full ${getBadgeStyle(selectedWisata.nama_kategori).bg}`}>
                                                    {selectedWisata.nama_kategori?.replace('Wisata ', '')}
                                                </span>
                                            </div>
                                            <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight mb-1">{selectedWisata.nama_wisata}</h3>
                                            <p className="text-xs text-gray-400 font-bold line-clamp-2 leading-relaxed">
                                                {selectedWisata.deskripsi || `Nikmati keindahan ${selectedWisata.nama_wisata} di Kabupaten Pemalang.`}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {selectedWisata.distance && (
                                                <div className="flex items-center gap-1.5 text-blue-500">
                                                    <MapPin size={14} strokeWidth={3} />
                                                    <span className="text-xs font-black">{selectedWisata.distance.toFixed(1)} km</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2.5 mt-2">
                                            <Link to={`/wisata/${selectedWisata.wisata_id}`} className="flex-1 py-3 bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl text-center shadow-lg shadow-blue-100 hover:bg-blue-600 transition active:scale-95">Lihat Detail</Link>
                                            <button
                                                onClick={() => getRoute(selectedWisata.latitude, selectedWisata.longitude, selectedWisata.nama_wisata)}
                                                className="px-6 py-3 bg-gray-50 text-gray-700 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition flex items-center gap-2 active:scale-95"
                                            >
                                                <Navigation size={14} strokeWidth={3} />
                                                Rute
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapPage;
