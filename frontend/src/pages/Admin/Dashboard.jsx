import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormWisata from '../../components/Admin/FormWisata';
import TableWisata from '../../components/Admin/TableWisata';
import { 
    LayoutDashboard, Map, LogOut, PlusCircle, List, 
    Palmtree, Layers, Star, Navigation, Sparkles, User, Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [wisataList, setWisataList] = useState([]);
    const [availableFasilitas, setAvailableFasilitas] = useState([]);
    
    const [formData, setFormData] = useState({ 
        nama_wisata: '', kecamatan: '', kategori_id: 2, 
        latitude: '', longitude: '', alamat: '',
        foto_utama: '', foto_2: '', foto_3: '',
        deskripsi: '', harga_tiket: '', jam_buka: '', jam_tutup: '',
        is_populer: false, foto_populer: '',
        fasilitas: [] // Menyimpan array of fasilitas_id yang dipilih
    });
    
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');

    const fetchWisata = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata`);
            setWisataList(res.data.data || []); 
        } catch (err) {
            console.error("Gagal mengambil data wisata:", err);
        }
    };

    const fetchFasilitas = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/fasilitas`);
            setAvailableFasilitas(res.data.data || []);
        } catch (err) {
            console.error("Gagal mengambil data fasilitas:", err);
        }
    };

    useEffect(() => { 
        fetchWisata(); 
        fetchFasilitas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDASI: Batasan Maksimal 3 Destinasi Populer
        if (formData.is_populer) {
            const popularCount = wisataList.filter(w => w.is_populer && w.wisata_id !== editingId).length;
            if (popularCount >= 3) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Limit Tercapai!',
                    text: 'Maksimal hanya boleh 3 destinasi populer. Matikan status populer di wisata lain dulu ya, bree!',
                    confirmButtonColor: '#3b82f6',
                    borderRadius: '24px'
                });
                return;
            }
        }
        
        const dataToSend = new FormData();
        dataToSend.append('nama_wisata', formData.nama_wisata);
        dataToSend.append('kecamatan', formData.kecamatan);
        dataToSend.append('kategori_id', formData.kategori_id);
        dataToSend.append('latitude', formData.latitude);
        dataToSend.append('longitude', formData.longitude);
        dataToSend.append('alamat', formData.alamat);
        
        dataToSend.append('deskripsi', formData.deskripsi);
        dataToSend.append('harga_tiket', formData.harga_tiket);
        dataToSend.append('jam_buka', formData.jam_buka);
        dataToSend.append('jam_tutup', formData.jam_tutup);
        dataToSend.append('daya_tarik', '');

        // Kirim array fasilitas sebagai JSON string
        dataToSend.append('fasilitas', JSON.stringify(formData.fasilitas || []));

        if (formData.foto_utama) dataToSend.append('foto_utama', formData.foto_utama);
        if (formData.foto_2) dataToSend.append('foto_2', formData.foto_2);
        if (formData.foto_3) dataToSend.append('foto_3', formData.foto_3);
        
        dataToSend.append('is_populer', formData.is_populer);
        if (formData.foto_populer) dataToSend.append('foto_populer', formData.foto_populer);

        const config = { headers: { Authorization: `Bearer ${token}` } };
        Swal.fire({ 
            title: 'Menyimpan Data...', 
            allowOutsideClick: false, 
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata/${editingId}`, dataToSend, config);
                Swal.fire({ title: 'Berhasil!', text: 'Data wisata berhasil diperbarui.', icon: 'success', confirmButtonColor: '#3b82f6', borderRadius: '24px' });
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata`, dataToSend, config);
                Swal.fire({ title: 'Berhasil!', text: 'Data wisata baru berhasil ditambahkan.', icon: 'success', confirmButtonColor: '#3b82f6', borderRadius: '24px' });
            }

            // RESET FORM
            setFormData({ 
                nama_wisata: '', kecamatan: '', kategori_id: 2, 
                latitude: '', longitude: '', alamat: '',
                foto_utama: '', foto_2: '', foto_3: '',
                deskripsi: '', harga_tiket: '', jam_buka: '', jam_tutup: '',
                is_populer: false, foto_populer: '',
                fasilitas: []
            });
            
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => input.value = '');

            setEditingId(null);
            fetchWisata();
        } catch (err) { 
            const msg = err.response?.data?.message || 'Terjadi kesalahan pada server.';
            Swal.fire({ title: 'Oops...', text: msg, icon: 'error', confirmButtonColor: '#ef4444', borderRadius: '24px' });
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Hapus Data?', 
            text: "Data yang dihapus tidak bisa dikembalikan!", 
            icon: 'warning',
            showCancelButton: true, 
            confirmButtonColor: '#ef4444', 
            cancelButtonColor: '#3b82f6', 
            confirmButtonText: 'Ya, Hapus!',
            borderRadius: '24px'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/wisata/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    Swal.fire({ title: 'Terhapus!', text: 'Data berhasil dihapus.', icon: 'success', confirmButtonColor: '#3b82f6', borderRadius: '24px' });
                    fetchWisata();
                } catch (err) { 
                    Swal.fire({ title: 'Gagal!', text: 'Terjadi kesalahan saat menghapus.', icon: 'error', confirmButtonColor: '#ef4444', borderRadius: '24px' }); 
                }
            }
        });
    };

    const handleEdit = (item) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setFormData({
            nama_wisata: item.nama_wisata,
            kecamatan: item.kecamatan || '',
            kategori_id: item.kategori_id || 2,
            latitude: item.latitude,
            longitude: item.longitude,
            alamat: item.alamat || '',
            foto_utama: item.foto_utama || '', 
            foto_2: item.foto_2 || '',
            foto_3: item.foto_3 || '',
            deskripsi: item.deskripsi || '',
            harga_tiket: item.harga_tiket || '',
            jam_buka: item.jam_buka || '',
            jam_tutup: item.jam_tutup || '',
            is_populer: item.is_populer || false,
            foto_populer: item.foto_populer || '',
            // Map the API facilities JSON format to just an array of IDs
            fasilitas: item.fasilitas ? item.fasilitas.map(f => f.fasilitas_id) : []
        });
        setEditingId(item.wisata_id);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
    };

    // Hitung ringkasan statistik
    const totalWisata = wisataList.length;
    const totalPopuler = wisataList.filter(w => w.is_populer).length;
    const totalBahari = wisataList.filter(w => w.kategori_id === 1).length;
    const totalAlam = wisataList.filter(w => w.kategori_id === 2).length;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            
            {/* ─── SIDEBAR ─── */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 hidden md:flex">
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-6 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Navigation className="text-white rotate-45" size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-xs uppercase tracking-wider leading-none">WebGIS Admin</h2>
                            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1 block">Pemalang</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1.5 flex-1">
                        <div className="px-3 py-2 text-[9px] font-black uppercase text-slate-500 tracking-widest">Utama</div>
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-600/10">
                            <LayoutDashboard size={16} />
                            Dashboard
                        </a>
                        <Link to="/explore" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-black uppercase tracking-wider transition-all">
                            <Map size={16} />
                            Buka Peta Wisata
                        </Link>
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-black uppercase tracking-wider transition-all">
                            <Home size={16} />
                            Kembali Beranda
                        </Link>
                    </nav>
                </div>

                {/* Bottom User Profile & Logout */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 p-2 bg-slate-800/40 border border-slate-800 rounded-2xl mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <User size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate leading-none">Administrator</p>
                            <span className="text-[9px] text-slate-500 font-medium">Role: Admin</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ─── MAIN CONTENT CONTAINER ─── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header (Top Nav) */}
                <header className="h-16 border-b border-slate-100 bg-white px-6 md:px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-blue-500" size={16} />
                        <h1 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dashboard Kelola Pariwisata</h1>
                    </div>

                    {/* Mobile LogOut Button */}
                    <button 
                        onClick={handleLogout}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </header>

                {/* Scrollable Workspace */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                    
                    {/* STATS OVERVIEW SECTION */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        {/* 1. Total Wisata */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-4 relative overflow-hidden group hover:border-blue-100 transition-all">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Palmtree size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Wisata</p>
                                <p className="text-2xl font-black text-slate-800 leading-none mt-1">{totalWisata}</p>
                            </div>
                        </div>

                        {/* 2. Total Populer */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-4 relative overflow-hidden group hover:border-yellow-100 transition-all">
                            <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Star className="fill-yellow-500 text-yellow-500" size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Populer Pilihan</p>
                                <p className="text-2xl font-black text-slate-800 leading-none mt-1">{totalPopuler} <span className="text-[10px] text-slate-400">/ 3</span></p>
                            </div>
                        </div>

                        {/* 3. Wisata Bahari */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-4 relative overflow-hidden group hover:border-sky-100 transition-all">
                            <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Layers size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wisata Bahari</p>
                                <p className="text-2xl font-black text-slate-800 leading-none mt-1">{totalBahari}</p>
                            </div>
                        </div>

                        {/* 4. Wisata Alam */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-4 relative overflow-hidden group hover:border-emerald-100 transition-all">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wisata Alam</p>
                                <p className="text-2xl font-black text-slate-800 leading-none mt-1">{totalAlam}</p>
                            </div>
                        </div>

                    </section>

                    {/* FORM SECTION */}
                    <section className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
                        <FormWisata 
                            formData={formData} 
                            setFormData={setFormData} 
                            onSubmit={handleSubmit} 
                            isEditing={!!editingId}
                            availableFasilitas={availableFasilitas}
                        />
                    </section>

                    {/* TABLE SECTION */}
                    <section className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Daftar Destinasi Wisata</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Kelola data terdaftar secara dinamis</p>
                            </div>
                            <span className="bg-blue-50 text-blue-600 text-xs font-black px-4 py-1.5 rounded-full">{totalWisata} Objek</span>
                        </div>
                        <div className="max-w-full w-full">
                            <TableWisata data={wisataList} onDelete={handleDelete} onEdit={handleEdit} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;