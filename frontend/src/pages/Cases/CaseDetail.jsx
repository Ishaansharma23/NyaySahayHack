import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, AlertCircle } from 'lucide-react';
import { useCase } from '../../hooks/useCaseQuery';
import { useAuthStatus } from '../../hooks/useAuthQuery';
import NavClient from '../../components/NavClient';
import NavAdvocate from '../../components/NavAdvocate';
import { useCreatePaymentOrder, useVerifyPayment } from '../../hooks/usePaymentQuery';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';

const CaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: authData } = useAuthStatus();
    const { data: caseData, isLoading, isError } = useCase(id);
    const createOrder = useCreatePaymentOrder();
    const verifyPayment = useVerifyPayment();

    const userRole = authData?.user?.role;

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayNow = async () => {
        if (!caseData?.billing?.estimatedFee || !caseData?.advocate?._id) return;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) return;

        const orderResponse = await createOrder.mutateAsync({
            amount: caseData.billing.estimatedFee,
            caseId: caseData._id,
            advocateId: caseData.advocate._id,
            paymentType: 'consultation',
            description: `Consultation for ${caseData.caseNumber}`
        });

        const order = orderResponse?.data?.order;
        if (!order) return;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'NyaySahay',
            description: `Case Payment - ${caseData.caseNumber}`,
            order_id: order.id,
            handler: async (response) => {
                await verifyPayment.mutateAsync({
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                });
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const content = () => {
        if (isLoading) {
            return (
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <SkeletonCard />
                </div>
            );
        }

        if (isError || !caseData) {
            return (
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Card>
                        <CardContent className="py-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                            <p className="text-gray-600">Failed to load case details.</p>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <StatusBadge status={caseData.status} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>{caseData.title}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">{caseData.caseNumber}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="default" className="bg-indigo-100 text-indigo-700">
                            {caseData.caseType?.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="default" className="bg-amber-100 text-amber-700">
                            {caseData.urgency?.toUpperCase()} PRIORITY
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(caseData.createdAt).toLocaleDateString('en-IN')}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Description</h4>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                            {caseData.description}
                        </p>
                    </div>

                    {userRole === 'client' && caseData?.billing?.estimatedFee && caseData?.advocate?._id && (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                            <div>
                                <p className="text-sm text-emerald-700">Estimated Consultation Fee</p>
                                <p className="text-xl font-bold text-emerald-800">₹{caseData.billing.estimatedFee}</p>
                            </div>
                            <Button onClick={handlePayNow} loading={createOrder.isPending || verifyPayment.isPending}>
                                Pay Now
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Client</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={caseData.client?.profilePicture}
                                name={caseData.client?.fullName}
                                size="md"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{caseData.client?.fullName}</p>
                                <p className="text-xs text-gray-500">{caseData.client?.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Advocate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {caseData.advocate ? (
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={caseData.advocate?.profilePicture}
                                    name={caseData.advocate?.fullName}
                                    size="md"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{caseData.advocate?.fullName}</p>
                                    <p className="text-xs text-gray-500">{caseData.advocate?.specialization}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No advocate assigned yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {caseData.aiAnalysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Summary: </span>{caseData.aiAnalysis.summary}
                        </p>
                        {caseData.aiAnalysis.relevantLaws?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">Relevant Laws</h4>
                                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                                    {caseData.aiAnalysis.relevantLaws.map((law, idx) => (
                                        <li key={idx}>{law}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {userRole === 'advocate' ? <NavAdvocate /> : <NavClient />}
            {content()}
        </div>
    );
};

export default CaseDetail;
