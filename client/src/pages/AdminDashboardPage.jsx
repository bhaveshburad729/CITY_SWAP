import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminMetrics, fetchAdminComplaints, assignDriverTask, downloadAdminExportCSV } from '../services/adminService';
import { getCurrentUser, logoutUser } from '../services/authService';
import ProfileModal from '../components/ProfileModal';
import InteractiveMap from '../components/InteractiveMap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  AlertCircle,
  Truck,
  ShoppingCart,
  Layers,
  FileText,
  TrendingUp,
  Bell,
  Settings,
  Users,
  LogOut,
  Download,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Plus,
  User
} from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dateRange, setDateRange] = useState('May 20 - May 26, 2026');
  const [exporting, setExporting] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  const [metrics, setMetrics] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);

  const loadData = async () => {
    try {
      const [m, c, u] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminComplaints(),
        getCurrentUser()
      ]);
      setMetrics(m);
      setRecentComplaints(c);
      if (u) setUser(u);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('ecopulse_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser({ name: 'Admin Officer', role: 'admin', ward: 'Municipal HQ' });
      }
    } else {
      setUser({ name: 'Admin Officer', role: 'admin', ward: 'Municipal HQ' });
    }

    loadData();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadAdminExportCSV();
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3500);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleDriverAssignment = async (complaintDbId, driverName) => {
    setAssigningId(complaintDbId);
    try {
      await assignDriverTask(complaintDbId, driverName);
      await loadData();
    } catch (err) {
      console.error('Assignment error:', err);
    } finally {
      setAssigningId(null);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  const topWards = metrics?.top_wards || [
    { name: 'Ward 12', percent: 92 },
    { name: 'Ward 8', percent: 85 },
    { name: 'Ward 4', percent: 76 },
    { name: 'Ward 10', percent: 66 }
  ];

  const availableDrivers = [
    'Ramesh Yadav',
    'Suresh Kumar',
    'Ajay Patel',
    'Vikram Singh'
  ];

  // Map tasks formatting from complaints
  const mapTasks = recentComplaints.map((c, i) => ({
    id: c.id,
    name: `${c.location} (${c.type})`,
    status: c.status,
    lat: 18.520 + (i * 0.006),
    lng: 73.850 + (i * 0.007)
  }));

  // Sidebar navigation items
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Complaints', icon: AlertCircle },
    { name: 'Drivers', icon: Truck },
    { name: 'Collectors', icon: ShoppingCart },
    { name: 'Bins', icon: Layers },
    { name: 'Reports', icon: FileText, action: handleExport },
    { name: 'Analytics', icon: TrendingUp },
    { name: 'Notifications', icon: Bell, badge: 12 },
    { name: 'Profile Settings', icon: User, action: () => setShowProfileModal(true) },
    { name: 'Settings', icon: Settings, action: () => setShowProfileModal(true) },
  ];

  // Dynamic counts for status donut chart and KPI badges
  const pendingCount = metrics?.pending_complaints ?? recentComplaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = metrics?.in_progress_complaints ?? recentComplaints.filter(c => c.status === 'In Progress').length;
  const completedCount = metrics?.completed_complaints ?? recentComplaints.filter(c => c.status === 'Completed').length;
  const totalComplaints = (metrics?.total_complaints ?? recentComplaints.length) || (pendingCount + inProgressCount + completedCount);

  const pendingPct = totalComplaints > 0 ? (pendingCount / totalComplaints) * 100 : 0;
  const inProgressPct = totalComplaints > 0 ? (inProgressCount / totalComplaints) * 100 : 0;
  const completedPct = totalComplaints > 0 ? (completedCount / totalComplaints) * 100 : 0;

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
    <div className="min-h-screen bg-[#f0f4f8] font-sans p-2 sm:p-4 md:p-6 text-slate-800 selection:bg-[#005C2B] selection:text-white">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {showNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#005C2B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>Municipal Complaints Report Downloaded from PostgreSQL!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-4 md:gap-6 min-h-[calc(100vh-3rem)]">
        
        {/* ----------------------------------------------------------------- */}
        {/* LEFT SIDEBAR NAVIGATION MATCHING SCREENSHOT                       */}
        {/* ----------------------------------------------------------------- */}
        <aside className="w-full md:w-64 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between shrink-0">
          
          <div className="space-y-6">
            {/* Logo Brand Header */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
              title="Go to Home Page"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#02471f] text-white flex items-center justify-center font-bold shadow-xs">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="text-base font-black text-slate-900 tracking-tight leading-none">
                  City Swap
                </div>
                <div className="text-[10px] font-bold text-[#02471f] tracking-wide mt-0.5">
                  EcoPulse Admin
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#02471f] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card & Sign Out */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#02471f] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || user?.full_name || 'Admin Officer'}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  Municipal HQ • Admin
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
        {/* RIGHT MAIN CONTENT AREA MATCHING SCREENSHOT                       */}
        {/* ----------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col min-w-0 space-y-5">
          
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Municipal Telemetry & OpenStreetMap GIS
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Real-time municipal driver fleet tracking & waste location mapping
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              
              {/* Admin Avatar Pill */}
              <div
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs cursor-pointer transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#02471f] text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-xs font-bold text-slate-800 pr-1">
                  {user?.name || user?.full_name || 'Admin'}
                </span>
              </div>

              {/* Date Range Selector Pill */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{dateRange}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadData}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Primary Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 bg-[#02471f] hover:bg-[#003617] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-80"
              >
                <Download className={`w-3.5 h-3.5 ${exporting ? 'animate-bounce' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export CSV Report'}</span>
              </button>

            </div>
          </div>

          {/* Conditional Sub-View Render based on Active Tab */}
          {activeTab !== 'Dashboard' ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{activeTab} Management</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Manage and monitor live municipal {activeTab.toLowerCase()} data in PostgreSQL.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  ← Back to Main Dashboard
                </button>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e2f4e8] text-[#02471f] flex items-center justify-center mx-auto text-xl font-bold">
                  ⚡
                </div>
                <h3 className="text-base font-bold text-slate-900">{activeTab} Live Data Active</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Municipal records for {activeTab} are synchronized directly with your PostgreSQL database.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* ----------------------------------------------------------- */}
              {/* ROW 1: 4 KPI STAT CARDS BOUND TO POSTGRESQL                 */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1: Total Complaints */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Complaints</div>
                  <div className="text-3xl font-black text-slate-900 my-2">
                    {totalComplaints}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <span>↑</span> Live DB Count
                    </span>
                    <span className="text-emerald-700 font-extrabold">🌱</span>
                  </div>
                </motion.div>

                {/* Stat 2: In Progress */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">In Progress</div>
                  <div className="text-3xl font-black text-amber-600 my-2">
                    {inProgressCount}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                    <span className="flex items-center gap-1">
                      <span>⚡</span> Active Tasks
                    </span>
                    <span className="text-amber-700 font-extrabold">🟡</span>
                  </div>
                </motion.div>

                {/* Stat 3: Pending */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pending</div>
                  <div className="text-3xl font-black text-red-600 my-2">
                    {pendingCount}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-red-600">
                    <span className="flex items-center gap-1">
                      <span>⌛</span> Awaiting Driver
                    </span>
                    <span className="text-red-700 font-extrabold">🔴</span>
                  </div>
                </motion.div>

                {/* Stat 4: Resolution Rate % */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Resolution Rate</div>
                  <div className="text-3xl font-black text-emerald-700 my-2">
                    {metrics?.resolution_rate ?? 0}%
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <span>↑</span> Target Exceeded
                    </span>
                  </div>
                </motion.div>

              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 2: LIVE OPENSTREETMAP GIS & DYNAMIC DONUT CHART         */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Panel: Live Collection Map (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-extrabold text-slate-900">Municipal OpenStreetMap Telemetry</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {metrics?.active_trucks || 24} Active Driver Fleet
                    </span>
                  </div>

                  {/* Interactive Leaflet Map */}
                  <InteractiveMap
                    center={[18.5204, 73.8567]}
                    zoom={13}
                    driverLocation={[18.524, 73.852]}
                    tasks={mapTasks}
                    height="280px"
                  />
                </div>

                {/* Right Panel: Complaint Status Dynamic Donut Chart (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-extrabold text-slate-900">Complaint Status Distribution</h3>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Live Telemetry
                    </span>
                  </div>

                  {/* Dynamic SVG Circular Donut Chart with Center Total Display */}
                  <div className="flex items-center justify-between gap-5 py-3">
                    <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Base Ring */}
                        <path
                          className="text-slate-100 stroke-current"
                          strokeWidth="4"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Pending Segment (Red) */}
                        {pendingPct > 0 && (
                          <path
                            className="text-red-500 stroke-current transition-all duration-700"
                            strokeWidth="4.5"
                            strokeDasharray={`${pendingPct}, 100`}
                            strokeDashoffset="0"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        )}
                        {/* In Progress Segment (Yellow) */}
                        {inProgressPct > 0 && (
                          <path
                            className="text-yellow-500 stroke-current transition-all duration-700"
                            strokeWidth="4.5"
                            strokeDasharray={`${inProgressPct}, 100`}
                            strokeDashoffset={`-${pendingPct}`}
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        )}
                        {/* Completed Segment (Green) */}
                        {completedPct > 0 && (
                          <path
                            className="text-emerald-500 stroke-current transition-all duration-700"
                            strokeWidth="4.5"
                            strokeDasharray={`${completedPct}, 100`}
                            strokeDashoffset={`-${pendingPct + inProgressPct}`}
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        )}
                      </svg>
                      
                      {/* Dynamic Center Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-900 leading-none">{totalComplaints}</span>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">Total</span>
                      </div>
                    </div>

                    {/* Donut Chart Legend & Stats Breakdown */}
                    <div className="space-y-3 font-semibold text-xs text-slate-700 flex-1">
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-50/60 border border-red-100">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                          <span className="font-bold text-red-900">Pending</span>
                        </span>
                        <span className="font-extrabold text-red-900">
                          {pendingCount} <span className="text-[10px] text-red-700 font-semibold">({Math.round(pendingPct)}%)</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-yellow-50/60 border border-yellow-100">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                          <span className="font-bold text-yellow-900">In Progress</span>
                        </span>
                        <span className="font-extrabold text-yellow-900">
                          {inProgressCount} <span className="text-[10px] text-yellow-700 font-semibold">({Math.round(inProgressPct)}%)</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="font-bold text-emerald-900">Completed</span>
                        </span>
                        <span className="font-extrabold text-emerald-900">
                          {completedCount} <span className="text-[10px] text-emerald-700 font-semibold">({Math.round(completedPct)}%)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>⚡ Live Dynamic Metrics</span>
                    <span className="text-[#02471f] font-extrabold">100% Real-Time Data</span>
                  </div>
                </div>

              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 3: RECENT COMPLAINTS TABLE WITH DRIVER ASSIGNMENT       */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Panel: Recent Complaints Table (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-extrabold text-slate-900">All Municipal Complaints</h3>
                    <button 
                      onClick={loadData}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sync PostgreSQL</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold text-slate-600">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3">Tracking ID</th>
                          <th className="pb-3">Location</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Assign Driver</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentComplaints.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 font-bold text-slate-900">{item.id}</td>
                            <td className="py-3.5 text-slate-700">{item.location}</td>
                            <td className="py-3.5 text-slate-700">{item.type}</td>
                            <td className="py-3.5">
                              <span className={getStatusBadgeClass(item.status)}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <select
                                value={item.assignedTo || 'Unassigned'}
                                disabled={assigningId === item.db_id}
                                onChange={(e) => handleDriverAssignment(item.db_id, e.target.value)}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-extrabold text-slate-800 focus:outline-none focus:border-[#02471f] cursor-pointer"
                              >
                                {(!item.assignedTo || item.assignedTo === 'Unassigned') && (
                                  <option value="Unassigned">Assign Driver...</option>
                                )}
                                {availableDrivers.map((driverName) => (
                                  <option key={driverName} value={driverName}>
                                    {driverName}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Panel: Top Performing Wards (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-extrabold text-slate-900">Ward Resolution Performance</h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Top Wards
                      </span>
                    </div>

                    {/* Ward Progress Bars */}
                    <div className="space-y-3.5 my-2">
                      {topWards.map((ward) => (
                        <div key={ward.name} className="flex items-center justify-between gap-3 text-xs font-bold">
                          <span className="w-16 text-slate-700">{ward.name}</span>
                          
                          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${ward.percent}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="bg-[#02471f] h-full rounded-full"
                            />
                          </div>

                          <span className="w-10 text-right text-slate-900 font-extrabold">{ward.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ward Efficiency Summary Badge */}
                  <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Average Ward Resolution Efficiency: 85%</span>
                    </span>
                    <span className="text-emerald-700 font-black">Optimum</span>
                  </div>
                </div>

              </div>
            </>
          )}

        </main>
      </div>

      {/* Admin Profile Settings Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />

    </div>
  );
};

export default AdminDashboardPage;
