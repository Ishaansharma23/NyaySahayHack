/**
 * Loading Skeleton Components
 * Provides visual feedback during content loading
 */

// Base skeleton animation
const Skeleton = ({ className = '', ...props }) => (
    <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        {...props}
    />
);

// Text skeleton
const SkeletonText = ({ lines = 3, className = '' }) => (
    <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
                key={i} 
                className={`h-4 ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
            />
        ))}
    </div>
);

// Avatar skeleton
const SkeletonAvatar = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };
    
    return <Skeleton className={`${sizes[size]} rounded-full ${className}`} />;
};

// Card skeleton
const SkeletonCard = ({ className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
        <div className="flex items-start gap-4">
            <SkeletonAvatar />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
        <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
    </div>
);

// Stat card skeleton
const SkeletonStatCard = ({ className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
        <div className="flex items-start justify-between">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="w-12 h-12 rounded-lg" />
        </div>
    </div>
);

// Table skeleton
const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <div className="flex gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
        </div>
        {/* Rows */}
        <div className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="px-5 py-4 flex gap-4 items-center">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

// Chat message skeleton
const SkeletonChatMessage = ({ isUser = false, className = '' }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
        <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
            {!isUser && <SkeletonAvatar size="sm" />}
            <div className={`space-y-2 ${isUser ? 'items-end' : ''}`}>
                <Skeleton className={`h-4 ${isUser ? 'w-48' : 'w-64'}`} />
                <Skeleton className={`h-4 ${isUser ? 'w-32' : 'w-48'}`} />
                {!isUser && <Skeleton className="h-4 w-40" />}
            </div>
        </div>
    </div>
);

// Chat list skeleton
const SkeletonChatList = ({ count = 5, className = '' }) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonChatMessage key={i} isUser={i % 2 === 1} />
        ))}
    </div>
);

// Profile skeleton
const SkeletonProfile = ({ className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center gap-4">
            <SkeletonAvatar size="xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-32" />
                </div>
            ))}
        </div>
    </div>
);

// Dashboard skeleton
const SkeletonDashboard = () => (
    <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonStatCard key={i} />
            ))}
        </div>
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <SkeletonTable rows={5} columns={4} />
            </div>
            <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    </div>
);

export {
    Skeleton,
    SkeletonText,
    SkeletonAvatar,
    SkeletonCard,
    SkeletonStatCard,
    SkeletonTable,
    SkeletonChatMessage,
    SkeletonChatList,
    SkeletonProfile,
    SkeletonDashboard
};

export default Skeleton;
