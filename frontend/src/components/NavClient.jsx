import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Scale, 
    Bot, 
    AlertTriangle, 
    Users, 
    MessageCircle,
    Bell, 
    ChevronDown, 
    User,
    LogOut,
    Settings,
    Shield
} from 'lucide-react';
import { useAuthStatus } from '../hooks/useAuthQuery.js';
import { useLogout } from '../hooks/useAuthQuery.js';

const NavClient = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data: authData } = useAuthStatus();
    const logoutMutation = useLogout();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const user = authData?.user;

    const navItems = [
        {
            name: 'Dashboard',
            path: '/client/dashboard',
            icon: Scale,
            description: 'Your Dashboard'
        },
        {
            name: 'JusticeAI',
            path: '/client/ai-chat',
            icon: Bot,
            description: 'AI Legal Assistant'
        },
        {
            name: 'Report Incident',
            path: '/client/report-incident',
            icon: AlertTriangle,
            description: 'Report Legal Issues'
        },
        {
            name: 'Find Advocates',
            path: '/client/advocates',
            icon: Users,
            description: 'Connect with Lawyers'
        },
        {
            name: 'My Advocates',
            path: '/client/my-advocates',
            icon: MessageCircle,
            description: 'Chat with Connected Lawyers'
        }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-white/5 backdrop-blur-md border-b border-white/15 shadow-xl sticky top-0 z-50">

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/client/dashboard" className="flex items-center space-x-2">
                        <div className="w-[3.25rem] h-9 rounded-lg overflow-hidden bg-white/10 border border-white/15 shadow-sm">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src="/NyayPreloadAnimation.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <span className="text-xl font-bold text-white">
                            <span className="text-indigo-300">न्याय</span>Sahay
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                        active
                                            ? 'bg-white/10 text-white border border-white/20'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className={`h-4 w-4 ${active ? 'text-indigo-300' : 'text-gray-400'}`} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white/5 backdrop-blur-md rounded-lg shadow-xl border border-white/15 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-white/10">
                                        <h3 className="font-semibold text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-white/5 cursor-pointer">
                                            <p className="text-sm font-medium text-white">New advocate response</p>
                                            <p className="text-xs text-gray-400">Your consultation request was accepted</p>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-white/5 cursor-pointer">
                                            <p className="text-sm font-medium text-white">Incident report update</p>
                                            <p className="text-xs text-gray-400">Your report INC-123456 is under review</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-full flex items-center justify-center">
                                    {user?.profilePicture ? (
                                        <img 
                                            src={user.profilePicture} 
                                            alt={user.fullName}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-4 w-4 text-indigo-300" />
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-white">{user?.fullName}</p>
                                    <p className="text-xs text-gray-400">Legal Advisor</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white/5 backdrop-blur-md rounded-lg shadow-xl border border-white/15 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-white/10">
                                        <p className="font-semibold text-white">{user?.fullName}</p>
                                        <p className="text-sm text-gray-400">{user?.email}</p>
                                    </div>
                                    
                                    <Link
                                        to="/client/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-white/5"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    
                                    <Link
                                        to="/client/dashboard"
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-white/5"
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>My Incidents</span>
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-200 py-2">
                    <div className="flex justify-around">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                                        active
                                            ? 'text-indigo-600'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {(showProfileMenu || showNotifications) && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => {
                        setShowProfileMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}
        </nav>
    );
};

export default NavClient;