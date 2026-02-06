import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Users, 
    MessageCircle, 
    Phone, 
    Mail, 
    Calendar,
    Clock,
    User,
    Search,
    Filter,
    ChevronRight,
    Badge,
    AlertCircle
} from 'lucide-react';
import { 
    useMyClients, 
    useMyConsultationRequests, 
    useAcceptConsultationRequest, 
    useRejectConsultationRequest 
} from '../../hooks/useConnectionQuery';

const YourClients = () => {
    const [activeTab, setActiveTab] = useState('clients');
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data: clientsData, isLoading: clientsLoading } = useMyClients();
    const { data: requestsData, isLoading: requestsLoading } = useMyConsultationRequests();
    const acceptRequestMutation = useAcceptConsultationRequest();
    const rejectRequestMutation = useRejectConsultationRequest();

    const clients = clientsData?.clients || [];
    const requests = requestsData?.requests || [];

    const filteredClients = clients.filter(item =>
        item?.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRequests = requests.filter(request =>
        request?.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptRequestMutation.mutateAsync(requestId);
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rejectRequestMutation.mutateAsync({ 
                requestId, 
                rejectionReason: 'Unable to take on new clients at this time' 
            });
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const ClientCard = ({ client, isRequest = false, requestId = null }) => {
        const phone = client?.phone || client?.phoneNumber;
        return (
        <div className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6 shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full border border-white/10 flex items-center justify-center">
                        {client?.profilePicture ? (
                            <img 
                                src={client.profilePicture} 
                                alt={client.fullName}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 text-indigo-300" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{client?.fullName}</h3>
                        <p className="text-sm text-gray-300">{client?.email}</p>
                        {phone && (
                            <p className="text-sm text-gray-300">{phone}</p>
                        )}
                        {isRequest ? (
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Request
                                </span>
                            </div>
                        ) : (
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    <Badge className="h-3 w-3 mr-1" />
                                    Active Client
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isRequest && (
                        <>
                            <Link 
                                to={`/chat/${client?._id}`}
                                className="p-2 text-gray-400 hover:text-indigo-300 hover:bg-white/10 rounded-lg transition-colors"
                                title="Start Chat"
                            >
                                <MessageCircle className="h-4 w-4" />
                            </Link>
                            <Link 
                                to={`/call/${client?._id}`}
                                className="p-2 text-gray-400 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-colors"
                                title="Call Client"
                            >
                                <Phone className="h-4 w-4" />
                            </Link>
                            <a 
                                href={client?.email ? `mailto:${client.email}` : undefined}
                                className="p-2 text-gray-400 hover:text-sky-300 hover:bg-white/10 rounded-lg transition-colors"
                                title="Send Email"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
            </div>
            
            {isRequest && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-300">
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Requested on {formatDate(client.createdAt)}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleAcceptRequest(requestId)}
                                disabled={acceptRequestMutation.isPending}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {acceptRequestMutation.isPending ? 'Accepting...' : 'Accept'}
                            </button>
                            <button 
                                onClick={() => handleRejectRequest(requestId)}
                                disabled={rejectRequestMutation.isPending}
                                className="px-3 py-1 text-sm bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                {rejectRequestMutation.isPending ? 'Declining...' : 'Decline'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Your Clients</h1>
                <p className="text-gray-400">Manage your client relationships and consultation requests</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-white/10">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'clients'
                                    ? 'border-indigo-400 text-indigo-300'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/30'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Active Clients</span>
                                {clients && (
                                    <span className="bg-indigo-500/15 text-indigo-300 py-0.5 px-2 rounded-full text-xs border border-indigo-500/20">
                                        {clients.length}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'requests'
                                    ? 'border-indigo-400 text-indigo-300'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/30'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Consultation Requests</span>
                                {requests && (
                                    <span className="bg-amber-500/15 text-amber-300 py-0.5 px-2 rounded-full text-xs border border-amber-500/20">
                                        {requests.length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'clients' && (
                    <>
                        {clientsLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                            </div>
                        ) : filteredClients.length > 0 ? (
                            filteredClients.map((item) => (
                                <ClientCard key={item.requestId || item.client?._id} client={item.client} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No clients yet</h3>
                                <p className="text-gray-400">
                                    {searchTerm ? 'No clients match your search.' : 'You haven\'t connected with any clients yet.'}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'requests' && (
                    <>
                        {requestsLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => (
                                <ClientCard 
                                    key={request._id} 
                                    client={request.client} 
                                    isRequest={true} 
                                    requestId={request._id}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No consultation requests</h3>
                                <p className="text-gray-400">
                                    {searchTerm ? 'No requests match your search.' : 'You don\'t have any pending consultation requests.'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default YourClients;