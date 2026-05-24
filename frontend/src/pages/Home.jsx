import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
    Map, 
    Compass, 
    ArrowRight, 
    Navigation, 
    ShieldCheck, 
    Zap, 
    ChevronDown,
    Menu,
    X,
    Camera,
    MapPin,
    Calendar,
    Globe
} from 'lucide-react';

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [popularWisata, setPopularWisata] = useState([]);
    
    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata`);
                const popular = res.data.data.filter(w => w.is_populer === true).slice(0, 3);
                setPopularWisata(popular);
            } catch (err) {
                console.error("Gagal ambil wisata populer:", err);
            }
        };
        fetchPopular();
    }, []);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer untuk animasi reveal saat scroll
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [popularWisata]);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
            
            {/* Custom Animations & Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 4s ease-in-out infinite; }
                
                .reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .reveal-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .nav-link {
                    position: relative;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: #3b82f6;
                    transition: width 0.3s ease;
                }
                .nav-link:hover::after {
                    width: 100%;
                }
            `}</style>
            
            {/* ─── NAVBAR ─── */}
            <nav className={`fixed w-full z-[100] transition-all duration-500 ${
                isScrolled 
                ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm' 
                : 'bg-transparent py-6'
            }`}>
                <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className={`text-xl font-black tracking-tighter ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                            WebGIS <span className={isScrolled ? 'text-blue-600' : 'text-blue-400'}>Pemalang</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {['Beranda', 'Wisata', 'Teknologi'].map((item) => (
                            <a 
                                key={item}
                                href={`#${item.toLowerCase()}`} 
                                className={`nav-link text-sm font-bold uppercase tracking-widest transition-colors ${
                                    isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white/80 hover:text-white'
                                }`}
                            >
                                {item}
                            </a>
                        ))}
                        <Link 
                            to="/explore" 
                            className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                                isScrolled 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5' 
                                : 'bg-white text-gray-900 hover:bg-blue-50 hover:-translate-y-0.5'
                            }`}
                        >
                            Explore Map
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white z-[90] transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {['Beranda', 'Wisata', 'Teknologi'].map((item) => (
                            <a 
                                key={item} 
                                href={`#${item.toLowerCase()}`} 
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-black text-gray-900 uppercase tracking-tighter"
                            >
                                {item}
                            </a>
                        ))}
                        <Link 
                            to="/explore" 
                            className="px-10 py-4 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-lg"
                        >
                            Explore Map
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO SECTION ─── */}
            <section id="beranda" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-950">
                <video 
                    autoPlay loop muted playsInline 
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60 scale-105"
                >
                    <source src="/bg-pemalang.mp4" type="video/mp4" />
                </video>

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-white/10 z-10"></div>

                <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                        Jelajahi Indahnya <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-300 drop-shadow-sm">
                            Pemalang
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Temukan surga tersembunyi dengan teknologi Haversine. 
                        Presisi, Cepat, dan Interaktif.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                        <Link 
                            to="/explore" 
                            className="group flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                        >
                            <Compass size={20} className="group-hover:rotate-45 transition-transform" />
                            Mulai Eksplorasi
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-12 z-20 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Scroll</span>
                    <ChevronDown className="text-white/30 animate-bounce" size={24} />
                </div>
            </section>

            {/* ─── POPULAR SECTION ─── */}
            <section id="wisata" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50"></div>
                
                <div className="container mx-auto px-6 lg:px-16 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl reveal">
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-none">
                                Destinasi <br/> Favorit <span className="text-blue-600">Pilihan.</span>
                            </h2>
                            <p className="text-gray-500 text-lg font-medium">
                                Kami merangkum tempat-tempat terbaik untuk mengisi waktu liburan Anda di Kabupaten Pemalang.
                            </p>
                        </div>
                        <Link to="/explore" className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all reveal">
                            Lihat Semua <ArrowRight size={20} />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {popularWisata.length > 0 ? (
                            popularWisata.map((item, index) => (
                                <Link 
                                    key={item.wisata_id}
                                    to={`/wisata/${item.wisata_id}`} 
                                    className={`group reveal ${index === 1 ? 'md:mt-12' : ''}`} 
                                    style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
                                >
                                    <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200">
                                        <img 
                                            src={item.foto_populer || item.foto_utama} 
                                            alt={item.nama_wisata} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-10 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    {item.nama_kategori || 'Wisata'}
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{item.nama_wisata}</h3>
                                            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <MapPin size={14} className="text-blue-400" /> {item.kecamatan}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 text-center text-gray-400 font-bold italic">
                                Belum ada destinasi populer yang dipilih di Admin.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ─── TECH SECTION (HAVERSINE) ─── */}
            <section id="teknologi" className="py-32 bg-gray-950 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)]"></div>
                
                <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto reveal">
                        <span className="text-blue-500 font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">Haversine Technology</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">
                            Presisi Digital dalam <br/> <span className="text-blue-500">Genggaman.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-16 leading-relaxed max-w-2xl mx-auto">
                            Kami menggunakan algoritma matematika untuk memastikan Anda mendapatkan informasi jarak yang paling akurat dari posisi Anda saat ini.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { icon: <Zap size={20} />, title: "Real-time Update", desc: "Data jarak diperbarui secara instan." },
                                { icon: <ShieldCheck size={20} />, title: "Akurasi Tinggi", desc: "Hitungan presisi kelengkungan bumi." },
                                { icon: <Globe size={20} />, title: "Optimasi Rute", desc: "Perjalanan jadi lebih efisien." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 group">
                                    <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                        <p className="text-gray-500 text-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;