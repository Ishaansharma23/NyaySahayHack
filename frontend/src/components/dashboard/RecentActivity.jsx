/**
 * Recent Activity Component
 * Shows recent case updates and activities
 */
import { 
    Clock, 
    FileText, 
    CheckCircle,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { useCaseStats } from '../../hooks/useCaseQuery';
import { useMyIncidents } from '../../hooks/useIncidentQuery';
import { Link } from 'react-router-dom';

const RecentActivity = ({ userRole = 'client' }) => {
    const isClient = userRole === 'client';
    const { data: statsData, isLoading: isCasesLoading } = useCaseStats();
    const { data: incidentsData, isLoading: isIncidentsLoading } = useMyIncidents();
    const recentCases = statsData?.recentCases || [];
    const recentIncidents = incidentsData?.incidents || [];

    const getActivityIcon = (status) => {
        switch (status) {
            case 'resolved':
            case 'accepted':
                return <CheckCircle className="h-4 w-4 text-emerald-400" />;
            case 'pending':
                case 'pending':
                    return <Clock className="h-4 w-4 text-amber-400" />;
                case 'submitted':
                case 'under_review':
                case 'forwarded':
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

    if ((isClient && isIncidentsLoading) || (!isClient && isCasesLoading)) {
        return (
            <Card variant="default">
                <CardHeader className="border-white/10">
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const recentItems = isClient
        ? recentIncidents.map((incident) => ({
            _id: incident._id,
            title: incident.title,
            reference: incident.incidentNumber,
            status: incident.status,
            updatedAt: incident.createdAt
        }))
        : recentCases.map((caseItem) => ({
            _id: caseItem._id,
            title: caseItem.title,
            reference: caseItem.caseNumber,
            status: caseItem.status,
            updatedAt: caseItem.updatedAt
        }));

    return (
        <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between border-white/10">
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <Link 
                    to={userRole === 'client' ? '/client/incidents' : '/advocate/cases'}
                    className="text-sm text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition-colors"
                >
                    View all <ChevronRight className="h-4 w-4" />
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                {recentItems.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-400">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {recentItems.map((item) => (
                            <div 
                                key={item._id}
                                className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white/10 border border-white/10 rounded-xl">
                                        {getActivityIcon(item.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {item.reference}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <StatusBadge status={item.status} />
                                        <span className="text-xs text-gray-400">
                                            {formatTime(item.updatedAt)}
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
