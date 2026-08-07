import api from './api';

export const fetchDriverTasks = async () => {
  try {
    const response = await api.get('/driver/tasks');
    return response.data;
  } catch (error) {
    console.warn('Error fetching driver tasks from API:', error.message);
    return [
      { id: 1, name: '1. Green Park, Plot No. 45', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { id: 2, name: '2. Sai Nagar, Main Road', status: 'In Progress', statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { id: 3, name: '3. Shanti Apartment', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800 border-amber-200' },
      { id: 4, name: '4. Market Area, Gate No. 2', status: 'Pending', statusColor: 'bg-amber-100 text-amber-800 border-amber-200' }
    ];
  }
};

export const updateDriverTaskStatus = async (taskId, status, proofImageUrl = null) => {
  try {
    const response = await api.patch(`/driver/tasks/${taskId}/status`, {
      status,
      proof_image_url: proofImageUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error updating driver task status:', error);
    return { id: taskId, status };
  }
};
