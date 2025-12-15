import api from './api';

export const campaignService = {
    getAllCampaigns: async (params = {}) => {
        const response = await api.get('/api/campaigns', { params });
        return response.data;
    },

    getCampaignById: async (id) => {
        const response = await api.get(`/api/campaigns/${id}`);
        return response.data;
    },

    createCampaign: async (campaignData) => {
        const response = await api.post('/api/campaigns', campaignData);
        return response.data;
    },

    updateCampaign: async (id, campaignData) => {
        const response = await api.put(`/api/campaigns/${id}`, campaignData);
        return response.data;
    },

    deleteCampaign: async (id) => {
        const response = await api.delete(`/api/campaigns/${id}`);
        return response.data;
    },

    verifyCampaign: async (id) => {
        const response = await api.patch(`/api/campaigns/${id}/verify`);
        return response.data;
    },
};
