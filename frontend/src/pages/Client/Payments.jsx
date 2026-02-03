import { CreditCard, AlertCircle, Calendar, User } from 'lucide-react';
import { usePayments } from '../../hooks/usePaymentQuery';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';

const Payments = () => {
    const { data, isLoading, isError } = usePayments();
    const payments = data?.payments || [];

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
                        <p className="text-gray-600">Failed to load payments.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-sm text-gray-500 mt-1">Track your consultation payments</p>
            </div>

            {payments.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No payments yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {payments.map((payment) => (
                        <Card key={payment._id} hover>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-100 rounded-lg">
                                        <CreditCard className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {payment.paymentType?.replace('_', ' ').toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-500">{payment.transactionId}</p>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {payment.advocate?.fullName || 'Advocate'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">₹{payment.amount}</p>
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

export default Payments;
