/**
 * Reusable Button Component
 * Modern, accessible button with multiple variants and states
 */
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    link: 'text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline'
};

const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-lg'
};

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    ...props
}, ref) => {
    const baseClasses = `
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `;

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={baseClasses}
            {...props}
        >
            {loading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {!loading && leftIcon && (
                <span className="mr-2">{leftIcon}</span>
            )}
            {children}
            {!loading && rightIcon && (
                <span className="ml-2">{rightIcon}</span>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
