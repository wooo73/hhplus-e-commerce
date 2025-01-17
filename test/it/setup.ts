import { MySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';

const init = async () => {
    await Promise.all([initMysql()]);
};

const initMysql = async () => {
    const mysql = await new MySqlContainer('mysql:8')
        .withDatabase('testDB')
        .withUser('root')
        .withRootPassword('test1234')
        .start();

    global.mysql = mysql;

    process.env.DATABASE_URL = `mysql://${mysql.getUsername()}:${mysql.getUserPassword()}@${mysql.getHost()}:${mysql.getPort()}/${mysql.getDatabase()}`;

    try {
        // schema.prisma 기반으로 테이블 생성
        execSync('npx prisma db push --force-reset', {
            stdio: 'inherit',
            env: { ...process.env },
        });

        execSync('npm run seed:test', {
            stdio: 'inherit',
            env: { ...process.env },
        });
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};

export default init;
