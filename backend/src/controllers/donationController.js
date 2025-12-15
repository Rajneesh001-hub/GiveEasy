const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
    try {
        const { campaign, amount, message } = req.body;

        // Check if campaign exists
        const campaignDoc = await Campaign.findById(campaign);
        if (!campaignDoc) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Create donation
        const donation = await Donation.create({
            user: req.user._id,
            campaign,
            amount,
            message,
        });

        // Update campaign current amount
        campaignDoc.currentAmount += amount;
        await campaignDoc.save();

        // Populate donation details
        await donation.populate('user', 'name email');
        await donation.populate('campaign', 'title ngo');

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's donations
// @route   GET /api/donations/user
// @access  Private
exports.getUserDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ user: req.user._id })
            .populate('campaign', 'title ngo image')
            .sort({ createdAt: -1 });

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get campaign donations
// @route   GET /api/donations/campaign/:id
// @access  Public
exports.getCampaignDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            campaign: req.params.id,
            status: 'completed'
        })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private
exports.getDonationStats = async (req, res) => {
    try {
        const totalDonations = await Donation.countDocuments({ user: req.user._id });
        const totalAmount = await Donation.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            totalDonations,
            totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Private
exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('campaign', 'title ngo')
            .populate('user', 'name email');

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Ensure user owns the donation or is admin
        if (donation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
