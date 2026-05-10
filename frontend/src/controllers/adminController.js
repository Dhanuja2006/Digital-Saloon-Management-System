import api from './api';

export const adminController = {
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  updateUserStatus: async (id, isBlocked) => {
    try {
      const response = await api.patch(`/admin/users/${id}/status`, { isBlocked });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  approveSalonOwner: async (id, adminCode) => {
    try {
      const response = await api.patch(`/admin/salons/${id}/status`, { status: 'Active', adminCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
