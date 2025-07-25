const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require('../../config/redis'); 
const Submission = require("../models/submission"); 

const registerUser = async (req, res) =>{
    try{
          validate(req.body);
          const { firstname, lastname, email_id,password } = req.body;
          req.body.password= await bcrypt.hash(password, 10);
          req.body.role = "user"; // Default role for new users

          const user_exist = await User.findOne({ email:email_id });

             if (user_exist) {
             return res.status(409).json({
              message: "User already exists"
             });
            }


          const user = await User.create({
              firstname,
              lastname,
              email_id,
              password : req.body.password,
          });
          const reply ={
            _id:user._id,
            firstname:user.firstname,
            email_id:user.email_id,
          }
          const token= jwt.sign({_id:user._id , email_id,role:"user" }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.cookie("token", token, {maxAge: 3600000});
          res.status(201).json({
            user:reply,
            message: "User registered successfully",
          }
          );
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(400).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        console.log("Login request received:", req.body);
        console.log("Request body:", req.body);
        const { email_id, password } = req.body;
        if (!email_id || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await User.findOne({ email_id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const reply ={
            _id:user._id,
            firstname:user.firstname,
            email_id:user.email_id,
            role:user.role
        }
        const token = jwt.sign({ _id: user._id, email_id,role:user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, { maxAge: 3600000 });
        res.status(201).json({
            user: reply,
            message: "Login successful",
        });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(400).json({ error: error.message });
    }
}


const logoutUser = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ error: "No token found" });
    }

    const payload = jwt.decode(token);
    if (!payload || !payload.exp) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Ensure Redis client is connected
    if (!redisClient.isOpen) await redisClient.connect();

    // Block the token by storing it in Redis
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);

    // Clear the cookie
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
    
    return res.status(200).send("Logout successful");

  } catch (error) {
    console.error("Error in logoutUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const adminRegister =async(req,res)=>{
    try{
        validate(req.body);
        const { firstname, lastname, email_id,password } = req.body;
        req.body.password= await bcrypt.hash(password, 10);
        req.body.role = "admin"; 

        const user = await User.create({
            firstname,
            lastname,
            email_id,
            password : req.body.password,
            role: "admin",      
        });
        const token= jwt.sign({_id:user._id , email_id,role:"admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {maxAge: 3600000});
        res.status(201).send("User registered successfully");
  }
  catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(400).json({ error: error.message });
  }
}

const deleteProfile = async(req,res)=>{
    try{
        const id =req.result._id;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        await User.findByIdAndDelete(id);

        await Submission.deleteMany({ userId: id });
        res.status(200).json({ message: "Profile deleted successfully" });
    }
    catch{
        console.error("Error in deleteProfile:", error);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    adminRegister,
    deleteProfile
};