
import jwt from 'jsonwebtoken'; 
import { Mandi } from '../Models/associations.js';

const MandiMiddleware = async(req , res, next)=>{
     console.log("Enters middleware")
      
      try{
        
        
        const {token} = req.cookies; 

        if(!token)
            throw new Error("Token is not present");

         const payload = jwt.verify(token, process.env.JWT_KEY);
         
         console.log(payload)

         const {_id} = payload; 

         if(!_id)
            throw new Error("invalid token"); 

         console.log("okay1"); 

         if(payload.role!='Mandi')
            throw new Error('invalid token'); 
         console.log("okay2"); 

         const result = await Mandi.findByPk(_id); 

          console.log("okay3"); 

          if(!result)
            throw new Error("Mandi Doesn't exist"); 
         console.log("okay4"); 

           req.result = result; 

           console.log("okay5"); 

           next(); 
        





      }
      catch(err)
      {
          console.log(err); 
         res.status(401).send("Error:"+ err.message);
         
      }
     

     
}

export {MandiMiddleware}; 