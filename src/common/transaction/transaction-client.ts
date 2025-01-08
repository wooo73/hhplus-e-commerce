import { Prisma } from '@prisma/client';

export interface TransactionManager {
    transaction<T>(action: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}

export const TRANSACTION_MANAGER = 'TransactionManager';
