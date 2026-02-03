/**
 * Badge Component
 * Status indicators and labels - Dark Theme
 */

const variants = {
    default: 'bg-white/10 text-gray-300 border border-white/10',
    primary: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
};

const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1'
};

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    rounded = false,
    className = ''
}) => {
    return (
        <span
            className={`
                inline-flex items-center font-medium
                ${rounded ? 'rounded-full' : 'rounded-md'}
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    variant === 'success' ? 'bg-emerald-400' :
                    variant === 'warning' ? 'bg-amber-400' :
                    variant === 'danger' ? 'bg-red-400' :
                    variant === 'info' ? 'bg-blue-400' :
                    variant === 'primary' ? 'bg-indigo-400' :
                    'bg-gray-400'
                }`} />
            )}
            {children}
        </span>
    );
};

// Status badge with predefined statuses
const StatusBadge = ({ status, className = '' }) => {
    const statusConfig = {
        // Case/Incident statuses
        pending: { label: 'Pending', variant: 'warning', dot: true },
        submitted: { label: 'Submitted', variant: 'info', dot: true },
        under_review: { label: 'Under Review', variant: 'info', dot: true },
        accepted: { label: 'Accepted', variant: 'success', dot: true },
        rejected: { label: 'Rejected', variant: 'danger', dot: true },
        in_progress: { label: 'In Progress', variant: 'primary', dot: true },
        forwarded: { label: 'Forwarded', variant: 'purple', dot: true },
        resolved: { label: 'Resolved', variant: 'success', dot: true },
        closed: { label: 'Closed', variant: 'default', dot: true },
        
        // Payment statuses
        paid: { label: 'Paid', variant: 'success', dot: true },
        unpaid: { label: 'Unpaid', variant: 'danger', dot: true },
        partial: { label: 'Partial', variant: 'warning', dot: true },
        refunded: { label: 'Refunded', variant: 'info', dot: true },
        
        // Urgency levels
        low: { label: 'Low', variant: 'success' },
        medium: { label: 'Medium', variant: 'warning' },
        high: { label: 'High', variant: 'danger' },
        critical: { label: 'Critical', variant: 'danger' },
        
        // User statuses
        online: { label: 'Online', variant: 'success', dot: true },
        offline: { label: 'Offline', variant: 'default', dot: true },
        busy: { label: 'Busy', variant: 'warning', dot: true },
        
        // Verification
        verified: { label: 'Verified', variant: 'success' },
        unverified: { label: 'Unverified', variant: 'warning' }
    };

    const config = statusConfig[status] || { label: status, variant: 'default' };

    return (
        <Badge
            variant={config.variant}
            dot={config.dot}
            rounded
            className={className}
        >
            {config.label}
        </Badge>
    );
};

export { Badge, StatusBadge };
export default Badge;
