import { MySqlContainer } from '@testcontainers/mysql';
import { RedisContainer } from '@testcontainers/redis';
import { execSync } from 'child_process';

const init = async () => {
    await Promise.all([initMysql(), initRedis()]);
};

const initMysql = async () => {
    const mysql = await new MySqlContainer('mysql:8')
        .withDatabase('testDB')
        .withUser('root')
        .withRootPassword('test1234')
        .start();

    global.mysql = mysql;

    process.env.DATABASE_URL = `mysql://${mysql.getUsername()}:${mysql.getUserPassword()}@${mysql.getHost()}:${mysql.getPort()}/${mysql.getDatabase()}`;

    // schema.prisma 기반으로 테이블 생성
    execSync('npx prisma db push --force-reset', {
        stdio: 'inherit',
        env: { ...process.env },
    });

    execSync('npm run seed:test', {
        stdio: 'inherit',
        env: { ...process.env },
    });
};

const initRedis = async () => {
    const redis = await new RedisContainer('redis:7.0').withExposedPorts(6379).start();

    process.env.REDIS_URL = `redis://localhost:${redis.getMappedPort(6379)}`;

    global.redis = redis;
};

export default init;
