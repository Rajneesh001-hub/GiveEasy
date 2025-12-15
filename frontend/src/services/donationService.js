import api from './api';

export const donationService = {
    createDonation: async (donationData) => {
        const response = await api.post('/api/donations', donationData);
        return response.data;
    },

    getUserDonations: async () => {
        const response = await api.get('/api/donations/user');
        return response.data;
    },

    getCampaignDonations: async (campaignId) => {
        const response = await api.get(`/api/donations/campaign/${campaignId}`);
        return response.data;
    },

    getDonationStats: async () => {
        const response = await api.get('/api/donations/stats');
        return response.data;
    },
};
