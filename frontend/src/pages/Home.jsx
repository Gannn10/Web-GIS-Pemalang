import React, { useState, useEffect, useRef } from 'react';
import { fetchWithCache } from '../services/apiCache';
import { Link } from 'react-router-dom';
import {
    Compass,
    ArrowRight,
    Navigation,
    ShieldCheck,
    Zap,
    ChevronDown,
    Menu,
    X,
    MapPin,
    Globe,
    Map,
    Home as HomeIcon
} from 'lucide-react';

/* ─── Design Tokens (Horizon Pemalang Light) ─── */
const COLORS = {
    primary: '#004DA4',
    primaryContainer: '#0064D2',
    secondary: '#006B5B',
    secondaryContainer: '#53F8D9',
    surface: '#F9F9FC',
    surfaceLow: '#F3F3F6',
    surfaceContainer: '#EEEEF0',
    onSurface: '#1A1C1E',
    onSurfaceVariant: '#424753',
    outline: '#727785',
    outlineVariant: '#C2C6D5',
};

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [popularWisata, setPopularWisata] = useState([]);
    const [activeNav, setActiveNav] = useState('beranda');
    const revealRefs = useRef([]);

    /* ─── Fetch Wisata Populer ─── */
    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata`;
                const res = await fetchWithCache(url);
                const popular = res.data.data.filter(w => w.is_populer === true).slice(0, 3);
                setPopularWisata(popular);
            } catch (err) {
                console.error("Gagal ambil wisata populer:", err);
            }
        };
        fetchPopular();
    }, []);

    /* ─── Scroll Handler ─── */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* ─── Scroll Reveal (IntersectionObserver) ─── */
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('hp-visible');
            }),
            { threshold: 0.12 }
        );
        document.querySelectorAll('.hp-reveal').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [popularWisata]);

    /* ─── Active section detection ─── */
    useEffect(() => {
        const sections = ['beranda', 'wisata', 'teknologi'];
        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) setActiveNav(e.target.id);
                });
            },
            { threshold: 0.4 }
        );
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, []);

    const navItems = [
        { label: 'Beranda', href: '#beranda', id: 'beranda' },
        { label: 'Wisata', href: '#wisata', id: 'wisata' },
        { label: 'Teknologi', href: '#teknologi', id: 'teknologi' },
    ];

    const techFeatures = [
        {
            icon: <Zap size={22} />,
            title: 'Real-time Update',
            desc: 'Sistem sinkronisasi data instan memastikan informasi geografis selalu diperbarui dalam hitungan detik.',
            color: '#EEF2FF',
            iconColor: '#004DA4',
        },
        {
            icon: <ShieldCheck size={22} />,
            title: 'Akurasi Tinggi',
            desc: 'Algoritma Haversine tingkat lanjut memberikan hasil kalkulasi jarak yang presisi secara matematis.',
            color: '#F0FDF9',
            iconColor: '#006B5B',
        },
        {
            icon: <Navigation size={22} />,
            title: 'Optimasi Rute',
            desc: 'Fitur navigasi pintar yang merekomendasikan rute paling efisien untuk menjangkau setiap destinasi.',
            color: '#F8F8F8',
            iconColor: '#424753',
        },
    ];

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: COLORS.surface, color: COLORS.onSurface, overflowX: 'hidden' }}>

            {/* ── Global Styles ── */}
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                /* Font */
                body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

                /* Scroll reveal */
                .hp-reveal {
                    opacity: 0;
                    transform: translateY(28px);
                    transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
                }
                .hp-reveal.hp-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .hp-delay-1 { transition-delay: 0.1s !important; }
                .hp-delay-2 { transition-delay: 0.2s !important; }
                .hp-delay-3 { transition-delay: 0.3s !important; }

                /* Nav link underline */
                .hp-nav-link {
                    position: relative;
                    font-size: 15px;
                    font-weight: 600;
                    color: #424753;
                    text-decoration: none;
                    letter-spacing: 0.01em;
                    transition: color 0.2s;
                }
                .hp-nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2.5px;
                    background: #004DA4;
                    transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
                    border-radius: 2px;
                }
                .hp-nav-link:hover { color: #004DA4; }
                .hp-nav-link:hover::after,
                .hp-nav-link.hp-active::after { width: 100%; }
                .hp-nav-link.hp-active { color: #004DA4; }

                /* Hero video overlay */
                .hp-hero-overlay {
                    background: linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.45) 0%,
                        rgba(0,0,0,0.15) 35%,
                        rgba(0,0,0,0.1) 65%,
                        rgba(0,0,0,0.35) 100%
                    );
                }

                /* Destination card — full image with overlay */
                .hp-dest-card {
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    display: block;
                    text-decoration: none;
                    color: inherit;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
                    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease;
                }
                .hp-dest-card:hover {
                    transform: translateY(-10px) scale(1.01);
                    box-shadow: 0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1);
                }
                .hp-dest-card:hover .hp-dest-img {
                    transform: scale(1.08);
                }
                .hp-dest-card:hover .hp-dest-content {
                    transform: translateY(0);
                    opacity: 1;
                }
                .hp-dest-card:hover .hp-dest-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }
                .hp-dest-card:hover .hp-dest-location {
                    opacity: 1;
                    transform: translateY(0);
                }
                .hp-dest-img {
                    transition: transform 1.2s cubic-bezier(0.22,1,0.36,1);
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .hp-dest-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 36px 32px 32px;
                    background: linear-gradient(
                        to top,
                        rgba(0,0,0,0.88) 0%,
                        rgba(0,0,0,0.55) 50%,
                        transparent 100%
                    );
                    transform: translateY(8px);
                    opacity: 0.92;
                    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease;
                }
                .hp-dest-location {
                    opacity: 0.8;
                    transform: translateY(4px);
                    transition: opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s;
                }
                .hp-dest-arrow {
                    opacity: 0;
                    transform: translateX(-8px);
                    transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
                }


                /* Tech card */
                .hp-tech-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #E8E8EA;
                    padding: 36px 32px;
                    box-shadow: 0 1px 3px rgba(0,77,164,0.05), 0 4px 16px rgba(0,77,164,0.05);
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
                }
                .hp-tech-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 40px rgba(0,77,164,0.14);
                }

                /* CTA Button */
                .hp-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    background: #004DA4;
                    color: #fff;
                    border: none;
                    border-radius: 9999px;
                    padding: 17px 40px;
                    font-size: 16px;
                    font-weight: 700;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    letter-spacing: 0.01em;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 24px rgba(0,77,164,0.25);
                    white-space: nowrap;
                }
                .hp-btn-primary:hover {
                    background: #0064D2;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(0,77,164,0.35);
                }

                .hp-btn-outline {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    color: #004DA4;
                    border: 2px solid #004DA4;
                    border-radius: 9999px;
                    padding: 15px 32px;
                    font-size: 16px;
                    font-weight: 700;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background 0.2s, color 0.2s, transform 0.2s;
                    white-space: nowrap;
                }
                .hp-btn-outline:hover {
                    background: #004DA4;
                    color: #fff;
                    transform: translateY(-1px);
                }

                /* Chip/badge */
                .hp-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: rgba(83,248,217,0.25);
                    color: #006B5B;
                    border-radius: 9999px;
                    padding: 4px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                }

                /* Section label */
                .hp-section-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #004DA4;
                    margin-bottom: 12px;
                }
                .hp-section-label::before {
                    content: '';
                    display: inline-block;
                    width: 28px;
                    height: 3px;
                    background: #004DA4;
                    border-radius: 2px;
                }

                /* Bounce animation for scroll cue */
                @keyframes hp-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(6px); }
                }
                .hp-bounce { animation: hp-bounce 1.6s ease-in-out infinite; }

                /* Fade in for hero text */
                @keyframes hp-fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hp-fadein-1 { animation: hp-fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
                .hp-fadein-2 { animation: hp-fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
                .hp-fadein-3 { animation: hp-fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.6s both; }
                .hp-fadein-4 { animation: hp-fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.8s both; }

                /* Mobile menu */
                .hp-mobile-menu {
                    position: fixed;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(0, 77, 164, 0.98) 0%, rgba(0, 30, 80, 0.99) 100%);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    z-index: 200;
                    display: flex;
                    flex-direction: column;
                    padding: 32px 24px;
                    transform: translateX(100%);
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .hp-mobile-menu.open { transform: translateX(0); }

                /* Mobile nav item style */
                .hp-mobile-nav-item {
                    display: block;
                    padding: 18px 24px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    outline: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
                .hp-mobile-nav-item:hover, .hp-mobile-nav-item:focus, .hp-mobile-nav-item:active {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.15) !important;
                    transform: translateX(6px);
                    outline: none !important;
                }
                .hp-mobile-nav-item.active {
                    background: rgba(255, 255, 255, 0.12) !important;
                    border-color: rgba(255, 255, 255, 0.25) !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                }

                /* Mobile menu close button */
                .hp-mobile-menu-close {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.15) !important;
                    background: rgba(255,255,255,0.04) !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff !important;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    outline: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
                .hp-mobile-menu-close:hover,
                .hp-mobile-menu-close:focus,
                .hp-mobile-menu-close:active {
                    background: rgba(255,255,255,0.12) !important;
                    color: #fff !important;
                    border-color: rgba(255,255,255,0.3) !important;
                    outline: none !important;
                    box-shadow: none !important;
                }

                /* Scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #F3F3F6; }
                ::-webkit-scrollbar-thumb { background: #C2C6D5; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #004DA4; }

                /* Haversine decorative line */
                .hp-divider {
                    width: 48px;
                    height: 4px;
                    background: #004DA4;
                    border-radius: 2px;
                    margin: 16px auto 0;
                }
            `}</style>

            {/* ══════════════════════════════
                NAVBAR
            ══════════════════════════════ */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition: 'all 0.4s ease',
                background: isScrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(16px)' : 'none',
                borderBottom: isScrolled ? '1px solid #E8E8EA' : '1px solid transparent',
                boxShadow: isScrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
                padding: isScrolled ? '12px 0' : '20px 0',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    className="hp-nav-inner">
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: 19, color: isScrolled ? '#1A1C1E' : '#fff', letterSpacing: '-0.02em' }}>
                            WebGIS <span style={{ color: '#004DA4', fontWeight: 800 }}>Pemalang</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }} className="hp-desktop-nav">
                        {navItems.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={`hp-nav-link ${activeNav === item.id ? 'hp-active' : ''}`}
                                style={{ color: isScrolled ? undefined : (activeNav === item.id ? '#004DA4' : '#fff') }}
                            >
                                {item.label}
                            </a>
                        ))}
                        <Link to="/explore" className="hp-btn-primary" style={{ padding: '13px 28px', fontSize: 15, boxShadow: isScrolled ? undefined : 'none' }}>
                            Explore Map
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isScrolled ? '#1A1C1E' : '#fff', padding: 4, display: 'none' }}
                        className="hp-mobile-toggle"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Responsive nav styles */}
                <style>{`
                    @media (max-width: 768px) {
                        .hp-nav-inner { padding: 0 20px !important; }
                        .hp-desktop-nav { display: none !important; }
                        .hp-mobile-toggle { display: flex !important; }
                    }
                `}</style>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`hp-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.2 }}>
                            PETA WISATA
                        </span>
                        <span style={{ fontWeight: 800, fontSize: 9, color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.1em' }}>
                            KABUPATEN PEMALANG
                        </span>
                    </div>
                    
                    <button onClick={() => setIsMenuOpen(false)} className="hp-mobile-menu-close hover:scale-105 active:scale-95">
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                {/* Subtitle / Menu Label */}
                <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#0064D2', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Menu Navigasi
                    </span>
                </div>

                {/* Navigation Links (Beautiful Interactive List) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { id: 'beranda', label: 'Beranda', desc: 'Halaman Utama & Ringkasan', href: '#beranda' },
                        { id: 'wisata', label: 'Wisata Pilihan', desc: 'Daftar Destinasi Terpopuler', href: '#wisata' },
                        { id: 'teknologi', label: 'Teknologi GIS', desc: 'Algoritma Jarak Haversine', href: '#teknologi' }
                    ].map(item => {
                        const isActive = activeNav === item.id;
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`hp-mobile-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                                        {item.label}
                                    </span>
                                    <p style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.65)', fontWeight: 600, marginTop: 4 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {/* Explore Map Button Card */}
                <div style={{ marginTop: 24 }}>
                    <Link to="/explore" className="hp-btn-primary" onClick={() => setIsMenuOpen(false)} style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '16px 24px',
                        fontSize: 15,
                        fontWeight: 800,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #004DA4 0%, #0064D2 100%)',
                        boxShadow: '0 8px 30px rgba(0, 77, 164, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <Compass size={18} strokeWidth={2.5} />
                        <span>Explore Peta Interaktif</span>
                    </Link>
                </div>
            </div>


            {/* ══════════════════════════════
                HERO SECTION
            ══════════════════════════════ */}
            <section id="beranda" style={{
                position: 'relative',
                height: '100vh',
                minHeight: 620,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#0A0F1E',
            }}>
                {/* Background video */}
                <video
                    autoPlay loop muted playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                >
                    <source src="/bg-pemalang.mp4" type="video/mp4" />
                </video>

                {/* Gradient overlay — dark only, no white fade */}
                <div className="hp-hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

                {/* Hero Content — pushed slightly above center for natural eye position */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '0 32px',
                    maxWidth: 860,
                    width: '100%',
                    marginTop: '-60px',
                }}>

                    <h1 className="hp-fadein-2" style={{
                        fontSize: 'clamp(42px, 7vw, 76px)',
                        fontWeight: 800,
                        color: '#ffffff',
                        lineHeight: 1.05,
                        letterSpacing: '-0.03em',
                        marginBottom: 24,
                    }}>
                        Jelajahi Indahnya{' '}
                        <span style={{
                            color: 'transparent',
                            backgroundImage: 'linear-gradient(100deg, #00F5C8 0%, #38BDF8 50%, #818CF8 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 20px rgba(0,245,200,0.4))',
                        }}>
                            Pemalang
                        </span>
                    </h1>

                    <p className="hp-fadein-3" style={{
                        fontSize: 'clamp(16px, 2vw, 20px)',
                        color: 'rgba(255,255,255,0.78)',
                        lineHeight: 1.7,
                        maxWidth: 580,
                        margin: '0 auto 48px',
                        fontWeight: 400,
                    }}>
                        Temukan surga tersembunyi dengan teknologi Haversine. Presisi, Cepat, dan
                        Interaktif untuk pengalaman eksplorasi geografis yang tak tertandingi.
                    </p>

                    <div className="hp-fadein-4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/explore" className="hp-btn-primary">
                            <Compass size={20} />
                            Mulai Eksplorasi
                        </Link>
                    </div>
                </div>

                {/* Scroll cue */}
                <div style={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'uppercase',
                    }}>SCROLL</span>
                    <div style={{
                        width: 1,
                        height: 32,
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0))',
                        borderRadius: 1,
                        animation: 'hp-scroll-line 1.8s ease-in-out infinite',
                    }} />
                </div>
                <style>{`
                    @keyframes hp-scroll-line {
                        0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
                        50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
                        100% { transform: scaleY(1); transform-origin: top; opacity: 0; }
                    }
                `}</style>
            </section>


            {/* ══════════════════════════════
                POPULAR DESTINATIONS SECTION
            ══════════════════════════════ */}
            <section id="wisata" style={{ padding: '100px 0', background: '#fff' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px' }} className="hp-section-inner">

                    {/* Section Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 64, flexWrap: 'wrap', gap: 28 }}>
                        <div className="hp-reveal" style={{ maxWidth: 560 }}>
                            <div className="hp-section-label">Discover</div>
                            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
                                Destinasi <span style={{ color: '#004DA4' }}>Favorit</span>
                            </h2>
                            <p style={{ fontSize: 17, color: '#424753', lineHeight: 1.75, fontWeight: 400 }}>
                                Kami merangkum tempat-tempat terbaik untuk mengisi waktu liburan Anda di
                                Kabupaten Pemalang dengan panduan digital yang lengkap.
                            </p>
                        </div>
                        <Link
                            to="/explore"
                            className="hp-reveal hp-delay-1"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#004DA4', fontWeight: 700, fontSize: 15, textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'gap 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.gap = '14px'}
                            onMouseLeave={e => e.currentTarget.style.gap = '8px'}
                        >
                            LIHAT SEMUA DESTINASI <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Cards Grid — staggered layout */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 24,
                        alignItems: 'start',
                    }} className="hp-dest-grid">
                        {popularWisata.length > 0 ? (
                            popularWisata.map((item, index) => (
                                <Link
                                    key={item.wisata_id}
                                    to={`/wisata/${item.wisata_id}`}
                                    className={`hp-dest-card hp-reveal hp-delay-${index + 1}`}
                                    style={{
                                        height: index === 1 ? 500 : 420,
                                        marginTop: index === 1 ? 40 : 0,
                                    }}
                                >
                                    {/* Full image */}
                                    <img
                                        src={item.foto_populer || item.foto_utama}
                                        alt={item.nama_wisata}
                                        loading="lazy"
                                        className="hp-dest-img"
                                        style={{ position: 'absolute', inset: 0 }}
                                    />


                                    {/* Category chip */}
                                    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 2 }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            background: 'rgba(255,255,255,0.18)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: 9999,
                                            padding: '5px 14px',
                                            fontSize: 12, fontWeight: 700, color: '#fff',
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                        }}>
                                            {item.nama_kategori || 'Wisata'}
                                        </span>
                                    </div>

                                    {/* Text overlay */}
                                    <div className="hp-dest-content" style={{ zIndex: 2 }}>
                                        <div className="hp-dest-location" style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                                            <MapPin size={14} color="#53F8D9" />
                                            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.03em' }}>
                                                {item.kecamatan}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                                            <h3 style={{
                                                fontSize: index === 1 ? 26 : 22,
                                                fontWeight: 800,
                                                color: '#fff',
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1.2,
                                                flex: 1,
                                            }}>
                                                {item.nama_wisata}
                                            </h3>
                                            <div className="hp-dest-arrow" style={{
                                                width: 40, height: 40, flexShrink: 0,
                                                background: '#004DA4',
                                                borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <ArrowRight size={18} color="#fff" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            /* Skeleton placeholder */
                            [0, 1, 2].map(i => (
                                <div key={i} className="hp-dest-card" style={{
                                    height: i === 1 ? 500 : 420,
                                    marginTop: i === 1 ? 40 : 0,
                                    background: 'linear-gradient(90deg, #E8E8EA 25%, #F3F3F6 50%, #E8E8EA 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'hp-shimmer 1.5s infinite',
                                }} />
                            ))
                        )}
                    </div>
                    <style>{`
                        @keyframes hp-shimmer {
                            0% { background-position: 200% 0; }
                            100% { background-position: -200% 0; }
                        }
                        @media (max-width: 768px) {
                            .hp-section-inner { padding: 0 20px !important; }
                            .hp-dest-grid {
                                grid-template-columns: 1fr !important;
                            }
                            .hp-dest-card {
                                height: 380px !important;
                                margin-top: 0 !important;
                            }
                        }
                        @media (max-width: 1024px) and (min-width: 769px) {
                            .hp-dest-grid {
                                grid-template-columns: repeat(2, 1fr) !important;
                            }
                        }
                    `}</style>
                </div>
            </section>


            {/* ══════════════════════════════
                TECHNOLOGY SECTION (HAVERSINE)
            ══════════════════════════════ */}
            <section id="teknologi" style={{ padding: '100px 0', background: COLORS.surfaceLow }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px', textAlign: 'center' }} className="hp-tech-inner">

                    {/* Section label */}
                    <div className="hp-reveal" style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#004DA4' }}>
                            Our Technology
                        </span>
                    </div>

                    <h2 className="hp-reveal hp-delay-1" style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: '#1A1C1E', letterSpacing: '-0.02em', marginTop: 14, marginBottom: 10 }}>
                        Teknologi Haversine
                    </h2>
                    <div className="hp-reveal hp-delay-1 hp-divider" />

                    <p className="hp-reveal hp-delay-2" style={{ fontSize: 17, color: '#424753', lineHeight: 1.75, maxWidth: 580, margin: '32px auto 64px', fontWeight: 400 }}>
                        Kami menggunakan algoritma matematika presisi tinggi untuk memastikan Anda mendapatkan
                        informasi jarak yang akurat dari posisi Anda saat ini ke setiap destinasi wisata.
                    </p>

                    {/* Tech Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, textAlign: 'left' }}>
                        {techFeatures.map((feat, i) => (
                            <div key={i} className={`hp-tech-card hp-reveal hp-delay-${i + 1}`}>
                                {/* Icon */}
                                <div style={{
                                    width: 60, height: 60,
                                    background: feat.color,
                                    borderRadius: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: feat.iconColor,
                                    marginBottom: 24,
                                }}>
                                    {feat.icon}
                                </div>
                                <h4 style={{ fontSize: 20, fontWeight: 700, color: '#1A1C1E', marginBottom: 12, letterSpacing: '-0.01em' }}>
                                    {feat.title}
                                </h4>
                                <p style={{ fontSize: 15, color: '#424753', lineHeight: 1.7, fontWeight: 400 }}>
                                    {feat.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <style>{`
                        @media (max-width: 768px) {
                            .hp-tech-inner { padding: 0 20px !important; }
                        }
                    `}</style>
                </div>
            </section>




            {/* ══════════════════════════════
                FOOTER
            ══════════════════════════════ */}
            <footer style={{ background: '#1A1C1E', padding: '36px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
                className="hp-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Map size={14} color="#ADC6FF" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.01em' }}>WebGIS <span style={{ color: '#ADC6FF' }}>Pemalang</span></span>
                </div>
                <p style={{ color: '#727785', fontSize: 13, fontWeight: 400 }}>
                    © {new Date().getFullYear()} WebGIS Pariwisata Pemalang
                </p>
                <style>{`
                    @media (max-width: 768px) {
                        .hp-footer { padding: 28px 20px !important; justify-content: center !important; text-align: center; }
                    }
                `}</style>
            </footer>

        </div>
    );
};

export default Home;