/**
 * Mengirimkan format response sukses yang standar.
 */
const sendSuccess = (res, data, message = 'Success', count = null, statusCode = 200) => {
    const response = {
        success: true,
        message: message
    };
    
    if (count !== null) response.count = count;
    if (data !== undefined) response.data = data;
    
    return res.status(statusCode).json(response);
};

/**
 * Mengirimkan format response error yang standar.
 */
const sendError = (res, message = 'Server Error', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message: message
    };
    
    // Expose detail error hanya jika diperlukan (bisa dimatikan di production dengan config env)
    if (error && process.env.NODE_ENV !== 'production') {
        response.error = error.message || error;
    }
    
    return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
