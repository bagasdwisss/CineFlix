import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <BookingProvider>
                <App />
              </BookingProvider>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);

// Register PWA Service Worker for offline boarding pass access
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('ServiceWorker note:', err);
    });
  });
}
