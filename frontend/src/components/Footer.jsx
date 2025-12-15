import { Link } from 'react-router-dom';
import { Heart, Mail, Github, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                                <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">GiveEasy</span>
                        </div>
                        <p className="text-gray-600 max-w-md">
                            Making donations simple, transparent, and impactful. Join us in supporting NGOs and
                            social causes that matter.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/campaigns"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Campaigns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                        <div className="flex items-center space-x-2 text-gray-600 mb-3">
                            <Mail className="w-4 h-4" />
                            <span>support@giveeasy.com</span>
                        </div>
                        <div className="flex space-x-3 mt-4">
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-primary transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-primary transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} GiveEasy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
