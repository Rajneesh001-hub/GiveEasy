const Campaign = require('../models/Campaign');

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
exports.getCampaigns = async (req, res) => {
    try {
        const { verified, category, status } = req.query;

        const filter = {};
        if (verified !== undefined) filter.verified = verified === 'true';
        if (category) filter.category = category;
        if (status) filter.status = status;

        const campaigns = await Campaign.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
exports.getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res) => {
    try {
        const { title, description, ngo, upiId, goalAmount, image, category } = req.body;

        const campaign = await Campaign.create({
            title,
            description,
            ngo,
            upiId,
            goalAmount,
            image,
            category,
            createdBy: req.user._id,
        });

        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check if user is owner or admin
        if (campaign.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this campaign' });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedCampaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check if user is owner or admin
        if (campaign.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this campaign' });
        }

        await campaign.deleteOne();
        res.json({ message: 'Campaign removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify campaign (Admin only)
// @route   PATCH /api/campaigns/:id/verify
// @access  Private/Admin
exports.verifyCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        campaign.verified = true;
        campaign.status = 'active';
        await campaign.save();

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
