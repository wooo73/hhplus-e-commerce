import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TransactionManager } from './transaction-client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
    constructor(private readonly prisma: PrismaService) {}

    async transaction<T>(action: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return await this.prisma.$transaction(action);
    }
}
