/**
 * Helper to dynamically format image URLs.
 * If the database stores 'http://localhost:5000/uploads/file.png',
 * and the app runs on a cloud service, this function will replace the local host
 * with the active production URL dynamically.
 */

const formatImageUrl = (url, req) => {
    if (!url) return null;
    const currentHost = `${req.protocol}://${req.get('host')}`;
    
    if (typeof url === 'string') {
        // If the URL is absolute and refers to localhost:5000, replace with the current host
        if (url.includes('http://localhost:5000')) {
            return url.replace('http://localhost:5000', currentHost);
        }
        
        // If it's a relative filename (not a full URL and has an extension, e.g. "image.jpg")
        if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
            return `${currentHost}/uploads/${url}`;
        }
    }
    
    return url;
};

/**
 * Format all image fields on a single wisata item.
 */
const formatWisataImages = (wisata, req) => {
    if (!wisata) return wisata;
    
    if (wisata.foto_utama) wisata.foto_utama = formatImageUrl(wisata.foto_utama, req);
    if (wisata.foto_2) wisata.foto_2 = formatImageUrl(wisata.foto_2, req);
    if (wisata.foto_3) wisata.foto_3 = formatImageUrl(wisata.foto_3, req);
    if (wisata.foto_populer) wisata.foto_populer = formatImageUrl(wisata.foto_populer, req);
    
    // Format icons inside the nested fasilitas array if present
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

module.exports = {
    formatImageUrl,
    formatWisataImages
};
