const down = async () => {
    await global.mysql.stop();
};

export default down;
