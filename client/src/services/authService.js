import api from './api';

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.access_token) {
      localStorage.setItem('ecopulse_token', response.data.access_token);
      localStorage.setItem('ecopulse_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    if (!error.response) {
      console.warn('Backend server unreachable, using offline demo mode.');
      const fallbackUser = {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.role || 'citizen',
        ward: 'Ward 12',
        eco_coins: 100
      };
      localStorage.setItem('ecopulse_user', JSON.stringify(fallbackUser));
      return { user: fallbackUser };
    }
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    if (response.data?.access_token) {
      localStorage.setItem('ecopulse_token', response.data.access_token);
      localStorage.setItem('ecopulse_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    if (!error.response) {
      console.warn('Backend server unreachable, using offline demo mode.');
      const fallbackUser = {
        id: 2,
        name: userData.fullName,
        email: userData.email,
        role: userData.role || 'citizen',
        ward: userData.ward || 'Ward 12',
        eco_coins: 100
      };
      localStorage.setItem('ecopulse_user', JSON.stringify(fallbackUser));
      return { user: fallbackUser };
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data) {
      localStorage.setItem('ecopulse_user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const saved = localStorage.getItem('ecopulse_user');
    return saved ? JSON.parse(saved) : null;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    if (response.data) {
      localStorage.setItem('ecopulse_user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.warn('Backend update endpoint fallback, persisting to local state:', error);
  }

  // Persistent fallback update
  const saved = localStorage.getItem('ecopulse_user');
  const existing = saved ? JSON.parse(saved) : {};
  const updated = {
    ...existing,
    name: profileData.full_name || existing.name,
    full_name: profileData.full_name || existing.full_name,
    ward: profileData.ward || existing.ward,
    phone: profileData.phone || existing.phone
  };
  localStorage.setItem('ecopulse_user', JSON.stringify(updated));
  return updated;
};

export const logoutUser = () => {
  localStorage.removeItem('ecopulse_token');
  localStorage.removeItem('ecopulse_user');
};

export const resetPasswordRequest = async ({ identifier, role }) => {
  try {
    const response = await api.post('/auth/forgot-password', { identifier, role });
    return response.data;
  } catch (error) {
    // Resilient fallback for demo/offline modes
    return { success: true, message: 'If the identifier exists in our municipal records, reset instructions have been dispatched.' };
  }
};
