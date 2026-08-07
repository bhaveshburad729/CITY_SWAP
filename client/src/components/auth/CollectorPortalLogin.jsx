import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ChevronRight, Headphones, CheckCircle2, ShieldAlert } from 'lucide-react';
import { loginUser } from '../../services/authService';

const CollectorPortalLogin = ({ onSuccess, onOpenForgotPassword }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      setErrorMsg('Employee ID is required');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await loginUser({
        email: `${employeeId}@collector.cityswap.io`,
        password: password,
        role: 'collector',
      });
      setAuthSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result?.user || { email: employeeId, role: 'collector' });
        }
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid Employee ID or Password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xl border border-slate-200/90 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-shadow duration-300">
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#ea580c]" />

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
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#ea580c] tracking-tight">
            Collector Portal
          </h3>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
            Manage collections, submit reports and photos.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-orange-100 mb-3.5 sm:mb-4 bg-gradient-to-b from-[#fff7ed] to-orange-50 flex items-center justify-center shadow-2xs p-2">
          <img
            src="/ChatGPT Image Aug 5, 2026, 01_05_55 PM.png"
            alt="Collector Portal Illustration"
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

          {/* Employee ID Field */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Employee ID
            </label>
            <div className="relative flex items-center border border-slate-300 rounded-xl bg-slate-50/80 focus-within:bg-white focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <div className="pl-3.5 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                className="w-full pl-2.5 pr-4 py-2 sm:py-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative flex items-center border border-slate-300 rounded-xl bg-slate-50/80 focus-within:bg-white focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <div className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-2.5 pr-10 py-2 sm:py-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkbox & Forgot Password */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-[#ea580c] focus:ring-orange-200 accent-[#ea580c] cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={onOpenForgotPassword}
              className="font-bold text-[#ea580c] hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || authSuccess}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-80 min-h-[42px]"
          >
            {authSuccess ? (
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-orange-200" />
                Signed In!
              </span>
            ) : isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Need Help Support Card */}
        <div className="mt-3 sm:mt-3.5">
          <button
            type="button"
            onClick={() => alert('Collector Helpline: 1800-CITY-SWAP-COLLECTOR')}
            className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#fff7ed] border border-orange-200/80 hover:bg-orange-100/60 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Headphones className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#ea580c]">Need Help?</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600">Contact Support</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ea580c] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="mt-4 pt-2 border-t border-orange-100 flex items-center justify-between text-[10px] text-orange-800/70 font-bold">
        <span>♻️ Field Operations</span>
        <span>City Swap 2026</span>
      </div>
    </div>
  );
};

export default CollectorPortalLogin;
