import React from 'react';
import { ChevronRight } from 'lucide-react';

export const getBadgeStyle = (kategori) => {
    const styles = {
        'Wisata Bahari': {
            bg: 'bg-blue-100 text-blue-700',
            dot: 'bg-blue-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/><path d="M2 12c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/><path d="M2 18c.6.5 1.2 1 2.5 1s2.5-.5 3-.5 1.2.5 2.5.5 2.5-.5 3-.5 1.2.5 2.5.5 1.9-.5 2.5-.5"/></svg>',
            color: '#3b82f6'
        },
        'Wisata Alam': {
            bg: 'bg-emerald-100 text-emerald-700',
            dot: 'bg-emerald-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.5M14 22v-4M4.5 10a2.5 2.5 0 0 1 0-5 3 3 0 0 1 5.9-1A3 3 0 0 1 15 6a3 3 0 0 1 5.25 2.5A2.5 2.5 0 0 1 19.5 13h-15Z"/></svg>',
            color: '#10b981'
        },
        'Wisata Religi': {
            bg: 'bg-orange-100 text-orange-700',
            dot: 'bg-orange-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 22H2M12 22V13M12 9a4 4 0 0 1 4 4v9H8v-9a4 4 0 0 1 4-4Z"/><path d="M12 2v4M10 4h4"/></svg>',
            color: '#f97316'
        },
        'Wisata Buatan': {
            bg: 'bg-purple-100 text-purple-700',
            dot: 'bg-purple-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 3 5v11H9V7z"/><path d="M5 22h14"/><path d="M9 18h6"/></svg>',
            color: '#a855f7'
        },
        'Wisata Kuliner': {
            bg: 'bg-pink-100 text-pink-700',
            dot: 'bg-pink-500',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v4"/><path d="M12 2v20"/><path d="M17 22H7"/><path d="M12 18H7"/><path d="M21 2v9a2 2 0 0 1-2 2h-5"/><path d="M19 2v4"/></svg>',
            color: '#ec4899'
        },
    };
    return styles[kategori] || {
        bg: 'bg-gray-100 text-gray-600',
        dot: 'bg-gray-400',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
        color: '#6b7280'
    };
};

export const WisataCard = ({ item, index, userLoc, activeRouteName, routeInfo, onCekJalur, formatDuration, onSelect }) => {
    const isActive = activeRouteName === item.nama_wisata;
    const badge = getBadgeStyle(item.nama_kategori);

    return (
        <div
            onClick={() => onSelect(item)}
            className={`group rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer
            ${isActive
                    ? 'border-blue-500 bg-blue-50/40 shadow-[0_8px_25px_rgba(59,130,246,0.08)]'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)]'}`}
        >
            <div className="flex items-center gap-3 px-3 py-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100/50 relative shadow-inner">
                    {item.foto_utama ? (
                        <img src={item.foto_utama} alt={item.nama_wisata} loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50" dangerouslySetInnerHTML={{ __html: badge.icon }} />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black truncate leading-tight mb-1.5 ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>
                        {item.nama_wisata}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${badge.bg}`}>
                            {item.nama_kategori?.replace('Wisata ', '')}
                        </span>
                        {item.distance !== undefined && (
                            <span className="text-[9px] font-bold text-gray-400">
                                • {item.distance.toFixed(1)} km
                            </span>
                        )}
                    </div>
                </div>

                {/* Arrow */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${isActive ? 'bg-blue-500 text-white shadow-blue-200 shadow-md' : 'bg-gray-50 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-400'}`}>
                    <ChevronRight size={14} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};
