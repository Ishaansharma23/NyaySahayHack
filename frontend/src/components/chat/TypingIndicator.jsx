/**
 * Typing Indicator Component
 * Animated dots indicating someone is typing
 */

const TypingIndicator = ({ name = 'JusticeAI' }) => {
    return (
        <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">⚖️</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500 mr-2">{name} is typing</span>
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
