import api from './api';

export const slotController = {
  getSlots: async (params) => {
    try {
      const response = await api.get('/slots', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateSlots: async (data) => {
    try {
      const response = await api.post('/slots/generate', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
