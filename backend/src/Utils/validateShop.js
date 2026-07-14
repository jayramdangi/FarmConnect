import validator from 'validator'; 


const validate= (data)=>{


     const mandatoryField = [
        'password', 'emailId', 'name', 'ownerName' 
     ]; 

     const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k)); 

     if(!IsAllowed)
        throw new Error('some field are missing'); 

   //   if(!validator.isEmail(data.emailId))
   //      throw new Error("invalid email"); 

   //   if(!validator.isStrongPassword(data.password))
   //      throw new Error('Week Password'); 





}

export default validate; 