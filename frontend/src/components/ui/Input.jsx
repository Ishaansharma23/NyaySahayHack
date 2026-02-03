/**
 * Reusable Input Component
 * Form input with label, error handling, and various states
 */
import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    success,
    hint,
    leftIcon,
    rightIcon,
    disabled = false,
    required = false,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const inputClasses = `
        w-full px-4 py-3 rounded-lg border
        text-gray-900 placeholder-gray-400
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        ${leftIcon ? 'pl-11' : ''}
        ${rightIcon || isPassword ? 'pr-11' : ''}
        ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : success 
                ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
        }
        ${className}
    `;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}
                
                <input
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />
                
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
                
                {!isPassword && rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
                
                {error && !rightIcon && !isPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}
                
                {success && !rightIcon && !isPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                )}
            </div>
            
            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
            
            {hint && !error && (
                <p className="text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

// Textarea Component
const Textarea = forwardRef(({
    label,
    error,
    hint,
    required = false,
    rows = 4,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const textareaClasses = `
        w-full px-4 py-3 rounded-lg border
        text-gray-900 placeholder-gray-400
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-0
        resize-none
        ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
        }
        ${className}
    `;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <textarea
                ref={ref}
                rows={rows}
                className={textareaClasses}
                {...props}
            />
            
            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
            
            {hint && !error && (
                <p className="text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// Select Component
const Select = forwardRef(({
    label,
    options = [],
    error,
    hint,
    required = false,
    placeholder = 'Select an option',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const selectClasses = `
        w-full px-4 py-3 rounded-lg border
        text-gray-900 bg-white
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-0
        ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
        }
        ${className}
    `;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <select ref={ref} className={selectClasses} {...props}>
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
            
            {hint && !error && (
                <p className="text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export { Input, Textarea, Select };
export default Input;
