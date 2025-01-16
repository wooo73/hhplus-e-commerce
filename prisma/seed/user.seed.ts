import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMockUser = async (balance: number) => {
    const user = await prisma.user.create({
        data: { balance },
    });

    return user;
};
