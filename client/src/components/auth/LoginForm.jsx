import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, User, Shield, Truck, ShoppingCart, UserCheck, Headphones, MapPin, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '../../services/authService';

const loginSchema = z.object({
  email: z.string().min(1, 'Email, Mobile Number or Employee ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const LoginForm = ({ onSwitchToSignup, onOpenForgotPassword, onRoleChange, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('collector'); // 'citizen' | 'driver' | 'collector' | 'admin'
  const [authSuccess, setAuthSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await loginUser({ email: data.email, password: data.password, role: selectedRole });
      setAuthSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(res?.user || { ...data, role: selectedRole });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Invalid credentials. Please verify your details.');
    }
  };

  const getPortalTitle = () => {
    if (selectedRole === 'citizen') return 'Citizen Portal';
    if (selectedRole === 'driver') return 'Driver Portal';
    if (selectedRole === 'collector') return 'Admin Portal';
    return 'Admin Portal';
  };

  const getPortalSubtitle = () => {
    if (selectedRole === 'citizen') return 'Report waste, earn eco-coins, track status live.';
    if (selectedRole === 'driver') return 'View assigned routes, update status, track fuel & metrics.';
    if (selectedRole === 'collector') return 'Manage municipal operations, system data and personnel.';
    return 'Manage municipal operations, system data and personnel.';
  };

  return (
    <div className="w-full text-slate-800">
      
      {/* ----------------------------------------------------------------- */}
      {/* BRAND HEADER (ECOPULSE AI | CITY SWAP | जनसेवक)                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-[#005C2B] text-white flex items-center justify-center p-1.5 shadow-xs">
            <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          <span className="text-xl sm:text-2xl font-black text-[#005C2B] tracking-tight">EcoPulse AI</span>
        </div>
        <div className="text-xs font-extrabold text-slate-700 tracking-wide">
          City Swap | <span className="text-[#005C2B]">जनसेवक</span>
        </div>
        <div className="text-[10px] font-bold text-[#005C2B] mt-0.5">
          🌱 एकत्र येऊ, स्वच्छ शहर घडवू. 🌱
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* PORTAL TITLE & SUBTITLE MATCHING SCREENSHOT                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="text-center mb-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#d9531e] tracking-tight">
          {getPortalTitle()}
        </h2>
        <div className="w-12 h-0.5 bg-[#d9531e]/40 mx-auto my-1.5 rounded-full" />
        <p className="text-xs font-semibold text-slate-600 max-w-xs mx-auto">
          {getPortalSubtitle()}
        </p>
      </div>

      {/* Role Selection Tabs (Citizen, Driver, Collector, Admin) */}
      <div className="mb-3 p-1 bg-slate-100/90 rounded-2xl flex items-center border border-slate-200/80 gap-0.5">
        <button
          type="button"
          onClick={() => handleRoleSelect('citizen')}
          className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'citizen'
              ? 'bg-[#005C2B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>Citizen</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('driver')}
          className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'driver'
              ? 'bg-[#d9531e] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-3 h-3" />
          <span>Driver</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('collector')}
          className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'collector'
              ? 'bg-[#d9531e] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Admin</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('admin')}
          className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'admin'
              ? 'bg-[#005C2B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>Admin</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* HERO COMPOSITE ILLUSTRATION (MAN WITH BIN + GREEN TRUCK)         */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative w-full h-36 sm:h-40 bg-gradient-to-b from-amber-50/60 to-orange-50/40 rounded-2xl overflow-hidden border border-orange-100 mb-4 flex items-center justify-center">
        
        {/* Soft City Backdrop */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-bottom"
          style={{ backgroundImage: `url('/background_1.png')` }}
        />

        {/* Location Pin */}
        <div className="absolute top-3 right-[28%] z-10">
          <div className="w-6 h-6 rounded-full bg-[#d9531e] text-white flex items-center justify-center shadow-md animate-bounce">
            <MapPin className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* Layered Man with Bin (Left) */}
        <div className="absolute left-1 bottom-0 z-20 h-full w-[45%] flex items-end">
          <img
            src="/login_man.png"
            alt="Collector Sanitation Worker"
            className="h-[95%] w-auto object-contain object-bottom drop-shadow-md"
          />
        </div>

        {/* Layered Green Garbage Truck (Right) */}
        <div className="absolute right-1 bottom-1 z-10 h-full w-[58%] flex items-end">
          <img
            src="/login_truck.png"
            alt="Waste Compactor Truck"
            className="h-[88%] w-auto object-contain object-bottom drop-shadow-md"
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN LOGIN FORM                                                   */}
      {/* ----------------------------------------------------------------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Server Error Alert */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span>{serverError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Employee ID / Email / Phone Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Address, Mobile Phone or Employee ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              {...register('email')}
              type="text"
              placeholder="Enter Email, Mobile Number or Employee ID"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none bg-slate-50/80 ${
                errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-300 focus:border-[#d9531e] focus:bg-white focus:ring-2 focus:ring-orange-100'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none bg-slate-50/80 ${
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-300 focus:border-[#d9531e] focus:bg-white focus:ring-2 focus:ring-orange-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 select-none">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-slate-300 text-[#d9531e] focus:ring-orange-200 cursor-pointer accent-[#d9531e]"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="font-bold text-[#d9531e] hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Primary Login Button matching Screenshot */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || authSuccess}
          className="w-full mt-2 py-3 px-5 rounded-xl bg-[#d9531e] hover:bg-[#c04314] text-white text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
        >
          {authSuccess ? (
            <div className="flex items-center gap-2 text-white font-black">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>Signed In Successfully!</span>
            </div>
          ) : isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 w-full">
              <span>Login</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </motion.button>
      </form>

      {/* Need Help Contact Support Card matching Screenshot */}
      <div className="mt-3.5">
        <button
          type="button"
          onClick={() => alert('Support helpline: 1800-CITY-SWAP (24x7)')}
          className="w-full p-3 rounded-2xl bg-orange-50/70 border border-orange-100 hover:bg-orange-100/60 flex items-center justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#d9531e] flex items-center justify-center font-bold shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#d9531e]">Need Help?</div>
              <div className="text-[11px] font-semibold text-slate-600">Contact Support</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#d9531e] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* OAuth2 Login Options preserved */}
      <div className="mt-4 pt-3 border-t border-slate-200/80">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2.5">
          or single sign-on with
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onSubmit({ email: 'google.user@cityswap.io', password: 'password123' })}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => onSubmit({ email: 'github.user@cityswap.io', password: 'password123' })}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current text-slate-900 shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>
      </div>

      {/* Switch to Signup Link */}
      <div className="mt-3 text-center">
        <p className="text-xs font-semibold text-slate-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-extrabold text-[#d9531e] hover:underline cursor-pointer ml-0.5"
          >
            Create Your Account →
          </button>
        </p>
      </div>

    </div>
  );
};

export default LoginForm;
