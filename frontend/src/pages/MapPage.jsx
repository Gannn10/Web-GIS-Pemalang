import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
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

    const centerPemalang = [-7.0125, 109.4312];
    const pemalangStyle = { color: "#3b82f6", weight: 2, fillColor: "#60a5fa", fillOpacity: 0.1 };

    useEffect(() => { if (userLoc) localStorage.setItem('userLoc_skripsi', JSON.stringify(userLoc)); else localStorage.removeItem('userLoc_skripsi'); }, [userLoc]);
    useEffect(() => { localStorage.setItem('userRad_skripsi', radius.toString()); }, [radius]);

    useEffect(() => {
        const fetchWisata = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/wisata');
                setWisataList(res.data.data || []);
                setFilteredWisata(res.data.data || []);
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

            <header className="hidden md:flex bg-white shadow-sm py-3 px-6 z-20 justify-between items-center relative shrink-0">
                <h1 className="text-xl font-extrabold text-gray-800">Peta Pariwisata <span className="text-blue-500">Pemalang</span></h1>
                <Link to="/" className="text-gray-500 hover:text-blue-500 font-medium transition flex items-center gap-1.5 text-sm bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    <span>←</span> Beranda
                </Link>
            </header>

            <div className="flex flex-1 overflow-hidden relative w-full">
                
                {/* SIDEBAR PANEL (Ditambahkan class custom-scrollbar) */}
                <div className={`bg-white/95 backdrop-blur-sm shadow-[4px_0_24px_rgba(0,0,0,0.08)] z-[2000] flex flex-col h-full absolute md:relative transform transition-transform duration-300 ease-in-out border-r border-gray-100 shrink-0 w-full md:w-[380px] custom-scrollbar overflow-y-auto
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
                        <h2 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                            <span>🗺️</span> Menu Pemetaan
                        </h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full font-bold transition-all active:scale-95" title="Tutup Menu">✕</button>
                    </div>

                    <div className="p-5">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
                            <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">🔍 Filter Pencarian</h2>
                            <input type="text" placeholder="Ketik nama wisata..." className="w-full p-2.5 mb-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition cursor-pointer" value={kategori} onChange={(e) => setKategori(e.target.value)}>
                                <option value="">Semua Kategori Wisata</option>
                                <option value="Wisata Bahari">Wisata Bahari</option>
                                <option value="Wisata Alam">Wisata Alam</option>
                                <option value="Wisata Buatan">Wisata Buatan</option>
                                <option value="Wisata Religi">Wisata Religi</option>
                            </select>
                        </div>

                        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 mb-6 relative">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">📍 Tentukan Titik Awal</h3>
                                {userLoc && <button onClick={clearLocation} className="text-[10px] bg-red-100 text-red-600 hover:bg-red-500 hover:text-white px-2 py-1 rounded font-bold transition-colors shadow-sm flex items-center gap-1">🗑️ Hapus</button>}
                            </div>
                            <button onClick={getLocationGPS} className="w-full py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-600 transition mb-2">Gunakan GPS Otomatis</button>
                            <button onClick={() => { setIsSelectingLoc(!isSelectingLoc); if(userLoc) resetRoute(); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`w-full py-2 text-sm font-semibold rounded-lg shadow-sm transition border-2 ${isSelectingLoc ? 'bg-amber-100 border-amber-400 text-amber-700 animate-pulse' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
                                {isSelectingLoc ? 'Pilih Titik di Peta (Batal)' : 'Pilih Manual di Peta'}
                            </button>
                            {userLoc && !isSelectingLoc && (
                                <div className="mt-4 pt-3 border-t border-blue-200">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex justify-between"><span>Batas Radius (Haversine):</span><span className="text-blue-600 font-bold">{radius} Km</span></label>
                                    <input type="range" min="1" max="50" className="w-full accent-blue-500 cursor-pointer" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} />
                                </div>
                            )}
                        </div>

                        <h3 className="font-bold text-gray-700 text-sm mb-3 flex justify-between items-center px-1"><span>Rekomendasi Terdekat</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{filteredWisata.length}</span></h3>
                        <div className="space-y-3 pb-6">
                            {filteredWisata.length > 0 ? (
                                filteredWisata.map((item, index) => (
                                    <div key={item.wisata_id} className={`bg-white border rounded-xl p-3 shadow-sm hover:shadow transition-shadow relative overflow-hidden group ${activeRouteName === item.nama_wisata ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="pr-12"><h4 className="font-bold text-gray-800 text-[0.9rem] leading-tight">{index + 1}. {item.nama_wisata}</h4><span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md mt-1.5 inline-block">{item.nama_kategori}</span></div>
                                            {typeof item.distance === 'number' && <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-bl-xl border-l border-b border-blue-100">{item.distance.toFixed(1)} Km</div>}
                                        </div>
                                        {activeRouteName === item.nama_wisata && routeInfo && (
                                            <div className="my-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                                                <div className="flex justify-between text-xs text-blue-800 font-medium"><span>🚗 Darat:</span><span className="font-bold">{routeInfo.distance} Km</span></div>
                                                <div className="flex justify-between text-xs text-blue-800 font-medium mt-1"><span>⏱️ Waktu:</span><span className="font-bold">{formatDuration(routeInfo.duration)}</span></div>
                                            </div>
                                        )}
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                            {/* Klik Cek Jalur memicu SweetAlert kalau belum ada titik awal */}
                                            <button onClick={() => getRoute(item.latitude, item.longitude, item.nama_wisata)} className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition flex items-center justify-center gap-1 ${activeRouteName === item.nama_wisata ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                {activeRouteName === item.nama_wisata ? '📍 Rute Aktif' : '🛣️ Cek Jalur'}
                                            </button>
                                            <Link to={`/wisata/${item.wisata_id}`} className="flex-1 py-1.5 rounded-md text-[11px] transition flex items-center justify-center gap-1 bg-blue-400 text-white font-normal hover:bg-blue-500 shadow-sm">Detail Wisata ➔</Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-6 bg-white rounded-xl border border-gray-100 border-dashed"><span className="text-2xl block mb-2">🗺️</span><p className="text-xs text-gray-500">Tujuan di luar radius atau tidak ditemukan.</p></div>
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
                                        <div className="w-64 -m-[13px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                                            <div className="relative">
                                                {item.foto_utama ? <img src={item.foto_utama} alt={item.nama_wisata} className="w-full h-32 object-cover" /> : <div className="w-full h-32 bg-gray-200 flex items-center justify-center"><span className="text-gray-400 text-xs">Tanpa foto</span></div>}
                                                <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">{item.nama_kategori}</div>
                                            </div>
                                            <div className="p-4 bg-white">
                                                <h3 className="font-extrabold text-gray-900 text-[15px] mb-1 leading-tight line-clamp-1">{item.nama_wisata}</h3>
                                                <div className="flex items-start gap-1 mb-3"><span className="text-[10px] mt-0.5 opacity-80">📍</span><p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{item.alamat || `${item.kecamatan ? `Kecamatan ${item.kecamatan}, ` : ''}Kabupaten Pemalang`}</p></div>
                                                
                                                {activeRouteName === item.nama_wisata && routeInfo ? (
                                                     <div className="bg-blue-50 p-2 rounded-lg mb-3 border border-blue-100">
                                                        <div className="flex justify-between text-[11px] mb-0.5"><span className="text-gray-600">🚗 Jarak:</span><span className="font-semibold text-blue-700">{routeInfo.distance} Km</span></div>
                                                        <div className="flex justify-between text-[11px]"><span className="text-gray-600">⏱️ Waktu:</span><span className="font-semibold text-blue-700">{formatDuration(routeInfo.duration)}</span></div>
                                                    </div>
                                                ) : (
                                                    typeof item.distance === 'number' && <div className="flex justify-between items-center mb-3 text-[11px] bg-gray-50 p-1.5 rounded border border-gray-100"><span className="text-gray-500 font-medium">📏 Radius:</span><span className="font-bold text-blue-600">{item.distance.toFixed(1)} Km</span></div>
                                                )}

                                                <div className="flex flex-col gap-1.5">
                                                    <button onClick={() => getRoute(item.latitude, item.longitude, item.nama_wisata)} className="w-full text-center bg-gray-50 text-gray-700 border border-gray-200 text-[11px] py-1.5 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm">Cek Waktu & Jalur</button>
                                                    <Link to={`/wisata/${item.wisata_id}`} className="block w-full text-center bg-blue-500 text-white text-[11px] py-1.5 rounded-lg font-semibold hover:bg-blue-600 transition shadow-sm">Lihat Detail Wisata</Link>
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