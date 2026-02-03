/**
 * Online Status Indicator
 * Shows user's online/offline status
 */

const OnlineStatus = ({ isOnline, showLabel = true, size = 'md' }) => {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3'
    };

    const labelSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    return (
        <div className="flex items-center gap-1.5">
            <span
                className={`
                    ${sizes[size]} 
                    rounded-full 
                    ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}
                    ${isOnline ? 'animate-pulse' : ''}
                `}
            />
            {showLabel && (
                <span className={`${labelSizes[size]} ${isOnline ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            )}
        </div>
    );
};

export default OnlineStatus;
