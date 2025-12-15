import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import CampaignCard from '../components/CampaignCard';
import { TrendingUp, Users, Target, Heart } from 'lucide-react';

const Home = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const data = await campaignService.getAllCampaigns({ verified: true, status: 'active' });
            setCampaigns(data.slice(0, 6)); // Show only 6 featured campaigns
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/20 via-white to-primary/10 py-20">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Make a Difference,{' '}
                            <span className="text-primary-800">One Donation at a Time</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Support verified NGOs and social causes. Track your impact. Create lasting change.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/campaigns" className="btn-primary text-lg px-8 py-3">
                                Browse Campaigns
                            </Link>
                            <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Heart, label: 'Active Campaigns', value: '150+' },
                            { icon: Users, label: 'Total Donors', value: '10,000+' },
                            { icon: Target, label: 'Funds Raised', value: '₹50L+' },
                            { icon: TrendingUp, label: 'Success Rate', value: '95%' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary-800" />
                                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-16 bg-gray-50">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
                        <p className="text-lg text-gray-600">
                            Support these verified causes and make an impact today
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {campaigns.map((campaign) => (
                                    <CampaignCard key={campaign._id} campaign={campaign} />
                                ))}
                            </div>

                            <div className="text-center">
                                <Link to="/campaigns" className="btn-primary text-lg px-8 py-3">
                                    View All Campaigns
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary/20 to-primary/10">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Join thousands of donors supporting verified causes and creating lasting impact
                        </p>
                        <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
                            Join GiveEasy Today
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
