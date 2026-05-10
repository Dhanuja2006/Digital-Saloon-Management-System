import api from './api';

export const salonController = {
  getAllSalons: async (params = {}) => {
    try {
      const response = await api.get('/salons', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSalonById: async (id) => {
    try {
      const response = await api.get(`/salons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSalon: async (salonData) => {
    try {
      const response = await api.post('/salons', salonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMySalons: async () => {
    try {
      const response = await api.get('/salons/my-salons');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPendingSalons: async () => {
    try {
      const response = await api.get('/salons/admin/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSalonStatus: async (id, status) => {
    try {
      const response = await api.patch(`/salons/admin/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSalon: async (id, salonData) => {
    try {
      const response = await api.patch(`/salons/${id}`, salonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSalon: async (id) => {
    try {
      const response = await api.delete(`/salons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  uploadSalonImages: async (id, formData) => {
    try {
      const response = await api.post(`/salons/${id}/images`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeSalonImage: async (id, imagePath) => {
    try {
      const response = await api.delete(`/salons/${id}/images`, { data: { imagePath } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSalonAnalytics: async (id) => {
    try {
      const response = await api.get(`/salons/${id}/analytics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
