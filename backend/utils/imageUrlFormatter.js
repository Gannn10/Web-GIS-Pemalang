/**
 * ============================================================================
 * IMAGE URL FORMATTER (PEMBENTUK FORMAT URL GAMBAR)
 * ============================================================================
 * Fungsi bantuan (helper) ini berguna untuk memastikan URL gambar selalu benar, 
 * baik saat aplikasi dijalankan secara lokal (localhost) maupun saat sudah di-hosting (server asli).
 */

const formatImageUrl = (url, req) => {
    // Jika tidak ada URL gambar di database, kembalikan null (kosong)
    if (!url) return null;
    
    // Deteksi otomatis alamat server saat ini (contoh: "http://localhost:5000" atau "https://domain-anda.com")
    const currentHost = `${req.protocol}://${req.get('host')}`;
    
    if (typeof url === 'string') {
        // KASUS 1: Jika di database masih tersimpan URL "http://localhost:5000",
        // kita timpa / ganti dengan alamat server yang asli (currentHost)
        // Ini berguna agar gambar tidak error (pecah) saat aplikasi sudah di-hosting.
        if (url.includes('http://localhost:5000')) {
            return url.replace('http://localhost:5000', currentHost);
        }
        
        // KASUS 2: Jika di database hanya tersimpan nama filenya saja (contoh: "pantai.jpg")
        // Maka kita tambahkan alamat server dan folder uploads di depannya.
        if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
            return `${currentHost}/uploads/${url}`;
        }
    }
    
    // Jika sudah berupa URL lengkap dari sumber luar, kembalikan apa adanya
    return url;
};

/**
 * ============================================================================
 * FUNGSI: formatWisataImages
 * ============================================================================
 * Fungsi ini digunakan untuk mengecek dan memperbaiki SEMUA properti foto 
 * (foto utama, foto galeri, foto fasilitas) pada satu data wisata.
 */
const formatWisataImages = (wisata, req) => {
    // Jika data wisata kosong, tidak perlu diformat
    if (!wisata) return wisata;
    
    // Format link gambar untuk semua kolom foto utama dan foto galeri
    if (wisata.foto_utama) wisata.foto_utama = formatImageUrl(wisata.foto_utama, req);
    if (wisata.foto_2) wisata.foto_2 = formatImageUrl(wisata.foto_2, req);
    if (wisata.foto_3) wisata.foto_3 = formatImageUrl(wisata.foto_3, req);
    if (wisata.foto_populer) wisata.foto_populer = formatImageUrl(wisata.foto_populer, req);
    
    // Format link icon untuk daftar fasilitas (jika ada)
    // Karena fasilitas berbentuk Array (daftar), kita harus melakukan perulangan (map)
    if (Array.isArray(wisata.fasilitas)) {
        wisata.fasilitas = wisata.fasilitas.map(f => {
            if (f.icon) {
                f.icon = formatImageUrl(f.icon, req);
            }
            return f;
        });
    }
    
    return wisata;
};

// Ekspor fungsi agar bisa dipakai di controller (seperti wisataController.js)
module.exports = {
    formatImageUrl,
    formatWisataImages
};
