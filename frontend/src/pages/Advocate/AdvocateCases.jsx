import { CaseList } from '../../components/cases';

const AdvocateCases = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <CaseList userRole="advocate" />
        </div>
    );
};

export default AdvocateCases;
