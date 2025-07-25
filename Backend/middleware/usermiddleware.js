
const jwt = require('jsonwebtoken');
const User = require('../src/models/user');

const redisClient = require('../config/redis');

const userMiddleware = async(req, res,next) => {
    try {
        // Check if the user is authenticated
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Verify the token (assuming you have a function to verify JWT)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {_id}= decoded;

        if(!_id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const result=await User.findById(_id);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        //now check if the user is blocked or not

        const isBlocked=await redisClient.exists(`token:${token}`);

        if(isBlocked) {
            return res.status(403).json({ error: "User is blocked" });
        }

        req.result = result; // Attach user data to the request object
        next(); 
    } catch (error) {
        console.error("Error in userMiddleware:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = userMiddleware;