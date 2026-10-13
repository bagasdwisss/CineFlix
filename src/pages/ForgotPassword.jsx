import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Film, ArrowLeft, CheckCircle2, Lock, KeyRound, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Request Reset
  const handleRequestReset = (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const users = JSON.parse(localStorage.getItem('cineflix_users') || '[]');
      const userExists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!userExists) {
        setErrorMsg('Email ini tidak terdaftar dalam akun CineFlix. Pastikan email sudah benar.');
        showToast('Email tidak terdaftar!', 'error');
        return;
      }

      // Generate simulated 6-digit OTP
      const sampleOtp = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(sampleOtp);
      setStep(2);
      showToast(`Kode OTP verifikasi: ${sampleOtp}`, 'info');
    } catch (err) {
      setErrorMsg('Terjadi kesalahan sistem. Silakan coba lagi.');
    }
  };

  // Step 2: Verify & Update Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim() !== generatedOtp.trim()) {
      setErrorMsg('Kode OTP verifikasi salah. Silakan periksa kembali kode OTP.');
      showToast('Kode OTP tidak valid!', 'error');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      resetPassword(email, newPassword);
      setStep(3);
      showToast('Kata sandi Anda berhasil diperbarui!', 'success');
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mereset kata sandi.');
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {step === 1 ? 'Lupa Kata Sandi?' : step === 2 ? 'Atur Ulang Sandi' : 'Sandi Diperbarui!'}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {step === 1 && 'Masukkan alamat email Anda untuk menerima kode verifikasi OTP'}
            {step === 2 && `Masukkan kode OTP dan buat kata sandi baru untuk ${email}`}
            {step === 3 && 'Akun Anda telah diamankan dengan kata sandi baru'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Alamat Email Terdaftar
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Kirim Kode Verifikasi OTP
            </button>
          </form>
        )}

        {/* STEP 2: Input OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* OTP helper banner */}
            <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
              <span>Kode OTP Anda: <strong className="font-mono text-amber-300 text-sm">{generatedOtp}</strong></span>
              <button
                type="button"
                onClick={() => setOtpCode(generatedOtp)}
                className="text-[11px] underline text-white font-bold hover:text-purple-300"
              >
                Isi Otomatis
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Kode Verifikasi OTP (6 Angka)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Contoh: 882910"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all mt-2"
            >
              Simpan Kata Sandi Baru
            </button>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-bold text-white text-lg">Kata Sandi Berhasil Diperbarui!</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Kata sandi baru Anda untuk akun <strong className="text-white">{email}</strong> telah disimpan dengan enkripsi aman. Silakan masuk untuk mulai memesan tiket.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-sm font-bold shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Masuk Sekarang
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
