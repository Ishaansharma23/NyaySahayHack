import { DashboardStats, QuickActions, RecentActivity } from '../../components/dashboard';
import { CaseList } from '../../components/cases';

const AdvocateOverview = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10">
                <h1 className="text-2xl font-bold text-white">Advocate Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Manage cases, clients, and consultations</p>
            </div>

            <div className="relative z-10">
                <DashboardStats userRole="advocate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                <div className="lg:col-span-2 space-y-6">
                    <CaseList userRole="advocate" showHeader={false} limit={5} />
                </div>
                <div className="space-y-6">
                    <QuickActions userRole="advocate" />
                    <RecentActivity userRole="advocate" />
                </div>
            </div>
        </div>
    );
};

export default AdvocateOverview;
