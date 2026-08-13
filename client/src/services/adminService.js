import api from './api';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Metrics
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAdminMetrics = async () => {
  try {
    const response = await api.get('/admin/metrics');
    return response.data;
  } catch (error) {
    console.warn('Error fetching admin metrics:', error.message);
    return {
      total_complaints: 4,
      pending_complaints: 2,
      in_progress_complaints: 1,
      completed_complaints: 1,
      resolution_rate: 50.0,
      active_trucks: 6,
      total_drivers: 4,
      total_citizens: 2,
      top_wards: [
        { name: 'Ward 12', percent: 92 },
        { name: 'Ward 8', percent: 85 },
        { name: 'Ward 4', percent: 76 },
        { name: 'Ward 10', percent: 66 }
      ]
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Complaints
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAdminComplaints = async () => {
  try {
    const response = await api.get('/admin/complaints');
    return response.data;
  } catch (error) {
    console.warn('Error fetching admin complaints:', error.message);
    return [];
  }
};

export const assignDriverTask = async (complaintDbId, driverName) => {
  try {
    const response = await api.post('/admin/assign-task', {
      complaint_id: complaintDbId,
      driver_name: driverName
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning driver:', error);
    throw error;
  }
};

export const updateComplaintStatus = async (complaintDbId, newStatus) => {
  try {
    const response = await api.patch(`/admin/complaints/${complaintDbId}/status`, {
      status: newStatus
    });
    return response.data;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw error;
  }
};

export const downloadAdminExportCSV = async () => {
  try {
    const response = await api.get('/admin/export-csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'municipal_complaints_report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading CSV report:', error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Driver Management
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAdminDrivers = async () => {
  try {
    const response = await api.get('/admin/drivers');
    return response.data;
  } catch (error) {
    console.warn('Error fetching admin drivers:', error.message);
    // Fallback drivers for offline/demo mode
    return [
      { id: 1, full_name: 'Ramesh Yadav', email: 'ramesh@cityswap.io', employee_id: 'EMP-DRIVER-01', ward: 'Ward 12', phone: '9876543211', role: 'driver', is_active: true, eco_coins: 850, tasks_completed: 42, tasks_in_progress: 1, tasks_pending: 3 },
      { id: 2, full_name: 'Suresh Kumar', email: 'suresh@cityswap.io', employee_id: 'EMP-DRIVER-02', ward: 'Ward 8', phone: '9876543214', role: 'driver', is_active: true, eco_coins: 620, tasks_completed: 35, tasks_in_progress: 2, tasks_pending: 1 },
    ];
  }
};

export const registerAdminDriver = async (driverData) => {
  try {
    const response = await api.post('/admin/drivers', driverData);
    return response.data;
  } catch (error) {
    console.error('Error registering driver:', error);
    throw error;
  }
};

export const toggleDriverStatus = async (driverId, isActive) => {
  try {
    const response = await api.patch(`/admin/drivers/${driverId}/status`, { is_active: isActive });
    return response.data;
  } catch (error) {
    console.error('Error toggling driver status:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Smart Bin Telemetry
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAdminBins = async () => {
  try {
    const response = await api.get('/admin/bins');
    return response.data;
  } catch (error) {
    console.warn('Error fetching bin telemetry:', error.message);
    // Fallback bin data for offline/demo mode
    return {
      total_bins: 4,
      critical_bins: 1,
      warning_bins: 1,
      normal_bins: 2,
      avg_fill_level: 62.5,
      bins: [
        { id: 1, bin_code: 'BIN-101', location_name: 'Green Park, Plot 45', ward: 'Ward 12', bin_type: 'General Waste', capacity_liters: 240, fill_level_pct: 92, is_active: true },
        { id: 2, bin_code: 'BIN-102', location_name: 'Sai Nagar, Main Road', ward: 'Ward 12', bin_type: 'Recyclable', capacity_liters: 120, fill_level_pct: 68, is_active: true },
        { id: 3, bin_code: 'BIN-103', location_name: 'Shanti Apartment, Block B', ward: 'Ward 8', bin_type: 'General Waste', capacity_liters: 360, fill_level_pct: 45, is_active: true },
        { id: 4, bin_code: 'BIN-104', location_name: 'Market Area, Gate No. 2', ward: 'Ward 8', bin_type: 'Organic', capacity_liters: 120, fill_level_pct: 85, is_active: true },
      ]
    };
  }
};

export const refreshBinTelemetry = async (binId, fillLevelPct) => {
  try {
    const response = await api.patch(`/admin/bins/${binId}`, { fill_level_pct: fillLevelPct });
    return response.data;
  } catch (error) {
    console.error('Error refreshing bin:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAdminAnalytics = async () => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error) {
    console.warn('Error fetching admin analytics:', error.message);
    return {
      resolution_rate: 72.0,
      avg_response_hours: 4.2,
      citizen_satisfaction: 87.3,
      waste_collected_tonnes: 124.5,
      ward_breakdown: [
        { ward: 'Ward 12', total: 45, resolved: 38, pending: 7 },
        { ward: 'Ward 8', total: 32, resolved: 25, pending: 7 },
        { ward: 'Ward 4', total: 28, resolved: 22, pending: 6 },
        { ward: 'Ward 10', total: 20, resolved: 14, pending: 6 },
      ],
      monthly_trends: [
        { month: 'May', complaints: 30, resolved: 22 },
        { month: 'Jun', complaints: 38, resolved: 30 },
        { month: 'Jul', complaints: 45, resolved: 35 },
        { month: 'Aug', complaints: 42, resolved: 38 },
        { month: 'Sep', complaints: 50, resolved: 44 },
        { month: 'Oct', complaints: 28, resolved: 24 },
      ],
      top_waste_types: [
        { type: 'Mixed Waste', count: 45 },
        { type: 'Plastic Waste', count: 30 },
        { type: 'Garbage Overflow', count: 18 },
        { type: 'E-Waste', count: 7 },
      ],
      active_drivers: 4,
      total_drivers: 6,
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Notifications & Broadcasts
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAdminNotifications = async () => {
  try {
    const response = await api.get('/admin/notifications');
    return response.data;
  } catch (error) {
    console.warn('Error fetching notifications:', error.message);
    return [];
  }
};

export const sendAdminBroadcast = async (broadcastData) => {
  try {
    const response = await api.post('/admin/notifications/broadcast', broadcastData);
    return response.data;
  } catch (error) {
    console.error('Error sending broadcast:', error);
    throw error;
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const response = await api.patch(`/admin/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.warn('Error marking notification read:', error.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────────────────────────────────────

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.warn('Error fetching all users:', error.message);
    return [];
  }
};
