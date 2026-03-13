import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 1. Ubah email menjadi username
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 2. Kirim username dan password ke backend
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Login Gagal. Cek username dan password Anda.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Admin WebGIS</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        {/* 3. Label dan Input diubah jadi Username */}
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Masukkan username"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="Masukkan password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                        Masuk Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;