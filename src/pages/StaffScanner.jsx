import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Video, 
  VideoOff, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Clock, 
  ArrowLeft, 
  Film, 
  QrCode, 
  Search, 
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { getAllTickets, getTicketByBookingId, extractBookingId, decodeTicketPayload, saveTicket } from '../utils/ticketRegistry';
import { playScanValid, playScanInvalid, isSoundEnabled, toggleSound } from '../utils/soundEffects';
import { useToast } from '../context/ToastContext';

export default function StaffScanner() {
  const { showToast } = useToast();

  const [selectedStudio, setSelectedStudio] = useState('Studio 1 (Dolby Atmos)');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const [lastScanResult, setLastScanResult] = useState(null); // { status: 'success' | 'error', ticket: {...}, message: '' }
  const [scanHistory, setScanHistory] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Available Studios for cinema staff
  const studiosList = [
    { id: 'Studio 1 (Dolby Atmos)', name: 'Studio 1 (Dolby Atmos)', capacity: 120 },
    { id: 'Studio IMAX 3D', name: 'Studio IMAX 3D', capacity: 150 },
    { id: 'Studio 2 Reguler', name: 'Studio 2 Reguler', capacity: 100 },
    { id: 'Festival Event Gate', name: 'Gate Event / Festival', capacity: 300 },
    { id: 'Counter FnB Pick-up', name: 'Counter FnB Pick-up', capacity: 200 }
  ];

  // Calculate checked-in count for current studio
  const allTickets = getAllTickets();
  const checkedInForStudio = allTickets.filter(t => t.checkedIn).length;
  const currentStudioCapacity = studiosList.find(s => s.id === selectedStudio)?.capacity || 120;
  const occupancyPercent = Math.min(100, Math.round((checkedInForStudio / currentStudioCapacity) * 100));

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

  // Start live camera
  const startCamera = async () => {
    setCameraError('');
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

      // Start BarcodeDetector loop if supported
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
                  handleVerify(detectedVal);
                }
              }
            } catch (err) {
              // frame error ignore
            }
          }
        }, 500);
      }
    } catch (err) {
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Silakan gunakan input scanner laser / manual di bawah.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  // Process ticket scan / verification
  const handleVerify = (codeOrUrl) => {
    if (!codeOrUrl) return;
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);

      // 1. Check for encoded ticket payload
      let ticket = decodeTicketPayload(codeOrUrl);

      // 2. If not from payload, look up by ID
      if (!ticket) {
        const cleanId = extractBookingId(codeOrUrl);
        ticket = getTicketByBookingId(cleanId);
      }

      const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

      if (!ticket) {
        // INVALID TICKET
        playScanInvalid();
        const errResult = {
          status: 'error',
          code: codeOrUrl,
          message: 'TIKET TIDAK DITEMUKAN DALAM DATABASE BIOSKOP',
          timestamp
        };
        setLastScanResult(errResult);
        setScanHistory(prev => [errResult, ...prev]);
        showToast('Akses ditolak: Tiket tidak terdaftar!', 'error');
        return;
      }

      // Check if ALREADY CHECKED IN
      if (ticket.checkedIn) {
        playScanInvalid();
        const errResult = {
          status: 'warning',
          ticket,
          message: `TIKET SUDAH PERNAH DIGUNAKAN PADA: ${ticket.checkedInAt || 'Sebelumnya'}`,
          timestamp
        };
        setLastScanResult(errResult);
        setScanHistory(prev => [errResult, ...prev]);
        showToast('Peringatan: Tiket sudah pernah di-check in!', 'error');
        return;
      }

      // VALID & FIRST TIME ENTRY!
      playScanValid();
      const updatedTicket = {
        ...ticket,
        checkedIn: true,
        checkedInAt: timestamp,
        status: ticket.orderType === 'food' ? 'PESANAN TELAH DIAMBIL' : 'SUDAH DIGUNAKAN (CHECKED IN)'
      };

      saveTicket(updatedTicket);

      const successResult = {
        status: 'success',
        ticket: updatedTicket,
        message: 'AKSES DIIZINKAN • GATE CHECK-IN BERHASIL',
        timestamp
      };

      setLastScanResult(successResult);
      setScanHistory(prev => [successResult, ...prev]);
      showToast(`Akses diizinkan untuk ${ticket.buyerName || 'Penonton'}!`, 'success');

      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleVerify(inputCode.trim());
    setInputCode('');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Beranda
            </Link>
            <span className="text-gray-500">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30">
              PORTAL PETUGAS GERBANG BIOSKOP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <span>Gate Scanner & Verification Terminal</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Sistem pemindai resmi tiket penonton studio & verifikasi konter CineFlix
          </p>
        </div>

        {/* Audio Toggle & Quick Status */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              soundOn 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}
            title="Toggle Buzzer Suara Scanner"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Buzzer: {soundOn ? 'Aktif' : 'Mute'}</span>
          </button>
        </div>
      </div>

      {/* Studio Selector & Occupancy Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Studio Selector Card */}
        <div className="bg-[#141424] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            PILIH STUDIO / GERBANG TUGAS:
          </span>
          <select
            value={selectedStudio}
            onChange={(e) => setSelectedStudio(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {studiosList.map(s => (
              <option key={s.id} value={s.id} className="bg-[#141424] text-white">
                {s.name} (Kapasitas: {s.capacity})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-400">
            Penonton dengan tiket pada studio ini akan otomatis diverifikasi aksesnya.
          </p>
        </div>

        {/* Live Studio Occupancy Meter */}
        <div className="bg-[#141424] border border-white/15 rounded-3xl p-6 shadow-xl md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              OKUPANSI STUDIO REAL-TIME
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {checkedInForStudio} / {currentStudioCapacity} Kursi Masuk ({occupancyPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
            <span>Sisa Kursi Kosong: {Math.max(0, currentStudioCapacity - checkedInForStudio)}</span>
            <span className="text-purple-300 font-semibold">Status Gerbang: AKTIF MENERIMA PENONTON</span>
          </div>
        </div>

      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Scanner & Gun Input (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-[#141424] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-400" />
                <span>Pemindai Optik Gerbang</span>
              </h3>
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  cameraActive 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600/50'
                }`}
              >
                {cameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                <span>{cameraActive ? 'Matikan Kamera' : 'Buka Kamera Petugas'}</span>
              </button>
            </div>

            {/* Camera Viewfinder */}
            <div className="relative w-full h-64 bg-black/80 rounded-2xl border-2 border-purple-500/40 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <QrCode className="w-16 h-16 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-400 font-mono">
                    Kamera belum aktif. Klik "Buka Kamera Petugas" di atas atau scan menggunakan barcode gun di bawah.
                  </p>
                </div>
              )}

              {/* Viewfinder Corners */}
              <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-purple-400 pointer-events-none" />

              {/* Laser Animation */}
              {isScanning ? (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ef4444] animate-bounce pointer-events-none" />
              ) : cameraActive ? (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 pointer-events-none" />
              ) : null}

              <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-cyan-300 bg-black/70 px-3 py-1 rounded-full">
                  {isScanning ? 'MEMVERIFIKASI KEASLIAN TIKET...' : 'ARAHKAN BARCODE / QR PENONTON KE AREA INI'}
                </span>
              </div>
            </div>

            {cameraError && (
              <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                {cameraError}
              </p>
            )}

            {/* Barcode Gun / Manual Input */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">
                Input Barcode Scanner Gun / Kode Tiket Penonton:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Scan dengan barcode gun atau ketik kode booking (misal FLIX-98214532)..."
                  className="w-full pl-4 pr-24 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-400 uppercase"
                />
                <button
                  type="submit"
                  disabled={!inputCode.trim() || isScanning}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs disabled:opacity-40 transition-all cursor-pointer"
                >
                  Verifikasi
                </button>
              </div>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                Uji Coba Cepat Tiket Penonton (1-Klik):
              </span>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {allTickets.slice(0, 5).map(t => (
                  <button
                    key={t.bookingId}
                    type="button"
                    onClick={() => handleVerify(t.bookingId)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-[11px] font-mono text-purple-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.bookingId}</span>
                    <span className="text-[9px] text-gray-400">({t.buyerName ? t.buyerName.split(' ')[0] : 'User'})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Instant Scan Result & Live Audit Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real-Time Scan Result Terminal Card */}
          <div className="bg-[#141424] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              STATUS HASIL PEMINDAIAN TERAKHIR:
            </span>

            {lastScanResult ? (
              <div className={`p-5 rounded-2xl border text-center space-y-3 transition-all animate-fadeIn ${
                lastScanResult.status === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : lastScanResult.status === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}>
                <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
                  lastScanResult.status === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : lastScanResult.status === 'warning'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {lastScanResult.status === 'success' ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : lastScanResult.status === 'warning' ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-black text-white">
                    {lastScanResult.status === 'success'
                      ? 'GATE ENTRY APPROVED'
                      : lastScanResult.status === 'warning'
                      ? 'TIKET SUDAH DI-CHECK IN'
                      : 'AKSES DITOLAK'}
                  </h4>
                  <p className="text-xs mt-1 font-semibold">
                    {lastScanResult.message}
                  </p>
                </div>

                {lastScanResult.ticket && (
                  <div className="p-3 bg-black/40 rounded-xl text-xs space-y-1 text-left border border-white/10 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Film:</span>
                      <span className="text-white font-bold">{lastScanResult.ticket.movie}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kursi:</span>
                      <span className="text-purple-300 font-bold">
                        {Array.isArray(lastScanResult.ticket.seats) ? lastScanResult.ticket.seats.join(', ') : lastScanResult.ticket.seats}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Penonton:</span>
                      <span className="text-white font-bold">{lastScanResult.ticket.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Waktu Scan:</span>
                      <span className="text-emerald-400">{lastScanResult.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 border border-white/5 rounded-2xl bg-white/[0.02]">
                <QrCode className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Menunggu pemindaian barcode penonton...</p>
              </div>
            )}
          </div>

          {/* Real-Time Scan History Log */}
          <div className="bg-[#141424] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                LOG AKTIVITAS GERBANG SHIFT INI
              </span>
              <span className="text-[11px] text-purple-400 font-mono">
                {scanHistory.length} Log
              </span>
            </div>

            {scanHistory.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                Belum ada riwayat pemindaian shift ini.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {scanHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        item.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                      }`} />
                      <span className="text-white font-bold">
                        {item.ticket ? item.ticket.bookingId : item.code}
                      </span>
                    </div>
                    <span className="text-gray-400 text-[11px]">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
