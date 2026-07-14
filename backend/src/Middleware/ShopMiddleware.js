
import jwt from 'jsonwebtoken'; 

import Shop from '../Models/shop.js';

const ShopMiddleware = async (req , res , next)=>{

     try{

        const {token}= req.cookies; 

        
        if(!token)
            throw new Error("Token is not present"); 

        const payload = jwt.verify(token, process.env.JWT_KEY); 
        console.log(payload)

        const {_id}= payload; 

        if(!_id)
            throw new Error("Invalid Token"); 

        if(payload.role!='shop')
            throw new Error("invalid token"); 

        const result = await Shop.findByPk(_id); 

        if(!result)
        {
             throw new Error("Invalid Token"); 
        }

         req.result = result.dataValues; 
         console.log(result); 

        next(); 
         



     }
     catch(err)
     {
         res.status(401).send("Error:"+ err.message); 
     }



}

export {ShopMiddleware}; 