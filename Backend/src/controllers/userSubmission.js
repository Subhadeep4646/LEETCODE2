const Problem = require('../models/problem');
const { getLanguageById, submitBatch, submitToken } = require('../utils/ProblemUtillity');
const Submission = require('../models/submission');

const submitCode =async (req, res) => {
    
    try{
        const userId = req.result._id;
        console.log("User ID:", userId);
        const { id: problemId } = req.params;  
        console.log("Problem ID:", problemId);
        let { code, language } = req.body;

        // if(language==="cpp")
        //     language="c++";

        if (!code || !language) {
            return res.status(400).json({ error: "All fields are required" });
        }


        //fetch the problem from the database
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            testCasesPassed: 0,
            testCasesTotal:problem.HiddenTestCases.length,
        });
         
        const language_Id = getLanguageById(language);
        if(!language_Id){
            return res.status(400).json({ error: "Invalid language in reference solutions" });
        }   

        //batch of submission
        const submission_batch = problem.HiddenTestCases.map((testCase) => ({
            source_code: code,
            language_id: language_Id,
            stdin: testCase.input,
            expected_output: testCase.output,
        }));

        const submitresult = await submitBatch(submission_batch);
        //now this will return an array of tokens for each submission

        const tokens=submitresult.map((value) => value.token);

        const testResults= await submitToken(tokens);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted'; //default status
        let errorMessage = '';

        for(const test of testResults){
            console.log("Test Result:", test.status_id);
            console.log('stdout:', test.stdout);
            console.log('expected:', test.expected_output);  // only if you echo it back
            if(test.status_id === 3){ //status_id 3 means accepted
            testCasesPassed++;
            runtime += parseFloat(test.time); //assuming time is in seconds
            memory = Math.max(test.memory,memory); //assuming memory is in bytes
            }
            else{
                status = 'wrong_answer'; //or any other status based on the error
                errorMessage = test.stderr || 'Test case failed';
            }
        }

        submission.testCasesPassed = testCasesPassed;
        submission.runtime = runtime;
        submission.memory = memory;
        submission.status = status;
        submission.errorMessage = errorMessage;
        submission.totalTestCases = problem.HiddenTestCases.length;
        //save the submission to the database
        await submission.save();

        console.log(req.result);
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        const accepted=(status==='accepted')
        return res.status(201).json({
        accepted,
        totalTestCases:submitresult.testCasesTotal,
        passedTestCases:testCasesPassed,
        runtime,
        memory
        });
    }           
    catch(error){
        console.error("Error in submitCode:", error);
        return res.status(400).json({ error: error.message });
    }
};

const runCode = async (req ,res) =>{
    try{
        const userId = req.result._id;
        console.log("User ID:", userId);
        const { id: problemId } = req.params;  
        console.log("Problem ID:", problemId);
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: "All fields are required" });
        }
        //fetch the problem from the database
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        const language_Id = getLanguageById(language);
        if(!language_Id){
            return res.status(400).json({ error: "Invalid language in reference solutions" });
        }   

        //batch of submission
        const submission_batch = problem.VisibleTestCases.map((testCase) => ({
            source_code: code,
            language_id: language_Id,
            stdin: testCase.input,
            expected_output: testCase.output,
        }));

        const submitresult = await submitBatch(submission_batch);
        //now this will return an array of tokens for each submission

        const tokens=submitresult.map((value) => value.token);

        const testResults= await submitToken(tokens);
        
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true; //default status
        let errorMessage = '';

        for(const test of testResults){
            // console.log("Test Result:", test.status_id);
            // console.log('stdout:', test.stdout);
            // console.log('expected:', test.expected_output);  // only if you echo it back
            if(test.status_id === 3){ //status_id 3 means accepted
            testCasesPassed++;
            runtime += parseFloat(test.time); //assuming time is in seconds
            memory = Math.max(test.memory,memory); //assuming memory is in bytes
            }
            else{
                if(test.status_id===4){
                status = false; //or any other status based on the error
                errorMessage = test.stderr || 'Test case failed';
            }
            else{
                status=false,
                errorMessage =test.stderr;
            }

        }
    }
        return res.status(201).json({ 
            success:status,
            testCases:testResults,
            runtime,
            memory
        });
    }           
    catch(error){
        console.error("Error in runCode:", error);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    submitCode,
    runCode
};