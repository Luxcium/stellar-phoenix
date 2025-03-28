#!/usr/bin/env node
import chalk from 'chalk';
import { spawn } from 'node:child_process';

interface ProcessInfo {
    name: string;
    command: string;
    args: string[];
    color: typeof chalk;
}

const processes: ProcessInfo[] = [
    {
        name: 'Dev Server',
        command: 'npm',
        args: ['run', 'dev'],
        color: chalk.green,
    }
];

function startProcess({ name, command, args, color }: ProcessInfo): void {
    const proc = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
    });

    console.log(color(`[${name}] Starting...`));

    proc.stdout?.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines
            .filter((line: string) => line.trim())
            .forEach((line: string) => {
                console.log(color(`[${name}] ${line}`));
            });
    });

    proc.stderr?.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines
            .filter((line: string) => line.trim())
            .forEach((line: string) => {
                console.error(chalk.red(`[${name} ERROR] ${line}`));
            });
    });

    proc.on('close', (code) => {
        if (code !== 0) {
            console.error(
                chalk.red(
                    `[${name}] Process exited with code ${code}`
                )
            );
        }
    });

    // Handle process cleanup
    const cleanup = () => {
        console.log(color(`[${name}] Shutting down...`));
        proc.kill();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}

function main() {
    console.log(chalk.cyan('Starting development environment...\n'));

    processes.forEach((processInfo) => {
        startProcess(processInfo);
    });

    console.log(
        chalk.cyan('\nDevelopment environment is running. Press Ctrl+C to stop.\n')
    );
}

main();
