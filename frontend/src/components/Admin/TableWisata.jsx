import React from 'react';

const TableWisata = ({ data, onDelete, onEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow-md mb-10 w-full overflow-hidden border border-gray-100">
            <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[800px] leading-normal whitespace-nowrap">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="px-5 py-4 border-b text-left text-xs font-bold uppercase tracking-wider">Gambar</th>
                            <th className="px-5 py-4 border-b text-left text-xs font-bold uppercase tracking-wider">Nama Wisata</th>
                            <th className="px-5 py-4 border-b text-left text-xs font-bold uppercase tracking-wider">Kategori</th>
                            <th className="px-5 py-4 border-b text-center text-xs font-bold uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.wisata_id} className="hover:bg-blue-50 transition border-b border-gray-100">
                                    {/* Kolom Menampilkan Gambar Thumbnail */}
                                    <td className="px-5 py-3">
                                        {item.foto_utama ? (
                                            <img src={item.foto_utama} alt={item.nama_wisata} className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-200" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-md text-[10px] text-gray-500">No Img</div>
                                        )}
                                    </td>
                                    
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                        {item.nama_wisata}
                                    </td>
                                    
                                    <td className="px-5 py-4 text-sm">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">
                                            {item.nama_kategori || 'Wisata'}
                                        </span>
                                    </td>
                                    
                                    <td className="px-5 py-4 text-sm text-center space-x-2">
                                        <button 
                                            onClick={() => onEdit(item)} 
                                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-md shadow hover:bg-yellow-600 font-bold transition active:scale-95"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => onDelete(item.wisata_id)} 
                                            className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow hover:bg-red-600 font-bold transition active:scale-95"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-5 py-10 text-center text-gray-500 italic bg-gray-50">
                                    Belum ada data wisata. Silakan tambahkan data baru.
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