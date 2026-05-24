import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    ChevronLeft, Share2, Heart, MapPin, Ticket, Clock, 
    Navigation, Compass, Info, CheckCircle2, Image as ImageIcon,
    Map as MapIcon, Star, Phone, Globe, ExternalLink, ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icon Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarkerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const formatHarga = (h) => {
    if (!h || parseInt(h) === 0) return 'Gratis';
    return `Rp ${parseInt(h).toLocaleString('id-ID')}`;
};

const formatJam = (buka, tutup) => {
    if (buka && tutup) return `${buka.substring(0, 5)} – ${tutup.substring(0, 5)} WIB`;
    return '08:00 – 17:00 WIB';
};

const getWeatherDescription = (code) => {
    const wmoCodes = {
        0: { text: 'Cerah', icon: '☀️' },
        1: { text: 'Sebagian Cerah', icon: '🌤️' },
        2: { text: 'Berawan Sebagian', icon: '⛅' },
        3: { text: 'Berawan Tebal', icon: '☁️' },
        45: { text: 'Berkabut', icon: '🌫️' },
        48: { text: 'Rime Kabut', icon: '🌫️' },
        51: { text: 'Gerimis Ringan', icon: '🌦️' },
        53: { text: 'Gerimis Sedang', icon: '🌦️' },
        55: { text: 'Gerimis Lebat', icon: '🌧️' },
        61: { text: 'Hujan Ringan', icon: '🌧️' },
        63: { text: 'Hujan Sedang', icon: '🌧️' },
        65: { text: 'Hujan Lebat', icon: '⛈️' },
        80: { text: 'Hujan Shower Ringan', icon: '🌦️' },
        81: { text: 'Hujan Shower Sedang', icon: '🌧️' },
        82: { text: 'Hujan Shower Lebat', icon: '⛈️' },
        95: { text: 'Badai Petir', icon: '⛈️' },
        96: { text: 'Badai Petir & Es', icon: '⛈️' },
    };
    return wmoCodes[code] || { text: 'Berawan', icon: '⛅' };
};

const DetailWisata = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [wisata, setWisata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tentang');
    const [isSaved, setIsSaved] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(false);

    // Titik Nol Pemalang (Alun-alun) sebagai Fallback
    const ALUN_ALUN_PEMALANG = { lat: -6.8906, lng: 109.3813 };

    // Ambil Data Cuaca Real-time
    useEffect(() => {
        if (!wisata?.latitude || !wisata?.longitude) return;

        const fetchWeather = async () => {
            try {
                setWeatherLoading(true);
                setWeatherError(false);
                const res = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(wisata.latitude)}&longitude=${parseFloat(wisata.longitude)}&current_weather=true`
                );
                if (res.data && res.data.current_weather) {
                    setWeather(res.data.current_weather);
                } else {
                    setWeatherError(true);
                }
            } catch (e) {
                console.error("Gagal mengambil data cuaca:", e);
                setWeatherError(true);
            } finally {
                setWeatherLoading(false);
            }
        };
        fetchWeather();
    }, [wisata]);

    // 1. Ambil Lokasi User
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    // Jika lokasi GPS terlalu jauh (> 100km dari Pemalang), anggap GPS tidak akurat (mungkin IP Jakarta)
                    // Kita pakai Alun-alun saja biar lebih relevan buat web wisata lokal
                    const distToCenter = calculateDistance(lat, lng, ALUN_ALUN_PEMALANG.lat, ALUN_ALUN_PEMALANG.lng);
                    if (distToCenter > 100) {
                        setUserLocation(ALUN_ALUN_PEMALANG);
                    } else {
                        setUserLocation({ lat, lng });
                    }
                },
                () => {
                    // Jika GPS ditolak atau error, pakai Alun-alun
                    setUserLocation(ALUN_ALUN_PEMALANG);
                }
            );
        } else {
            setUserLocation(ALUN_ALUN_PEMALANG);
        }
    }, []);

    // 2. Fungsi Hitung Jarak (Haversine)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Radius bumi dalam km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata/${id}`);
                setWisata(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse">Menyiapkan Pengalaman...</p>
            </div>
        </div>
    );

    if (!wisata) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={40} />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Wisata Tidak Ditemukan</h2>
                <button onClick={() => navigate('/explore')} className="text-blue-500 font-bold hover:underline">Kembali ke Peta</button>
            </div>
        </div>
    );

    const images = [wisata.foto_utama, wisata.foto_2, wisata.foto_3].filter(Boolean);
    const tabs = [
        { id: 'tentang', label: 'Tentang' },
        { id: 'fasilitas', label: 'Fasilitas' },
        { id: 'galeri', label: 'Galeri' },
        { id: 'lokasi', label: 'Lokasi' },
        { id: 'statistik', label: 'Statistik' },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pb-20 overflow-x-hidden">
            <style>{`
                @keyframes kenburns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-kenburns {
                    animation: kenburns 12s ease-out forwards;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {/* ─── HERO SECTION ─── */}
            <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
                {/* Main Background Image */}
                <img 
                    src={wisata.foto_utama} 
                    alt={wisata.nama_wisata}
                    className="w-full h-full object-cover animate-kenburns"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Top Toolbar */}
                <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white text-sm font-bold transition hover:bg-white/20 active:scale-95"
                    >
                        <ChevronLeft size={18} strokeWidth={3} />
                        Kembali ke Peta
                    </button>
                    
                    <div className="flex gap-3">
                        {weatherLoading ? (
                            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white/70 text-xs font-bold">
                                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Loading cuaca...
                            </div>
                        ) : weatherError || !weather ? null : (
                            <div className="flex items-center gap-3.5 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white">
                                <span className="text-2xl leading-none">
                                    {getWeatherDescription(weather.weathercode).icon}
                                </span>
                                <div className="leading-tight">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black">{Math.round(weather.temperature)}°C</span>
                                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                                            {getWeatherDescription(weather.weathercode).text}
                                        </span>
                                    </div>
                                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-0.5">
                                        Angin: {weather.windspeed} km/h
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title & Info Overlay */}
                <div className="absolute bottom-16 md:bottom-24 inset-x-0 px-6 md:px-12 z-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/30">
                                <Compass size={12} strokeWidth={3} />
                                {wisata.nama_kategori}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
                                {wisata.nama_wisata}
                            </h1>
                            <div className="flex items-center gap-2 text-white/80 font-bold text-sm md:text-base">
                                <MapPin size={18} className="text-red-400" />
                                {wisata.kecamatan}, Pemalang, Jawa Tengah
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── ACTION BAR (Floating) ─── */}
            <div className="max-w-7xl mx-auto px-6 relative -mt-10 z-30">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                    {/* Quick Stats Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-100 p-4 rounded-[28px] shadow-xl flex items-center gap-4 group hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                                <Ticket size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiket Masuk</p>
                                <p className="text-sm font-black text-gray-900">{formatHarga(wisata.harga_tiket)}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-[28px] shadow-xl flex items-center gap-4 group hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jam Buka</p>
                                <p className="text-sm font-black text-gray-900 leading-tight">{formatJam(wisata.jam_buka, wisata.jam_tutup)}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-[28px] shadow-xl flex items-center gap-4 group hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-110 transition-transform">
                                <Star size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori</p>
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{wisata.nama_kategori.split(' ')[1]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Primary CTA */}
                    <Link to={`/explore?wisata=${wisata.wisata_id}`} className="lg:w-auto px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[28px] shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95">
                        <Navigation size={24} strokeWidth={2.5} />
                        <span className="font-black uppercase tracking-widest text-sm">Navigasi ke Lokasi</span>
                        <ArrowRight size={18} className="animate-pulse" />
                    </Link>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COL: CONTENT */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Custom Tabs */}
                        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar gap-10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-black uppercase tracking-[0.2em] relative transition-colors
                                        ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500 rounded-full animate-in slide-in-from-left-4 duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeTab === 'tentang' && (
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-black text-gray-900">Tentang {wisata.nama_wisata}</h2>
                                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                            {wisata.deskripsi || `${wisata.nama_wisata} merupakan destinasi unggulan di ${wisata.kecamatan}, Pemalang yang menawarkan pesona luar biasa bagi para pengunjung.`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'fasilitas' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-black text-gray-900">Fasilitas Tersedia</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {wisata.fasilitas && wisata.fasilitas.length > 0 ? (
                                            wisata.fasilitas.map((f, i) => (
                                                <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-white hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default group">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-300">
                                                        <div className="text-lg transition-transform group-hover:scale-110 duration-300 flex items-center justify-center">
                                                            {f.icon && (f.icon.includes('/') || f.icon.includes('.') || f.icon.startsWith('http')) ? (
                                                                <img src={f.icon} alt={f.nama_fasilitas} className="w-5 h-5 object-contain" />
                                                            ) : (
                                                                f.icon
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider group-hover:text-blue-600 transition-colors duration-300">{f.nama_fasilitas}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-full py-12 text-center text-slate-400 font-bold italic bg-slate-50/50 rounded-2xl border border-slate-100">
                                                Belum ada informasi fasilitas pendukung untuk destinasi ini.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'galeri' && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-black text-gray-900">Galeri Foto</h2>
                                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                        {images.map((img, i) => (
                                            <div key={i} className="break-inside-avoid rounded-[32px] overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                                                <img src={img} className="w-full h-auto group-hover:scale-110 transition-transform duration-700" alt="gallery" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'lokasi' && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-black text-gray-900">Lokasi Persis</h2>
                                    <div className="h-[400px] rounded-[32px] overflow-hidden border-4 border-gray-100 shadow-xl relative z-10">
                                        <MapContainer 
                                            center={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]} 
                                            zoom={15} 
                                            className="h-full w-full"
                                            scrollWheelZoom={false}
                                        >
                                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                            <Marker position={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]} icon={customMarkerIcon} />
                                        </MapContainer>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                                                <Compass />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Koordinat GPS</p>
                                                <p className="text-sm font-black text-gray-900">{wisata.latitude}, {wisata.longitude}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'statistik' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <h2 className="text-2xl font-black text-gray-900">Statistik Pengunjung</h2>
                                    
                                    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-xl space-y-8">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tren Kunjungan Wisata (3 Tahun Terakhir)</p>
                                        </div>

                                        {(() => {
                                            const y22 = wisata.pengunjung_2022 || 0;
                                            const y23 = wisata.pengunjung_2023 || 0;
                                            const y24 = wisata.pengunjung_2024 || 0;
                                            const maxVal = Math.max(y22, y23, y24, 1000);
                                            const getPercent = (val) => (val / maxVal) * 80; // 80% maximum height

                                            return (
                                                <div className="space-y-8">
                                                    {/* Spacious chart block */}
                                                    <div className="relative h-64 w-full flex items-end justify-around border-b border-gray-100 pb-2">
                                                        {/* Gridlines */}
                                                        <div className="absolute inset-x-0 bottom-[20%] border-t border-dashed border-gray-100 pointer-events-none"></div>
                                                        <div className="absolute inset-x-0 bottom-[50%] border-t border-dashed border-gray-100 pointer-events-none"></div>
                                                        <div className="absolute inset-x-0 bottom-[80%] border-t border-dashed border-gray-100 pointer-events-none"></div>

                                                        {/* Columns */}
                                                        {[
                                                            { year: '2022', val: y22, color: 'bg-blue-500', glow: 'shadow-blue-100' },
                                                            { year: '2023', val: y23, color: 'bg-emerald-500', glow: 'shadow-emerald-100' },
                                                            { year: '2024', val: y24, color: 'bg-indigo-500', glow: 'shadow-indigo-100' },
                                                        ].map((item, idx) => {
                                                            const heightPercent = getPercent(item.val);
                                                            return (
                                                                <div key={idx} className="flex flex-col justify-end items-center w-1/4 h-full group relative z-10">
                                                                    {/* Tooltip */}
                                                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 bg-gray-900 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-xl shadow-lg pointer-events-none whitespace-nowrap">
                                                                        {item.val.toLocaleString('id-ID')} Orang
                                                                    </div>

                                                                    {/* Column bar */}
                                                                    <div 
                                                                        className={`w-12 md:w-16 ${item.color} rounded-t-2xl shadow-xl ${item.glow} transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) cursor-pointer hover:brightness-105`}
                                                                        style={{ height: `${heightPercent}%`, minHeight: item.val > 0 ? '8px' : '4px' }}
                                                                    ></div>

                                                                    {/* Year */}
                                                                    <span className="text-xs font-black text-gray-500 mt-3">{item.year}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Numeric totals list */}
                                                    <div className="grid grid-cols-3 gap-6 pt-2">
                                                        {[
                                                            { label: 'Tahun 2022', val: y22, border: 'border-l-blue-500' },
                                                            { label: 'Tahun 2023', val: y23, border: 'border-l-emerald-500' },
                                                            { label: 'Tahun 2024', val: y24, border: 'border-l-indigo-500' }
                                                        ].map((item, idx) => (
                                                            <div key={idx} className={`pl-4 border-l-4 ${item.border}`}>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                                <p className="text-lg font-black text-gray-900">{item.val.toLocaleString('id-ID')} <span className="text-xs text-gray-400 font-bold">Orang</span></p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COL: SIDEBAR */}
                    <div className="space-y-8">

                        {/* Mini Map Card */}
                        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Lokasi</h3>
                                <button onClick={() => setActiveTab('lokasi')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Lihat Detail</button>
                            </div>
                            <div className="h-40 rounded-2xl overflow-hidden border border-gray-100 relative grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
                                <MapContainer 
                                    center={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]} 
                                    zoom={13} 
                                    className="h-full w-full"
                                    zoomControl={false}
                                    dragging={false}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                    <Marker position={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]} icon={customMarkerIcon} />
                                </MapContainer>
                            </div>
                            <p className="text-xs text-gray-500 font-bold flex items-start gap-2">
                                <MapPin size={14} className="text-blue-500 shrink-0" />
                                {wisata.alamat || `${wisata.kecamatan}, Pemalang`}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetailWisata;
