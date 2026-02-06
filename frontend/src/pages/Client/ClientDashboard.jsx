import { useLocation } from 'react-router-dom';
import NavClient from '../../components/NavClient';
import NyaySahayAi from '../../common/NyaySahayAi';
import ClientHome from './ClientHome';
import ReportIncident from './ReportIncident';
import RecommendedAdvocates from './RecommendedAdvocates';
import MyAdvocates from './MyAdvocates';

const ClientDashboard = () => {
    const location = useLocation();

    // Determine which component to show based on the current path
    const renderContent = () => {
        switch (location.pathname) {
            case '/client/report-incident':
                return <ReportIncident />;
            case '/client/advocates':
                return <RecommendedAdvocates />;
            case '/client/my-advocates':
                return <MyAdvocates />;
            case '/client/ai-chat':
                return <NyaySahayAi />;
            case '/client/dashboard':
            default:
                return <ClientHome />;
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <NavClient />
            <main className="flex-1 min-h-0">
                {renderContent()}
            </main>
        </div>
    );
};

export default ClientDashboard;