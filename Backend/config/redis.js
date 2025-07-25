const { createClient } = require('redis');

const redisClient = createClient({
  url: `redis://default:${process.env.REDIS_KEY}@redis-15272.crce182.ap-south-1-1.ec2.redns.redis-cloud.com:15272`
});

redisClient.on('error', (err) => console.error('Redis connection error:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();

module.exports = redisClient;
