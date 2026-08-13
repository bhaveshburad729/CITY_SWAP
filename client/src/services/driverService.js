import api from './api';

export const fetchDriverTasks = async () => {
  try {
    const response = await api.get('/driver/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching driver tasks:', error);
    throw error;
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
    throw error;
  }
};

export const fetchPerformanceData = async () => {
  try {
    const response = await api.get('/driver/performance');
    return response.data;
  } catch (error) {
    console.error('Error fetching driver performance data:', error);
    throw error;
  }
};

export const fetchFuelLogs = async () => {
  try {
    const response = await api.get('/driver/fuel-logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching driver fuel logs:', error);
    throw error;
  }
};

export const addFuelEntry = async (odometer, liters, cost) => {
  try {
    const response = await api.post('/driver/fuel-logs', {
      odometer: parseInt(odometer),
      liters: parseFloat(liters),
      cost: parseFloat(cost)
    });
    return response.data;
  } catch (error) {
    console.error('Error saving fuel entry:', error);
    throw error;
  }
};

export const fetchMessages = async () => {
  try {
    const response = await api.get('/driver/messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages overview:', error);
    throw error;
  }
};

export const sendMessage = async (body) => {
  try {
    const response = await api.post('/driver/messages', {
      body
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

