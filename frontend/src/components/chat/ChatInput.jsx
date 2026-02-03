/**
 * Chat Input Component
 * Message input with attachments support
 */
import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, X } from 'lucide-react';

const ChatInput = ({
    onSend,
    disabled = false,
    placeholder = 'Type a message...',
    showAttachment = false,
    maxLength = 5000
}) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState([]);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) return;
        if (disabled) return;

        onSend({
            content: message.trim(),
            attachments
        });

        setMessage('');
        setAttachments([]);
        
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const isValid = file.size <= 10 * 1024 * 1024; // 10MB limit
            return isValid;
        });
        setAttachments(prev => [...prev, ...validFiles].slice(0, 5));
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                        >
                            <Paperclip className="h-4 w-4 text-gray-500" />
                            <span className="max-w-[150px] truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end gap-3">
                {/* Attachment Button */}
                {showAttachment && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*,video/*,.pdf,.doc,.docx"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={disabled}
                        >
                            <Paperclip className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        maxLength={maxLength}
                        rows={1}
                        className="
                            w-full px-4 py-3 
                            bg-gray-50 border border-gray-200 rounded-2xl
                            text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                            resize-none overflow-hidden
                            min-h-[48px] max-h-[150px]
                        "
                    />
                    
                    {/* Character Count */}
                    {message.length > maxLength * 0.8 && (
                        <span className="absolute bottom-1 right-3 text-xs text-gray-400">
                            {message.length}/{maxLength}
                        </span>
                    )}
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={disabled || (!message.trim() && attachments.length === 0)}
                    className="
                        p-3 rounded-xl
                        bg-gradient-to-r from-indigo-600 to-blue-600
                        text-white
                        hover:from-indigo-700 hover:to-blue-700
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all
                    "
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send, Shift + Enter for new line
            </p>
        </form>
    );
};

export default ChatInput;
