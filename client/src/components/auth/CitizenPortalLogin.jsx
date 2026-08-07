import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ShieldCheck, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { loginUser } from '../../services/authService';

const CitizenPortalLogin = ({ onSuccess, onOpenForgotPassword }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setOtp('123456'); // Pre-fill sample OTP for smooth UX test
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobileNumber) {
      setErrorMsg('Mobile number is required');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Authenticate citizen role
      const result = await loginUser({
        email: `${mobileNumber}@citizen.cityswap.io`,
        password: 'password123',
        role: 'citizen',
      });
      setAuthSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result?.user || { email: mobileNumber, role: 'citizen' });
        }
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xl border border-slate-200/90 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-shadow duration-300">
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#16a34a]" />

      <div>
        {/* Logo Header */}
        <div className="text-center mb-2.5 sm:mb-3">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center p-1.5 shadow-xs">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-black text-[#16a34a] tracking-tight">EcoPulse Ai</span>
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wide">
            City Swap | <span className="text-[#16a34a]">जनसेवक</span>
          </div>
          <div className="text-[10px] font-bold text-[#16a34a] mt-0.5">
            🌱 एकत्र येऊ, स्वच्छ शहर घडवू. 🌱
          </div>
        </div>

        {/* Portal Title & Subtitle */}
        <div className="text-center mb-3">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#16a34a] tracking-tight">
            Citizen Portal
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
            Report waste, track status and earn rewards.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-emerald-100 mb-3.5 sm:mb-4 bg-gradient-to-b from-[#eaf7ee] to-emerald-50 flex items-center justify-center shadow-2xs p-2">
          <img
            src="/ChatGPT Image Aug 5, 2026, 01_06_09 PM.png"
            alt="Citizen Portal Illustration"
            className="w-full h-full object-contain object-center drop-shadow-xs"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          {errorMsg && (
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mobile Number Field */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Mobile Number
            </label>
            <div className="relative flex items-center border border-slate-300 rounded-xl bg-slate-50/80 focus-within:bg-white focus-within:border-[#16a34a] focus-within:ring-2 focus-within:ring-emerald-100 transition-all overflow-hidden">
              <div className="pl-3 pr-2 py-2 sm:py-2.5 flex items-center gap-1 border-r border-slate-200 text-slate-600 font-bold text-xs shrink-0">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full px-3 py-2 sm:py-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Enter OTP Field */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Enter OTP
            </label>
            <div className="relative flex items-center border border-slate-300 rounded-xl bg-slate-50/80 focus-within:bg-white focus-within:border-[#16a34a] focus-within:ring-2 focus-within:ring-emerald-100 transition-all overflow-hidden">
              <div className="pl-3 text-slate-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6 digit OTP"
                className="w-full pl-2.5 pr-20 py-2 sm:py-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="absolute right-2 px-2.5 py-1 text-xs font-extrabold text-[#16a34a] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                {otpSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>
          </div>

          {/* Checkbox & Resend OTP */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-[#16a34a] focus:ring-emerald-200 accent-[#16a34a] cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleSendOtp}
              className="font-bold text-[#16a34a] hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          </div>

          {/* Primary Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || authSuccess}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-80 min-h-[42px]"
          >
            {authSuccess ? (
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                Signed In!
              </span>
            ) : isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-2.5 sm:my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => handleSubmit({ preventDefault: () => {} })}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer min-h-[42px]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Need Help WhatsApp Assistant Card */}
        <div className="mt-3 sm:mt-3.5">
          <a
            href="https://wa.me/?text=Hi%20EcoPulse%20AI%20Assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#f0fdf4] border border-emerald-200/80 hover:bg-emerald-100/60 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#16a34a]">Need Help?</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600">Chat with WhatsApp AI Assistant</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#16a34a] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>
        </div>
      </div>

      {/* Decorative Bottom Wave Skyline */}
      <div className="mt-4 pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] text-emerald-800/70 font-bold">
        <span>🌱 Eco-Certified Login</span>
        <span>City Swap 2026</span>
      </div>
    </div>
  );
};

export default CitizenPortalLogin;
