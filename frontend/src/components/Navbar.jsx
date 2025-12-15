import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Home, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary group-hover:bg-primary-600 transition-colors">
                            <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">GiveEasy</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/campaigns"
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Explore Causes
                        </Link>
                        <Link
                            to="/campaigns/create"
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Start Fundraising
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="flex items-center space-x-1 text-primary-900 hover:text-primary-700 transition-colors font-medium"
                            >
                                <Shield className="w-4 h-4" />
                                <span>Admin</span>
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Start Fundraising
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
