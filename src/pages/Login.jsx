import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Film, LogIn, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, login, quickDemoLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to profile
    if (user) {
      navigate('/profile');
    }

    // Check remembered email
    const remembered = localStorage.getItem('cineflix_remembered_email');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      showToast('Login berhasil! Selamat datang di CineFlix.', 'success');
      navigate('/profile');
    } catch (err) {
      const errMsg = err.message || 'Email atau kata sandi tidak valid.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setLoading(true);
    try {
      quickDemoLogin();
      showToast('Berhasil masuk sebagai John Doe (Akun Demo VIP)!', 'success');
      navigate('/profile');
    } catch (err) {
      showToast('Gagal memuat akun demo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/30 ring-4 ring-white/10">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Selamat Datang</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
            Masuk ke akun CineFlix untuk kemudahan pesan tiket & riwayat nonton
          </p>
        </div>

        {/* Quick Demo Login Pill Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 group transition-all hover:scale-[1.01] active:scale-98 shadow-lg shadow-amber-500/10"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>⚡ Masuk 1-Klik Akun Demo (VIP John Doe)</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">Atau login manual</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc] focus:ring-1 focus:ring-[#2575fc] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Kata Sandi
              </label>
              <Link to="/forgot-password" className="text-xs text-[#2575fc] hover:text-blue-400 hover:underline">
                Lupa sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc] focus:ring-1 focus:ring-[#2575fc] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#2575fc] bg-white/5 border-white/20 focus:ring-0 mr-2"
              />
              Ingat saya di perangkat ini
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
          </button>
        </form>

        {/* Demo credentials hint box */}
        <div className="mt-6 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-gray-400 text-center">
          Kredensial Demo: <strong className="text-white">john.doe@example.com</strong> | Sandi: <strong className="text-white">password123</strong>
        </div>

        {/* Footer link */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
          Belum punya akun CineFlix?{' '}
          <Link to="/register" className="font-bold text-[#2575fc] hover:text-blue-400 hover:underline">
            Daftar gratis disini
          </Link>
        </div>

      </div>
    </div>
  );
}
