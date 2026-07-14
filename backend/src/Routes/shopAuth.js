// src/Routes/shopAuth.js
import express from "express";
const shopAuthRouter = express.Router();

// IMPORTANT: include .js and correct path/casing
import { loginShop } from "../Controllers/shopController.js";

shopAuthRouter.post('/login', loginShop);



export { shopAuthRouter };
