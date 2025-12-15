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
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Minimal Hero */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Trusted by 10,000+ donors
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
                        Giving made <span className="text-green-600">simple</span> <br className="hidden md:block" /> and impactful.
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Connect with verified causes and track your donations in real-time.
                        The easiest way to make a difference today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/campaigns" className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all flex items-center gap-2 text-lg shadow-lg shadow-green-200">
                            Explore Causes <ArrowRight size={20} />
                        </Link>
                        <Link to="/register" className="text-gray-600 font-medium px-8 py-4 hover:text-green-600 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Simple Stats/Trust */}
            <section className="py-12 border-y border-gray-100 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        <div className="p-4">
                            <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                            <div className="text-gray-500 font-medium">Verified NGOs</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-gray-900 mb-2">₹50L+</div>
                            <div className="text-gray-500 font-medium">Funds Raised</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-gray-900 mb-2">Zero</div>
                            <div className="text-gray-500 font-medium">Platform Fees</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Campaigns</h2>
                            <p className="text-gray-500">Urgent causes needing your help right now.</p>
                        </div>
                        <Link to="/campaigns" className="hidden md:flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors">
                            View all <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))}
                        </div>
                    )}
                    <div className="mt-12 text-center md:hidden">
                        <Link to="/campaigns" className="btn-secondary">View all campaigns</Link>
                    </div>
                </div>
            </section>

            {/* Simple Value Props */}
            <section className="py-24 bg-gray-900 text-white rounded-t-3xl mx-4 lg:mx-8 mb-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why GiveEasy?</h2>
                        <p className="text-gray-400">Transparency and trust at the core of every donation.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-white/10 p-4 rounded-2xl mb-6">
                                <ShieldCheck size={32} className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">100% Verified</h3>
                            <p className="text-gray-400">Every NGO is manually vetted to ensure your money goes to the right place.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white/10 p-4 rounded-2xl mb-6">
                                <Globe size={32} className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
                            <p className="text-gray-400">Support causes from across the nation, from local shelters to national relief funds.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-white/10 p-4 rounded-2xl mb-6">
                                <Heart size={32} className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Transparent</h3>
                            <p className="text-gray-400">Get regular updates and see exactly how your donation is making a difference.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
