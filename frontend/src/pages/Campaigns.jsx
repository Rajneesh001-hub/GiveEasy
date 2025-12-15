import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import CampaignCard from '../components/CampaignCard';
import { Filter, Plus } from 'lucide-react';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        verified: 'true',
    });

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'education', label: 'Education' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'environment', label: 'Environment' },
        { value: 'poverty', label: 'Poverty' },
        { value: 'disaster-relief', label: 'Disaster Relief' },
        { value: 'other', label: 'Other' },
    ];

    useEffect(() => {
        fetchCampaigns();
    }, [filters]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const params = {
                ...(filters.category && { category: filters.category }),
                verified: filters.verified,
                status: 'active',
            };
            const data = await campaignService.getAllCampaigns(params);
            setCampaigns(data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Campaigns</h1>
                        <p className="text-lg text-gray-600">
                            Browse and support verified NGO campaigns making a real difference
                        </p>
                    </div>
                    <Link
                        to="/campaigns/create"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Start Fundraising
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="input-field"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Verified Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Status
                            </label>
                            <select
                                value={filters.verified}
                                onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
                                className="input-field"
                            >
                                <option value="">All Campaigns</option>
                                <option value="true">Verified Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Campaigns Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <CampaignCard key={campaign._id} campaign={campaign} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No campaigns found matching your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Campaigns;
