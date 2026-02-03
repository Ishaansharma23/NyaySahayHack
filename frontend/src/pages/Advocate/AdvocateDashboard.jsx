import { useLocation } from 'react-router-dom';
import NavAdvocate from '../../components/NavAdvocate';
import NyaySahayAi from '../../common/NyaySahayAi';
import YourClients from './YourClients';
import { useAuthStatus } from '../../hooks/useAuthQuery';

const AdvocateDashboard = () => {
    const location = useLocation();
    const { data: authData, isLoading, error } = useAuthStatus();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-600">Error loading dashboard: {error.message}</div>
            </div>
        );
    }

    // Determine which component to show based on the current path
    const renderContent = () => {
        switch (location.pathname) {
            case '/advocate/clients':
            case '/advocate/consultation-requests':
                return <YourClients />;
            case '/advocate/dashboard':
            default:
                return <NyaySahayAi />;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <NavAdvocate />
            <main className="flex-1 min-h-0">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdvocateDashboard;