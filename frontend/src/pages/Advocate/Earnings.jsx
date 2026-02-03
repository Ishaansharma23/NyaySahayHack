import { DollarSign, AlertCircle, Calendar, User } from 'lucide-react';
import { useEarnings } from '../../hooks/usePaymentQuery';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';

const Earnings = () => {
    const { data, isLoading, isError } = useEarnings();
    const payments = data?.payments || [];
    const totalEarnings = data?.totalEarnings || 0;

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-6">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                        <p className="text-gray-600">Failed to load earnings.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your consultation income</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{totalEarnings}</p>
                </div>
            </div>

            {payments.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center">
                        <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No earnings yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {payments.map((payment) => (
                        <Card key={payment._id} hover>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-100 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {payment.paymentType?.replace('_', ' ').toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-500">{payment.transactionId}</p>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {payment.client?.fullName || 'Client'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">₹{payment.advocateAmount || payment.amount}</p>
                                    <StatusBadge status={payment.status} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Earnings;
