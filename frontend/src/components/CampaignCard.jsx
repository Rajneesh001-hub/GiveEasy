import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
    const progressPercentage = campaign.progressPercentage ||
        Math.round((campaign.currentAmount / campaign.goalAmount) * 100);

    return (
        <div className="card overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {campaign.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
                        <BadgeCheck className="w-3 h-3" />
                        <span>Verified</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* NGO Name */}
                <p className="text-sm text-primary-700 font-medium mb-2">{campaign.ngo}</p>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {campaign.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Raised</span>
                        <span className="font-semibold text-gray-900">
                            ₹{campaign.currentAmount?.toLocaleString()} / ₹{campaign.goalAmount?.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progressPercentage}% funded</p>
                </div>

                {/* Donate Button */}
                <Link
                    to={`/campaigns/${campaign._id}`}
                    className="block w-full text-center btn-primary"
                >
                    Donate Now
                </Link>
            </div>
        </div>
    );
};

export default CampaignCard;
