const Card = ({ title, children, className = '', ...props }) => {
    return (
        <div
            className={`card ${className}`}
            style={{
                background: 'var(--background)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s ease',
                ...props.style
            }}
            {...props}
        >
            {title && (
                <h3
                    style={{
                        marginBottom: '20px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'var(--text)',
                        letterSpacing: '-0.025em'
                    }}
                >
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
