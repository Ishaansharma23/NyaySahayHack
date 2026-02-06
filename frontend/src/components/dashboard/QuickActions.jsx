/**
 * Quick Actions Component
 * Provides quick access to common actions
 */
import { 
    MessageCircle, 
    FileText, 
    AlertTriangle, 
    Users, 
    Video,
    Bot,
    Plus,
    ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ userRole = 'client' }) => {
    const navigate = useNavigate();

    const clientActions = [
        {
            icon: Bot,
            label: 'Talk to JusticeAI',
            description: 'Get legal guidance',
            color: 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20',
            onClick: () => navigate('/client/ai-chat')
        },
        {
            icon: AlertTriangle,
            label: 'Report Incident',
            description: 'File a complaint',
            color: 'bg-amber-500/10 text-amber-200 border border-amber-500/20',
            onClick: () => navigate('/client/report-incident')
        },
        {
            icon: Users,
            label: 'Find Advocate',
            description: 'Connect with lawyers',
            color: 'bg-sky-500/10 text-sky-200 border border-sky-500/20',
            onClick: () => navigate('/client/advocates')
        },
        {
            icon: MessageCircle,
            label: 'My Advocates',
            description: 'Chat with connected lawyers',
            color: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20',
            onClick: () => navigate('/client/my-advocates')
        }
    ];

    const advocateActions = [
        {
            icon: FileText,
            label: 'View Cases',
            description: 'Manage your cases',
            color: 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20',
            onClick: () => navigate('/advocate/cases')
        },
        {
            icon: Users,
            label: 'Your Clients',
            description: 'Connected clients',
            color: 'bg-sky-500/10 text-sky-200 border border-sky-500/20',
            onClick: () => navigate('/advocate/clients')
        },
        {
            icon: MessageCircle,
            label: 'Consultation Requests',
            description: 'Pending requests',
            color: 'bg-amber-500/10 text-amber-200 border border-amber-500/20',
            onClick: () => navigate('/advocate/consultation-requests')
        },
        {
            icon: Video,
            label: 'Schedule Call',
            description: 'Video consultation',
            color: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20',
            onClick: () => {}
        }
    ];

    const actions = userRole === 'client' ? clientActions : advocateActions;

    return (
        <Card variant="default">
            <CardHeader className="border-white/10">
                <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-white/10">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className={`p-3 rounded-xl ${action.color}`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">
                                    {action.label}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {action.description}
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
