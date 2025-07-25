const {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_KEY, // Ensure you set this in your environment variables
    socket: {
        host: 'redis-15272.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15272
    }
});

module.exports = redisClient;
