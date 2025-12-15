import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { donationService } from '../services/donationService';
import { campaignService } from '../services/campaignService';
import { Heart, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState({ totalDonations: 0, totalAmount: 0 });
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [donationsData, statsData, campaignsData] = await Promise.all([
                donationService.getUserDonations(),
                donationService.getDonationStats(),
                campaignService.getAllCampaigns(),
            ]);

            setDonations(donationsData);
            setStats(statsData);

            // Filter campaigns created by user
            const myCampaigns = campaignsData.filter(
                (c) => c.createdBy?._id === user._id
            );
            setUserCampaigns(myCampaigns);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-lg text-gray-600">Here's your impact summary</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Heart className="w-8 h-8 text-primary-800" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            ₹{stats.totalAmount?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-700">Total Donated</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-green-700" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {stats.totalDonations || 0}
                        </p>
                        <p className="text-gray-700">Campaigns Supported</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-blue-700" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {userCampaigns.length}
                        </p>
                        <p className="text-gray-700">My Campaigns</p>
                    </div>
                </div>

                {/* My Campaigns */}
                {userCampaigns.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">My Campaigns</h2>
                            <Link to="/campaigns/create" className="btn-primary flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>Create Campaign</span>
                            </Link>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Campaign
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Progress
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {userCampaigns.map((campaign) => (
                                            <tr key={campaign._id}>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/campaigns/${campaign._id}`}
                                                        className="font-medium text-gray-900 hover:text-primary-800"
                                                    >
                                                        {campaign.title}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-32">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span>₹{campaign.currentAmount?.toLocaleString()}</span>
                                                            <span>₹{campaign.goalAmount?.toLocaleString()}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-primary h-full rounded-full"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (campaign.currentAmount / campaign.goalAmount) * 100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${campaign.verified
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {campaign.verified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Donation History */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation History</h2>
                    {donations.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Campaign
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Transaction ID
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {donations.map((donation) => (
                                            <tr key={donation._id}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={donation.campaign?.image}
                                                            alt={donation.campaign?.title}
                                                            className="w-10 h-10 rounded-lg object-cover mr-3"
                                                        />
                                                        <div>
                                                            <Link
                                                                to={`/campaigns/${donation.campaign?._id}`}
                                                                className="font-medium text-gray-900 hover:text-primary-800"
                                                            >
                                                                {donation.campaign?.title}
                                                            </Link>
                                                            <p className="text-sm text-gray-600">{donation.campaign?.ngo}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-primary-800">
                                                        ₹{donation.amount?.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(donation.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                                    {donation.transactionId}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-600 mb-4">You haven't made any donations yet</p>
                            <Link to="/campaigns" className="btn-primary inline-block">
                                Browse Campaigns
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
