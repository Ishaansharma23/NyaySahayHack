import { CaseList } from '../../components/cases';

const ClientCases = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <CaseList userRole="client" />
        </div>
    );
};

export default ClientCases;
