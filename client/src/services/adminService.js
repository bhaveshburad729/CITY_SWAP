import api from './api';

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
      top_wards: [
        { name: 'Ward 12', percent: 92 },
        { name: 'Ward 8', percent: 85 },
        { name: 'Ward 4', percent: 76 },
        { name: 'Ward 10', percent: 66 }
      ]
    };
  }
};

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

export const downloadAdminExportCSV = async () => {
  try {
    const response = await api.get('/admin/export-csv', {
      responseType: 'blob'
    });
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
