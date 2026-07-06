/**
 * Fungsi Pembantu: Konversi Derajat ke Radian (Untuk Algoritma Haversine)
 */
const toRad = (value) => {
    return (value * Math.PI) / 180;
};

/**
 * ============================================================================
 * LOGIKA MATEMATIKA ALGORITMA HAVERSINE MURNI
 * ============================================================================
 * PENJELASAN UNTUK SIDANG SKRIPSI:
 * Algoritma Haversine digunakan untuk menghitung jarak garis lurus (Great-Circle Distance)
 * antara dua titik di permukaan bumi yang melengkung/bulat, menggunakan garis lintang 
 * (latitude) dan garis bujur (longitude).
 */
const hitungJarakHaversine = (lat1, lon1, lat2, lon2) => {
    // 1. R = Konstanta Radius (Jari-jari) rata-rata Bumi dalam kilometer
    const R = 6371; 
    
    // 2. Menghitung selisih lintang (ΔLat) dan bujur (ΔLon) lalu dikonversi ke format Radian
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    // 3. Rumus "a" (Kuadrat setengah jarak tali busur / kuadrat jarak antar titik)
    //    Inti rumus Haversine: a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    // 4. Rumus "c" (Jarak sudut / angular distance dalam radian)
    //    Menggunakan fungsi arc-tangent (atan2) yang stabil untuk presisi jarak dekat maupun jauh
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // 5. Rumus Akhir: Mengalikan radius bumi (R) dengan jarak sudut (c)
    const jarak = R * c; // Output akhir berupa jarak garis lurus (geodesik) dalam satuan Kilometer
    
    return jarak;
};

module.exports = { toRad, hitungJarakHaversine };
