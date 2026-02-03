/**
 * Recent Activity Component
 * Shows recent case updates and activities
 */
import { 
    Clock, 
    FileText, 
    User, 
    MessageCircle,
    CheckCircle,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { useCaseStats } from '../../hooks/useCaseQuery';
import { Link } from 'react-router-dom';

const RecentActivity = ({ userRole = 'client' }) => {
    const { data: statsData, isLoading } = useCaseStats();
    const recentCases = statsData?.recentCases || [];

    const getActivityIcon = (status) => {
        switch (status) {
            case 'resolved':
            case 'accepted':
                return <CheckCircle className="h-4 w-4 text-emerald-400" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-amber-400" />;
            case 'rejected':
                return <AlertCircle className="h-4 w-4 text-red-400" />;
            default:
                return <FileText className="h-4 w-4 text-blue-400" />;
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const then = new Date(date);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return then.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <Card variant="light">
                <CardHeader className="border-gray-200">
                    <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="light">
            <CardHeader className="flex flex-row items-center justify-between border-gray-200">
                <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                <Link 
                    to={userRole === 'client' ? '/client/cases' : '/advocate/cases'}
                    className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1 transition-colors"
                >
                    View all <ChevronRight className="h-4 w-4" />
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                {recentCases.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentCases.map((caseItem) => (
                            <div 
                                key={caseItem._id}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-50 border border-gray-200 rounded-xl">
                                        {getActivityIcon(caseItem.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {caseItem.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {caseItem.caseNumber}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <StatusBadge status={caseItem.status} />
                                        <span className="text-xs text-gray-500">
                                            {formatTime(caseItem.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentActivity;
