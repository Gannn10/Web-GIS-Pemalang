import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetailWisata = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [wisata, setWisata] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State untuk Slider Foto
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // PERUBAHAN: Sekarang langsung nembak API khusus Detail (pakai id)
                const res = await axios.get(`http://localhost:5000/api/wisata/${id}`);
                setWisata(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data wisata:", error);
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    if (!wisata) return <div className="h-screen w-full flex items-center justify-center"><h1 className="text-2xl font-bold">Wisata Tidak Ditemukan 😢</h1></div>;

    const images = [wisata.foto_utama, wisata.foto_2, wisata.foto_3].filter(Boolean);

    const nextSlide = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    // ==========================================
    // FUNGSI FORMAT DATA DARI DATABASE
    // ==========================================
    
    // Format Harga Tiket
    const formatHarga = (harga) => {
        if (!harga || parseInt(harga) === 0) return 'Gratis / Belum Tersedia';
        return `Rp ${parseInt(harga).toLocaleString('id-ID')}`;
    };

    // Format Jam Buka - Tutup
    const formatJam = (buka, tutup) => {
        if (buka && tutup) {
            // Potong detik dari database (08:00:00 jadi 08:00)
            const jamBuka = buka.substring(0, 5);
            const jamTutup = tutup.substring(0, 5);
            return `${jamBuka} - ${jamTutup} WIB`;
        }
        return 'Jadwal Belum Tersedia';
    };

    return (
        // 1. KUNCI UTAMA: h-screen dan overflow-hidden biar ngga bisa discroll ke bawah
        <div className="h-screen w-full flex flex-col bg-gray-100 font-sans overflow-hidden">
            
            {/* SUNTIKAN CSS: Custom Scrollbar halus */}
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />

            {/* NAVBAR (Dibuat lebih pipih/pendek) */}
            <nav className="bg-white shadow-sm py-3 px-6 shrink-0 z-50">
                <div className="container mx-auto flex items-center justify-between max-w-7xl">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600 font-bold flex items-center gap-2 transition px-3 py-1.5 rounded-lg hover:bg-blue-50">
                        <span>←</span> Kembali Peta
                    </button>
                    <h1 className="text-lg font-extrabold text-gray-800">Detail <span className="text-blue-600">Wisata</span></h1>
                </div>
            </nav>

            {/* MAIN CONTENT AREA (Sisa tinggi layar) */}
            <div className="flex-1 overflow-hidden p-3 md:p-5 container mx-auto max-w-7xl">
                
                {/* WADAH PUTIH FULL HEIGHT */}
                <div className="bg-white h-full w-full rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col lg:flex-row gap-6">
                    
                    {/* ========================================= */}
                    {/* BAGIAN KIRI: SLIDER & DESKRIPSI (Lebar 55%) */}
                    {/* ========================================= */}
                    <div className="lg:w-[55%] flex flex-col min-h-0 h-full gap-4">
                        
                        {/* SLIDER FOTO */}
                        <div className="w-full h-[55%] relative group bg-gray-900 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                            {images.length > 0 ? (
                                <>
                                    <img 
                                        src={images[currentImage]} 
                                        alt={wisata.nama_wisata} 
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">◀</button>
                                            <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">▶</button>
                                            <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5 z-20">
                                                {images.map((_, idx) => (
                                                    <div key={idx} className={`h-1.5 rounded-full transition-all ${currentImage === idx ? 'w-6 bg-blue-500' : 'w-2 bg-white/60'}`}></div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">Belum ada foto</div>
                            )}
                        </div>

                        {/* DESKRIPSI (Menggunakan data asli dari Admin) */}
                        <div className="flex-1 overflow-y-auto bg-blue-50/40 p-5 rounded-2xl border border-blue-100/50 pr-2 custom-scrollbar">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-3">Tentang Wisata</h3>
                            {/* whitespace-pre-line bikin enter dari admin tetep kebaca di frontend */}
                            <p className="text-gray-700 text-[0.95rem] leading-relaxed text-justify whitespace-pre-line">
                                {wisata.deskripsi || "Deskripsi wisata belum ditambahkan oleh admin."}
                            </p>
                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* BAGIAN KANAN: DETAIL INFO (Lebar 45%)     */}
                    {/* ========================================= */}
                    <div className="lg:w-[45%] flex flex-col min-h-0 h-full">
                        
                        {/* AREA SCROLLABLE UNTUK INFO */}
                        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 custom-scrollbar">
                            
                            {/* JUDUL DAN LOKASI */}
                            <div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block shadow-sm">
                                    {wisata.nama_kategori || 'Wisata'}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                                    {wisata.nama_wisata}
                                </h1>
                                <div className="flex items-start gap-2 text-gray-600">
                                    <span className="text-base mt-0.5">📍</span>
                                    <span className="text-sm font-medium">
                                        {wisata.alamat || `${wisata.kecamatan ? `Kecamatan ${wisata.kecamatan}, ` : ''}Pemalang, Jawa Tengah`}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* TIKET & JAM BUKA (Pakai fungsi format dari atas) */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Tiket */}
                                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1.5">🎟️ Tiket Masuk</span>
                                    <span className="font-extrabold text-blue-700 text-lg">
                                        {formatHarga(wisata.harga_tiket)}
                                    </span>
                                </div>
                                {/* Jam */}
                                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1.5">⏰ Jam Operasional</span>
                                    <span className="font-bold text-gray-900 text-sm whitespace-pre-line leading-tight">
                                        {formatJam(wisata.jam_buka, wisata.jam_tutup)}
                                    </span>
                                </div>
                            </div>

                            {/* FASILITAS */}
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-2">Fasilitas Tersedia</h3>
                                <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-gray-700 font-medium text-[0.85rem]">
                                    <div className="flex items-center gap-2"><span>🅿️</span> Parkir Luas</div>
                                    <div className="flex items-center gap-2"><span>🕌</span> Mushola</div>
                                    <div className="flex items-center gap-2"><span>🚽</span> Toilet Umum</div>
                                    <div className="flex items-center gap-2"><span>🍽️</span> Area Kuliner</div>
                                    <div className="flex items-center gap-2"><span>📸</span> Spot Foto</div>
                                    <div className="flex items-center gap-2"><span>🛖</span> Gazebo</div>
                                </div>
                            </div>

                        </div>

                        {/* TOMBOL BUKA GOOGLE MAPS DI BAWAH */}
                        <div className="pt-4 shrink-0 mt-2">
                            <div className="text-xs text-gray-500 text-center mb-2 font-mono bg-gray-50 py-1.5 rounded-lg border border-gray-100">
                                Lat: {wisata.latitude} | Lon: {wisata.longitude}
                            </div>
                            <a 
                                href={`http://googleusercontent.com/maps.google.com/?q=${wisata.latitude},${wisata.longitude}`}
                                target="_blank" rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold text-base hover:bg-gray-800 transition shadow-lg hover:-translate-y-0.5 active:scale-95"
                            >
                                <span>🗺️</span> Buka Rute di Google Maps
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailWisata;