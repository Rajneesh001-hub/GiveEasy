import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import CampaignCard from '../components/CampaignCard';
import { ArrowRight, Heart, Globe, ShieldCheck } from 'lucide-react';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const data = await campaignService.getAllCampaigns({ verified: true, status: 'active' });
            setCampaigns(data.slice(0, 3)); // Show top 3
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <div className="relative w-full h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt="Volunteers planting"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Empower Change.<br />
                            Fund the Future.
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/campaigns"
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg transition-colors inline-block text-center"
                            >
                                Donate Now
                            </Link>
                            <Link
                                to="/create-campaign"
                                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3.5 rounded-lg font-bold text-lg transition-colors inline-block text-center"
                            >
                                Start a Campaign
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="py-8 text-center px-4">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">50M+</div>
                            <div className="text-gray-500 font-medium">Raised</div>
                        </div>
                        <div className="py-8 text-center px-4">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">10,000+</div>
                            <div className="text-gray-500 font-medium">Campaigns</div>
                        </div>
                        <div className="py-8 text-center px-4">
                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">2M+</div>
                            <div className="text-gray-500 font-medium">Donors</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Urgent Causes Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900">Urgent Causes Needing Your Help</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))}
                        </div>
                    )}

                    <div className="mt-16 text-center">
                        <Link
                            to="/campaigns"
                            className="text-green-600 font-semibold hover:text-green-700 text-lg hover:underline"
                        >
                            View all causes
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
