import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormWisata from '../../components/Admin/FormWisata';
import TableWisata from '../../components/Admin/TableWisata';

const Dashboard = () => {
    const [wisataList, setWisataList] = useState([]);
    
    // TAMBAHAN: Masukkan deskripsi, harga_tiket, jam_buka, jam_tutup ke State
    const [formData, setFormData] = useState({ 
        nama_wisata: '', kecamatan: '', kategori_id: 2, 
        latitude: '', longitude: '', alamat: '',
        foto_utama: '', foto_2: '', foto_3: '',
        deskripsi: '', harga_tiket: '', jam_buka: '', jam_tutup: ''
    });
    
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');

    const fetchWisata = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/wisata');
            setWisataList(res.data.data); 
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        }
    };

    useEffect(() => { fetchWisata(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = new FormData();
        dataToSend.append('nama_wisata', formData.nama_wisata);
        dataToSend.append('kecamatan', formData.kecamatan);
        dataToSend.append('kategori_id', formData.kategori_id);
        dataToSend.append('latitude', formData.latitude);
        dataToSend.append('longitude', formData.longitude);
        dataToSend.append('alamat', formData.alamat);
        
        // TAMBAHAN: Kirim data baru ke backend
        dataToSend.append('deskripsi', formData.deskripsi);
        dataToSend.append('harga_tiket', formData.harga_tiket);
        dataToSend.append('jam_buka', formData.jam_buka);
        dataToSend.append('jam_tutup', formData.jam_tutup);

        if (formData.foto_utama) dataToSend.append('foto_utama', formData.foto_utama);
        if (formData.foto_2) dataToSend.append('foto_2', formData.foto_2);
        if (formData.foto_3) dataToSend.append('foto_3', formData.foto_3);

        const config = { headers: { Authorization: `Bearer ${token}` } };
        Swal.fire({ title: 'Menyimpan Data...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/wisata/${editingId}`, dataToSend, config);
                Swal.fire('Berhasil!', 'Data wisata berhasil diperbarui.', 'success');
            } else {
                await axios.post('http://localhost:5000/api/wisata', dataToSend, config);
                Swal.fire('Berhasil!', 'Data wisata baru berhasil ditambahkan.', 'success');
            }

            // RESET FORM
            setFormData({ 
                nama_wisata: '', kecamatan: '', kategori_id: 2, 
                latitude: '', longitude: '', alamat: '',
                foto_utama: '', foto_2: '', foto_3: '',
                deskripsi: '', harga_tiket: '', jam_buka: '', jam_tutup: ''
            });
            
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => input.value = '');

            setEditingId(null);
            fetchWisata();
        } catch (err) { 
            Swal.fire('Oops...', 'Gagal menyimpan data wisata.', 'error');
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Hapus Data?', text: "Data yang dihapus tidak bisa dikembalikan!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/wisata/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
                    fetchWisata();
                } catch (err) { Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'); }
            }
        });
    };

    const handleEdit = (item) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // TAMBAHAN: Isi form dengan data yang mau diedit
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
            jam_tutup: item.jam_tutup || ''
        });
        setEditingId(item.wisata_id);
    };

    return (
        <div className="h-screen overflow-y-auto overflow-x-hidden bg-gray-100 p-4 md:p-8 pb-20 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center">Admin Dashboard WebGIS</h1>
                <button 
                    onClick={() => { localStorage.removeItem('token'); window.location.href='/admin/login'; }} 
                    className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600 transition w-full md:w-auto font-semibold"
                > Logout </button>
            </div>
            <FormWisata formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={!!editingId} />
            <div className="max-w-full w-full">
                <TableWisata data={wisataList} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default Dashboard;