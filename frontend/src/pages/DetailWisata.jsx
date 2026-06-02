import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ChevronLeft, Share2, Heart, MapPin, Ticket, Clock,
    Navigation, Compass, Info, CheckCircle2, Image as ImageIcon,
    Map as MapIcon, Star, Phone, Globe, ExternalLink, ArrowRight,
    Wind, Thermometer, X
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
    if (buka && tutup) return `${buka.substring(0, 5)} – ${tutup.substring(0, 5)}`;
    return '08:00 – 17:00';
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
    const [userLocation, setUserLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(false);
    const [lightboxImg, setLightboxImg] = useState(null);

    const ALUN_ALUN_PEMALANG = { lat: -6.8906, lng: 109.3813 };

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
                } else setWeatherError(true);
            } catch (e) {
                setWeatherError(true);
            } finally {
                setWeatherLoading(false);
            }
        };
        fetchWeather();
    }, [wisata]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('userLoc_skripsi');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === 2) {
                    setUserLocation({ lat: parsed[0], lng: parsed[1] });
                }
            }
        } catch (e) {
            console.error("Gagal membaca lokasi dari localStorage:", e);
        }
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
        <div style={{ minHeight: '100vh', background: '#F9F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, border: '3px solid #DBEAFE', borderTopColor: '#004DA4', borderRadius: '50%', animation: 'dw-spin 0.8s linear infinite' }} />
                <p style={{ color: '#727785', fontWeight: 600, fontSize: 14 }}>Menyiapkan Pengalaman...</p>
            </div>
            <style>{`@keyframes dw-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!wisata) return (
        <div style={{ minHeight: '100vh', background: '#F9F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF4444' }}>
                    <Info size={40} />
                </div>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1C1E', marginBottom: 8 }}>Wisata Tidak Ditemukan</h2>
                <button onClick={() => navigate('/explore')} style={{ color: '#004DA4', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
                    Kembali ke Peta →
                </button>
            </div>
        </div>
    );

    const images = [wisata.foto_utama, wisata.foto_2, wisata.foto_3].filter(Boolean);
    const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, parseFloat(wisata.latitude), parseFloat(wisata.longitude)) : null;
    const tabs = [
        { id: 'tentang', label: 'Tentang' },
        { id: 'fasilitas', label: 'Fasilitas' },
        { id: 'galeri', label: 'Galeri' },
        { id: 'lokasi', label: 'Lokasi' },
        { id: 'statistik', label: 'Statistik' },
    ];

    const isGratis = !wisata.harga_tiket || parseInt(wisata.harga_tiket) === 0;

    return (
        <div style={{ minHeight: '100vh', background: '#F9F9FC', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: '#1A1C1E', overflowX: 'hidden' }}>
            <style>{`
                @keyframes dw-kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
                @keyframes dw-spin { to { transform: rotate(360deg); } }
                @keyframes dw-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dw-fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .dw-tab-btn { background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
                .dw-tab-btn:focus { outline: none; }
                .dw-gallery-img { cursor: zoom-in; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease; }
                .dw-gallery-img:hover { transform: scale(1.02); box-shadow: 0 16px 48px rgba(0,0,0,0.2); }
                .dw-facility-chip { transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease; }
                .dw-facility-chip:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,77,164,0.14); background: #EEF4FF !important; }
                .dw-sidebar-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
                .dw-sidebar-card:hover { box-shadow: 0 12px 40px rgba(0,77,164,0.13) !important; transform: translateY(-2px); }
                .dw-nav-btn { transition: background 0.2s, transform 0.15s; }
                .dw-nav-btn:hover { transform: translateY(-2px); }
                .dw-nav-btn:active { transform: scale(0.97); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .dw-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 999; display: flex; align-items: center; justify-content: center; animation: dw-fadeIn 0.2s ease; }
                .dw-lightbox img { max-width: 92vw; max-height: 88vh; border-radius: 16px; object-fit: contain; }
            `}</style>

            {/* ── LIGHTBOX ── */}
            {lightboxImg && (
                <div className="dw-lightbox" onClick={() => setLightboxImg(null)}>
                    <button onClick={() => setLightboxImg(null)} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                        <X size={20} />
                    </button>
                    <img src={lightboxImg} alt="preview" onClick={e => e.stopPropagation()} />
                </div>
            )}

            {/* ══════════════════════════════
                POINT 1 — HERO MAGAZINE STYLE
            ══════════════════════════════ */}
            <div style={{ position: 'relative', height: '72vh', minHeight: 520, overflow: 'hidden' }}>
                {/* Ken Burns image */}
                <img
                    src={wisata.foto_utama}
                    alt={wisata.nama_wisata}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'dw-kenburns 14s ease-out forwards', transformOrigin: 'center center' }}
                />

                {/* Dark gradient - stronger at top and bottom */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.82) 100%)' }} />

                {/* Top Toolbar */}
                <div className="absolute top-0 left-0 right-0 p-4 md:py-5 md:px-8 flex justify-between items-center z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="dw-nav-btn flex items-center gap-2 px-3.5 py-2 md:px-4.5 md:py-2.5 bg-white/12 backdrop-blur-md border border-white/22 rounded-2xl text-white text-xs md:text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-white/20 active:scale-95"
                    >
                        <ChevronLeft size={16} strokeWidth={3} className="md:w-[18px] md:h-[18px]" />
                        Kembali
                    </button>

                    {/* Weather pill */}
                    <div className="flex gap-2.5 items-center">
                        {!weatherLoading && !weatherError && weather && (
                            <div className="flex items-center gap-2 md:gap-3 px-3.5 py-2 md:px-4 md:py-2.5 bg-white/12 backdrop-blur-md border border-white/20 rounded-2xl text-white">
                                <span className="text-xl md:text-2xl leading-none">{getWeatherDescription(weather.weathercode).icon}</span>
                                <div>
                                    <div className="flex items-center gap-1.5 md:gap-2 leading-none">
                                        <span className="text-xs md:text-sm font-black">{Math.round(weather.temperature)}°C</span>
                                        <span className="hidden md:inline text-[10px] font-bold text-white/70 uppercase tracking-wider">{getWeatherDescription(weather.weathercode).text}</span>
                                    </div>
                                    <p className="hidden md:block text-[9px] text-white/50 font-semibold mt-0.5">Angin: {weather.windspeed} km/h</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── MAGAZINE INFO BAR ── at bottom of hero */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 md:px-8 md:pb-8">
                    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                        {/* Category + Distance row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '5px 14px', background: '#004DA4', borderRadius: 9999,
                                color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                            }}>
                                <Compass size={11} strokeWidth={3} />
                                {wisata.nama_kategori}
                            </span>

                            {distance !== null && (
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    padding: '5px 14px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.25)', borderRadius: 9999,
                                    color: '#fff', fontSize: 11, fontWeight: 700,
                                }}>
                                    <Navigation size={11} />
                                    {distance.toFixed(1)} km dari lokasi Anda
                                </span>
                            )}

                            {/* ── POINT 5 — Jam & Tiket Badges on Hero ── */}
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '5px 14px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 9999,
                                color: '#fff', fontSize: 11, fontWeight: 700,
                            }}>
                                <Clock size={11} />
                                {formatJam(wisata.jam_buka, wisata.jam_tutup)} WIB
                            </span>

                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '5px 14px',
                                background: isGratis ? 'rgba(16,185,129,0.25)' : 'rgba(251,191,36,0.2)',
                                backdropFilter: 'blur(8px)',
                                border: `1px solid ${isGratis ? 'rgba(16,185,129,0.4)' : 'rgba(251,191,36,0.4)'}`,
                                borderRadius: 9999,
                                color: '#fff', fontSize: 11, fontWeight: 700,
                            }}>
                                <Ticket size={11} />
                                {formatHarga(wisata.harga_tiket)}{!isGratis && ' /orang'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: 'clamp(32px, 5vw, 60px)',
                            fontWeight: 800,
                            color: '#fff',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.05,
                            marginBottom: 10,
                            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                        }}>
                            {wisata.nama_wisata}
                        </h1>

                        {/* Location row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={16} color="#F87171" />
                            <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                                {wisata.kecamatan}, Pemalang, Jawa Tengah
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ACTION BAR ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #E8E8EA', boxShadow: '0 2px 16px rgba(0,77,164,0.06)' }}>
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="dw-action-bar flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 md:py-5">
                        {/* ── POINT 5 — Styled Tiket & Jam Cards ── */}
                        <div className="flex gap-1.5 xs:gap-2 w-full overflow-x-auto no-scrollbar lg:flex lg:w-auto lg:gap-3 pb-1">
                            {/* Tiket Badge */}
                            <div
                                style={{
                                    background: isGratis ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' : 'linear-gradient(135deg, #FFF7ED, #FEE2E2)',
                                    border: `1px solid ${isGratis ? '#A7F3D0' : '#FECACA'}`,
                                    borderRadius: 16,
                                    boxShadow: isGratis ? '0 2px 12px rgba(16,185,129,0.12)' : '0 2px 12px rgba(239,68,68,0.1)',
                                }}
                                className="flex-1 min-w-[92px] xs:min-w-[104px] flex-shrink-0 flex flex-col items-center justify-center text-center gap-1.5 p-1.5 xs:p-2.5 md:flex-row md:items-center md:justify-start md:text-left md:gap-3 md:p-3 md:px-5 md:w-auto md:flex-initial"
                            >
                                <div 
                                    style={{
                                        borderRadius: 10,
                                        background: isGratis ? '#10B981' : '#F59E0B',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: isGratis ? '0 4px 12px rgba(16,185,129,0.35)' : '0 4px 12px rgba(245,158,11,0.35)',
                                    }}
                                    className="w-7 h-7 xs:w-8 xs:h-8 md:w-[38px] md:h-[38px] flex-shrink-0"
                                >
                                    <Ticket color="#fff" strokeWidth={2.5} className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-[18px] md:h-[18px]" />
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <p className="text-[8px] xs:text-[9px] md:text-[10px] uppercase tracking-wider mb-0.5" style={{ fontWeight: 700, color: '#727785' }}>Tiket Masuk</p>
                                    <p className="text-[10px] xs:text-xs md:text-[16px] font-extrabold leading-tight" style={{ color: isGratis ? '#059669' : '#D97706', letterSpacing: '-0.01em' }}>
                                        {formatHarga(wisata.harga_tiket)}
                                        {!isGratis && <span className="text-[7.5px] xs:text-[9px] md:text-[11px] font-semibold block md:inline-block md:ml-0.5" style={{ color: '#92400E' }}>/orang</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Jam Buka Badge */}
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                                    border: '1px solid #BFDBFE',
                                    borderRadius: 16,
                                    boxShadow: '0 2px 12px rgba(59,130,246,0.1)',
                                }}
                                className="flex-1 min-w-[92px] xs:min-w-[104px] flex-shrink-0 flex flex-col items-center justify-center text-center gap-1.5 p-1.5 xs:p-2.5 md:flex-row md:items-center md:justify-start md:text-left md:gap-3 md:p-3 md:px-5 md:w-auto md:flex-initial"
                            >
                                <div 
                                    style={{
                                        borderRadius: 10,
                                        background: '#3B82F6',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                                    }}
                                    className="w-7 h-7 xs:w-8 xs:h-8 md:w-[38px] md:h-[38px] flex-shrink-0"
                                >
                                    <Clock color="#fff" strokeWidth={2.5} className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-[18px] md:h-[18px]" />
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <p className="text-[8px] xs:text-[9px] md:text-[10px] uppercase tracking-wider mb-0.5" style={{ fontWeight: 700, color: '#727785' }}>Jam Buka</p>
                                    <p className="text-[10px] xs:text-xs md:text-[16px] font-extrabold leading-tight" style={{ color: '#1D4ED8', letterSpacing: '-0.01em' }}>
                                        {formatJam(wisata.jam_buka, wisata.jam_tutup)}
                                        <span className="text-[7.5px] xs:text-[9px] md:text-[11px] font-semibold block md:inline-block md:ml-0.5" style={{ color: '#3B82F6' }}>WIB</span>
                                    </p>
                                </div>
                            </div>

                            {/* Jarak Badge */}
                            {distance !== null ? (
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
                                        border: '1px solid #DDD6FE',
                                        borderRadius: 16,
                                        boxShadow: '0 2px 12px rgba(139,92,246,0.1)',
                                    }}
                                    className="flex-1 min-w-[92px] xs:min-w-[104px] flex-shrink-0 flex flex-col items-center justify-center text-center gap-1.5 p-1.5 xs:p-2.5 md:flex-row md:items-center md:justify-start md:text-left md:gap-3 md:p-3 md:px-5 md:w-auto md:flex-initial"
                                >
                                    <div 
                                        style={{
                                            borderRadius: 10,
                                            background: '#8B5CF6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(139,92,246,0.35)',
                                        }}
                                        className="w-7 h-7 xs:w-8 xs:h-8 md:w-[38px] md:h-[38px] flex-shrink-0"
                                    >
                                        <Navigation color="#fff" strokeWidth={2.5} className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-[18px] md:h-[18px]" />
                                    </div>
                                    <div className="flex flex-col items-center md:items-start">
                                        <p className="text-[8px] xs:text-[9px] md:text-[10px] uppercase tracking-wider mb-0.5" style={{ fontWeight: 700, color: '#727785' }}>Rute</p>
                                        <p className="text-[10px] xs:text-xs md:text-[16px] font-extrabold leading-tight" style={{ color: '#6D28D9', letterSpacing: '-0.01em' }}>
                                            {distance.toFixed(1)}
                                            <span className="text-[7.5px] xs:text-[9px] md:text-[11px] font-semibold block md:inline-block md:ml-0.5" style={{ color: '#8B5CF6' }}>km</span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={`/explore?wisata=${wisata.wisata_id}`}
                                    style={{
                                        background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
                                        border: '1px dashed #C084FC',
                                        borderRadius: 16,
                                        boxShadow: '0 2px 12px rgba(139,92,246,0.05)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                    }}
                                    className="dw-nav-btn flex-1 min-w-[92px] xs:min-w-[104px] flex-shrink-0 flex flex-col items-center justify-center text-center gap-1.5 p-1.5 xs:p-2.5 md:flex-row md:items-center md:justify-start md:text-left md:gap-3 md:p-3 md:px-5 md:w-auto md:flex-initial"
                                >
                                    <div 
                                        style={{
                                            borderRadius: 10,
                                            background: '#a855f7',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(168,85,247,0.25)',
                                        }}
                                        className="w-7 h-7 xs:w-8 xs:h-8 md:w-[38px] md:h-[38px] flex-shrink-0"
                                    >
                                        <MapPin color="#fff" strokeWidth={2.5} className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-[18px] md:h-[18px]" />
                                    </div>
                                    <div className="flex flex-col items-center md:items-start">
                                        <p className="text-[8px] xs:text-[9px] md:text-[10px] uppercase tracking-wider mb-0.5" style={{ fontWeight: 700, color: '#727785' }}>Rute</p>
                                        <p className="text-[9px] xs:text-[10px] md:text-[13px] font-extrabold leading-tight" style={{ color: '#7c3aed', letterSpacing: '-0.01em' }}>
                                            <span className="hidden md:inline">Tentukan Titik Awal</span>
                                            <span className="inline md:hidden">Cari Rute</span>
                                        </p>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* CTA Button */}
                        <Link
                            to={`/explore?wisata=${wisata.wisata_id}`}
                            style={{
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #004DA4, #0064D2)',
                                color: '#fff', borderRadius: 16,
                                fontWeight: 800, fontSize: 14, textDecoration: 'none',
                                letterSpacing: '0.02em',
                                boxShadow: '0 4px 20px rgba(0,77,164,0.35)',
                                transition: 'all 0.2s',
                            }}
                            className="dw-nav-btn w-full lg:w-auto inline-flex items-center justify-center gap-2.5"
                        >
                            <Navigation size={18} strokeWidth={2.5} />
                            Navigasi ke Lokasi
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-10 md:px-8 pb-20">
                <div className="dw-grid-main grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-10 items-start">

                    {/* LEFT: CONTENT */}
                    <div className="min-w-0 w-full">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-[#EEEEF0] gap-8 overflow-x-auto no-scrollbar w-full max-w-full mb-9 flex-nowrap scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="dw-tab-btn flex-shrink-0 whitespace-nowrap"
                                    style={{
                                        paddingBottom: 14,
                                        fontSize: 13, fontWeight: 700,
                                        textTransform: 'uppercase', letterSpacing: '0.1em',
                                        color: activeTab === tab.id ? '#004DA4' : '#727785',
                                        borderBottom: activeTab === tab.id ? '2px solid #004DA4' : '2px solid transparent',
                                        marginBottom: -2,
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{ animation: 'dw-fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both' }} key={activeTab}>

                            {/* ── TENTANG ── */}
                            {activeTab === 'tentang' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                    <div>
                                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em', marginBottom: 16 }}>
                                            Tentang {wisata.nama_wisata}
                                        </h2>
                                        <p style={{ fontSize: 17, color: '#424753', lineHeight: 1.8, fontWeight: 400 }}>
                                            {wisata.deskripsi || `${wisata.nama_wisata} merupakan destinasi unggulan di ${wisata.kecamatan}, Pemalang yang menawarkan pesona luar biasa bagi para pengunjung.`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── POINT 4 — FASILITAS PILL CHIPS ── */}
                            {activeTab === 'fasilitas' && (
                                <div>
                                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em', marginBottom: 24 }}>Fasilitas Tersedia</h2>
                                    {wisata.fasilitas && wisata.fasilitas.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                            {wisata.fasilitas.map((f, i) => (
                                                <div
                                                    key={i}
                                                    className="dw-facility-chip"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 10,
                                                        padding: '10px 18px 10px 10px',
                                                        background: '#fff',
                                                        border: '1.5px solid #E8E8EA',
                                                        borderRadius: 9999,
                                                        boxShadow: '0 2px 8px rgba(0,77,164,0.06)',
                                                        cursor: 'default',
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: '50%',
                                                        background: '#EEF4FF',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 18, flexShrink: 0,
                                                    }}>
                                                        {f.icon && (f.icon.includes('/') || f.icon.includes('.') || f.icon.startsWith('http')) ? (
                                                            <img src={f.icon} alt={f.nama_fasilitas} style={{ width: 20, height: 20, objectFit: 'contain' }} />
                                                        ) : (
                                                            f.icon
                                                        )}
                                                    </div>
                                                    <span className="text-xs xs:text-sm font-bold" style={{ color: '#1A1C1E', whiteSpace: 'nowrap' }}>
                                                        {f.nama_fasilitas}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '48px 24px', textAlign: 'center', background: '#F3F3F6', borderRadius: 20, color: '#727785', fontWeight: 600, fontSize: 15 }}>
                                            Belum ada informasi fasilitas untuk destinasi ini.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── POINT 2 — GALLERY MASONRY + FEATURED ── */}
                            {activeTab === 'galeri' && (
                                <div>
                                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em', marginBottom: 24 }}>Galeri Foto</h2>
                                    {images.length === 0 ? (
                                        <div style={{ padding: '48px 24px', textAlign: 'center', background: '#F3F3F6', borderRadius: 20, color: '#727785', fontWeight: 600 }}>
                                            Belum ada foto galeri.
                                        </div>
                                    ) : images.length === 1 ? (
                                        <div style={{ borderRadius: 20, overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightboxImg(images[0])}>
                                            <img src={images[0]} alt="gallery" className="dw-gallery-img" style={{ width: '100%', height: 400, objectFit: 'cover', display: 'block', borderRadius: 20 }} />
                                        </div>
                                    ) : images.length === 2 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            {images.map((img, i) => (
                                                <div key={i} style={{ borderRadius: 20, overflow: 'hidden' }} onClick={() => setLightboxImg(img)}>
                                                    <img src={img} alt={`gallery-${i}`} className="dw-gallery-img" style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Featured + Thumbnails layout */
                                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3.5">
                                            {/* Featured big image */}
                                            <div
                                                className="md:row-span-2 rounded-3xl overflow-hidden relative cursor-zoom-in"
                                                onClick={() => setLightboxImg(images[0])}
                                            >
                                                <img src={images[0]} alt="featured" className="dw-gallery-img w-full h-full min-h-[260px] md:min-h-[360px] object-cover block" />
                                                <div className="absolute top-3.5 left-3.5 px-3 py-1 bg-[#004DA4] rounded-full text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">
                                                    Foto Utama
                                                </div>
                                            </div>
                                            {/* Thumbnails */}
                                            {images.slice(1).map((img, i) => (
                                                <div key={i} className="rounded-2xl overflow-hidden cursor-zoom-in" onClick={() => setLightboxImg(img)}>
                                                    <img src={img} alt={`thumb-${i}`} className="dw-gallery-img w-full h-[140px] md:h-[172px] object-cover block" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p style={{ marginTop: 14, fontSize: 12, color: '#727785', textAlign: 'center', fontWeight: 500 }}>
                                        Klik foto untuk melihat lebih besar
                                    </p>
                                </div>
                            )}

                            {/* ── LOKASI ── */}
                            {activeTab === 'lokasi' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em' }}>Lokasi Persis</h2>
                                    <div style={{ height: 420, borderRadius: 20, overflow: 'hidden', border: '2px solid #E8E8EA', boxShadow: '0 4px 24px rgba(0,77,164,0.1)' }}>
                                        <MapContainer
                                            center={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]}
                                            zoom={15}
                                            style={{ height: '100%', width: '100%' }}
                                            scrollWheelZoom={false}
                                        >
                                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                            <Marker position={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]} icon={customMarkerIcon} />
                                        </MapContainer>
                                    </div>
                                    <div style={{ padding: '18px 22px', background: '#fff', borderRadius: 16, border: '1px solid #E8E8EA', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(0,77,164,0.05)' }}>
                                        <div style={{ width: 44, height: 44, background: '#EEF4FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#004DA4', flexShrink: 0 }}>
                                            <Compass size={20} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 10, fontWeight: 700, color: '#727785', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Koordinat GPS</p>
                                            <p style={{ fontSize: 15, fontWeight: 800, color: '#1A1C1E' }}>{wisata.latitude}, {wisata.longitude}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STATISTIK ── */}
                            {activeTab === 'statistik' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em' }}>Statistik Pengunjung</h2>
                                    <div style={{ background: '#fff', borderRadius: 24, padding: '32px', border: '1px solid #E8E8EA', boxShadow: '0 4px 24px rgba(0,77,164,0.06)' }}>
                                        <p style={{ fontSize: 12, color: '#727785', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 28 }}>Tren Kunjungan (3 Tahun Terakhir)</p>
                                        {(() => {
                                            const y22 = wisata.pengunjung_2022 || 0;
                                            const y23 = wisata.pengunjung_2023 || 0;
                                            const y24 = wisata.pengunjung_2024 || 0;
                                            const maxVal = Math.max(y22, y23, y24, 1000);
                                            const getPercent = (val) => (val / maxVal) * 80;
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                                    <div style={{ position: 'relative', height: 220, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '2px solid #EEEEF0', paddingBottom: 8 }}>
                                                        {[
                                                            { year: '2022', val: y22, color: 'linear-gradient(to top, #3B82F6, #60A5FA)', shadow: 'rgba(59,130,246,0.25)' },
                                                            { year: '2023', val: y23, color: 'linear-gradient(to top, #10B981, #34D399)', shadow: 'rgba(16,185,129,0.25)' },
                                                            { year: '2024', val: y24, color: 'linear-gradient(to top, #6366F1, #818CF8)', shadow: 'rgba(99,102,241,0.25)' },
                                                        ].map((item, idx) => (
                                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '25%', height: '100%', gap: 8, position: 'relative' }}>
                                                                <div style={{ position: 'absolute', top: -28, fontSize: 11, fontWeight: 700, color: '#1A1C1E', whiteSpace: 'nowrap', opacity: 0.8 }}>
                                                                    {item.val.toLocaleString('id-ID')}
                                                                </div>
                                                                <div style={{
                                                                    width: 52, background: item.color,
                                                                    borderRadius: '10px 10px 4px 4px',
                                                                    boxShadow: `0 8px 20px ${item.shadow}`,
                                                                    height: `${Math.max(getPercent(item.val), item.val > 0 ? 4 : 2)}%`,
                                                                    minHeight: item.val > 0 ? 12 : 4,
                                                                    transition: 'height 1s cubic-bezier(0.22,1,0.36,1)',
                                                                }} />
                                                                <span style={{ fontSize: 12, fontWeight: 800, color: '#424753' }}>{item.year}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                                        {[
                                                            { label: 'Tahun 2022', val: y22, color: '#3B82F6' },
                                                            { label: 'Tahun 2023', val: y23, color: '#10B981' },
                                                            { label: 'Tahun 2024', val: y24, color: '#6366F1' },
                                                        ].map((item, idx) => (
                                                            <div key={idx} style={{ paddingLeft: 14, borderLeft: `4px solid ${item.color}`, borderRadius: 2 }}>
                                                                <p style={{ fontSize: 10, color: '#727785', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</p>
                                                                <p style={{ fontSize: 20, fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em' }}>
                                                                    {item.val.toLocaleString('id-ID')}
                                                                    <span style={{ fontSize: 12, color: '#727785', fontWeight: 600 }}> org</span>
                                                                </p>
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

                    {/* ── POINT 3 — SIDEBAR GLASSMORPHISM CARDS ── */}
                    <div className="min-w-0 w-full" style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 24 }}>

                        {/* Map Card */}
                        <div
                            className="dw-sidebar-card"
                            style={{
                                background: '#fff',
                                borderRadius: 24,
                                padding: 20,
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 24px rgba(0,77,164,0.08), 0 1px 4px rgba(0,77,164,0.04)',
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 32, height: 32, background: '#EEF4FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#004DA4' }}>
                                        <MapPin size={16} />
                                    </div>
                                    <h3 style={{ fontWeight: 800, fontSize: 14, color: '#1A1C1E', letterSpacing: '-0.01em' }}>Lokasi & Peta</h3>
                                </div>
                                <button onClick={() => setActiveTab('lokasi')} style={{ fontSize: 12, fontWeight: 700, color: '#004DA4', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background 0.2s', fontFamily: 'inherit' }}>
                                    Detail →
                                </button>
                            </div>
                            <div style={{ height: 160, borderRadius: 14, overflow: 'hidden', border: '1px solid #E8E8EA', marginBottom: 12 }}>
                                <MapContainer
                                    center={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
                                    zoomControl={false}
                                    dragging={false}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                    <Marker position={[parseFloat(wisata.latitude), parseFloat(wisata.longitude)]} icon={customMarkerIcon} />
                                </MapContainer>
                            </div>
                            <p style={{ fontSize: 12, color: '#424753', fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                                <MapPin size={13} color="#004DA4" style={{ flexShrink: 0, marginTop: 1 }} />
                                {wisata.alamat || `${wisata.kecamatan}, Pemalang, Jawa Tengah`}
                            </p>
                        </div>

                        {/* Info Quick Card */}
                        <div
                            className="dw-sidebar-card"
                            style={{
                                background: 'linear-gradient(135deg, #004DA4 0%, #0064D2 100%)',
                                borderRadius: 24,
                                padding: 24,
                                boxShadow: '0 8px 32px rgba(0,77,164,0.3)',
                                color: '#fff',
                            }}
                        >
                            <h3 style={{ fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', marginBottom: 16, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>Info Kunjungan</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    { label: 'Tiket Masuk', value: formatHarga(wisata.harga_tiket), icon: <Ticket size={15} /> },
                                    { label: 'Jam Operasional', value: `${formatJam(wisata.jam_buka, wisata.jam_tutup)} WIB`, icon: <Clock size={15} /> },
                                    { label: 'Kategori', value: wisata.nama_kategori, icon: <Star size={15} /> },
                                    ...(distance !== null ? [{ label: 'Jarak Anda', value: `${distance.toFixed(1)} km`, icon: <Navigation size={15} /> }] : []),
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)' }} className="min-w-0">
                                            {item.icon}
                                            <span className="text-[11px] xs:text-xs font-semibold truncate">{item.label}</span>
                                        </div>
                                        <span className="text-xs xs:text-sm font-extrabold text-white text-right ml-2 flex-shrink-0">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigate CTA */}
                        <Link
                            to={`/explore?wisata=${wisata.wisata_id}`}
                            className="dw-nav-btn"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                padding: '16px 24px',
                                background: '#fff',
                                border: '2px solid #004DA4',
                                borderRadius: 18,
                                color: '#004DA4', fontWeight: 800, fontSize: 14,
                                textDecoration: 'none',
                                boxShadow: '0 2px 12px rgba(0,77,164,0.1)',
                                letterSpacing: '0.01em',
                            }}
                        >
                            <Navigation size={18} />
                            Buka di Peta Interaktif
                        </Link>
                    </div>

                </div>
            </div>

            {/* Responsive */}
            <style>{`
                @media (max-width: 1024px) {
                    .dw-grid-main { grid-template-columns: minmax(0, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    .dw-action-bar { flex-direction: column !important; }
                }
            `}</style>
        </div>
    );
};

export default DetailWisata;
