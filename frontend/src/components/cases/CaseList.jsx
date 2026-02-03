/**
 * Case List Component
 * Displays a list of cases with filtering and sorting - Dark Theme
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FileText, 
    ChevronRight, 
    Filter, 
    Search, 
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge, Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { SkeletonCard } from '../ui/Skeleton';
import { NoCases } from '../ui/EmptyState';
import { useCases } from '../../hooks/useCaseQuery';

const CaseList = ({ userRole = 'client', showHeader = true, limit = 10 }) => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useCases({ 
        status: statusFilter, 
        page, 
        limit 
    });

    const cases = data?.cases || [];
    const pagination = data?.pagination;

    const statusFilters = [
        { value: '', label: 'All Cases' },
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    const getCaseTypeColor = (type) => {
        const colors = {
            civil: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            criminal: 'bg-red-500/10 text-red-400 border-red-500/20',
            family: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
            property: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            consumer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            labour: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            corporate: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            constitutional: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            cyber: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            other: 'bg-white/5 text-gray-400 border-white/10'
        };
        return colors[type] || colors.other;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredCases = cases.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardContent className="py-8 text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-400">Failed to load cases. Please try again.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {showHeader && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Your Cases</h2>
                        <p className="text-sm text-gray-500">Manage and track your legal cases</p>
                    </div>
                    
                    {userRole === 'client' && (
                        <Button
                            leftIcon={<Plus className="h-4 w-4" />}
                            onClick={() => navigate('/client/create-case')}
                        >
                            Create Case
                        </Button>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
                            className={`
                                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                                ${statusFilter === filter.value 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                }
                            `}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cases List */}
            {filteredCases.length === 0 ? (
                userRole === 'client' ? (
                    <NoCases onCreateCase={() => navigate('/client/create-case')} />
                ) : (
                    <NoCases />
                )
            ) : (
                <div className="space-y-3">
                    {filteredCases.map((caseItem) => (
                        <Card 
                            key={caseItem._id}
                            hover
                            className="cursor-pointer"
                            onClick={() => navigate(`/case/${caseItem._id}`)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                                    <FileText className="h-6 w-6 text-gray-400" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-white truncate">
                                                {caseItem.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {caseItem.caseNumber}
                                            </p>
                                        </div>
                                        <StatusBadge status={caseItem.status} />
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <Badge 
                                            variant="default" 
                                            className={getCaseTypeColor(caseItem.caseType)}
                                        >
                                            {caseItem.caseType?.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {formatDate(caseItem.createdAt)}
                                        </div>

                                        {caseItem.advocate && (
                                            <div className="flex items-center gap-2">
                                                <Avatar 
                                                    src={caseItem.advocate.profilePicture}
                                                    name={caseItem.advocate.fullName}
                                                    size="xs"
                                                />
                                                <span className="text-sm text-gray-400">
                                                    {caseItem.advocate.fullName}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <ChevronRight className="h-5 w-5 text-gray-600 flex-shrink-0" />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </Button>
                    
                    <span className="text-sm text-gray-400">
                        Page {page} of {pagination.pages}
                    </span>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === pagination.pages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CaseList;
