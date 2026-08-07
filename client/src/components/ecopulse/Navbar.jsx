import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenLogin, onOpenSignup }) => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 py-3.5 px-4 md:px-10 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-[1340px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-[42px] h-[42px] bg-[#005C2B] rounded-xl flex items-center justify-center text-white shadow-xs">
            {/* Truck Icon */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <div>
            <div className="text-[20px] font-extrabold text-gray-900 tracking-tight leading-none">
              EcoPulse AI
            </div>
            <div className="text-[11px] font-semibold text-gray-500 tracking-wide mt-1">
              Smart Waste Management
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-gray-800">
          <a href="#home" className="text-[#005C2B] font-bold border-b-2 border-[#005C2B] pb-1">
            Home
          </a>
          <a href="#features" className="hover:text-[#005C2B] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#005C2B] transition-colors">
            How It Works
          </a>
          <a href="#ai-agents" className="hover:text-[#005C2B] transition-colors">
            AI Agents
          </a>
          <a href="#dashboards" className="hover:text-[#005C2B] transition-colors">
            Dashboards
          </a>
          <a href="#impact" className="hover:text-[#005C2B] transition-colors">
            Impact
          </a>
          <a href="#blog" className="hover:text-[#005C2B] transition-colors">
            Blog
          </a>
          <a href="#contact" className="hover:text-[#005C2B] transition-colors">
            Contact
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            to="/login"
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-50 hover:border-[#005C2B] hover:text-[#005C2B] transition-all cursor-pointer inline-flex items-center justify-center"
          >
            Login
          </Link>
          <Link 
            to="/signup"
            className="px-5 py-2 rounded-lg bg-[#005C2B] text-white text-sm font-bold shadow-xs hover:bg-[#004821] transition-all cursor-pointer inline-flex items-center justify-center"
          >
            Create Account
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
