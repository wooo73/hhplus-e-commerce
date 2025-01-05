import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private logger = new Logger(PrismaService.name);

    constructor(private readonly configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
                },
            },
            log: [{ emit: 'event', level: 'query' }],
        });
    }

    async onModuleInit() {
        this.prismaLog();
        await this.$connect();
    }

    prismaLog() {
        if (this.configService.get('NODE_ENV') === 'dev') {
            (this.$on as any)('query', (e: Prisma.QueryEvent) => {
                this.logger.debug(`Query: ${e.query}`);
                this.logger.debug(`Duration: ${e.duration}ms`);
            });
        }
    }

    async enableShutdownHooks() {
        process.on('beforeExit', async () => {
            await this.$disconnect();
        });
    }
}
