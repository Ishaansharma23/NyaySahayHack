import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    User,
    MapPin,
    Briefcase,
    MessageCircle,
    Building2,
    Award,
    Clock,
    Send
} from 'lucide-react';
import { useRecommendedAdvocates, useSendConsultationRequest, useConsultationQuota } from '../../hooks/useConnectionQuery.js';
import paymentService from '../../services/paymentService.js';

const RecommendedAdvocates = () => {
    const { data: advocatesData, isLoading, error } = useRecommendedAdvocates();
    const sendRequestMutation = useSendConsultationRequest();
    const { data: quotaData } = useConsultationQuota();
    const [selectedAdvocate, setSelectedAdvocate] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const legalIssues = [
        { value: 'civil', label: 'Civil Law' },
        { value: 'criminal', label: 'Criminal Law' },
        { value: 'corporate', label: 'Corporate Law' },
        { value: 'family', label: 'Family Law' },
        { value: 'property', label: 'Property Law' },
        { value: 'labor', label: 'Labor Law' },
        { value: 'other', label: 'Other' }
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-orange-600' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
    ];

    const CONSULTATION_PRICE = 199;
    const freeRemaining = quotaData?.freeRemaining ?? 5;
    const paymentRequired = quotaData?.paymentRequired ?? false;

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const onSubmitRequest = async (data) => {
        try {
            if (!selectedAdvocate) return;

            if (!paymentRequired) {
                await sendRequestMutation.mutateAsync({
                    advocateId: selectedAdvocate._id,
                    requestData: data
                });
                setShowRequestModal(false);
                setSelectedAdvocate(null);
                reset();
                return;
            }

            setIsPaying(true);
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay. Please try again.');
            }

            const orderResponse = await paymentService.createOrder({
                amount: CONSULTATION_PRICE,
                advocateId: selectedAdvocate._id,
                paymentType: 'consultation',
                description: 'Consultation fee'
            });

            const { order } = orderResponse.data || orderResponse;
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                throw new Error('Razorpay key is not configured');
            }

            const rzp = new window.Razorpay({
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: 'NyaySahay',
                description: 'Consultation Payment',
                order_id: order.id,
                handler: async (response) => {
                    const verify = await paymentService.verifyPayment({
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature
                    });

                    const paymentId = verify.data?.paymentId || verify.paymentId;

                    await sendRequestMutation.mutateAsync({
                        advocateId: selectedAdvocate._id,
                        requestData: { ...data, paymentId }
                    });

                    setShowRequestModal(false);
                    setSelectedAdvocate(null);
                    reset();
                },
                theme: { color: '#4f46e5' }
            });

            rzp.open();
        } catch (error) {
            console.error('Error sending request:', error);
        } finally {
            setIsPaying(false);
        }
    };

    const handleSendRequest = (advocate) => {
        setSelectedAdvocate(advocate);
        setShowRequestModal(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Advocates</h2>
                    <p className="text-gray-600">{error.message}</p>
                </div>
            </div>
        );
    }

    const advocates = advocatesData?.advocates || [];
    const filteredAdvocates = advocates.filter((advocate) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
            advocate?.fullName?.toLowerCase().includes(q) ||
            advocate?.specialization?.toLowerCase().includes(q) ||
            advocate?.lawFirm?.toLowerCase().includes(q) ||
            advocate?.location?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Advocates</h1>
                    <p className="text-gray-600">
                        Connect with experienced legal professionals who can help with your case
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, specialization, firm, or location"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="text-sm text-gray-600">
                        {filteredAdvocates.length} result{filteredAdvocates.length === 1 ? '' : 's'}
                    </div>
                </div>

                {/* Advocates Grid */}
                {filteredAdvocates.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Advocates Available</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'No advocates match your search.' : 'Check back later for available advocates.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAdvocates.map((advocate) => (
                            <div key={advocate._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Profile Header */}
                                <div className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                            {advocate.profilePicture ? (
                                                <img 
                                                    src={advocate.profilePicture} 
                                                    alt={advocate.fullName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {advocate.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-600">{advocate.specialization}</p>
                                        </div>
                                    </div>

                                    {/* Law Firm */}
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{advocate.lawFirm}</span>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Award className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {advocate.yearsOfPractice} years of experience
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center space-x-2 mb-4">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{advocate.location}</span>
                                    </div>

                                    {/* Bio */}
                                    {advocate.bio && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                            {advocate.bio}
                                        </p>
                                    )}

                                    {/* Connect Button */}
                                    <button
                                        onClick={() => handleSendRequest(advocate)}
                                        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        <span>Request Consultation</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Request Modal */}
                {showRequestModal && selectedAdvocate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Send Consultation Request
                            </h3>
                            <div className="mb-3 text-sm text-gray-600">
                                Free consultations remaining: <span className="font-semibold text-indigo-600">{freeRemaining}</span>
                                {paymentRequired && (
                                    <span className="ml-2 text-rose-600">Payment required: ₹{CONSULTATION_PRICE}</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                To: <strong>{selectedAdvocate.fullName}</strong>
                            </p>

                            <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
                                {/* Legal Issue */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Legal Issue <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className={`block w-full px-3 py-2 border ${
                                            errors.legalIssue ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        {...register('legalIssue', { required: 'Please select a legal issue' })}
                                    >
                                        <option value="">Select legal issue</option>
                                        {legalIssues.map(issue => (
                                            <option key={issue.value} value={issue.value}>
                                                {issue.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.legalIssue && (
                                        <p className="mt-1 text-sm text-red-600">{errors.legalIssue.message}</p>
                                    )}
                                </div>

                                {/* Urgency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Urgency Level
                                    </label>
                                    <select
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        {...register('urgency')}
                                    >
                                        {urgencyLevels.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe your legal issue and why you need consultation..."
                                        className={`block w-full px-3 py-2 border ${
                                            errors.message ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        {...register('message', {
                                            required: 'Message is required',
                                            minLength: {
                                                value: 20,
                                                message: 'Message must be at least 20 characters'
                                            }
                                        })}
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowRequestModal(false);
                                            setSelectedAdvocate(null);
                                            reset();
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPaying || sendRequestMutation.isPending}
                                        className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>
                                            {isPaying ? 'Processing Payment...' : sendRequestMutation.isPending ? 'Sending...' : paymentRequired ? `Pay ₹${CONSULTATION_PRICE} & Send` : 'Send Request'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendedAdvocates;