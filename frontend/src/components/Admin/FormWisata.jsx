import React from 'react';

const FormWisata = ({ formData, setFormData, onSubmit, isEditing }) => {
    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFormData({ ...formData, [fieldName]: file });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                {isEditing ? '✏️ Edit Destinasi Wisata' : '➕ Tambah Destinasi Baru'}
            </h3>
          
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Nama Wisata */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Wisata</label>
                    <input 
                        type="text" placeholder="Contoh: Pantai Widuri" required 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.nama_wisata} 
                        onChange={(e) => setFormData({...formData, nama_wisata: e.target.value})}
                    />
                </div>

                {/* 2. Kecamatan */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kecamatan</label>
                    <input 
                        type="text" placeholder="Contoh: Pemalang" required 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.kecamatan} 
                        onChange={(e) => setFormData({...formData, kecamatan: e.target.value})}
                    />
                </div>

                {/* 3. Kategori ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Wisata</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
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
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
                        <input 
                            type="number" step="any" placeholder="-6.8615" required 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.latitude} 
                            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
                        <input 
                            type="number" step="any" placeholder="109.3835" required 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.longitude} 
                            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        />
                    </div>
                </div>

                {/* ========================================== */}
                {/* FITUR BARU: INFO KUNJUNGAN & DESKRIPSI     */}
                {/* ========================================== */}
                
                {/* Harga Tiket */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Tiket (Rp)</label>
                    <input 
                        type="number" placeholder="Contoh: 15000 (Kosongkan jika gratis)" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.harga_tiket || ''} 
                        onChange={(e) => setFormData({...formData, harga_tiket: e.target.value})}
                    />
                </div>

                {/* Jam Operasional */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Jam Buka</label>
                        <input 
                            type="time" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.jam_buka || ''} 
                            onChange={(e) => setFormData({...formData, jam_buka: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Jam Tutup</label>
                        <input 
                            type="time" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.jam_tutup || ''} 
                            onChange={(e) => setFormData({...formData, jam_tutup: e.target.value})}
                        />
                    </div>
                </div>

                {/* Alamat Lengkap */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                    <textarea 
                        rows="2" placeholder="Contoh: Jl. Laksamana Yos Sudarso..." 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.alamat || ''} 
                        onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    />
                </div>

                {/* Deskripsi / Tentang Wisata */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi / Tentang Wisata</label>
                    <textarea 
                        rows="4" placeholder="Ceritakan keindahan dan keunikan wisata ini..." 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.deskripsi || ''} 
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    />
                </div>

                {/* ========================================== */}
                {/* UPLOAD FOTO                                */}
                {/* ========================================== */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">🖼️ Upload Foto Wisata</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Foto Utama {isEditing ? '(Opsional)' : '(Wajib)'}</label>
                            <input type="file" accept="image/*" required={!isEditing} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={(e) => handleFileChange(e, 'foto_utama')} />
                            {isEditing && typeof formData.foto_utama === 'string' && formData.foto_utama && (
                                <p className="text-[10px] text-green-600 mt-1 truncate">Tersimpan: {formData.foto_utama.split('/').pop()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Foto 2 (Opsional)</label>
                            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer" onChange={(e) => handleFileChange(e, 'foto_2')} />
                            {isEditing && typeof formData.foto_2 === 'string' && formData.foto_2 && (
                                <p className="text-[10px] text-green-600 mt-1 truncate">Tersimpan: {formData.foto_2.split('/').pop()}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Foto 3 (Opsional)</label>
                            <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer" onChange={(e) => handleFileChange(e, 'foto_3')} />
                            {isEditing && typeof formData.foto_3 === 'string' && formData.foto_3 && (
                                <p className="text-[10px] text-green-600 mt-1 truncate">Tersimpan: {formData.foto_3.split('/').pop()}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 mt-4">
                    <button type="submit" className={`w-full text-white py-3 rounded-lg font-bold shadow-md transition ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isEditing ? 'Simpan Perubahan Data' : 'Simpan Destinasi Baru'}
                    </button>
                    
                    {isEditing && (
                        <button type="button" onClick={() => {
                            setFormData({ 
                                nama_wisata: '', kecamatan: '', kategori_id: 2, 
                                latitude: '', longitude: '', alamat: '',
                                foto_utama: '', foto_2: '', foto_3: '',
                                deskripsi: '', harga_tiket: '', jam_buka: '', jam_tutup: ''
                            });
                            const fileInputs = document.querySelectorAll('input[type="file"]');
                            fileInputs.forEach(input => input.value = '');
                        }} className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg font-bold hover:bg-gray-600 transition">
                            Batal Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FormWisata;