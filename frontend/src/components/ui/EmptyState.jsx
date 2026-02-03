/**
 * Empty State Component
 * Shown when there's no data to display
 */
import { FileText, Search, Inbox, Users, MessageCircle, Folder } from 'lucide-react';
import Button from './Button';

const illustrations = {
    empty: Inbox,
    search: Search,
    document: FileText,
    users: Users,
    chat: MessageCircle,
    folder: Folder
};

const EmptyState = ({
    icon = 'empty',
    title = 'No data found',
    description = 'There are no items to display at the moment.',
    actionLabel,
    onAction,
    actionIcon,
    className = ''
}) => {
    const Icon = typeof icon === 'string' ? illustrations[icon] : icon;

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
            </h3>
            
            <p className="text-sm text-gray-500 max-w-sm mb-6">
                {description}
            </p>
            
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    leftIcon={actionIcon}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

// Specific empty states for common scenarios
const NoResults = ({ searchTerm, onClear }) => (
    <EmptyState
        icon="search"
        title="No results found"
        description={searchTerm 
            ? `No results match "${searchTerm}". Try adjusting your search.`
            : 'Try adjusting your search or filters to find what you\'re looking for.'
        }
        actionLabel={onClear ? 'Clear search' : undefined}
        onAction={onClear}
    />
);

const NoCases = ({ onCreateCase }) => (
    <EmptyState
        icon="folder"
        title="No cases yet"
        description="You haven't created any legal cases. Start by creating your first case."
        actionLabel="Create Case"
        onAction={onCreateCase}
    />
);

const NoMessages = () => (
    <EmptyState
        icon="chat"
        title="No messages"
        description="Start a conversation to see your messages here."
    />
);

const NoAdvocates = ({ onFindAdvocates }) => (
    <EmptyState
        icon="users"
        title="No advocates connected"
        description="You haven't connected with any advocates yet. Find and connect with legal professionals."
        actionLabel="Find Advocates"
        onAction={onFindAdvocates}
    />
);

const NoClients = () => (
    <EmptyState
        icon="users"
        title="No clients yet"
        description="You don't have any clients connected. Clients will appear here once they connect with you."
    />
);

export { EmptyState, NoResults, NoCases, NoMessages, NoAdvocates, NoClients };
export default EmptyState;
