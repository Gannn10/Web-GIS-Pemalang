import React from 'react';
import { useMap } from 'react-leaflet';
import { LocateIcon } from '../icons/CustomIcons';
import { Navigation } from 'lucide-react';

export const ZoomLocateControls = ({ onLocate, onSelectManual, isSelectingLoc, userLoc }) => {
    const map = useMap();

    const handleFlyToUser = () => {
        if (userLoc) {
            map.flyTo([userLoc[0] - 0.010, userLoc[1]], 12, {
                animate: true,
                duration: 2.0
            });
        } else {
            onLocate();
        }
    };

    return (
        <div className="absolute top-auto bottom-[260px] right-2 md:bottom-6 md:right-[196px] z-[1000] flex flex-col bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white overflow-hidden w-9 md:w-12 transition-all duration-300">
            {/* Manual Pin Select Button */}
            <button
                onClick={onSelectManual}
                className={`w-full h-9 md:h-12 flex items-center justify-center transition-all border-b border-gray-100/50 hover:bg-gray-50 active:bg-gray-100
                    ${isSelectingLoc ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                title="Pilih Titik Manual"
            >
                <LocateIcon size={16} className="md:w-5 md:h-5" />
            </button>

            {/* GPS Locate Button */}
            <button
                onClick={handleFlyToUser}
                className={`w-full h-9 md:h-12 flex items-center justify-center transition-all border-b border-gray-100/50 hover:bg-gray-50 active:bg-gray-100
                    ${userLoc ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                title="Lokasi Saya"
            >
                <Navigation size={18} className={`md:w-5 md:h-5 ${userLoc ? "fill-blue-500" : ""}`} strokeWidth={2.5} />
            </button>
            
            {/* Zoom Out */}
            <button
                onClick={() => map.zoomOut()}
                className="w-full h-9 md:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-all border-b border-gray-100/50 text-lg md:text-xl font-medium"
            >
                −
            </button>

            {/* Zoom In */}
            <button
                onClick={() => map.zoomIn()}
                className="w-full h-9 md:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-all text-lg md:text-xl font-medium"
            >
                +
            </button>
        </div>
    );
};
