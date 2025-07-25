const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const path = require('path');
const fs = require('fs');
const userAuthRoutes = require('./routes/userAuth');
const connectDB = require('../config/db');
const redisClient = require('../config/redis');
const Problemrouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const rateLimiter = require('../middleware/rateLimiter'); // Assuming you have a rate limiter middleware
const cors = require('cors');
const aiRouter=require('./routes/aiRouter')

const cookieParser = require('cookie-parser');
const videoRouter = require('./routes/videoCreater');
const otpRouter = require('./routes/Otp');
// const userMiddleware = require('../middleware/usermiddleware');


app.use(express.json()); // to convert JSON body to JS object
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the client URL
    credentials: true, // Allow cookies to be sent with requests
}));


app.use(cookieParser()); //extracts raw cookie data from the HTTP request header into a JavaScript object that’s easy to use in your code.
app.use('/user', userAuthRoutes);
app.use('/problem', Problemrouter); 
//app.use(rateLimiter ); // Apply userMiddleware to all routes under /problem
app.use('/user', submitRouter); // Apply userMiddleware to all submit routes
app.use('/ai',aiRouter);
app.use('/video',videoRouter)
app.use('/user',otpRouter)


if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../../Frontend/dist');
    const indexPath = path.join(distPath, 'index.html');
  
    if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
      console.log("✅ Serving static files from:", distPath);
      app.use(express.static(distPath));
  
      app.get(/.*/, (req, res) => {
        res.sendFile(indexPath);
      });
    } else {
      console.warn("⚠️  Static files not found at:", distPath);
      console.warn("🛠️  Please build your frontend before running in production mode.");
    }
  }


const InitializeConnection = async()=>{
    try{
        await Promise.all([connectDB(),redisClient.connect()]);
        console.log('Redis connected successfully');
       //ng the problem router to handle problem-related routes
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
    })
    }   
    catch(err){
        console.error('Redis connection error:', err);
    }
}

InitializeConnection();



// admin register is left