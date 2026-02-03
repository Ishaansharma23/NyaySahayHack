/**
 * Dashboard Stats Component
 * Displays key metrics for both client and advocate dashboards
 */
import { 
    FileText, 
    Users, 
    MessageCircle, 
    Clock, 
    CheckCircle, 
    AlertTriangle,
    TrendingUp,
    Calendar,
    DollarSign,
    Briefcase
} from 'lucide-react';
import { StatCard } from '../ui/Card';
import { SkeletonStatCard } from '../ui/Skeleton';
import { useCaseStats } from '../../hooks/useCaseQuery';
import { useEarnings } from '../../hooks/usePaymentQuery';

const DashboardStats = ({ userRole = 'client' }) => {
    const { data: caseStats, isLoading } = useCaseStats();
    const { data: earningsData } = useEarnings(userRole === 'advocate');

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonStatCard key={i} />
                ))}
            </div>
        );
    }

    const stats = caseStats?.stats || {
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0
    };

    const clientStats = [
        {
            title: 'Total Cases',
            value: stats.total,
            icon: <FileText className="h-6 w-6 text-indigo-600" />,
            change: 'Active legal matters',
            changeType: 'neutral'
        },
        {
            title: 'Pending Cases',
            value: stats.pending,
            icon: <Clock className="h-6 w-6 text-amber-600" />,
            change: 'Awaiting response',
            changeType: 'warning'
        },
        {
            title: 'In Progress',
            value: stats.in_progress || 0,
            icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
            change: 'Being handled',
            changeType: 'neutral'
        },
        {
            title: 'Resolved',
            value: stats.resolved,
            icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
            change: 'Successfully closed',
            changeType: 'positive'
        }
    ];

    const advocateStats = [
        {
            title: 'Active Cases',
            value: stats.in_progress || 0,
            icon: <Briefcase className="h-6 w-6 text-indigo-600" />,
            change: 'Currently handling',
            changeType: 'neutral'
        },
        {
            title: 'Pending Requests',
            value: stats.pending,
            icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
            change: 'Need attention',
            changeType: 'warning'
        },
        {
            title: 'Completed',
            value: stats.resolved + (stats.closed || 0),
            icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
            change: 'This month',
            changeType: 'positive'
        },
        {
            title: 'Total Earnings',
            value: `₹${earningsData?.totalEarnings || 0}`,
            icon: <DollarSign className="h-6 w-6 text-green-600" />,
            change: 'This month',
            changeType: 'positive'
        }
    ];

    const displayStats = userRole === 'client' ? clientStats : advocateStats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {displayStats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    change={stat.change}
                    changeType={stat.changeType}
                    variant="light"
                    className="transition-transform hover:-translate-y-0.5"
                />
            ))}
        </div>
    );
};

export default DashboardStats;
