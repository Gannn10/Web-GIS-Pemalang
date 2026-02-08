/**
 * =========================================
 * HELPER FUNCTIONS
 * =========================================
 */

// Format currency (Rupiah)
export const formatRupiah = (number) => {
    if (!number) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Format number with thousand separator
export const formatNumber = (number) => {
    if (!number) return '0';
    return new Intl.NumberFormat('id-ID').format(number);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get distance color based on range
export const getDistanceColor = (distance) => {
    if (distance < 10) return 'text-green-600';
    if (distance < 30) return 'text-yellow-600';
    return 'text-red-600';
};

// Get distance badge color
export const getDistanceBadgeColor = (distance) => {
    if (distance < 10) return 'bg-green-100 text-green-800';
    if (distance < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

// Validate coordinates
export const isValidCoordinate = (lat, lon) => {
    return (
        typeof lat === 'number' &&
        typeof lon === 'number' &&
        lat >= -90 && lat <= 90 &&
        lon >= -180 && lon <= 180
    );
};

// Calculate estimated time
export const calculateEstimatedTime = (distanceKm, speedKmh = 60) => {
    const hours = distanceKm / speedKmh;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) {
        return `${minutes} menit`;
    }
    
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} jam ${m} menit`;
};

// Get category icon
export const getCategoryIcon = (categoryName) => {
    const icons = {
        'Wisata Bahari': '🏖️',
        'Wisata Alam': '⛰️',
        'Wisata Buatan': '🎡',
        'Wisata Religi': '🕌',
    };
    return icons[categoryName] || '📍';
};

// Format date
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};