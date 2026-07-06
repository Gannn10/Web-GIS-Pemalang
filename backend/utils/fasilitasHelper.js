/**
 * Fungsi Helper untuk Parsing Fasilitas IDs
 * Memastikan ID fasilitas dari request terurai dengan benar dan bebas dari duplikasi
 */
const parseFasilitasIds = (fasilitasList) => {
    let fasilitasIds = [];
    if (!fasilitasList) return fasilitasIds;

    try {
        if (typeof fasilitasList === 'string') {
            fasilitasIds = JSON.parse(fasilitasList);
        } else {
            fasilitasIds = fasilitasList;
        }
    } catch (e) {
        if (typeof fasilitasList === 'string' && fasilitasList.trim()) {
            fasilitasIds = fasilitasList.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        }
    }

    if (Array.isArray(fasilitasIds) && fasilitasIds.length > 0) {
        // Hapus duplikat dan pastikan semuanya adalah angka (integer)
        fasilitasIds = [...new Set(fasilitasIds)].map(id => parseInt(id)).filter(id => !isNaN(id));
    }

    return fasilitasIds;
};

module.exports = { parseFasilitasIds };
