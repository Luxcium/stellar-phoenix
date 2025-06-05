/**
 * Système de Worker Pool optimisé pour la gestion de tâches concurrentes
 * 
 * Ce module implémente un pool de workers qui:
 * 1. Limite le nombre de tâches concurrentes en fonction des CPU disponibles
 * 2. Gère les files d'attente avec priorité
 * 3. Optimise l'allocation de ressources
 * 4. Fournit des métriques de performance
 */

import os from 'os';

// Types pour le pool de workers
interface Task<T> {
    id: string;
    execute: () => Promise<T>;
    priority: number;
    size?: number; // Taille estimée du travail (utile pour prioriser les petites tâches)
    startTime?: number;
    endTime?: number;
}

interface WorkerPoolOptions {
    concurrency?: number; // Nombre maximum de tâches concurrentes
    prioritizeSmallTasks?: boolean; // Prioriser les petites tâches pour libérer des ressources rapidement
    monitorInterval?: number; // Intervalle en ms pour surveiller les performances
    logPerformance?: boolean; // Activer les logs de performance
}

interface PoolMetrics {
    completedTasks: number;
    failedTasks: number;
    averageTaskTime: number;
    taskTimes: Record<string, number>;
    currentLoad: number; // 0-1, niveau d'occupation du pool
    queueLength: number;
    startTime: number;
}

/**
 * Implémentation du Worker Pool avec gestion optimisée des ressources
 */
export class WorkerPool<T> {
    private queue: Task<T>[] = [];
    private running = new Map<string, Task<T>>();
    private concurrency: number;
    private metrics: PoolMetrics = {
        completedTasks: 0,
        failedTasks: 0,
        averageTaskTime: 0,
        taskTimes: {},
        currentLoad: 0,
        queueLength: 0,
        startTime: Date.now()
    };
    private options: Required<WorkerPoolOptions>;
    private monitorInterval?: NodeJS.Timeout;
    private resolvers = new Map<string, (result: T) => void>();
    private rejectors = new Map<string, (error: Error) => void>();

    constructor(options: WorkerPoolOptions = {}) {
        // Déterminer le niveau de concurrence optimal (nombre de CPU - 1)
        const cpuCount = os.cpus().length;
        const optimalConcurrency = Math.max(1, cpuCount - 1);

        this.options = {
            concurrency: options.concurrency || optimalConcurrency,
            prioritizeSmallTasks: options.prioritizeSmallTasks !== false,
            monitorInterval: options.monitorInterval || 10000, // 10 secondes par défaut
            logPerformance: options.logPerformance || false
        };

        this.concurrency = this.options.concurrency;
        console.log(`Worker Pool initialisé avec ${this.concurrency} workers (${cpuCount} CPUs détectés)`);

        if (this.options.logPerformance) {
            this.startMonitoring();
        }
    }

    /**
     * Ajoute une tâche à la file d'attente et retourne une promesse
     */
    public addTask(
        id: string,
        taskFn: () => Promise<T>,
        options: { priority?: number; size?: number } = {}
    ): Promise<T> {
        const task: Task<T> = {
            id,
            execute: taskFn,
            priority: options.priority || 1,
            size: options.size
        };

        return new Promise<T>((resolve, reject) => {
            this.resolvers.set(id, resolve);
            this.rejectors.set(id, reject);
            this.queue.push(task);
            this.metrics.queueLength = this.queue.length;

            // Trier la file si nécessaire
            this.sortQueue();

            // Vérifier s'il y a des slots disponibles pour exécuter des tâches
            this.processQueue();
        });
    }

    /**
     * Arrête le pool et annule toutes les tâches en attente
     */
    public shutdown(): void {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }

        // Rejeter toutes les tâches en attente
        this.queue.forEach(task => {
            const reject = this.rejectors.get(task.id);
            if (reject) {
                reject(new Error('Worker pool shutdown'));
                this.rejectors.delete(task.id);
                this.resolvers.delete(task.id);
            }
        });

        this.queue = [];
        console.log('Worker Pool arrêté');
    }

    /**
     * Retourne les métriques actuelles du pool
     */
    public getMetrics(): PoolMetrics {
        return {
            ...this.metrics,
            currentLoad: this.running.size / this.concurrency,
            queueLength: this.queue.length
        };
    }

    /**
     * Ajuste dynamiquement le nombre maximum de tâches concurrentes
     */
    public setConcurrency(value: number): void {
        this.concurrency = Math.max(1, value);
        console.log(`Concurrence ajustée à ${this.concurrency} workers`);

        // Vérifier si des tâches peuvent être exécutées avec la nouvelle concurrence
        this.processQueue();
    }

    /**
     * Trie la file d'attente en fonction des priorités et tailles
     */
    private sortQueue(): void {
        if (this.options.prioritizeSmallTasks) {
            // Trier par priorité (nombre plus élevé = priorité plus haute),
            // puis par taille (plus petit d'abord) si les priorités sont égales
            this.queue.sort((a, b) => {
                if (b.priority !== a.priority) {
                    return b.priority - a.priority;
                }
                // Si les deux tâches ont une taille définie, prioriser la plus petite
                if (a.size !== undefined && b.size !== undefined) {
                    return a.size - b.size;
                }
                return 0;
            });
        } else {
            // Trier uniquement par priorité
            this.queue.sort((a, b) => b.priority - a.priority);
        }
    }

    /**
     * Traite la file d'attente et exécute les tâches si possible
     */
    private processQueue(): void {
        // Tant qu'il y a des tâches dans la file et des slots disponibles
        while (this.queue.length > 0 && this.running.size < this.concurrency) {
            const task = this.queue.shift();
            if (!task) continue;

            this.executeTask(task);
        }

        this.metrics.queueLength = this.queue.length;
    }

    /**
     * Exécute une tâche et gère son cycle de vie
     */
    private async executeTask(task: Task<T>): Promise<void> {
        this.running.set(task.id, { ...task, startTime: Date.now() });

        try {
            const result = await task.execute();
            // Tâche réussie
            task.endTime = Date.now();
            this.handleTaskCompletion(task, result);
        } catch (error) {
            // Tâche échouée
            task.endTime = Date.now();
            this.handleTaskError(task, error as Error);
        }

        // Retirer la tâche de la liste en cours d'exécution
        this.running.delete(task.id);

        // Vérifier si d'autres tâches peuvent être exécutées
        this.processQueue();
    }

    /**
     * Gère la réussite d'une tâche
     */
    private handleTaskCompletion(task: Task<T>, result: T): void {
        // Mettre à jour les métriques
        this.metrics.completedTasks++;

        if (task.startTime && task.endTime) {
            const taskTime = task.endTime - task.startTime;
            this.metrics.taskTimes[task.id] = taskTime;

            // Mettre à jour le temps moyen d'exécution
            const totalTime = Object.values(this.metrics.taskTimes).reduce((a, b) => a + b, 0);
            this.metrics.averageTaskTime = totalTime / this.metrics.completedTasks;
        }

        // Résoudre la promesse pour cette tâche
        const resolve = this.resolvers.get(task.id);
        if (resolve) {
            resolve(result);
            this.resolvers.delete(task.id);
            this.rejectors.delete(task.id);
        }
    }

    /**
     * Gère l'échec d'une tâche
     */
    private handleTaskError(task: Task<T>, error: Error): void {
        // Mettre à jour les métriques
        this.metrics.failedTasks++;

        // Rejeter la promesse pour cette tâche
        const reject = this.rejectors.get(task.id);
        if (reject) {
            reject(error);
            this.resolvers.delete(task.id);
            this.rejectors.delete(task.id);
        }
    }

    /**
     * Démarre la surveillance des performances
     */
    private startMonitoring(): void {
        this.monitorInterval = setInterval(() => {
            const metrics = this.getMetrics();

            console.log(`--- Worker Pool Metrics ---`);
            console.log(`- Load: ${Math.round(metrics.currentLoad * 100)}%`);
            console.log(`- Queue: ${metrics.queueLength} tasks`);
            console.log(`- Completed: ${metrics.completedTasks}, Failed: ${metrics.failedTasks}`);
            console.log(`- Avg task time: ${Math.round(metrics.averageTaskTime)}ms`);
            console.log(`- Uptime: ${Math.round((Date.now() - metrics.startTime) / 1000)}s`);
            console.log(`-------------------------`);
        }, this.options.monitorInterval);
    }
}

// Export par défaut
export default WorkerPool;