/**
 * Reusable Card Component
 * Flexible card with header, body, and footer slots
 * Dark theme with glassmorphism
 */
import { forwardRef } from 'react';

const Card = forwardRef(({
    children,
    className = '',
    hover = false,
    padding = 'default',
    variant = 'default',
    ...props
}, ref) => {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        default: 'p-5',
        lg: 'p-6',
        xl: 'p-8'
    };

    const variants = {
        default: 'bg-white/5 backdrop-blur-md border-white/10 shadow-xl',
        solid: 'bg-white/5 backdrop-blur-md border-white/10 shadow-xl',
        gradient: 'bg-white/5 backdrop-blur-md border-white/10 shadow-xl',
        light: 'bg-white/5 backdrop-blur-md border-white/10 shadow-xl'
    };

    const hoverStyles = {
        default: 'hover:scale-[1.02] transition-all duration-300 ease-out',
        solid: 'hover:scale-[1.02] transition-all duration-300 ease-out',
        gradient: 'hover:scale-[1.02] transition-all duration-300 ease-out',
        light: 'hover:scale-[1.02] transition-all duration-300 ease-out'
    };

    return (
        <div
            ref={ref}
            className={`
                rounded-2xl border
                ${variants[variant]}
                ${hover ? hoverStyles[variant] : ''}
                ${paddingStyles[padding]}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

// Card Header
const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`pb-4 border-b border-white/10 ${className}`} {...props}>
        {children}
    </div>
);

// Card Title
const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
    <Component className={`text-lg font-semibold text-white ${className}`} {...props}>
        {children}
    </Component>
);

// Card Description
const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-gray-400 mt-1 ${className}`} {...props}>
        {children}
    </p>
);

// Card Body/Content
const CardContent = ({ children, className = '', ...props }) => (
    <div className={`py-4 ${className}`} {...props}>
        {children}
    </div>
);

// Card Footer
const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`pt-4 border-t border-white/10 ${className}`} {...props}>
        {children}
    </div>
);

// Stat Card (for dashboards)
const StatCard = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    className = '',
    variant = 'default'
}) => {
    const isLight = variant === 'light';
    const changeColors = isLight
        ? {
            positive: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
            negative: 'text-red-700 bg-red-50 border border-red-200',
            warning: 'text-amber-700 bg-amber-50 border border-amber-200',
            neutral: 'text-gray-600 bg-gray-50 border border-gray-200'
        }
        : {
            positive: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
            negative: 'text-red-400 bg-red-500/10 border border-red-500/20',
            warning: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
            neutral: 'text-gray-400 bg-white/5 border border-white/10'
        };

    return (
        <Card className={`${className}`} hover variant={variant}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{title}</p>
                    <p className={`text-2xl font-bold mt-1 ${isLight ? 'text-gray-900' : 'text-white'}`}>{value}</p>
                    {change && (
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-3 ${changeColors[changeType]}`}>
                            {change}
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-xl ${isLight ? 'bg-indigo-50 border border-indigo-200' : 'bg-indigo-500/10 border border-indigo-500/20'}`}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
export default Card;
