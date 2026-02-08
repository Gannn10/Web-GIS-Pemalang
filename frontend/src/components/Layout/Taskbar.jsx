/**
 * =========================================
 * TASKBAR COMPONENT
 * =========================================
 * 3 Menu utama: Search, Lokasi Saya, Kategori/Filter
 */

import React from 'react';

const Taskbar = ({ activeMenu, onMenuChange }) => {
    const menus = [
        {
            id: 'search',
            icon: '🔍',
            label: 'SEARCH',
            subtitle: 'Cari berdasarkan nama',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'location',
            icon: '📍',
            label: 'LOKASI SAYA',
            subtitle: 'Rekomendasi terdekat (GPS)',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'filter',
            icon: '🏷️',
            label: 'KATEGORI/FILTER',
            subtitle: 'Filter jenis wisata',
            color: 'from-green-500 to-teal-500'
        }
    ];

    return (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-6 shadow-xl">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => onMenuChange(menu.id)}
                            className={`
                                group relative overflow-hidden rounded-2xl p-6 
                                transition-all duration-300 transform hover:scale-105
                                ${activeMenu === menu.id 
                                    ? 'bg-white shadow-2xl ring-4 ring-yellow-400' 
                                    : 'bg-white/90 hover:bg-white shadow-lg'
                                }
                            `}
                        >
                            {/* Active Indicator */}
                            {activeMenu === menu.id && (
                                <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    AKTIF
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`
                                text-5xl mb-3 transition-transform duration-300
                                ${activeMenu === menu.id ? 'scale-110' : 'group-hover:scale-110'}
                            `}>
                                {menu.icon}
                            </div>

                            {/* Label */}
                            <h3 className={`
                                text-xl font-bold mb-1 transition-colors
                                ${activeMenu === menu.id 
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r ' + menu.color
                                    : 'text-gray-800'
                                }
                            `}>
                                {menu.label}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-sm text-gray-600">
                                {menu.subtitle}
                            </p>

                            {/* Hover Effect */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-r ${menu.color} opacity-0 
                                group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
                            `} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Taskbar;