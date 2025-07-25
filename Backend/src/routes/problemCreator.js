const express= require('express');
const Problemrouter = express.Router();

const adminMiddleware = require('../../middleware/adminMiddleware')
const {problemCreate,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblemsByUser,getSubmissionsByUser} = require('../controllers/userProblem');
const userMiddleware = require('../../middleware/usermiddleware');
const rateLimiter = require('../../middleware/rateLimiter'); // Assuming you have a rate limiter middleware

Problemrouter.post("/create",adminMiddleware,problemCreate);
Problemrouter.get('/getProblem/:id',userMiddleware,getProblemById);
Problemrouter.get('/getAllProblems',userMiddleware,getAllProblems);
Problemrouter.put('/update/:id',adminMiddleware,updateProblem);
Problemrouter.delete('/delete/:id',adminMiddleware,deleteProblem);
Problemrouter.get('/solvedProblemsByUser',userMiddleware,solvedProblemsByUser);
Problemrouter.get('/submissions/:id',userMiddleware,getSubmissionsByUser); // Assuming this is for getting submissions by user
module.exports=Problemrouter;