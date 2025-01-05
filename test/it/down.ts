import { getPrismaClient } from './util';

const down = async () => {
    await global.mysql.stop();
    await (await getPrismaClient()).$disconnect();
};

export default down;
