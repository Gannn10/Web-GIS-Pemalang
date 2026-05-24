import React from 'react';
import { Edit3, Trash2, MapPin, Clock, Banknote } from 'lucide-react';

const TableWisata = ({ data, onDelete, onEdit }) => {
    // Helper format rupiah
    const formatRupiah = (number) => {
        if (!number || parseInt(number) === 0) return 'Gratis';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <div className="bg-white rounded-2xl w-full overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[950px] leading-normal whitespace-nowrap border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-widest text-[9px] font-black">
                            <th className="px-6 py-4 text-left w-20">Gambar</th>
                            <th className="px-6 py-4 text-left">Detail Wisata</th>
                            <th className="px-6 py-4 text-left">Kategori</th>
                            <th className="px-6 py-4 text-left">Harga Tiket</th>
                            <th className="px-6 py-4 text-left">Jam Buka</th>
                            <th className="px-6 py-4 text-left">Fasilitas</th>
                            <th className="px-6 py-4 text-center w-36">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.wisata_id} className="hover:bg-slate-50/50 transition duration-150">
                                    {/* 1. GAMBAR */}
                                    <td className="px-6 py-4.5 vertical-middle">
                                        {item.foto_utama ? (
                                            <div className="relative group">
                                                <img 
                                                    src={item.foto_utama} 
                                                    alt={item.nama_wisata} 
                                                    className="w-12 h-12 object-cover rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition duration-200" 
                                                />
                                                {item.is_populer && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm border border-white font-bold" title="Populer Landing Page">★</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-wider border border-dashed border-slate-200">No Pic</div>
                                        )}
                                    </td>
                                    
                                    {/* 2. DETAIL NAMA & KECAMATAN */}
                                    <td className="px-6 py-4.5">
                                        <p className="text-xs font-black text-slate-800 tracking-wide">{item.nama_wisata}</p>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            <MapPin size={10} className="text-blue-500" />
                                            <span>Kec. {item.kecamatan || 'Pemalang'}</span>
                                        </div>
                                    </td>
                                    
                                    {/* 3. KATEGORI BADGE */}
                                    <td className="px-6 py-4.5">
                                        <span className="bg-slate-100 text-slate-700 text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider">
                                            {item.nama_kategori || 'Wisata'}
                                        </span>
                                    </td>

                                    {/* 4. HARGA TIKET */}
                                    <td className="px-6 py-4.5">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                            <Banknote size={13} className="text-emerald-500" />
                                            <span>{formatRupiah(item.harga_tiket)}</span>
                                        </div>
                                    </td>

                                    {/* 5. JAM BUKA */}
                                    <td className="px-6 py-4.5">
                                        {item.jam_buka && item.jam_tutup ? (
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                                <Clock size={13} className="text-slate-400" />
                                                <span>{item.jam_buka} - {item.jam_tutup}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">24 Jam / Fleksibel</span>
                                        )}
                                    </td>

                                    {/* 6. DAFTAR FASILITAS (ICON ROW) */}
                                    <td className="px-6 py-4.5">
                                        <div className="flex gap-1 max-w-[150px] overflow-hidden truncate">
                                            {item.fasilitas && item.fasilitas.length > 0 ? (
                                                item.fasilitas.map((f, i) => (
                                                    <span 
                                                        key={f.fasilitas_id || i} 
                                                        title={f.nama_fasilitas} 
                                                        className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs border border-slate-200/40"
                                                    >
                                                        {f.icon && (f.icon.includes('/') || f.icon.includes('.') || f.icon.startsWith('http')) ? (
                                                            <img src={f.icon} alt={f.nama_fasilitas} className="w-4 h-4 object-contain" />
                                                        ) : (
                                                            f.icon
                                                        )}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic font-medium">Belum diatur</span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    {/* 7. AKSI BUTTONS */}
                                    <td className="px-6 py-4.5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => onEdit(item)} 
                                                className="bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white p-2 rounded-xl border border-amber-100 hover:border-amber-500 transition-all duration-200 active:scale-95 flex items-center gap-1"
                                                title="Edit Wisata"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(item.wisata_id)} 
                                                className="bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white p-2 rounded-xl border border-rose-100 hover:border-rose-600 transition-all duration-200 active:scale-95 flex items-center gap-1"
                                                title="Hapus Wisata"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-14 text-center text-slate-400 text-xs italic bg-slate-50/50">
                                    Belum ada data wisata terdaftar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableWisata;