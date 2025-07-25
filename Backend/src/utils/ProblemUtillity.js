const axios = require('axios');
const getLanguageById = (language) => {
    const languages = {
        cpp: 54,
        java: 62,
        javascript: 63,
        python: 71
    };
    
    return languages[language.toLowerCase()] || null;
}

const submitBatch = async (submissions) => {

     // This function should implement the logic to submit a batch of code submissions
     const options = {
       method: 'POST',
       url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
       params: {
         base64_encoded: 'false'
       },
       headers: {
         'x-rapidapi-key': '7e2b4a0a69msh76abf8989667e0bp16dbd6jsn27cb774fa78b',
         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
         'Content-Type': 'application/json'
       },
       data: {
         submissions
     }
    };
     
     async function fetchData() {
         try {
             const response = await axios.request(options);
             return response.data;
         } catch (error) {
             console.error(error);
         }
     }
     
     return await fetchData();
}

// This function should implement the logic to submit a batch of code submissions
//wait for 1 second before checking the status of the submissions
const waiting = async (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
}


const submitToken = async (tokens) => { 
     
const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokens.join(","),
    // This parameter is used to specify the format of the response
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '7f46703e3dmsh8a139868dc06dd3p1c33cdjsn75d0cbb80e8f',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
        return response.data;
	} catch (error) {
		console.error(error);
	}
}

  while(1){
  const result = await fetchData();

    const res_obtained=result.submissions.every((r) => r.status_id>2);
    if(res_obtained) {
        return result.submissions;
    }
    await waiting(1000);
}
}
module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};