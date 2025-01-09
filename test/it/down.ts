import { disconnectPrisma } from './util';

const down = async () => {
    await global.mysql.stop();
    await disconnectPrisma();
};

export default down;
