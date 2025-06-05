import chalk from 'chalk';
import WebSocket from 'ws';
import { ErrorSeverity } from './error-handler';

interface HMREventData {
    stack?: string;
    [key: string]: unknown;
}

interface HMREvent {
    type: 'hmr:update' | 'hmr:error' | 'hmr:reload' | 'hmr:connection';
    timestamp: number;
    path?: string;
    severity?: ErrorSeverity;
    message?: string;
    data?: HMREventData;
}

class HMRMonitor {
    private ws!: WebSocket;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;
    private readonly reconnectDelay: number = 2000;

    constructor(private port: number = 5173) {
        this.setupWebSocket();
        this.setupProcessHandlers();
    }

    private setupWebSocket(): void {
        this.ws = new WebSocket(`ws://localhost:${this.port}`);

        this.ws.on('open', () => {
            this.logEvent({
                type: 'hmr:connection',
                timestamp: Date.now(),
                message: 'Connected to HMR server',
                severity: 'warning',
            });
            this.reconnectAttempts = 0;
        });

        this.ws.on('message', (data: Buffer) => {
            try {
                const event: HMREvent = JSON.parse(data.toString('utf-8'));
                this.handleEvent(event);
            } catch (error: unknown) {
                this.logError('Failed to parse HMR message', error as Error);
            }
        });

        this.ws.on('close', () => {
            this.logEvent({
                type: 'hmr:connection',
                timestamp: Date.now(),
                message: 'Disconnected from HMR server',
                severity: 'error',
            });
            this.attemptReconnect();
        });

        this.ws.on('error', (error: Error) => {
            this.logError('WebSocket error', error);
            this.attemptReconnect();
        });
    }

    private setupProcessHandlers(): void {
        process.on('SIGINT', () => {
            this.cleanup();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.cleanup();
            process.exit(0);
        });
    }

    private handleEvent(event: HMREvent): void {
        this.logEvent(event);

        switch (event.type) {
            case 'hmr:update':
                this.handleHMRUpdate(event);
                break;
            case 'hmr:error':
                this.handleHMRError(event);
                break;
            case 'hmr:reload':
                this.handleHMRReload(event);
                break;
        }
    }

    private handleHMRUpdate(event: HMREvent): void {
        const message = chalk.green(`[HMR] Update detected in ${event.path}`);
        const timestamp = this.formatTimestamp(event.timestamp);
        console.log(`${timestamp} ${message}`);
    }

    private handleHMRError(event: HMREvent): void {
        const message = chalk.red(`[HMR] Error: ${event.message}`);
        const timestamp = this.formatTimestamp(event.timestamp);
        console.error(`${timestamp} ${message}`);

        if (event.data?.stack) {
            console.error(chalk.gray(event.data.stack));
        }
    }

    private handleHMRReload(event: HMREvent): void {
        const message = chalk.yellow('[HMR] Full page reload triggered');
        const timestamp = this.formatTimestamp(event.timestamp);
        console.log(`${timestamp} ${message}`);
    }

    private logEvent(event: HMREvent): void {
        const timestamp = this.formatTimestamp(event.timestamp);
        const typeColor = this.getTypeColor(event.type);
        const severityColor = this.getSeverityColor(event.severity);

        console.log(
            `${timestamp} ${typeColor(event.type)} ${event.message ? severityColor(event.message) : ''
            }`
        );
    }

    private logError(message: string, error: Error): void {
        const timestamp = this.formatTimestamp(Date.now());
        console.error(
            `${timestamp} ${chalk.red('[ERROR]')} ${message}: ${error.message}`
        );
        if (error.stack) {
            console.error(chalk.gray(error.stack));
        }
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(
                chalk.red(
                    `Failed to reconnect after ${this.maxReconnectAttempts} attempts`
                )
            );
            process.exit(1);
        }

        this.reconnectAttempts++;
        console.log(
            chalk.yellow(
                `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
            )
        );

        setTimeout(() => {
            this.setupWebSocket();
        }, this.reconnectDelay);
    }

    private cleanup(): void {
        if (this.ws) {
            this.ws.close();
        }
    }

    private formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp);
        return chalk.gray(
            `[${date.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })}]`
        );
    }

    private getTypeColor(type: string): typeof chalk {
        switch (type) {
            case 'hmr:update':
                return chalk.green;
            case 'hmr:error':
                return chalk.red;
            case 'hmr:reload':
                return chalk.yellow;
            case 'hmr:connection':
                return chalk.blue;
            default:
                return chalk.white;
        }
    }

    private getSeverityColor(severity?: ErrorSeverity): typeof chalk {
        switch (severity) {
            case 'error':
                return chalk.red;
            case 'warning':
                return chalk.yellow;
            case 'fatal':
                return chalk.red.bold;
            default:
                return chalk.white;
        }
    }
}

// Start monitoring when this script is run directly
const port = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 5173;
new HMRMonitor(port);

export { HMRMonitor };
export type { HMREvent };

