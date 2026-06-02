import axios from 'axios';

// Waktu kedaluwarsa cache (misal: 10 menit dalam milidetik)
const CACHE_DURATION = 10 * 60 * 1000; 

export const fetchWithCache = async (url) => {
    // Cek apakah data sudah ada di sessionStorage
    const cachedItem = sessionStorage.getItem(url);
    
    if (cachedItem) {
        try {
            const { data, timestamp } = JSON.parse(cachedItem);
            
            // Cek apakah cache masih valid (belum expired)
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log(`[Cache Hit] Memuat dari cache: ${url}`);
                return { data, fromCache: true };
            } else {
                // Hapus cache yang kadaluwarsa
                sessionStorage.removeItem(url);
            }
        } catch (error) {
            console.error("Gagal mem-parsing cache:", error);
            sessionStorage.removeItem(url);
        }
    }

    // Jika tidak ada cache atau expired, lakukan request baru
    try {
        console.log(`[Cache Miss] Mengambil dari server: ${url}`);
        const response = await axios.get(url);
        
        // Simpan hasil ke cache
        sessionStorage.setItem(url, JSON.stringify({
            data: response.data,
            timestamp: Date.now()
        }));
        
        return { data: response.data, fromCache: false };
    } catch (error) {
        console.error("Fetch with cache error:", error);
        throw error;
    }
};
