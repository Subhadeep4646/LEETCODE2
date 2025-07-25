const express= require('express');
const aiRouter = express.Router();
const adminMiddleware = require('../../middleware/adminMiddleware')
const SolveDoubts=require('../controllers/SolveDoubts')



aiRouter.post("/chat",adminMiddleware,SolveDoubts);
module.exports=aiRouter;
