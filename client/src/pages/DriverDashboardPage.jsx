import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDriverTasks, updateDriverTaskStatus } from '../services/driverService';
import { getCurrentUser, logoutUser } from '../services/authService';
import ProfileModal from '../components/ProfileModal';
import InteractiveMap from '../components/InteractiveMap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Navigation,
  TrendingUp,
  Fuel,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  AlertCircle
} from 'lucide-react';

const DriverDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [driver, setDriver] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showNavToast, setShowNavToast] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [tasks, setTasks] = useState([]);

  const loadDriverData = async () => {
    try {
      const [userSession, tList] = await Promise.all([
        getCurrentUser(),
        fetchDriverTasks()
      ]);
      if (userSession) setDriver(userSession);
      setTasks(tList);
    } catch (err) {
      console.error('Error loading driver data:', err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('ecopulse_user');
    if (savedUser) {
      try {
        setDriver(JSON.parse(savedUser));
      } catch (e) {
        setDriver({ name: 'Ramesh Yadav', role: 'driver', ward: 'Ward 12' });
      }
    } else {
      setDriver({ name: 'Ramesh Yadav', role: 'driver', ward: 'Ward 12' });
    }

    loadDriverData();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setShowNavToast(true);
    setTimeout(() => setShowNavToast(false), 3500);
  };

  const toggleTaskStatus = async (taskId) => {
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;

    let newStatus = 'In Progress';
    if (currentTask.status === 'Pending') newStatus = 'In Progress';
    else if (currentTask.status === 'In Progress') newStatus = 'Completed';
    else newStatus = 'Pending';

    // Optimistically update UI
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const statusColor = newStatus === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
          return { ...task, status: newStatus, statusColor };
        }
        return task;
      })
    );

    try {
      await updateDriverTaskStatus(taskId, newStatus);
      await loadDriverData();
    } catch (err) {
      console.error('Error updating task in PostgreSQL:', err);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setDriver(updatedUser);
  };

  // Compute live real-time driver telemetry from PostgreSQL tasks
  const totalStops = tasks.length;
  const completedStops = tasks.filter(t => t.status === 'Completed').length;
  const pendingStops = tasks.filter(t => t.status === 'Pending').length;
  const progressPercent = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  // Driver GPS coordinates [lat, lng]
  const driverGPS = [18.524, 73.852];

  // Sidebar navigation items matching DRIVER.png
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', icon: ClipboardList },
    { name: 'Route & Navigation', icon: Navigation, action: handleStartNavigation },
    { name: 'My Performance', icon: TrendingUp },
    { name: 'Fuel Log', icon: Fuel },
    { name: 'Messages', icon: MessageSquare, badge: 3 },
    { name: 'Profile Settings', icon: User, action: () => setShowProfileModal(true) },
    { name: 'Settings', icon: Settings, action: () => setShowProfileModal(true) },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans p-2 sm:p-4 md:p-6 text-slate-800 selection:bg-[#005C2B] selection:text-white">
      
      {/* Toast Alert for Navigation */}
      <AnimatePresence>
        {showNavToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs"
          >
            <Navigation className="w-5 h-5 fill-current animate-bounce" />
            <span>Turn-by-Turn GPS Navigation Started on Interactive OpenStreetMap!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-4 md:gap-6 min-h-[calc(100vh-3rem)]">
        
        {/* ----------------------------------------------------------------- */}
        {/* LEFT SIDEBAR NAVIGATION MATCHING DRIVER.PNG                       */}
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
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
              <div>
                <div className="text-base font-black text-slate-900 tracking-tight leading-none">
                  City Swap
                </div>
                <div className="text-[10px] font-bold text-[#02471f] tracking-wide mt-0.5">
                  Driver Portal
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

          {/* Driver Profile Card & Sign Out */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#02471f] flex items-center justify-center font-bold text-xs shrink-0">
                {driver?.name ? driver.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {driver?.name || driver?.full_name || 'Ramesh Yadav'}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  {driver?.ward || 'Ward 12'} • Driver
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
        {/* RIGHT MAIN CONTENT AREA MATCHING DRIVER.PNG                       */}
        {/* ----------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col min-w-0 space-y-5">
          
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Driver Telematics & Live GPS Mapping
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Built-in OpenStreetMap navigation with real-time citizen waste coordinates
              </p>
            </div>

            {/* Header Right Driver Card */}
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#02471f] text-white flex items-center justify-center font-bold text-xs">
                {driver?.name ? driver.name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {driver?.name || driver?.full_name || 'Ramesh Yadav'}
                </div>
                <div className="text-[10px] font-bold text-emerald-700">
                  ⚡ EcoCoins: {driver?.eco_coins || 100}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-View Navigation if not on Dashboard */}
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
                    Live driver telematics & route operations for Ward 12.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Dashboard')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  ← Back to Driver Dashboard
                </button>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e2f4e8] text-[#02471f] flex items-center justify-center mx-auto text-xl font-bold">
                  🚛
                </div>
                <h3 className="text-base font-bold text-slate-900">{activeTab} Real-time Sync Active</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Vehicle telemetry (MH12 AB 4567), fuel logs, and Ward 12 route stops are active in PostgreSQL.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* ----------------------------------------------------------- */}
              {/* ROW 1: 5 KPI STAT CARDS BOUND TO POSTGRESQL                 */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* Stat 1: Today's Duty */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500">Today's Duty</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {driver?.ward || 'Ward 12'}
                  </div>
                </motion.div>

                {/* Stat 2: Total Stops */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500">Total Stops</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{totalStops}</div>
                </motion.div>

                {/* Stat 3: Completed */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500">Completed</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{completedStops}</div>
                </motion.div>

                {/* Stat 4: Pending */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500">Pending</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{pendingStops}</div>
                </motion.div>

                {/* Stat 5: Progress */}
                <motion.div whileHover={{ y: -2 }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="text-xs font-bold text-slate-500">Progress</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-2">
                    {progressPercent}%
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="bg-[#02471f] h-full rounded-full"
                    />
                  </div>
                </motion.div>

              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 2: BUILT-IN INTERACTIVE LEAFLET MAP & MY TASKS          */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Column 1: Built-in Interactive Leaflet OpenStreetMap (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-extrabold text-slate-900">Today's Live OpenStreetMap Route</h3>
                    <button
                      onClick={handleStartNavigation}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 fill-current" />
                      <span>Start GPS Navigation</span>
                    </button>
                  </div>

                  {/* Built-in Interactive Leaflet Map */}
                  <InteractiveMap
                    center={[18.5204, 73.8567]}
                    zoom={13}
                    driverLocation={driverGPS}
                    tasks={tasks}
                    onCompleteTask={(id) => toggleTaskStatus(id)}
                    height="280px"
                  />
                </div>

                {/* Column 2: Next Stop & My Vehicle Sub-Cards (3.5 Cols) */}
                <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
                  
                  {/* Next Stop Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex-1 flex flex-col justify-between">
                    <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Next Stop</div>
                    <div className="my-2">
                      <div className="text-sm font-black text-slate-900 leading-tight">
                        {tasks.find(t => t.status === 'In Progress')?.name || '2. Sai Nagar, Main Road'}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ETA: 8 mins (GPS Tracked)
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTaskStatus(tasks.find(t => t.status === 'In Progress')?.id || 2)}
                      className="w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-[#02471f] font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Complete Next Stop
                    </button>
                  </div>

                  {/* My Vehicle Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex-1 flex flex-col justify-between">
                    <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">My Vehicle</div>
                    <div className="my-2">
                      <div className="text-sm font-black text-slate-900">Compactor Truck #04</div>
                      <div className="text-[11px] font-bold text-slate-500 mt-0.5">Reg: MH12 AB 4567</div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                      <span>Fuel Level</span>
                      <span className="font-extrabold">78% ⛽</span>
                    </div>
                  </div>

                </div>

                {/* Column 3: My Tasks Interactive Table (3.5 Cols) */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-extrabold text-slate-900">My Route Tasks</h3>
                    <span className="text-[10px] font-bold text-slate-500">Click to Toggle Status</span>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskStatus(task.id)}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${task.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-extrabold text-slate-800 truncate">
                            {task.name}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border shrink-0 ${task.statusColor}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 text-xs font-semibold text-slate-500 text-center">
                    Status updates sync live to PostgreSQL database & map pins.
                  </div>
                </div>

              </div>
            </>
          )}

        </main>
      </div>

      {/* Driver Profile Settings Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={driver}
        onProfileUpdated={handleProfileUpdated}
      />

    </div>
  );
};

export default DriverDashboardPage;
