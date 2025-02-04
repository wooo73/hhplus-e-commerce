const down = async () => {
    await global.mysql.stop();
    await global.redis.stop();
};

export default down;
