/**
 * Chat Message Bubble Component
 * WhatsApp/ChatGPT style message bubbles
 */
import { useState } from 'react';
import { Copy, Check, User, Scale } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

const ChatBubble = ({
    content,
    sender = 'user', // 'user' or 'assistant'
    timestamp,
    senderName,
    senderAvatar,
    showAvatar = true
}) => {
    const [copied, setCopied] = useState(false);
    const isUser = sender === 'user';

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Format markdown-like content
    const formatContent = (text) => {
        if (isUser) {
            return <div className="whitespace-pre-wrap">{text}</div>;
        }

        // Simple markdown formatting for AI responses
        const lines = text.split('\n');
        return lines.map((line, index) => {
            // Headers
            if (line.startsWith('### ')) {
                return <h4 key={index} className="font-semibold text-gray-900 mt-3 mb-1">{line.slice(4)}</h4>;
            }
            if (line.startsWith('## ')) {
                return <h3 key={index} className="font-bold text-gray-900 mt-4 mb-2">{line.slice(3)}</h3>;
            }
            if (line.startsWith('# ')) {
                return <h2 key={index} className="font-bold text-lg text-gray-900 mt-4 mb-2">{line.slice(2)}</h2>;
            }

            // Bullet points
            if (line.match(/^[\-\*•]\s/)) {
                return (
                    <div key={index} className="flex items-start gap-2 my-1">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{line.replace(/^[\-\*•]\s/, '')}</span>
                    </div>
                );
            }

            // Numbered lists
            if (line.match(/^\d+\.\s/)) {
                const num = line.match(/^(\d+)\./)[1];
                return (
                    <div key={index} className="flex items-start gap-2 my-1">
                        <span className="text-indigo-500 font-medium min-w-[20px]">{num}.</span>
                        <span>{line.replace(/^\d+\.\s/, '')}</span>
                    </div>
                );
            }

            // Bold text
            if (line.includes('**')) {
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return (
                    <p key={index} className={line.trim() ? 'my-1' : 'h-2'}>
                        {parts.map((part, i) => 
                            i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                        )}
                    </p>
                );
            }

            // Empty line
            if (!line.trim()) {
                return <div key={index} className="h-2"></div>;
            }

            // Regular text
            return <p key={index} className="my-1">{line}</p>;
        });
    };

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slideUp`}>
            {/* Avatar */}
            {showAvatar && (
                <div className="flex-shrink-0">
                    {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {senderAvatar ? (
                                <img src={senderAvatar} alt={senderName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="h-4 w-4 text-gray-600" />
                            )}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
                            <Scale className="h-4 w-4 text-white" />
                        </div>
                    )}
                </div>
            )}

            {/* Message Bubble */}
            <div className={`relative max-w-[80%] group ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`
                        px-4 py-3 rounded-2xl
                        ${isUser 
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-md' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                        }
                    `}
                >
                    <div className="text-sm leading-relaxed">
                        {formatContent(content)}
                    </div>
                </div>

                {/* Timestamp and Actions */}
                <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-400">
                        {timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {!isUser && (
                        <button
                            onClick={copyToClipboard}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                            title="Copy message"
                        >
                            {copied ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <Copy className="h-3 w-3 text-gray-400" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
