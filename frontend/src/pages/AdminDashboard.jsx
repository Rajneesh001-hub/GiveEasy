import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { campaignService } from '../services/campaignService';
import { Shield, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, verified

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            // Fetch all campaigns without filters to see everything as admin
            const data = await campaignService.getAllCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        if (!window.confirm('Are you sure you want to verify this campaign?')) return;
        try {
            await campaignService.verifyCampaign(id);
            // Update local state
            setCampaigns(campaigns.map(c =>
                c._id === id ? { ...c, verified: true, status: 'active' } : c
            ));
        } catch (error) {
            console.error('Error verifying campaign:', error);
            alert('Failed to verify campaign');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;
        try {
            await campaignService.deleteCampaign(id);
            setCampaigns(campaigns.filter(c => c._id !== id));
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert('Failed to delete campaign');
        }
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !campaign.verified;
        if (filter === 'verified') return campaign.verified;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="container">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-8 h-8 text-primary-800" />
                            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                        </div>
                        <p className="text-gray-600">Manage campaigns and platform content</p>
                    </div>

                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-primary text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('verified')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'verified' ? 'bg-primary text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Verified
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-500 font-medium">Total Campaigns</h3>
                            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Shield className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-500 font-medium">Pending Review</h3>
                            <span className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                <AlertCircle className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {campaigns.filter(c => !c.verified).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-500 font-medium">Verified Active</h3>
                            <span className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {campaigns.filter(c => c.verified).length}
                        </p>
                    </div>
                </div>

                {/* Campaigns List */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCampaigns.length > 0 ? (
                                    filteredCampaigns.map((campaign) => (
                                        <tr key={campaign._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={campaign.image}
                                                        alt=""
                                                        className="w-10 h-10 rounded-lg object-cover mr-3 bg-gray-100"
                                                    />
                                                    <div>
                                                        <Link
                                                            to={`/campaigns/${campaign._id}`}
                                                            className="font-medium text-gray-900 hover:text-primary-800"
                                                        >
                                                            {campaign.title}
                                                        </Link>
                                                        <p className="text-xs text-gray-500">{campaign.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{campaign.createdBy?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{campaign.createdBy?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                ₹{campaign.goalAmount?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {campaign.verified ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Pending Review
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-3">
                                                    {!campaign.verified && (
                                                        <button
                                                            onClick={() => handleVerify(campaign._id)}
                                                            className="text-green-600 hover:text-green-900 font-medium text-xs bg-green-50 px-3 py-1.5 rounded-md hover:bg-green-100 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(campaign._id)}
                                                        className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Delete Campaign"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No campaigns found matching filter
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
