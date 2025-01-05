import { DataSource } from 'typeorm';
import * as process from 'process';
import { PrismaClient } from '@prisma/client';

let datasource: DataSource;

export const getDatasource = async () => {
    if (datasource) {
        return datasource;
    }
    datasource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        migrations: [`migrations/*`],
        logging: true,
        entities: [`**/*.entity.ts`],
        relationLoadStrategy: 'join',
    });
    await datasource.initialize();
    return datasource;
};

let prismaClient: PrismaClient;

export const getPrismaClient = async () => {
    if (prismaClient) {
        return prismaClient;
    }

    prismaClient = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
    try {
        await prismaClient.$connect();
        return prismaClient;
    } catch (error) {
        console.error('Failed to connect to database:', error);
        throw error;
    }
};
