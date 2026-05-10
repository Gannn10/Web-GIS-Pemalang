import React, { useState, useEffect } from 'react';
import { Link , useSearchParams} from 'react-router-dom'; 
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Circle, useMapEvents, Polyline, useMap, ZoomControl } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// TAMBAHAN: Import SweetAlert2
import Swal from 'sweetalert2';

import dataBatasPemalang from './pemalang.json';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const calculateHaversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
};

const MapResizer = ({ isSidebarOpen }) => {
    const map = useMap();
    useEffect(() => {
        const timeout = setTimeout(() => { map.invalidateSize(); }, 300);
        return () => clearTimeout(timeout);
    }, [isSidebarOpen, map]);
    return null;
};

const MapEvents = ({ isSelectingLoc, onLocationSelected }) => {
    useMapEvents({ click(e) { if (isSelectingLoc) onLocationSelected([e.latlng.lat, e.latlng.lng]); } });
    return null;
};

// Taruh di atas const MapPage = () => {
// =============================================
// KOMPONEN WISATA CARD (sidebar list)
// =============================================
const WisataCard = ({ item, index, userLoc, activeRouteName, routeInfo, onCekJalur, formatDuration }) => {
    const [expanded, setExpanded] = useState(false);
    const isActive = activeRouteName === item.nama_wisata;

    const getBadgeStyle = (kategori) => {
        const styles = {
            'Wisata Bahari': 'bg-sky-100 text-sky-700',
            'Wisata Alam': 'bg-emerald-100 text-emerald-700',
            'Wisata Buatan': 'bg-violet-100 text-violet-700',
            'Wisata Religi': 'bg-amber-100 text-amber-700',
        };
        return styles[kategori] || 'bg-gray-100 text-gray-600';
    };

    const getKategoriIcon = (kategori) => {
        const icons = {
            'Wisata Bahari': '🏖️',
            'Wisata Alam': '⛰️',
            'Wisata Buatan': '🎡',
            'Wisata Religi': '🕌',
        };
        return icons[kategori] || '📍';
    };

    return (
        <div className={`rounded-2xl border transition-all duration-200 overflow-hidden
            ${isActive
                ? 'border-blue-300 bg-blue-50 shadow-md'
                : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'
            }`}
        >
            <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
                <div className="flex items-center gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        {item.foto_utama ? (
                            <img
                                src={item.foto_utama}
                                alt={item.nama_wisata}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=📍'; }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                                {getKategoriIcon(item.nama_kategori)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                            {item.nama_wisata}
                        </p>
                        <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-semibold mt-0.5 ${getBadgeStyle(item.nama_kategori)}`}>
                            {getKategoriIcon(item.nama_kategori)} {item.nama_kategori?.replace('Wisata ', '')}
                        </span>
                        {userLoc && typeof item.distance === 'number' && (
                            <p className="text-[11px] font-bold text-blue-500 mt-0.5">
                                📍 {item.distance.toFixed(1)} km dari Anda
                            </p>
                        )}
                    </div>

                    {/* Chevron */}
                    <span className={`text-gray-300 text-[10px] shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
            </button>

            {/* Expanded */}
            {expanded && (
                <div className="px-3 pb-3 border-t border-gray-100 pt-2">
                    {isActive && routeInfo && (
                        <div className="flex gap-3 bg-blue-100 rounded-xl px-3 py-2 mb-2">
                            <div className="flex-1 text-center">
                                <p className="text-[10px] text-blue-500 font-medium">Jarak Darat</p>
                                <p className="text-sm font-bold text-blue-700">{routeInfo.distance} km</p>
                            </div>
                            <div className="w-px bg-blue-200"></div>
                            <div className="flex-1 text-center">
                                <p className="text-[10px] text-blue-500 font-medium">Estimasi</p>
                                <p className="text-sm font-bold text-blue-700">{formatDuration(routeInfo.duration)}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={onCekJalur}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all
                                ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {isActive ? '📍 Rute Aktif' : '🛣️ Cek Jalur'}
                        </button>
                        <Link
                            to={`/wisata/${item.wisata_id}`}
                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-500 text-white text-center hover:bg-blue-600 transition-all"
                        >
                            Detail ➔
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};


const MapPage = () => {
    const [wisataList, setWisataList] = useState([]);
    const [filteredWisata, setFilteredWisata] = useState([]);
    const [kategori, setKategori] = useState('');
    const [search, setSearch] = useState('');
    
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    const getSavedLoc = () => {
        try { const saved = localStorage.getItem('userLoc_skripsi'); if (saved) return JSON.parse(saved); } catch(e) {}
        return null;
    };

    const [userLoc, setUserLoc] = useState(getSavedLoc());
    const [radius, setRadius] = useState(() => { const savedRad = localStorage.getItem('userRad_skripsi'); return savedRad ? parseInt(savedRad) : 15; });
    const [isSelectingLoc, setIsSelectingLoc] = useState(false);
    const [routePath, setRoutePath] = useState(null);
    const [activeRouteName, setActiveRouteName] = useState("");
    const [routeInfo, setRouteInfo] = useState(null);
    const [searchParams] = useSearchParams();

    const centerPemalang = [-7.0125, 109.4312];
    const pemalangStyle = { color: "#3b82f6", weight: 2, fillColor: "#60a5fa", fillOpacity: 0.1 };

    useEffect(() => { if (userLoc) localStorage.setItem('userLoc_skripsi', JSON.stringify(userLoc)); else localStorage.removeItem('userLoc_skripsi'); }, [userLoc]);
    useEffect(() => { localStorage.setItem('userRad_skripsi', radius.toString()); }, [radius]);

    useEffect(() => {
    const fetchWisata = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/wisata');
            const data = res.data.data || [];
            setWisataList(data);
            setFilteredWisata(data);

            // Auto-highlight wisata dari query param ?wisata=ID
            const wisataId = searchParams.get('wisata');
            if (wisataId) {
                const target = data.find(w => w.wisata_id == wisataId);
                if (target) {
                    setSearch(target.nama_wisata);
                }
            }
        } catch (error) { console.error("Gagal mengambil data:", error); }
         };
          fetchWisata();
        }, []);

    const getLocationGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => { setUserLoc([position.coords.latitude, position.coords.longitude]); setIsSelectingLoc(false); resetRoute(); },
                (error) => {
                    // MENGGUNAKAN SWEETALERT2
                    Swal.fire({
                        icon: 'warning',
                        title: 'Akses GPS Ditolak',
                        text: 'Gagal mengambil lokasi GPS. Silakan gunakan fitur "Pilih Manual di Peta".',
                        confirmButtonColor: '#3b82f6',
                        confirmButtonText: 'Mengerti'
                    });
                }
            );
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Tidak Didukung',
                text: 'Browser Anda tidak mendukung fitur Geolocation.',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleLocationSelected = (coords) => { setUserLoc(coords); setIsSelectingLoc(false); resetRoute(); };
    const resetRoute = () => { setRoutePath(null); setActiveRouteName(""); setRouteInfo(null); };
    const clearLocation = () => { setUserLoc(null); resetRoute(); setIsSelectingLoc(false); };

    const getRoute = async (destLat, destLon, destName) => {
        if (!userLoc) {
            // MENGGUNAKAN SWEETALERT2
            return Swal.fire({
                icon: 'info',
                title: 'Tentukan Titik Awal',
                text: 'Silakan tentukan titik awal Anda terlebih dahulu di menu sebelah kiri!',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Oke'
            });
        }
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${userLoc[1]},${userLoc[0]};${parseFloat(destLon)},${parseFloat(destLat)}?overview=full&geometries=geojson`;
            const response = await axios.get(url);
            if (response.data.routes && response.data.routes.length > 0) {
                const routeData = response.data.routes[0];
                setRoutePath(routeData.geometry.coordinates.map(c => [c[1], c[0]])); 
                setActiveRouteName(destName);
                setRouteInfo({ distance: (routeData.distance / 1000).toFixed(1), duration: Math.ceil(routeData.duration / 60) });
                if (window.innerWidth < 768) setIsSidebarOpen(false);
            }
        } catch (error) { 
            Swal.fire({
                icon: 'error',
                title: 'Rute Gagal',
                text: 'Terjadi kesalahan saat mengambil data rute dari server.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const formatDuration = (minutes) => {
        if (minutes < 60) return `${minutes} Menit`;
        const hours = Math.floor(minutes / 60); const mins = minutes % 60;
        return `${hours} Jam ${mins > 0 ? `${mins} Menit` : ''}`;
    };

    useEffect(() => {
        let result = wisataList;
        if (kategori) result = result.filter(w => w.nama_kategori === kategori);
        if (search) result = result.filter(w => w.nama_wisata && w.nama_wisata.toLowerCase().includes(search.toLowerCase()));
        if (userLoc) {
            result = result.map(w => {
                if(w.latitude && w.longitude) return { ...w, distance: calculateHaversine(userLoc[0], userLoc[1], parseFloat(w.latitude), parseFloat(w.longitude)) };
                return { ...w, distance: null };
            });
            result = result.filter(w => w.distance !== null && w.distance !== undefined && w.distance <= radius).sort((a, b) => a.distance - b.distance);
        } else { result = result.map(w => ({ ...w, distance: undefined })); }
        setFilteredWisata(result);
    }, [kategori, search, wisataList, userLoc, radius]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-sans relative">
            
            {/* SUNTIKAN CSS: Custom Scrollbar Sidebar & Zoom Control */}
            <style dangerouslySetInnerHTML={{__html: `
                /* CUSTOM SCROLLBAR UNTUK SIDEBAR */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1; 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; 
                }

                /* KOTAK ZOOM CONTROL */
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    border-radius: 10px !important;
                    overflow: hidden;
                    margin-bottom: 24px !important;
                    margin-right: 24px !important;
                }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                    background-color: white !important;
                    color: #4b5563 !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    width: 38px !important;
                    height: 38px !important;
                    line-height: 38px !important;
                    font-size: 18px !important;
                    font-weight: bold !important;
                    transition: all 0.2s !important;
                }
                .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
                    background-color: #f8fafc !important;
                    color: #2563eb !important;
                }
                .leaflet-control-zoom-out { border-bottom: none !important; }
            `}} />

                <header className="hidden md:flex bg-white border-b border-gray-100 py-3 px-6 z-20 justify-between items-center relative shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">
                        Peta <span className="text-blue-600">Wisata</span>
                    </h1>
                    <div className="flex items-center gap-2 -mt-1">
                        <span className="h-[2px] w-4 bg-blue-500 rounded-full"></span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
                            Kabupaten Pemalang
                        </p>
                    </div>
                </div>
            {/* Tombol Beranda  */}
             <Link 
                to="/" 
                className="group flex items-center gap-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 pl-4 pr-1.5 py-1.5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
                <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors">
                    Beranda
                </span>
                
                {/* Kotak Ikon yang Lebih Kecil & Minimalis */}
                <div className="bg-blue-600 w-7 h-7 rounded-xl flex items-center justify-center shadow-blue-200 shadow-lg group-hover:scale-110 transition-transform">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3.5 w-3.5 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={3}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </div>
            </Link>
            </header>

            <div className="flex flex-1 overflow-hidden relative w-full">
                
               {/* SIDEBAR */}
                <div className={`bg-white shadow-2xl z-[2000] flex flex-col h-full absolute md:relative transform transition-transform duration-300 ease-in-out shrink-0 w-full md:w-[340px]
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}
                >
                    {/* HEADER */}
                    <div className="px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-50 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                                    <span className="text-lg">🗺️</span>
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-gray-800 text-base leading-none">Peta Wisata</h2>
                                    <p className="text-[11px] text-gray-400 mt-0.5">Kabupaten Pemalang</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
                            >✕</button>
                        </div>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto">

                        {/* SEARCH */}
                        <div className="px-4 pt-4 pb-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari destinasi wisata..."
                                    className="w-full pl-4 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:bg-white focus:border-transparent outline-none transition"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>
                        </div>

                        {/* KATEGORI */}
                        <div className="px-4 pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Kategori Wisata</p>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[
                                    { label: 'Semua', icon: '🗺️', value: '' },
                                    { label: 'Bahari', icon: '🏖️', value: 'Wisata Bahari' },
                                    { label: 'Alam', icon: '⛰️', value: 'Wisata Alam' },
                                    { label: 'Religi', icon: '🕌', value: 'Wisata Religi' },
                                    { label: 'Buatan', icon: '🎡', value: 'Wisata Buatan' },
                                ].map((kat) => (
                                    <button
                                        key={kat.value}
                                        onClick={() => setKategori(kat.value)}
                                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-bold border-2 transition-all active:scale-95
                                            ${kategori === kat.value
                                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105'
                                                : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span className="text-xl mb-1">{kat.icon}</span>
                                        <span>{kat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TITIK AWAL */}
                        <div className="px-4 pb-4">
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Titik Awal</p>

                            {userLoc ? (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                            <span className="text-sm font-bold text-green-700">Lokasi Aktif</span>
                                        </div>
                                        <button
                                            onClick={clearLocation}
                                            className="text-xs text-red-400 hover:text-red-600 font-semibold bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-green-600 font-mono mb-3">
                                        {userLoc[0].toFixed(5)}, {userLoc[1].toFixed(5)}
                                    </p>
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs text-gray-500 font-medium">Radius Haversine</span>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">{radius} km</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="50"
                                            className="w-full accent-blue-500 cursor-pointer"
                                            value={radius}
                                            onChange={(e) => setRadius(parseInt(e.target.value))}
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                                            <span>1 km</span><span>50 km</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={getLocationGPS}
                                        className="flex flex-col items-center justify-center gap-1.5 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition shadow-md active:scale-95"
                                    >
                                        <span className="text-2xl">📡</span>
                                        <span className="text-xs font-bold">GPS Otomatis</span>
                                        <span className="text-[10px] text-blue-200">Temukan lokasi terdekat</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsSelectingLoc(!isSelectingLoc);
                                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                                        }}
                                        className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border-2 transition active:scale-95
                                            ${isSelectingLoc
                                                ? 'bg-amber-50 border-amber-400 text-amber-600 animate-pulse'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        <span className="text-2xl">📌</span>
                                        <span className="text-xs font-bold">{isSelectingLoc ? 'Klik di Peta!' : 'Pilih di Peta'}</span>
                                        <span className={`text-[10px] ${isSelectingLoc ? 'text-amber-400' : 'text-gray-400'}`}>
                                            {isSelectingLoc ? 'Tap lokasi manapun' : 'Pilih lokasi manual'}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* RINGKASAN */}
                        <div className="px-4 pb-4">
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Ringkasan</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
                                    <p className="text-xl font-extrabold text-blue-600">{filteredWisata.length}</p>
                                    <p className="text-[11px] text-blue-400 font-medium mt-0.5">Destinasi</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
                                    <p className="text-xl font-extrabold text-orange-500">5</p>
                                    <p className="text-[11px] text-orange-400 font-medium mt-0.5">Kategori</p>
                                </div>
                                <div className={`rounded-2xl p-3 text-center border ${userLoc ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                                    <p className={`text-xl font-extrabold ${userLoc ? 'text-green-500' : 'text-gray-400'}`}>
                                        {userLoc ? 'ON' : 'OFF'}
                                    </p>
                                    <p className={`text-[11px] font-medium mt-0.5 ${userLoc ? 'text-green-400' : 'text-gray-400'}`}>GPS</p>
                                </div>
                            </div>
                        </div>

                        {/* DESTINASI POPULER */}
                        <div className="px-4 pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Destinasi Populer</p>
                            </div>
                            <div className="space-y-2">
                                {wisataList
                                    .sort((a, b) => (b.pengunjung_2024 || 0) - (a.pengunjung_2024 || 0))
                                    .slice(0, 3)
                                    .map((item) => (
                                        <Link
                                            key={item.wisata_id}
                                            to={`/wisata/${item.wisata_id}`}
                                            className="flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition group"
                                        >
                                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                                                {item.foto_utama ? (
                                                    <img
                                                        src={item.foto_utama}
                                                        alt={item.nama_wisata}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl bg-blue-100">🏝️</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition">{item.nama_wisata}</p>
                                                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-0.5
                                                    ${item.nama_kategori === 'Wisata Bahari' ? 'bg-sky-100 text-sky-700' :
                                                    item.nama_kategori === 'Wisata Alam' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.nama_kategori === 'Wisata Buatan' ? 'bg-violet-100 text-violet-700' :
                                                    'bg-amber-100 text-amber-700'}`}>
                                                    {item.nama_kategori?.replace('Wisata ', '')}
                                                </span>
                                                {item.pengunjung_2024 > 0 && (
                                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                                        👥 {item.pengunjung_2024?.toLocaleString('id-ID')} pengunjung
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-gray-300 text-xs shrink-0">›</span>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="mx-4 h-px bg-gray-100 mb-4"></div>

                        {/* SEMUA DESTINASI */}
                        <div className="px-4 pb-8">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Semua Destinasi</p>
                                <span className="bg-blue-100 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                    {filteredWisata.length} tempat
                                </span>
                            </div>

                            {filteredWisata.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredWisata.map((item, index) => (
                                        <WisataCard
                                            key={item.wisata_id}
                                            item={item}
                                            index={index}
                                            userLoc={userLoc}
                                            activeRouteName={activeRouteName}
                                            routeInfo={routeInfo}
                                            onCekJalur={() => getRoute(item.latitude, item.longitude, item.nama_wisata)}
                                            formatDuration={formatDuration}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                                        <span className="text-2xl">🔍</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500">Tidak ditemukan</p>
                                    <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>     
              
                {/* FULL PETA */}
                <div className={`flex-1 relative z-0 ${isSelectingLoc ? 'cursor-crosshair' : ''}`}>
                    
                    {!isSidebarOpen && (
                        <div className="absolute top-4 md:top-6 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 w-[90%] md:w-[380px] max-w-[400px] z-[1000] flex items-center bg-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] rounded-full px-2 py-1.5 border border-gray-100 transition-all duration-300">
                            <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition flex-shrink-0 text-gray-600" title="Buka Menu">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                            <input type="text" placeholder="Cari wisata di Pemalang..." className="flex-1 bg-transparent px-3 py-2 text-[15px] text-gray-800 focus:outline-none placeholder-gray-400 font-medium" value={search} onChange={(e) => setSearch(e.target.value)} />
                            {search && <button onClick={() => setSearch('')} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition mr-1">✕</button>}
                            <div className="h-6 border-r border-gray-300 mx-1"></div>
                            <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 text-blue-500 transition flex-shrink-0" title="Ke Beranda">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            </Link>
                        </div>
                    )}

                    {isSelectingLoc && (
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-gray-900/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg animate-bounce pointer-events-none border border-gray-700 whitespace-nowrap">👇 Klik area mana saja di Peta!</div>
                    )}

                    <MapContainer center={centerPemalang} zoom={11} scrollWheelZoom={true} zoomControl={false} className="w-full h-full relative z-0">
                        <MapResizer isSidebarOpen={isSidebarOpen} />
                        <TileLayer attribution='© OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <ZoomControl position="bottomright" />
                        <MapEvents isSelectingLoc={isSelectingLoc} onLocationSelected={handleLocationSelected} />

                        {dataBatasPemalang && <GeoJSON data={dataBatasPemalang} style={pemalangStyle} />}
                        {routePath && <Polyline positions={routePath} color="#3b82f6" weight={5} opacity={0.8} />}

                        {userLoc && (
                            <>
                                <Marker position={userLoc} icon={userIcon}><Popup><strong className="text-red-500 text-center block text-sm">Titik Awal Anda</strong></Popup></Marker>
                                <Circle center={userLoc} radius={radius * 1000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.08, weight: 1.5 }} />
                            </>
                        )}

                        {filteredWisata.map((item) => {
                            if (!item.latitude || !item.longitude) return null;
                            return (
                                <Marker key={item.wisata_id} position={[parseFloat(item.latitude), parseFloat(item.longitude)]}>
                                    <Popup className="custom-popup" style={{ padding: 0, margin: 0 }}>
                                        <div className="w-72 -m-[13px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                                            {/* Foto */}
                                            <div className="relative h-36 bg-gray-100">
                                                {item.foto_utama ? (
                                                    <img
                                                        src={item.foto_utama}
                                                        alt={item.nama_wisata}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x150'; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-100 to-blue-200">🏝️</div>
                                                )}
                                                {/* Badge kategori */}
                                                <div className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm
                                                    ${item.nama_kategori === 'Wisata Bahari' ? 'bg-sky-500/90 text-white' :
                                                    item.nama_kategori === 'Wisata Alam' ? 'bg-emerald-500/90 text-white' :
                                                    item.nama_kategori === 'Wisata Buatan' ? 'bg-violet-500/90 text-white' :
                                                    'bg-amber-500/90 text-white'}`}>
                                                    {item.nama_kategori?.replace('Wisata ', '')}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3 bg-white">
                                                <h3 className="font-bold text-gray-800 text-base mb-1">{item.nama_wisata}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                                    📍 {item.alamat || `Kec. ${item.kecamatan}, Kab. Pemalang`}
                                                </p>

                                                {/* Stats */}
                                                <div className="flex gap-2 mb-3">
                                                    <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                                                        <p className="text-xs font-bold text-gray-700">
                                                            {item.harga_tiket === 0 ? 'Gratis' : `Rp ${item.harga_tiket?.toLocaleString('id-ID')}`}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">Tiket Masuk</p>
                                                    </div>
                                                    {typeof item.distance === 'number' && (
                                                        <div className="flex-1 bg-blue-50 rounded-xl p-2 text-center">
                                                            <p className="text-xs font-bold text-blue-600">{item.distance.toFixed(1)} km</p>
                                                            <p className="text-[10px] text-blue-400">Dari Anda</p>
                                                        </div>
                                                    )}
                                                    {activeRouteName === item.nama_wisata && routeInfo && (
                                                        <div className="flex-1 bg-green-50 rounded-xl p-2 text-center">
                                                            <p className="text-xs font-bold text-green-600">{routeInfo.distance} km</p>
                                                            <p className="text-[10px] text-green-400">Via Jalan</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Tombol */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => getRoute(item.latitude, item.longitude, item.nama_wisata)}
                                                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                                                    >
                                                        🛣️ Rute
                                                    </button>
                                                    <Link
                                                        to={`/wisata/${item.wisata_id}`}
                                                        className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1"
                                                    >
                                                        Detail ➔
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                 </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapPage;