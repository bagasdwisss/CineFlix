import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, Search, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Camera, Video, VideoOff, RefreshCw, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, getTicketByBookingId, extractBookingId, decodeTicketPayload, saveTicket } from '../../utils/ticketRegistry';

export default function TicketScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  if (!isOpen) return null;

  const tickets = getAllTickets();

  // Stop camera stream safely
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start live device camera (webcam or mobile camera)
  const startCamera = async () => {
    setCameraError('');
    setError('');
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Start BarcodeDetector loop if supported by browser (Chrome/Edge/Opera/Android)
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['qr_code', 'code_128', 'code_39', 'ean_13']
        });

        scanIntervalRef.current = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detectedVal = barcodes[0].rawValue;
                if (detectedVal) {
                  stopCamera();
                  handleScanCode(detectedVal);
                }
              }
            } catch (err) {
              // ignore frame errors
            }
          }
        }, 400);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Tidak dapat mengakses kamera perangkat. Anda dapat memasukkan kode atau menempel URL tiket di bawah.');
      setCameraActive(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleScanCode = (code) => {
    setError('');
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);

      // 1. Check for encoded ticket payload (?d=...)
      const fromPayload = decodeTicketPayload(code);
      if (fromPayload) {
        saveTicket(fromPayload);
        handleClose();
        navigate(`/verify/${encodeURIComponent(fromPayload.bookingId)}`);
        return;
      }

      // 2. Extract clean booking ID from code or URL
      const cleanId = extractBookingId(code);
      if (!cleanId) {
        setError('Format kode tidak dikenali. Pastikan memasukkan kode seperti FLIX-98214532.');
        return;
      }

      const found = getTicketByBookingId(cleanId);
      if (found) {
        saveTicket(found);
        handleClose();
        navigate(`/verify/${encodeURIComponent(found.bookingId || cleanId)}`);
      } else {
        setError(`Kode booking "${cleanId}" tidak ditemukan dalam database. Coba salah satu tiket yang tersedia di bawah.`);
      }
    }, 700);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleScanCode(inputCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-[#16213e] border border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white my-6">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scanner Terminal Header */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-600 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-black">Scanner Tiket Bioskop</h3>
          <p className="text-xs text-purple-200 mt-1">
            Pemindai Barcode & QR Code Resmi Gerbang Masuk CineFlix
          </p>
        </div>

        {/* Viewfinder Camera Graphic */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Viewfinder Box */}
          <div className="relative w-full h-48 bg-black/70 rounded-2xl border-2 border-purple-500/40 overflow-hidden flex flex-col items-center justify-center shadow-inner">

            {/* Live Video Preview if active */}
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <QrCode className={`w-14 h-14 ${isScanning ? 'text-red-400 animate-pulse' : 'text-gray-500'}`} />
            )}

            {/* Viewfinder Corners */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-purple-400 z-10 pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-400 z-10 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-400 z-10 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-400 z-10 pointer-events-none" />

            {/* Laser Scanning Line Animation */}
            {isScanning ? (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-bounce z-10" />
            ) : cameraActive ? (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] animate-pulse z-10" />
            ) : null}

            <div className="absolute bottom-2 inset-x-0 text-center z-10 pointer-events-none">
              <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-3 py-1 rounded-full">
                {isScanning
                  ? 'MEMINDAI DATA TIKET...'
                  : cameraActive
                  ? 'KAMERA AKTIF: ARAHKAN QR CODE KE LAYAR'
                  : 'ARAHKAN BARCODE ATAU PASTE KODE'}
              </span>
            </div>
          </div>

          {/* Camera Toggle Button */}
          <div className="flex gap-2">
            {!cameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-purple-300" />
                <span>Gunakan Kamera Perangkat</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <VideoOff className="w-4 h-4 text-red-300" />
                <span>Matikan Kamera</span>
              </button>
            )}
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              {cameraError}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Input for Manual, Barcode Gun, or Scanned URL */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 block">
              Tempel URL atau Masukkan Kode Booking:
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Contoh: FLIX-98214532 atau tempel link..."
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={isScanning || !inputCode.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
                title="Pindai Kode"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Click Demo Tickets */}
          {tickets.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Uji Coba Cepat Tiket Tersedia:
              </span>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {tickets.slice(0, 5).map((t) => (
                  <button
                    key={t.bookingId}
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleScanCode(t.bookingId)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-[11px] font-mono text-purple-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{t.bookingId}</span>
                    <span className="text-[9px] text-gray-400">({t.movie ? t.movie.split(':')[0] : 'Tiket'})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
