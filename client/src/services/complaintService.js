import api from './api';

export const fetchMyComplaints = async () => {
  try {
    const response = await api.get('/complaints/my');
    return response.data;
  } catch (error) {
    console.warn('Using fallback complaints list:', error.message);
    return [
      {
        id: 'EP-2026-00123',
        location: 'Green Park, Ward 12',
        type: 'Mixed Waste',
        status: 'In Progress',
        time: '10:15 AM',
        statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      },
      {
        id: 'EP-2026-00122',
        location: 'Sai Nagar, Ward 8',
        type: 'Garbage Overflow',
        status: 'Pending',
        time: '09:30 AM',
        statusColor: 'bg-amber-100 text-amber-800 border-amber-200'
      },
      {
        id: 'EP-2026-00121',
        location: 'Market Area, Ward 4',
        type: 'Plastic Waste',
        status: 'Resolved',
        time: 'Yesterday',
        statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      }
    ];
  }
};

export const createComplaint = async (complaintData) => {
  try {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  } catch (error) {
    console.error('Error creating complaint:', error);
    return {
      id: `EP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      location: complaintData.location,
      type: complaintData.type,
      status: 'In Progress',
      time: 'Just now',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
  }
};
