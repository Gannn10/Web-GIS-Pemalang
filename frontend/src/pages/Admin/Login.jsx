import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            // Beri sedikit delay untuk transisi animasi loading yang memuaskan
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 600);
        } catch (err) {
            setError(err.response?.data?.message || 'Login Gagal. Cek username dan password Anda.');
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark & Blur Overlay */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[6px] z-0"></div>

            {/* Glowing Decorative Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Login Card Container */}
            <div className="relative z-10 w-full max-w-md mx-6">
                <div className="backdrop-blur-xl bg-white/75 border border-white/30 rounded-[32px] p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.25)] transition-all duration-300">
                    
                    {/* Brand Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transition-transform hover:rotate-6">
                            <MapPin className="text-white" size={28} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            Admin <span className="text-blue-600">WebGIS</span>
                        </h2>
                        <p className="text-[10px] text-blue-600/80 font-black uppercase tracking-widest mt-1">Kabupaten Pemalang</p>
                    </div>

                    {/* Alert Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 border border-rose-100 p-3.5 rounded-2xl mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <ShieldCheck size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username Input */}
                        <div className="space-y-1.5">
                            <label className="block text-slate-600 text-[10px] font-black uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <User size={16} />
                                </span>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Masukkan username"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="block text-slate-600 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={16} />
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    placeholder="Masukkan password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Masuk Dashboard
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;