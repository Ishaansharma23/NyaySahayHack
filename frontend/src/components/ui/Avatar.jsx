/**
 * Avatar Component
 * User profile pictures with fallback
 */

const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl'
};

const Avatar = ({
    src,
    name,
    size = 'md',
    status,
    className = ''
}) => {
    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    // Generate consistent color from name
    const getColor = (name) => {
        if (!name) return 'bg-gray-400';
        const colors = [
            'bg-indigo-500',
            'bg-emerald-500',
            'bg-amber-500',
            'bg-red-500',
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-teal-500'
        ];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const statusColors = {
        online: 'bg-emerald-500',
        offline: 'bg-gray-400',
        busy: 'bg-amber-500',
        away: 'bg-yellow-500'
    };

    const statusSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5'
    };

    return (
        <div className={`relative inline-flex ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={name || 'Avatar'}
                    className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
                />
            ) : (
                <div
                    className={`
                        ${sizes[size]} ${getColor(name)}
                        rounded-full flex items-center justify-center
                        font-semibold text-white ring-2 ring-white
                    `}
                >
                    {getInitials(name)}
                </div>
            )}
            
            {status && (
                <span
                    className={`
                        absolute bottom-0 right-0
                        ${statusSizes[size]} ${statusColors[status]}
                        rounded-full ring-2 ring-white
                    `}
                />
            )}
        </div>
    );
};

// Avatar Group for showing multiple avatars
const AvatarGroup = ({
    users = [],
    max = 4,
    size = 'md',
    className = ''
}) => {
    const displayUsers = users.slice(0, max);
    const remaining = users.length - max;

    const overlapMap = {
        xs: '-ml-2',
        sm: '-ml-2',
        md: '-ml-3',
        lg: '-ml-4',
        xl: '-ml-5',
        '2xl': '-ml-6'
    };

    return (
        <div className={`flex items-center ${className}`}>
            {displayUsers.map((user, index) => (
                <div
                    key={user.id || index}
                    className={index > 0 ? overlapMap[size] : ''}
                    style={{ zIndex: displayUsers.length - index }}
                >
                    <Avatar
                        src={user.profilePicture || user.avatar}
                        name={user.fullName || user.name}
                        size={size}
                    />
                </div>
            ))}
            
            {remaining > 0 && (
                <div
                    className={`
                        ${sizes[size]} ${overlapMap[size]}
                        rounded-full bg-gray-100 border-2 border-white
                        flex items-center justify-center
                        font-medium text-gray-600
                    `}
                    style={{ zIndex: 0 }}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
};

export { Avatar, AvatarGroup };
export default Avatar;
