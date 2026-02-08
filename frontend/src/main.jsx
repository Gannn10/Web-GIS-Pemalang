import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { WisataProvider } from './context/WisataContext'; // Import ini

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Bungkus App di sini */}
        <WisataProvider>
            <App />
        </WisataProvider>
    </React.StrictMode>
);