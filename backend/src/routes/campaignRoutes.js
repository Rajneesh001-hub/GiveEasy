const express = require('express');
const router = express.Router();
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    verifyCampaign,
} = require('../controllers/campaignController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(getCampaigns)
    .post(protect, createCampaign);

router.route('/:id')
    .get(getCampaign)
    .put(protect, updateCampaign)
    .delete(protect, deleteCampaign);

router.patch('/:id/verify', protect, admin, verifyCampaign);

module.exports = router;
