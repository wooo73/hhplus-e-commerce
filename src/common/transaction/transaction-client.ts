import { Prisma } from '@prisma/client';

export interface TransactionClient {
    prisma: Prisma.TransactionClient;
}

export interface TransactionManager {
    transaction<T>(action: (tx: TransactionClient) => Promise<T>): Promise<T>;
}

export const TRANSACTION_MANAGER = 'TransactionManager';
