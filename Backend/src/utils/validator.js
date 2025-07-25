const validator = require("validator");

const validate = (data)=>{
     const mandatoryFields = ['firstname', 'email_id', 'password'];
     console.log(data);
     for (const field of mandatoryFields) {
         if (!data[field]) {
             throw new Error(`${field} is required`);
         }
     }
     if (!validator.isEmail(data.email_id)) {
         throw new Error('Invalid email format');
     }

    if( !validator.isAlpha(data.firstname)) {
         throw new Error('First name and last name must contain only letters');
     }
}

module.exports = validate;