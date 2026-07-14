
import jwt from 'jsonwebtoken'; 
import { Farmer } from '../Models/associations.js';

const FarmerMiddleware = async(req , res, next)=>{
     
      
      try{
        console.log("somebodycomes")
        
        const {token} = req.cookies; 
        console.log(token)

        if(!token)
            throw new Error("Token is not present");

         const payload = jwt.verify(token, process.env.JWT_KEY); 
         console.log(payload);

         const {_id} = payload; 

         if(!_id)
            throw new Error("invalid token"); 

         if(payload.role!='farmer' && payload.role!='Farmer')
            throw new Error('invalid token'); 

         const result = await Farmer.findByPk(_id); 


          if(!result)
            throw new Error("User Doesn't exist"); 

           req.result = result.dataValues; 
           console.log("Goes out of farmerMiddleware")

           next(); 
        

        



      }
      catch(err)
      { console.log(err); 
         res.status(401).send("Error:"+ err.message);
         
      }
     

     
}

export {FarmerMiddleware}; 