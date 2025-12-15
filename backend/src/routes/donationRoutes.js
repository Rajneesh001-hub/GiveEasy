const express = require('express');
const router = express.Router();
const {
    createDonation,
    getUserDonations,
    getCampaignDonations,
    getDonationStats,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createDonation);
router.get('/user', protect, getUserDonations);
router.get('/stats', protect, getDonationStats);
router.get('/campaign/:id', getCampaignDonations);

module.exports = router;
