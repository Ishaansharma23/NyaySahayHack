/**
 * Modal Component
 * Accessible modal/dialog with animations
 */
import { Fragment, useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = ''
}) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]'
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Fragment>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`
                        relative w-full ${sizes[size]}
                        bg-white rounded-2xl shadow-2xl
                        pointer-events-auto
                        animate-scaleIn
                        ${className}
                    `}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-start justify-between p-5 border-b border-gray-100">
                            <div>
                                {title && (
                                    <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                                )}
                            </div>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                        {children}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

// Modal Footer for action buttons
const ModalFooter = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end gap-3 pt-5 border-t border-gray-100 -mx-5 -mb-5 px-5 py-4 bg-gray-50 rounded-b-2xl ${className}`}>
        {children}
    </div>
);

// Confirmation Modal
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false
}) => {
    const variants = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white',
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600">{message}</p>
            </div>
            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${variants[variant]}`}
                >
                    {loading ? 'Processing...' : confirmText}
                </button>
            </div>
        </Modal>
    );
};

export { Modal, ModalFooter, ConfirmModal };
export default Modal;
