import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateCampaign = () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ngo: '',
        upiId: '',
        goalAmount: '',
        image: '',
        category: 'education',
    });

    const categories = [
        { value: 'education', label: 'Education' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'environment', label: 'Environment' },
        { value: 'poverty', label: 'Poverty Alleviation' },
        { value: 'disaster-relief', label: 'Disaster Relief' },
        { value: 'other', label: 'Other' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/api/campaigns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    goalAmount: Number(formData.goalAmount),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create campaign');
            }

            // Redirect to campaigns page or the new campaign details
            navigate('/campaigns');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Please log in to create a campaign</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Create New Campaign
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Start a fundraising campaign to make a difference
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Campaign Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Give your campaign a clear, compelling title"
                                    className="input-field"
                                />
                            </div>

                            {/* NGO Name */}
                            <div>
                                <label htmlFor="ngo" className="block text-sm font-medium text-gray-700 mb-2">
                                    NGO/Organization Name *
                                </label>
                                <input
                                    type="text"
                                    id="ngo"
                                    name="ngo"
                                    value={formData.ngo}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter the NGO or organization name"
                                    className="input-field"
                                />
                            </div>

                            {/* UPI ID */}
                            <div>
                                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                                    UPI ID *
                                </label>
                                <input
                                    type="text"
                                    id="upiId"
                                    name="upiId"
                                    value={formData.upiId}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. username@upi"
                                    pattern="[\w.-]+@[\w.-]+"
                                    title="Please enter a valid UPI ID (e.g. username@upi)"
                                    className="input-field"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    This will be used to generate the donation QR code
                                </p>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Goal Amount */}
                            <div>
                                <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fundraising Goal (₹) *
                                </label>
                                <input
                                    type="number"
                                    id="goalAmount"
                                    name="goalAmount"
                                    value={formData.goalAmount}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    step="1"
                                    placeholder="Enter target amount"
                                    className="input-field"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Image URL
                                </label>
                                <input
                                    type="url"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg (optional)"
                                    className="input-field"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave blank to use a default placeholder image
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Campaign Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Describe your campaign, what it aims to achieve, and why people should support it..."
                                    className="input-field resize-none"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Campaign...' : 'Create Campaign'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/campaigns')}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 text-center pt-2">
                                * Your campaign will be pending until verified by an admin
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
