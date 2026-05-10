import api from './api';

export const serviceController = {
  getSalonServices: async (salonId) => {
    try {
      const response = await api.get(`/services/salon/${salonId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
