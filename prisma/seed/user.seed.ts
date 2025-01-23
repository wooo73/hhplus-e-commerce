import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/database/prisma/prisma.service';

const configService = new ConfigService();
const prisma = new PrismaService(configService);

export const createMockUser = async (balance: number) => {
    const user = await prisma.user.create({
        data: { balance },
    });

    return user;
};
