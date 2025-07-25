const redisClient = require('../config/redis');

const windowSize = 10; // seconds
const maxRequests = 15; // maximum requests allowed in the window

const rateLimiter = async (req, res, next) => {
    if (!req.result || !req.result._id) {
        return res.status(401).json({ error: 'Unauthorized: User ID missing for rate limiting' });
    }

    try {
        const key = `rateLimit:sortedSet:${req.ip}`
        const current_time = Date.now()/1000; // seconds
        const windowStart = current_time - windowSize;
        await redisClient.zRemRangeByScore(key, 0, windowStart); // Remove old requests outside the window
        const requestCount = await redisClient.zCard(key); // Get the count of requests in the current window
        if (requestCount >= maxRequests) {
            return res.status(429).json({ error: 'please try 5 secs later' });
        }
        await redisClient.zAdd(key,[{score:current_time ,value:`${current_time}:${Math.random()}`}]); 
        // Add the current request timestamp to the sorted set with a unique value to avoid duplicates
        await redisClient.expire(key, windowSize); // Set the expiration for the key to the window size
        next();

    } catch (error) {
        console.error("Error in rateLimiter:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = rateLimiter;


//A unique Redis key is created per IP address (or user).
