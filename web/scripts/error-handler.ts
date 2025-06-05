
export type ErrorSeverity = 'warning' | 'error' | 'fatal';
export type RecoveryType = 'auto' | 'manual' | 'reload';

export interface ErrorConfig {
    severity: ErrorSeverity;
    recovery: RecoveryType;
    retry: number;
    timeout: number;
    notification: boolean;
}

export interface ErrorStrategy {
    [key: string]: ErrorConfig;
}

export const errorStrategies: ErrorStrategy = {
    BUILD: {
        severity: 'error',
        recovery: 'manual',
        retry: 0,
        timeout: 0,
        notification: true,
    },
    HMR: {
        severity: 'warning',
        recovery: 'auto',
        retry: 3,
        timeout: 1000,
        notification: true,
    },
    RUNTIME: {
        severity: 'error',
        recovery: 'reload',
        retry: 1,
        timeout: 500,
        notification: true,
    },
    NETWORK: {
        severity: 'warning',
        recovery: 'auto',
        retry: 5,
        timeout: 2000,
        notification: true,
    },
};

class ErrorHandler {
    private static instance: ErrorHandler;
    private retryCount: Map<string, number> = new Map();

    private constructor() { }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    async handleError(
        error: Error,
        type: keyof typeof errorStrategies
    ): Promise<void> {
        const strategy = errorStrategies[type];
        const typeStr = type.toString();
        const currentRetries = this.retryCount.get(typeStr) || 0;

        if (currentRetries < strategy.retry) {
            await this.attemptRecovery(error, typeStr, strategy);
        } else {
            await this.handleUnrecoverable(error, typeStr, strategy);
        }

        if (strategy.notification) {
            this.notifyDeveloper(error, typeStr, strategy);
        }
    }

    private async attemptRecovery(
        error: Error,
        type: string,
        strategy: ErrorConfig
    ): Promise<void> {
        const currentRetries = this.retryCount.get(type) || 0;
        this.retryCount.set(type, currentRetries + 1);

        console.log(`[${type}] Recovery attempt ${currentRetries + 1}/${strategy.retry}`);

        if (strategy.recovery === 'auto') {
            await new Promise(resolve => setTimeout(resolve, strategy.timeout));
            // Implement recovery logic based on error type
            this.executeRecoveryStrategy(type);
        }
    }

    private async handleUnrecoverable(
        error: Error,
        type: string,
        strategy: ErrorConfig
    ): Promise<void> {
        console.error(`[${type}] Unrecoverable error:`, error);

        if (strategy.recovery === 'reload') {
            // Trigger page reload
            console.log('[Recovery] Triggering page reload...');
        } else {
            // Show error overlay
            this.showErrorOverlay(error, type);
        }
    }

    private executeRecoveryStrategy(type: string): void {
        switch (type) {
            case 'HMR':
                // Attempt to re-establish HMR connection
                console.log('[Recovery] Attempting to reconnect HMR...');
                break;
            case 'NETWORK':
                // Attempt to reconnect to the development server
                console.log('[Recovery] Attempting to reconnect to dev server...');
                break;
            default:
                console.log(`[Recovery] No specific recovery strategy for ${type}`);
        }
    }

    private showErrorOverlay(error: Error, type: string): void {
        // Implementation will be in error-overlay.ts
        console.error(`[${type}] Showing error overlay:`, error);
    }

    private notifyDeveloper(
        error: Error,
        type: string,
        strategy: ErrorConfig
    ): void {
        console.log(`[${type}] Developer notification:`, {
            message: error.message,
            severity: strategy.severity,
            stack: error.stack,
        });
    }

    // Reset retry count for a specific error type
    public resetRetryCount(type: string): void {
        this.retryCount.delete(type);
    }

    // Clear all retry counts
    public clearRetryCount(): void {
        this.retryCount.clear();
    }
}

export const errorHandler = ErrorHandler.getInstance();
