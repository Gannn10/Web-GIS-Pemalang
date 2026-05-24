import React from 'react';
import { Star, ShieldAlert, Image, Calendar, Info, MapPin } from 'lucide-react';

const FormWisata = ({ formData, setFormData, onSubmit, isEditing, availableFasilitas = [] }) => {
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFormData({ ...formData, [fieldName]: file });
    };

    const handleFasilitasToggle = (id) => {
        const current = formData.fasilitas || [];
        let updated;
        if (current.includes(id)) {
            updated = current.filter(fid => fid !== id);
        } else {
            updated = [...current, id];
        }
        setFormData({ ...formData, fasilitas: updated });
    };

    return (
        <div className="bg-white rounded-3xl w-full">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                    {isEditing ? '✏️' : '➕'}
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        {isEditing ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Baru'}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Lengkapi formulir detail di bawah ini</p>
                </div>
            </div>
          
            <form onSubmit={onSubmit} className="space-y-6">
                {/* GRID INFORMASI DASAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Nama Wisata */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Wisata</label>
                        <input 
                            type="text" placeholder="Contoh: Pantai Widuri" required 
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                            value={formData.nama_wisata} 
                            onChange={(e) => setFormData({...formData, nama_wisata: e.target.value})}
                        />
                    </div>

                    {/* 2. Kecamatan */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kecamatan</label>
                        <input 
                            type="text" placeholder="Contoh: Pemalang" required 
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                            value={formData.kecamatan} 
                            onChange={(e) => setFormData({...formData, kecamatan: e.target.value})}
                        />
                    </div>

                    {/* 3. Kategori Wisata */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategori Wisata</label>
                        <select 
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm cursor-pointer" 
                            value={formData.kategori_id}
                            onChange={(e) => setFormData({...formData, kategori_id: parseInt(e.target.value)})}
                        >
                            <option value={1}>Wisata Bahari (Pantai/Laut)</option>
                            <option value={2}>Wisata Alam (Gunung/Curug)</option>
                            <option value={3}>Wisata Buatan (Taman/Kolam)</option>
                            <option value={4}>Wisata Religi (Makam/Masjid)</option>
                        </select>
                    </div>

                    {/* 4. Koordinat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Latitude</label>
                            <input 
                                type="number" step="any" placeholder="-6.8615" required 
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                value={formData.latitude} 
                                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Longitude</label>
                            <input 
                                type="number" step="any" placeholder="109.3835" required 
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                value={formData.longitude} 
                                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* 5. Harga Tiket */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Harga Tiket Masuk (Rp)</label>
                        <input 
                            type="number" placeholder="Contoh: 15000 (Kosongkan jika gratis)" 
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                            value={formData.harga_tiket || ''} 
                            onChange={(e) => setFormData({...formData, harga_tiket: e.target.value})}
                        />
                    </div>

                    {/* 6. Jam Operasional */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jam Buka</label>
                            <input 
                                type="time" 
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm cursor-pointer"
                                value={formData.jam_buka || ''} 
                                onChange={(e) => setFormData({...formData, jam_buka: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jam Tutup</label>
                            <input 
                                type="time" 
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm cursor-pointer"
                                value={formData.jam_tutup || ''} 
                                onChange={(e) => setFormData({...formData, jam_tutup: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* ALAMAT LENGKAP */}
                <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                    <textarea 
                        rows="2" placeholder="Contoh: Jl. Laksamana Yos Sudarso, Widuri, Pemalang..." 
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                        value={formData.alamat || ''} 
                        onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    />
                </div>

                {/* DESKRIPSI WISATA */}
                <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deskripsi / Tentang Wisata</label>
                    <textarea 
                        rows="4" placeholder="Ceritakan keindahan dan keunikan destinasi wisata ini..." 
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                        value={formData.deskripsi || ''} 
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    />
                </div>

                {/* ─── FITUR BARU: PILIHAN FASILITAS ─── */}
                <div className="space-y-2.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fasilitas Pendukung Wisata</label>
                    {availableFasilitas.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-slate-50/60 p-4 rounded-3xl border border-slate-100/80">
                            {availableFasilitas.map(f => {
                                const isChecked = formData.fasilitas?.includes(f.fasilitas_id);
                                return (
                                    <label 
                                        key={f.fasilitas_id}
                                        className={`flex items-center justify-center gap-2.5 px-3 py-3 rounded-2xl border cursor-pointer select-none transition-all duration-300 active:scale-[0.97]
                                            ${isChecked 
                                                ? 'bg-blue-500 border-blue-500 text-white font-black shadow-md shadow-blue-500/10' 
                                                : 'bg-white border-slate-200/60 text-slate-500 hover:bg-slate-100/50'}`}
                                    >
                                        <input 
                                            type="checkbox"
                                            className="sr-only"
                                            checked={isChecked}
                                            onChange={() => handleFasilitasToggle(f.fasilitas_id)}
                                        />
                                        <span className="text-base leading-none flex items-center justify-center w-5 h-5">
                                            {f.icon && (f.icon.includes('/') || f.icon.includes('.') || f.icon.startsWith('http')) ? (
                                                <img src={f.icon} alt={f.nama_fasilitas} className="w-5 h-5 object-contain" />
                                            ) : (
                                                f.icon
                                            )}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-wider truncate">{f.nama_fasilitas}</span>
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-[10px] font-bold">Memuat daftar fasilitas...</div>
                    )}
                </div>

                {/* ─── FITUR POPULER LANDING PAGE ─── */}
                <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 rounded-[28px] shadow-xl relative overflow-hidden">
                    {/* Glowing effect inside */}
                    <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1">
                            <h4 className="text-white font-black text-sm flex items-center gap-2 uppercase tracking-wide">
                                <Star className={formData.is_populer ? "text-yellow-400 fill-yellow-400 animate-spin-slow" : "text-slate-400"} size={20} />
                                Jadikan Destinasi Populer
                            </h4>
                            <p className="text-slate-400 text-[10px] font-medium leading-relaxed max-w-xl">
                                Jika diaktifkan, wisata ini akan muncul di halaman utama (Beranda) dalam jajaran destinasi pariwisata terbaik Kabupaten Pemalang.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-2xl border border-white/10 shrink-0">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={formData.is_populer || false}
                                    onChange={(e) => setFormData({...formData, is_populer: e.target.checked})}
                                />
                                <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500 peer-checked:after:bg-white"></div>
                                <span className="ml-3 text-[9px] font-black text-white uppercase tracking-widest">
                                    {formData.is_populer ? 'AKTIF' : 'MATI'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {formData.is_populer && (
                        <div className="mt-6 pt-5 border-t border-white/10 animate-in fade-in duration-300">
                            <label className="block text-white text-[9px] font-black uppercase tracking-widest mb-3">Upload Foto Banner Populer (Rasio 16:9)</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="text-xs text-slate-300 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-white file:text-slate-900 hover:file:bg-slate-200 cursor-pointer w-full sm:w-auto" 
                                    onChange={(e) => handleFileChange(e, 'foto_populer')} 
                                />
                                {isEditing && typeof formData.foto_populer === 'string' && formData.foto_populer && (
                                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1.5 shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Banner Tersimpan ✓</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* GALERI FOTO DETAIL */}
                <div className="bg-slate-50/50 p-6 rounded-[28px] border border-slate-200/60">
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-4 border-b border-slate-200/50 pb-2">🖼️ Galeri Foto Detail</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Foto Utama {isEditing ? '(Opsional)' : '(Wajib)'}</label>
                            <input type="file" accept="image/*" required={!isEditing} className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" onChange={(e) => handleFileChange(e, 'foto_utama')} />
                            {isEditing && typeof formData.foto_utama === 'string' && formData.foto_utama && (
                                <p className="text-[9px] text-slate-400 truncate max-w-full font-bold ml-1">✓ {formData.foto_utama.split('/').pop()}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Foto 2 (Opsional)</label>
                            <input type="file" accept="image/*" className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" onChange={(e) => handleFileChange(e, 'foto_2')} />
                            {isEditing && typeof formData.foto_2 === 'string' && formData.foto_2 && (
                                <p className="text-[9px] text-slate-400 truncate max-w-full font-bold ml-1">✓ {formData.foto_2.split('/').pop()}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Foto 3 (Opsional)</label>
                            <input type="file" accept="image/*" className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" onChange={(e) => handleFileChange(e, 'foto_3')} />
                            {isEditing && typeof formData.foto_3 === 'string' && formData.foto_3 && (
                                <p className="text-[9px] text-slate-400 truncate max-w-full font-bold ml-1">✓ {formData.foto_3.split('/').pop()}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button 
                        type="submit" 
                        className={`flex-1 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-[0.98]
                            ${isEditing 
                                ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/10' 
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10'}`}
                    >
                        {isEditing ? 'Simpan Perubahan Data' : 'Simpan Destinasi Baru'}
                    </button>
                    
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={() => {
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
                            }} 
                            className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            Batal Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FormWisata;