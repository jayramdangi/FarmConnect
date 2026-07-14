import validator from 'validator';


const validate = (data)=>{
     
     const mandatoryField = [
        'password', 'name', 'location', 
        'phoneNo', 'emailId'
     ]; 

     const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k)); 
    
         if(!IsAllowed)
            throw new Error('some field are missing'); 
    
         if(!validator.isEmail(data.email))
            throw new Error("invalid email"); 
    
        

       
}
export default validate; 