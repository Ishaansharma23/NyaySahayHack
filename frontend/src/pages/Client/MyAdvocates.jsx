import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Users, 
    MessageCircle, 
    Phone, 
    Mail, 
    User,
    Search,
    Filter,
    ChevronRight,
    Badge,
    Building2,
    Award,
    MapPin,
    Calendar
} from 'lucide-react';
import { useMyAdvocates } from '../../hooks/useConnectionQuery';

const MyAdvocates = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data, isLoading } = useMyAdvocates();
    
    // Extract advocates array from the API response
    const advocates = data?.advocates || [];

    const filteredAdvocates = advocates.filter(item =>
        item?.advocate?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.advocate?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.advocate?.lawFirm?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const AdvocateCard = ({ item }) => {
        const advocate = item.advocate;
        
        return (
            <div className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6 shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full border border-white/10 flex items-center justify-center">
                            {advocate?.profilePicture ? (
                                <img 
                                    src={advocate.profilePicture} 
                                    alt={advocate.fullName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-6 w-6 text-indigo-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{advocate?.fullName}</h3>
                            <p className="text-sm text-gray-300">{advocate?.specialization}</p>
                            
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-gray-300">
                                    <Building2 className="h-3 w-3 mr-1" />
                                    {advocate?.lawFirm}
                                </div>
                                <div className="flex items-center text-sm text-gray-300">
                                    <Award className="h-3 w-3 mr-1" />
                                    {advocate?.yearsOfPractice} years experience
                                </div>
                                <div className="flex items-center text-sm text-gray-300">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {advocate?.location}
                                </div>
                            </div>
                            
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    <Badge className="h-3 w-3 mr-1" />
                                    Connected
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link 
                            to={`/chat/${advocate?._id}`}
                            className="p-2 text-gray-400 hover:text-indigo-300 hover:bg-white/10 rounded-lg transition-colors"
                            title="Start Chat"
                        >
                            <MessageCircle className="h-4 w-4" />
                        </Link>
                        <button 
                            className="p-2 text-gray-400 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-colors"
                            title="Call Advocate"
                        >
                            <Phone className="h-4 w-4" />
                        </button>
                        <button 
                            className="p-2 text-gray-400 hover:text-sky-300 hover:bg-white/10 rounded-lg transition-colors"
                            title="Send Email"
                        >
                            <Mail className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Advocates</h1>
                <p className="text-gray-400">Your connected legal professionals</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search advocates..."
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
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                    </div>
                ) : filteredAdvocates.length > 0 ? (
                    filteredAdvocates.map((item) => (
                        <AdvocateCard key={item.requestId || item.advocate?._id} item={item} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No connected advocates</h3>
                        <p className="text-gray-400">
                            {searchTerm ? 'No advocates match your search.' : 'You haven\'t connected with any advocates yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAdvocates;