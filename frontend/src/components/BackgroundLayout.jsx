const BackgroundLayout = ({ children, className = '' }) => {
    return (
        <div className={`relative min-h-screen text-white ${className}`}>
            <div className="pointer-events-none fixed inset-0 app-bg" />
            <div className="pointer-events-none fixed inset-0 app-bg-glow" />
            <div className="pointer-events-none fixed inset-0 app-bg-grid" />
            <div className="pointer-events-none fixed inset-0 app-bg-vignette" />
            <div className="relative z-10 min-h-screen">
                {children}
            </div>
        </div>
    );
};
export default BackgroundLayout;
