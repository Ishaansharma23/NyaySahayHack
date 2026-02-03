/**
 * Advocate Home Dashboard
 * Main dashboard view for advocates showing cases, clients, and earnings
 */
import { useAuthStatus } from '../../hooks/useAuthQuery';
import { DashboardStats, RecentActivity, QuickActions } from '../../components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { 
    Scale, 
    Shield, 
    TrendingUp,
    Users,
    FileText,
    DollarSign,
    Calendar,
    Star,
    Clock,
    CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvocateHome = () => {
    const { data: authData } = useAuthStatus();
    const user = authData?.user;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Mock data for pending requests (would come from API)
    const pendingRequests = [
        {
            id: 1,
            clientName: 'Rahul Sharma',
            caseType: 'Property Dispute',
            urgency: 'high',
            requestedAt: '2 hours ago'
        },
        {
            id: 2,
            clientName: 'Priya Gupta',
            caseType: 'Consumer Complaint',
            urgency: 'medium',
            requestedAt: '5 hours ago'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar 
                                src={user?.profilePicture} 
                                name={user?.fullName} 
                                size="lg" 
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {getGreeting()}, Adv. {user?.fullName?.split(' ')[0]}! ⚖️
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    {user?.specialization} Specialist • {user?.yearsOfPractice || 0}+ years experience
                                </p>
                            </div>
                        </div>
                        
                        {user?.barCouncilNumber && (
                            <Badge variant="success" className="hidden md:flex">
                                <Shield className="h-3 w-3 mr-1" />
                                Bar Council Verified
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <DashboardStats userRole="advocate" />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Pending Consultation Requests */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-amber-500" />
                                    Pending Consultation Requests
                                </CardTitle>
                                <Link 
                                    to="/advocate/consultation-requests"
                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    View all
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                {pendingRequests.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
                                        <p>No pending requests</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {pendingRequests.map((request) => (
                                            <div key={request.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar name={request.clientName} size="sm" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{request.clientName}</p>
                                                            <p className="text-sm text-gray-500">{request.caseType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <StatusBadge status={request.urgency} />
                                                        <span className="text-xs text-gray-400">{request.requestedAt}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <button className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                                                        Accept
                                                    </button>
                                                    <button className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <RecentActivity userRole="advocate" />

                        {/* Performance Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="text-center p-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900">95%</h4>
                                <p className="text-sm text-gray-500">Success Rate</p>
                            </Card>
                            
                            <Card className="text-center p-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="h-6 w-6 text-amber-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900">4.8</h4>
                                <p className="text-sm text-gray-500">Client Rating</p>
                            </Card>
                            
                            <Card className="text-center p-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900">&lt; 2h</h4>
                                <p className="text-sm text-gray-500">Avg Response</p>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="space-y-6">
                        <QuickActions userRole="advocate" />

                        {/* Earnings Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-emerald-500" />
                                    Earnings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">This Month</span>
                                        <span className="text-xl font-bold text-gray-900">₹0</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Pending</span>
                                        <span className="text-amber-600">₹0</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Last Month</span>
                                        <span className="text-gray-600">₹0</span>
                                    </div>
                                    <Link 
                                        to="/advocate/earnings"
                                        className="block text-center py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 mt-2"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Consultations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="h-5 w-5 text-indigo-500" />
                                    Today's Schedule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4 text-gray-500">
                                    <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No consultations scheduled</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvocateHome;
