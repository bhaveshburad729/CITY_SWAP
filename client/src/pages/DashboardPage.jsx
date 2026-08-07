import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyComplaints } from '../services/complaintService';
import { getCurrentUser, logoutUser } from '../services/authService';
import ProfileModal from '../components/ProfileModal';
import ReportWasteModal from '../components/ReportWasteModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Search,
  Coins,
  Gift,
  User,
  HelpCircle,
  Settings,
  LogOut,
  Sparkles,
  Camera,
  Cpu,
  Truck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    // Synchronize current user session with backend PostgreSQL database
    getCurrentUser().then((userData) => {
      if (userData) {
        setUser(userData);
      } else {
        const savedUser = localStorage.getItem('ecopulse_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            setUser({ name: 'Priya Patil', email: 'priya@cityswap.io', role: 'citizen', ward: 'Ward 12', eco_coins: 150 });
          }
        }
      }
    });

    // Load complaints from backend API for logged-in user session
    fetchMyComplaints().then((data) => setRecentComplaints(data));
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleComplaintCreated = (newComplaint) => {
    setRecentComplaints((prev) => [newComplaint, ...prev]);
    // Refresh user eco coins
    getCurrentUser().then((u) => {
      if (u) setUser(u);
    });
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  // Compute live real-time statistics
  const totalComplaintsCount = recentComplaints.length;
  const inProgressCount = recentComplaints.filter((c) => c.status === 'In Progress').length;
  const ecoCoinsCount = user?.eco_coins || 150;

  // How it works steps matching CITIZEN.png
  const steps = [
    {
      title: 'Report',
      description: 'Upload photo & location on WhatsApp',
      icon: Camera
    },
    {
      title: 'AI Verify',
      description: 'We verify & create complaint',
      icon: Cpu
    },
    {
      title: 'Assigned',
      description: 'Task assigned to driver or collector',
      icon: Truck
    },
    {
      title: 'Resolved',
      description: 'You get notified & earn EcoCoins',
      icon: CheckCircle2
    }
  ];

  // Sidebar navigation items matching CITIZEN.png
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/citizen' },
    { name: 'My Complaints', icon: FileText, path: '/citizen' },
    { name: 'Track Waste Truck', icon: Search, path: '/citizen' },
    { name: 'EcoCoins Rewards', icon: Coins, path: '/citizen' },
    { name: 'Redeem Coupons', icon: Gift, path: '/citizen' },
    { name: 'Profile Settings', icon: User, action: () => setShowProfileModal(true) },
    { name: 'Help & Support', icon: HelpCircle, action: () => setShowWhatsAppModal(true) },
    { name: 'Settings', icon: Settings, action: () => setShowProfileModal(true) },
  ];

  const getStatusBadgeClass = (status) => {
    if (status === 'In Progress') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 font-extrabold whitespace-nowrap inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] border shadow-2xs';
    }
    if (status === 'Pending') {
      return 'bg-red-100 text-red-800 border-red-300 font-extrabold whitespace-nowrap inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] border shadow-2xs';
    }
    if (status === 'Completed') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold whitespace-nowrap inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] border shadow-2xs';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300 font-extrabold whitespace-nowrap inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] border shadow-2xs';
  };

  return (
    <div className="min-h-screen bg-[#f6f9f7] font-sans selection:bg-[#02471f] selection:text-white flex text-slate-800">
      
      {/* ----------------------------------------------------------------- */}
      {/* LEFT SIDEBAR NAVIGATION MATCHING CITIZEN.PNG                     */}
      {/* ----------------------------------------------------------------- */}
      <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-screen">
        
        <div className="space-y-6">
          {/* Platform Header */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
            title="Go to Home Page"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#02471f] text-white flex items-center justify-center font-bold shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                EcoPulse AI
              </div>
              <div className="text-[10px] font-bold text-[#02471f] tracking-wide mt-0.5">
                City Swap Platform
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.name);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#02471f] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Button */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#02471f] flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user?.name || user?.full_name || 'Priya Patil'}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 truncate">
                {user?.ward || 'Ward 12'} • Citizen
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN DASHBOARD CONTENT                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Citizen Dashboard
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">
              Clean City • Ward 12 Municipal Portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#02471f] hover:bg-[#003617] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            {/* Profile Action */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              title="Profile Settings"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {activeTab !== 'Dashboard' ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{activeTab} Details</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Manage your eco-credits, reported complaints, and civic status.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Dashboard')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  ← Back to Citizen Dashboard
                </button>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e2f4e8] text-[#02471f] flex items-center justify-center mx-auto text-xl font-bold">
                  🌱
                </div>
                <h3 className="text-base font-bold text-slate-900">{activeTab} Section Active</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your civic complaints, recycling rewards, and EcoCoins balance are synced live with PostgreSQL database.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* ----------------------------------------------------------- */}
              {/* ROW 1: 3 KPI STAT CARDS & RIGHT BANNER                      */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left 3 Stat Cards (7 Cols) */}
                <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
                  
                  <div className="grid grid-cols-3 gap-4">
                    
                    {/* Stat 1: Total Complaints */}
                    <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="text-xs font-bold text-slate-500">Total Complaints</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {totalComplaintsCount}
                      </div>
                    </motion.div>

                    {/* Stat 2: In Progress */}
                    <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="text-xs font-bold text-slate-500">In Progress</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {inProgressCount}
                      </div>
                    </motion.div>

                    {/* Stat 3: EcoCoins */}
                    <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="text-xs font-bold text-slate-500">EcoCoins</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {ecoCoinsCount}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs shadow-xs border border-amber-300">
                          🪙
                        </div>
                      </div>
                    </motion.div>

                  </div>

                  {/* My Recent Complaints Panel Matching CITIZEN.png */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-extrabold text-slate-900">My Recent Complaints</h3>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="text-xs font-bold text-[#02471f] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Complaint</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold text-slate-600">
                        <tbody className="divide-y divide-slate-100">
                          {recentComplaints.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 font-bold text-slate-900">{item.id}</td>
                              <td className="py-3 text-slate-700">{item.location}</td>
                              <td className="py-3 text-slate-700">{item.type}</td>
                              <td className="py-3">
                                <span className={getStatusBadgeClass(item.status)}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-3 text-right">
                      <button
                        onClick={() => setActiveTab('My Complaints')}
                        className="text-xs font-bold text-[#02471f] hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Panel: Report New Waste Card (5 Cols) Matching CITIZEN.png */}
                <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-between text-center">
                  
                  <h3 className="text-base font-extrabold text-slate-900 mb-2 w-full text-left">
                    Report New Waste
                  </h3>

                  {/* Recycling Illustration Image */}
                  <div className="w-full max-w-[240px] h-36 my-2 flex items-center justify-center overflow-hidden">
                    <img
                      src="/girl.png"
                      alt="Citizens Recycling Waste"
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>

                  <p className="text-xs font-semibold text-slate-600 max-w-xs leading-relaxed my-2">
                    Help your city stay clean. Report waste in just a few seconds.
                  </p>

                  <div className="w-full space-y-2">
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full py-3 px-4 bg-[#02471f] hover:bg-[#003617] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Report Issue in App</span>
                    </button>

                    <button
                      onClick={() => setShowWhatsAppModal(true)}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#02471f] border border-emerald-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Report via WhatsApp</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 2: HOW IT WORKS (4 STEP CARDS MATCHING CITIZEN.PNG)     */}
              {/* ----------------------------------------------------------- */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">How It Works</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {steps.map((step, idx) => {
                    const IconComponent = step.icon;
                    return (
                      <div
                        key={step.title}
                        className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 transition-all flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#02471f] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{step.title}</div>
                          <div className="text-[11px] font-semibold text-slate-500 leading-snug mt-0.5">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Report Waste Modal */}
      <ReportWasteModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        user={user}
        onComplaintCreated={handleComplaintCreated}
      />

    </div>
  );
};

export default DashboardPage;
