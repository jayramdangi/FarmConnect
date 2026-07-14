

import e from "express";
export const mandiAuthRouter = e.Router(); 



import { loginMandi, registerMandi, registerShop } from "../Controllers/MandiAuth.js";
import { MandiMiddleware } from "../Middleware/MandiMiddleware.js";



mandiAuthRouter.post('/register', registerMandi);
mandiAuthRouter.post('/login', loginMandi);  
mandiAuthRouter.post('/registerShop', MandiMiddleware, registerShop ); 


