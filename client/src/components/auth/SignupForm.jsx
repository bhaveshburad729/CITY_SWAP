import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ShieldAlert, ArrowRight, Sparkles, UserCheck, Truck, ShoppingCart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signupUser } from '../../services/authService';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the Terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score === 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-amber-500' };
  if (score >= 4) return { score: 4, label: 'Strong & Secure', color: 'bg-[#005C2B]' };

  return { score: 0, label: '', color: 'bg-gray-200' };
};

const SignupForm = ({ onSwitchToLogin, onRoleChange, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const watchPassword = watch('password', '');
  const strength = getPasswordStrength(watchPassword);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await signupUser({
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: selectedRole
      });
      setAuthSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(res?.user || { ...data, role: selectedRole });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full text-gray-900">
      {/* Pill Badge */}
      <div className="flex justify-center sm:justify-start mb-2">
        <div className="inline-flex items-center gap-1.5 bg-[#e2f4e8]/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#005C2B] tracking-wide border border-[#c4ebcf] shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#005C2B]" />
          <span>Join City Swap</span>
          <span className="text-[#005C2B] font-bold">•</span>
          <span className="capitalize">{selectedRole} Registration</span>
        </div>
      </div>

      {/* Form Heading & Subtitle */}
      <div className="text-center sm:text-left mb-3">
        <h2 className="text-xl sm:text-2xl font-black text-[#101828] tracking-tight leading-tight">
          Create Account
        </h2>
        <p className="text-[11px] sm:text-xs font-semibold text-gray-600 mt-0.5 leading-relaxed">
          Enter your Email, Phone Number & Secure Password to get started.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-3 p-1 bg-gray-100/80 rounded-xl flex items-center border border-gray-200/80">
        <button
          type="button"
          onClick={() => handleRoleSelect('citizen')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'citizen'
              ? 'bg-white text-[#005C2B] shadow-xs border border-emerald-100'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('driver')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'driver'
              ? 'bg-white text-blue-600 shadow-xs border border-blue-100'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Driver</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('collector')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            selectedRole === 'collector'
              ? 'bg-white text-[#005C2B] shadow-xs border border-emerald-100'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Collector</span>
        </button>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
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

        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              {...register('name')}
              type="text"
              placeholder="Sarah Connor"
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium transition-all outline-none bg-white/90 ${
                errors.name
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#005C2B] focus:ring-2 focus:ring-[#005C2B]/10'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="sarah@cityswap.io"
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium transition-all outline-none bg-white/90 ${
                errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#005C2B] focus:ring-2 focus:ring-[#005C2B]/10'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mobile Phone Number */}
        <div>
          <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1">
            Mobile Phone Number
          </label>
          <div className="relative flex items-center border rounded-xl overflow-hidden bg-white/90 focus-within:border-[#005C2B] focus-within:ring-2 focus-within:ring-[#005C2B]/10 transition-all">
            <div className="pl-3 pr-2 py-2 flex items-center gap-1 border-r border-gray-200 text-gray-600 font-bold text-xs shrink-0">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>+91</span>
            </div>
            <input
              {...register('phone')}
              type="tel"
              placeholder="9876543210"
              className={`w-full px-3 py-2 text-xs font-medium outline-none bg-transparent ${
                errors.phone ? 'text-red-600' : 'text-gray-800'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Secure Password */}
        <div>
          <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1">
            Secure Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full pl-9 pr-10 py-2 rounded-xl border text-xs font-medium transition-all outline-none bg-white/90 ${
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#005C2B] focus:ring-2 focus:ring-[#005C2B]/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Password Strength Indicator Bar */}
          {watchPassword && (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-gray-600">
                <span>Password Strength:</span>
                <span className={`font-bold ${strength.score >= 3 ? 'text-[#005C2B]' : 'text-orange-500'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
                <div className={`h-full flex-1 transition-all ${strength.score >= 4 ? strength.color : 'bg-gray-200'}`} />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full pl-9 pr-10 py-2 rounded-xl border text-xs font-medium transition-all outline-none bg-white/90 ${
                errors.confirmPassword
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#005C2B] focus:ring-2 focus:ring-[#005C2B]/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Accept Terms */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-[#005C2B] focus:ring-[#005C2B]/30 cursor-pointer accent-[#005C2B]"
            />
            <span className="leading-tight text-[11px] font-semibold text-gray-600">
              I agree to City Swap's{' '}
              <a href="#terms" className="text-[#005C2B] font-bold underline">Terms & Privacy</a>.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || authSuccess}
          className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#005C2B] to-[#007a33] text-white text-xs font-bold shadow-xs hover:from-[#004821] hover:to-[#005C2B] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
        >
          {authSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 text-white font-black text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Account Created!</span>
            </motion.div>
          ) : isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Registering...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span>Create {selectedRole === 'driver' ? 'Driver' : selectedRole === 'collector' ? 'Collector' : 'Citizen'} Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </motion.button>
      </form>

      {/* Switch Link */}
      <div className="mt-3 pt-2 border-t border-gray-200/60 text-center">
        <p className="text-xs font-semibold text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-extrabold text-[#005C2B] hover:underline cursor-pointer ml-0.5"
          >
            Sign In Instead →
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
