import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    // State untuk efek navbar saat di-scroll
    const [isScrolled, setIsScrolled] = useState(false);
    
    // State untuk animasi list Haversine saat diklik
    const [animatingItem, setAnimatingItem] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fungsi untuk trigger animasi selama 400ms
    const handleItemClick = (index) => {
        setAnimatingItem(index);
        setTimeout(() => setAnimatingItem(null), 400);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
            
            {/* =========================================
                1. NAVBAR (MENU ATAS)
            ========================================= */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                    {/* Logo & Judul */}
                    <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-800' : 'text-white drop-shadow-md'}`}>
                            Sistem Informasi Geografis Pemalang
                        </span>
                    </div>

                    {/* Menu Kanan */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#beranda" className={`font-semibold transition hover:text-blue-400 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}>Beranda</a>
                        <a href="#kategori" className={`font-semibold transition hover:text-blue-400 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}> Wisata Populer</a>
                        <a href="#tentang" className={`font-semibold transition hover:text-blue-400 ${isScrolled ? 'text-gray-600' : 'text-gray-200'}`}>Tentang </a>
                        
        
                    </div>
                </div>
            </nav>

            {/* =========================================
                2. HERO SECTION (VIDEO BACKGROUND)
            ========================================= */}
            <section id="beranda" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
                {/* Video Background */}
                <video 
                    autoPlay loop muted playsInline 
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
                >
                    <source src="/bg-pemalang.mp4" type="video/mp4" />
                </video>

                {/* Overlay Hitam Transparan */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>

                {/* Konten Hero */}
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
                        Pesona Pariwisata <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Kabupaten Pemalang</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 drop-shadow-lg leading-relaxed font-light">
                        Temukan destinasi wisata terbaik dan rute terdekat menggunakan <strong className="text-white font-semibold">Algoritma Haversine</strong>. Liburan jadi lebih mudah dan terencana.
                    </p>
                    
                    <Link 
                        to="/explore" 
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                    >
                        Jelajahi Peta Interaktif
                    </Link>
                </div>

                {/* Panah ke Bawah */}
                <div className="absolute bottom-10 z-20 animate-bounce">
                    <a href="#kategori" className="text-white/70 hover:text-white transition">
                        <span className="text-3xl">↓</span>
                    </a>
                </div>
            </section>

           {/* =========================================
                3. SECTION WISATA TERPOPULER
            ========================================= */}
            <section id="kategori" className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-extrabold tracking-widest text-sm uppercase mb-4 block">
                            Pilihan Terbaik
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                            Destinasi Terpopuler
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Jelajahi keindahan tersembunyi Kabupaten Pemalang. Dari pesisir pantai hingga kesejukan pegunungan, temukan pengalaman liburan yang tak terlupakan.
                        </p>
                    </div>
                    
                    {/* Grid 3 Kolom Card Wisata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        
                        {/* Wisata 1 */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src="/widuri 1.jpg" 
                                    alt="Pantai Widuri" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-blue-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Wisata Bahari
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Pantai Widuri</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Pantai legendaris di pusat kota Pemalang dengan fasilitas lengkap, sirkuit balap, dan pemandangan sunset yang memukau.</p>
                                <div className="flex items-center text-sm font-medium text-gray-400">
                                    <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                    Pemalang, Jawa Tengah
                                </div>
                            </div>
                        </div>

                        {/* Wisata 2 */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer mt-0 md:mt-8">
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src="/curug cibedil3.jpg"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-green-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Wisata Alam
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Curug Sibedil</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Air terjun eksotis dengan tebing berbatu unik yang menyajikan kesegaran alami khas pegunungan Pemalang selatan.</p>
                                <div className="flex items-center text-sm font-medium text-gray-400">
                                    <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                    Moga, Pemalang
                                </div>
                            </div>
                        </div>

                        {/* Wisata 3 */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer mt-0 md:mt-16">
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src="/bukit tanggeban5.jpg" 
                                    alt="Bukit Tangkeban" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-purple-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    Wisata Buatan
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Bukit Tangkeban</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Spot foto kekinian dengan latar belakang Gunung Slamet yang megah. Terdapat jembatan kaca dan fasilitas camping.</p>
                                <div className="flex items-center text-sm font-medium text-gray-400">
                                    <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                    Pulosari, Pemalang
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    

                </div>
            </section>

            {/* =========================================
                4. SECTION INFO HAVERSINE (CARD HORIZONTAL)
            ========================================= */}
            <section id="tentang" className="py-24 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    
                    <span className="text-blue-600 font-extrabold tracking-widest text-sm uppercase mb-4 block">
                        Teknologi Yang Digunakan
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                        Pencarian Jarak Terdekat
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl mb-16 max-w-4xl mx-auto leading-relaxed">
                        Aplikasi ini menerapkan algoritma <strong className="text-gray-900">Haversine Formula</strong> untuk menghitung jarak lurus secara presisi antara lokasi Anda saat ini dengan titik koordinat objek wisata.
                    </p>
                    
                    {/* Grid 3 Kolom Menyamping */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        
                        {/* Card 1 */}
                        <div 
                            onClick={() => handleItemClick(1)}
                            className={`bg-white p-8 rounded-3xl shadow-md border border-gray-100 cursor-pointer transition-all duration-300 flex flex-col items-center text-center
                                ${animatingItem === 1 
                                    ? 'scale-110 shadow-2xl ring-4 ring-blue-100 border-blue-400 -translate-y-4' 
                                    : 'hover:shadow-xl hover:-translate-y-2'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${animatingItem === 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Real-Time</h3>
                            <p className="text-gray-600">Rekomendasi wisata terdekat yang disesuaikan dengan posisi GPS Anda secara langsung.</p>
                        </div>

                        {/* Card 2 */}
                        <div 
                            onClick={() => handleItemClick(2)}
                            className={`bg-white p-8 rounded-3xl shadow-md border border-gray-100 cursor-pointer transition-all duration-300 flex flex-col items-center text-center
                                ${animatingItem === 2 
                                    ? 'scale-110 shadow-2xl ring-4 ring-green-100 border-green-400 -translate-y-4' 
                                    : 'hover:shadow-xl hover:-translate-y-2'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${animatingItem === 2 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Jarak Presisi</h3>
                            <p className="text-gray-600">Detail perhitungan jarak lurus ditampilkan dalam satuan Kilometer (Km) dengan akurasi tinggi.</p>
                        </div>

                        {/* Card 3 */}
                        <div 
                            onClick={() => handleItemClick(3)}
                            className={`bg-white p-8 rounded-3xl shadow-md border border-gray-100 cursor-pointer transition-all duration-300 flex flex-col items-center text-center
                                ${animatingItem === 3 
                                    ? 'scale-110 shadow-2xl ring-4 ring-purple-100 border-purple-400 -translate-y-4' 
                                    : 'hover:shadow-xl hover:-translate-y-2'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${animatingItem === 3 ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Filter Cerdas</h3>
                            <p className="text-gray-600">Sesuaikan pencarian berdasarkan radius jarak tempuh dan kategori wisata yang diinginkan.</p>
                        </div>

                    </div>

  
                    
                </div>
            </section>

            {/* =========================================
                5. FOOTER
            ========================================= */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
                <p className="mb-2 text-sm">
                    &copy; 2026  Muhammad Gani Ramadhani (A11.2022.14223)
                </p>
                <p className="text-xs">
                     <span className="text-gray-200 font-bold">Dikembangkan untuk Tugas Akhir</span> - Universitas Dian Nuswantoro
                </p>
            </footer>

        </div>
    );
};

export default Home;