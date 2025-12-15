import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import DonationModal from '../components/DonationModal';
import { BadgeCheck, Calendar, TrendingUp, Heart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CampaignDetails = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDonationModal, setShowDonationModal] = useState(false);

    useEffect(() => {
        fetchCampaignDetails();
        fetchDonations();
    }, [id]);

    const fetchCampaignDetails = async () => {
        try {
            const data = await campaignService.getCampaignById(id);
            setCampaign(data);
        } catch (error) {
            console.error('Error fetching campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonations = async () => {
        try {
            const data = await donationService.getCampaignDonations(id);
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const handleDonationSuccess = () => {
        fetchCampaignDetails();
        fetchDonations();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600">Campaign not found</p>
            </div>
        );
    }

    const progressPercentage = campaign.progressPercentage || 0;

    return (
        <div className="min-h-screen py-12">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Campaign Image */}
                        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
                            <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="w-full h-96 object-cover"
                            />
                            {campaign.verified && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full flex items-center space-x-2 font-medium">
                                    <BadgeCheck className="w-5 h-5" />
                                    <span>Verified Campaign</span>
                                </div>
                            )}
                        </div>

                        {/* Campaign Info */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                            <div className="mb-6">
                                <p className="text-primary-700 font-semibold mb-2 text-lg">{campaign.ngo}</p>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="capitalize">{campaign.category?.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Campaign</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {campaign.description}
                                </p>
                            </div>
                        </div>

                        {/* Recent Donations */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Recent Donations
                            </h2>
                            {donations.length > 0 ? (
                                <div className="space-y-3">
                                    {donations.map((donation) => (
                                        <div
                                            key={donation._id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">{donation.user?.name || 'Anonymous'}</p>
                                                {donation.message && (
                                                    <p className="text-sm text-gray-600 mt-1">"{donation.message}"</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-primary-800">
                                                    ₹{donation.amount.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(donation.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No donations yet. Be the first to donate!</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                                {/* Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <p className="text-3xl font-bold text-gray-900">
                                            ₹{campaign.currentAmount?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            of ₹{campaign.goalAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all"
                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">{progressPercentage}% funded</p>
                                </div>

                                {/* Donate Button */}
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => setShowDonationModal(true)}
                                        className="w-full btn-primary text-lg py-3 flex items-center justify-center space-x-2"
                                    >
                                        <Heart className="w-5 h-5" />
                                        <span>Donate Now</span>
                                    </button>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-3">Login to donate</p>
                                        <a href="/login" className="btn-primary block text-center">
                                            Login / Sign Up
                                        </a>
                                    </div>
                                )}

                                {/* Campaign Stats */}
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Donors</span>
                                        <span className="font-semibold text-gray-900">{donations.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Status</span>
                                        <span className="font-semibold text-green-600 capitalize">
                                            {campaign.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Modal */}
            {showDonationModal && (
                <DonationModal
                    campaign={campaign}
                    isOpen={showDonationModal}
                    onClose={() => setShowDonationModal(false)}
                    onSuccess={handleDonationSuccess}
                />
            )}
        </div>
    );
};

export default CampaignDetails;
