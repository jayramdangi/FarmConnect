

import e from "express";
export const farmerAuthRouter = e.Router(); 



import { loginFarmer, registerFarmer } from "../Controllers/farmerAuth.js";



farmerAuthRouter.post('/register', registerFarmer);
farmerAuthRouter.post('/login', loginFarmer);  

