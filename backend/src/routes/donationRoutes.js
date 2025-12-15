const express = require('express');
const router = express.Router();
const {
    createDonation,
    getUserDonations,
    getCampaignDonations,
    getDonationStats,
    getDonationById,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createDonation);
router.get('/user', protect, getUserDonations);
router.get('/stats', protect, getDonationStats);
router.get('/campaign/:id', getCampaignDonations);
router.get('/:id', protect, getDonationById);

module.exports = router;
