import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorSeverity } from './error-handler';

interface ErrorOverlayProps {
    message: string;
    type: string;
    severity: ErrorSeverity;
    stack?: string;
    onDismiss?: () => void;
    position?: 'top-right' | 'bottom-right' | 'full';
    timeout?: number;
}

const severityColors = {
    warning: '#FFA500',
    error: '#FF0000',
    fatal: '#8B0000',
};

const overlayPositions = {
    'top-right': {
        top: '1rem',
        right: '1rem',
        maxWidth: '400px',
    },
    'bottom-right': {
        bottom: '1rem',
        right: '1rem',
        maxWidth: '400px',
    },
    'full': {
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        maxWidth: '100%',
    },
};

export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
    message,
    type,
    severity,
    stack,
    onDismiss,
    position = 'bottom-right',
    timeout,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (timeout && timeout > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onDismiss?.();
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [timeout, onDismiss]);

    if (!isVisible) return null;

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        color: '#FFFFFF',
        padding: '1rem',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        fontFamily: 'monospace',
        ...overlayPositions[position],
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        borderBottom: `2px solid ${severityColors[severity]}`,
        paddingBottom: '0.5rem',
    };

    const closeButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: '1.2rem',
        padding: '0.2rem 0.5rem',
    };

    const messageStyle: React.CSSProperties = {
        color: severityColors[severity],
        marginBottom: '0.5rem',
        wordBreak: 'break-word',
    };

    const stackStyle: React.CSSProperties = {
        fontSize: '0.9rem',
        opacity: 0.8,
        whiteSpace: 'pre-wrap',
        marginTop: '1rem',
    };

    return (
        <div style={overlayStyle}>
            <div style={headerStyle}>
                <div>
                    <strong>[{type}]</strong> {severity.toUpperCase()}
                </div>
                {onDismiss && (
                    <button
                        style={closeButtonStyle}
                        onClick={() => {
                            setIsVisible(false);
                            onDismiss();
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
            <div style={messageStyle}>{message}</div>
            {stack && <pre style={stackStyle}>{stack}</pre>}
        </div>
    );
};

export const showErrorOverlay = (props: ErrorOverlayProps): void => {
    const container = document.createElement('div');
    container.id = 'error-overlay-container';
    document.body.appendChild(container);

    const cleanup = () => {
        document.body.removeChild(container);
    };

    const root = document.createElement('div');
    container.appendChild(root);

    // Using createRoot API for React 18+
    const reactRoot = createRoot(root);
    reactRoot.render(
        <ErrorOverlay
            {...props}
            onDismiss={() => {
                props.onDismiss?.();
                cleanup();
                reactRoot.unmount();
            }}
        />
    );
};
