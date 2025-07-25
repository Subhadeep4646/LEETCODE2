const Problem = require('../models/problem');
const {getLanguageById} = require('../utils/ProblemUtillity');
const {submitBatch, submitToken} = require('../utils/ProblemUtillity');
const User = require('../models/user');
const Submission = require('../models/submission');
const SolutionVideo = require("../models/Video")


const problemCreate = async (req,res)=>{
    console.log("Incoming data:", req.body);
     const {VisibleTestCases,referenceSolutions} = req.body;


        try{
             for(const {language,completeCode} of referenceSolutions){
                if(!['c', 'cpp', 'java', 'python', 'javascript'].includes(language)){
                    return res.status(400).json({ error: "Invalid language in reference solutions" });
                }

                const language_Id = getLanguageById(language);
                if(!language_Id){
                    return res.status(400).json({ error: "Invalid language in reference solutions" });
                }   

                //batch of submission
                const submission = VisibleTestCases.map((testCase) => ({
                    source_code: completeCode,
                    language_id: language_Id,
                    stdin: testCase.input,
                    expected_output: testCase.output,
                }));

                const submitresult = await submitBatch(submission);
                //now this will return an array of tokens for each submission

                const tokens=submitresult.map((value) => value.token);

                const testResults= await submitToken(tokens);

                 console.log("Test Results:", testResults);

                for(let i=0;i<testResults.length;i++){
                    if(testResults[i].status_id !== 3){ 
                        return res.status(400).json({ error: `Reference solution failed for test case ${i+1}` });
                    }
                }
            }

            //we can store the problem in the database
            const problem = await Problem.create({
                ...req.body,
                ProblemCreator:req.result._id,
            });
            return res.status(201).json({ message: "Problem created successfully", problem });
        }
        catch(error){
            console.error("Error in createProblem:", error);
            return res.status(400).json({ error: error.message });
        }
};

const updateProblem = async (req, res) => {
    // Implement the logic to update a problem
    const { id } = req.params;
    try{
        if(!id){
            return res.status(400).json({ error: "Problem ID is required" });
        }
        const validId = await Problem.findById(id);
        if(!validId){
            return res.status(404).json({ error: "Problem not found" });
        }
        const {VisibleTestCases,referenceSolutions} = req.body;

        if (!VisibleTestCases || !referenceSolutions) {
        return res.status(400).json({ error: "VisibleTestCases and referenceSolutions are required" });
        }
        for(const {language,completeCode} of referenceSolutions){
            if(!['c', 'cpp', 'java', 'python', 'javascript'].includes(language)){
                return res.status(400).json({ error: "Invalid language in reference solutions" });
            }

            const language_Id = getLanguageById(language);
            if(!language_Id){
                return res.status(400).json({ error: "Invalid language in reference solutions" });
            }   

            //batch of submission
            const submission = VisibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: language_Id,
                stdin: testCase.input,
                expected_output: testCase.output,
            }));

            const submitresult = await submitBatch(submission);
            //now this will return an array of tokens for each submission

            const tokens=submitresult.map((value) => value.token);

            const testResults= await submitToken(tokens);

            // console.log("Test Results:", testResults);

            for(let i=0;i<testResults.length;i++){
                if(testResults[i].status_id !== 3){ 
                    return res.status(400).json({ error: `Reference solution failed for test case ${i+1}` });
                }
            }

        
        }

        //we can update the problem in the database
        const problem = await Problem.findByIdAndUpdate(validId,{...req.body},{ new:true, runValidators: true });
        return res.status(201).json({ message: "Problem updated successfully", problem });
    }
    catch(error){
        console.error("Error in updateProblem:", error);
        return res.status(400).json({ error: error.message });
    }
};

const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try{
        if(!id){
            return res.status(400).json({ error: "Problem ID is required" });
        }
        const validId = await Problem.findById(id);
        if(!validId){
            return res.status(404).json({ error: "Problem not found" });
        }
        const problem = await Problem.findByIdAndDelete(validId);
        return res.status(200).json({ message: "Problem deleted successfully", problem });
    }
    catch(error){
        console.error("Error in deleteProblem:", error);
        return res.status(400).json({ error: error.message });
    }
};

const getProblemById = async (req, res) => {
    const { id } = req.params;
    try{
        if(!id){
            return res.status(400).json({ error: "Problem ID is required" });
        }
        const problemDoc = await Problem.findById(id).select('_id title description difficulty tags VisibleTestCases startCode referenceSolutions');
        if (!problemDoc) {
            return res.status(404).json({ error: "Problem not found" });
        }

        // Always convert to plain object
        const validId = problemDoc.toObject();

        // Check for associated video
        const videos = await SolutionVideo.findOne({ problemId: id });
        if (videos) {
            validId.secureUrl = videos.secureUrl;
            validId.thumbnailUrl = videos.thumbnailUrl;
            validId.duration = videos.duration;
        }

        return res.status(200).json({ message: "Problem fetched successfully", validId });
    } catch (error) {
        console.error("Error in getProblemById:", error);
        return res.status(400).json({ error: error.message });
    }
};

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({}).select('_id title  difficulty tags');
        res.status(200).json({ message: "All problems fetched successfully", problems });
    } catch (error) {
        console.error("Error in getAllProblems:", error);
        return res.status(400).json({ error: error.message });
    }
};

const solvedProblemsByUser = async (req, res) => {
   
    try {
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path: 'problemSolved',
            select: 'title description difficulty tags ',
        })
        console.log(user.problemSolved)
        res.status(200).send(user.problemSolved);
    }
    catch (error) {
        console.error("Error in solvedProblemsByUser:", error);
        return res.status(400).json({ error: error.message });
    }
};

const getSubmissionsByUser = async (req, res) => {
    const userId = req.result._id;
    const { id: problemId } = req.params;
    console.log("User ID:", userId, typeof userId);
    console.log("Problem ID:", problemId, typeof problemId);


    const ans= await Submission.find({ userId, problemId }).populate({ path: 'problemId', select: 'title difficulty tags' });
    if (!ans || ans.length === 0) {
        return res.status(404).json({ error: "No submissions found for this user and problem" });
    }
    res.status(200).json({ message: "Submissions fetched successfully", ans });
}

module.exports = {
    problemCreate,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblems,
    solvedProblemsByUser,
    getSubmissionsByUser
};

