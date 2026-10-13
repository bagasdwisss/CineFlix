import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Film, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Lupa Kata Sandi?</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Masukkan alamat email Anda untuk menerima instruksi reset password
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Tautan Reset Terkirim!</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Kami telah mengirimkan instruksi pemulihan kata sandi ke <strong className="text-white">{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white text-xs font-bold"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="nama@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2575fc]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Kirim Tautan Reset
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
