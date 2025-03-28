import { DataSource } from 'typeorm';
import { BasicImageInfo, CustomMetadata, ImageGroup, ImageMetadata, ImageTag, SemanticGroup, Tag } from '../types/entities.js';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'image_manager',
    synchronize: false, // Disable in production
    logging: process.env.NODE_ENV === 'development',
    entities: [
        BasicImageInfo,
        ImageMetadata,
        Tag,
        ImageTag,
        SemanticGroup,
        ImageGroup,
        CustomMetadata
    ],
    migrations: ['src/db/migrations/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        throw error;
    }
};

export class DatabaseService {
    private static instance: DatabaseService;
    private constructor() { }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public getDataSource(): DataSource {
        if (!AppDataSource.isInitialized) {
            throw new Error('Database not initialized');
        }
        return AppDataSource;
    }

    public async getRepository<T>(entityClass: new () => T) {
        if (!AppDataSource.isInitialized) {
            throw new Error('Database not initialized');
        }
        return AppDataSource.getRepository(entityClass);
    }

    public async cleanup(): Promise<void> {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

// Graceful shutdown handler
const handleShutdown = async () => {
    console.log('Shutting down...');
    try {
        await DatabaseService.getInstance().cleanup();
        console.log('Database connections closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Register shutdown handlers
process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

export default DatabaseService;
