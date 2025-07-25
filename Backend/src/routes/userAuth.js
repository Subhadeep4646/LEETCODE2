const express = require('express');
const User = require('../models/user.js');
const router = express.Router();

const { registerUser, loginUser , logoutUser,adminRegister,deleteProfile } = require('../controllers/userfunc.js');
const userMiddleware = require('../../middleware/usermiddleware.js');
const adminMiddleware = require('../../middleware/adminMiddleware.js');

//register user,login user,logout user,get profile,update profile,reset password,forgot password

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',userMiddleware, logoutUser);
router.post('/admin/register',adminMiddleware, adminRegister); // Assuming you have an adminMiddleware for admin routes
// router.get('/profile', getProfile);
router.post('/deleteProfile',userMiddleware,deleteProfile);
router.get('/checkAuth', userMiddleware, (req, res) => {
    const reply ={
        _id:User._id,
        firstname:User.firstname,
        email_id:User.email_id,
        role:req.result.role
      }
    res.status(200).json({ 
        user: reply,
        message: 'User is authenticated' });
});



module.exports = router;
