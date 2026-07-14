import e from "express";
export const chatRouter = e.Router(); 
import { handleUnifiedChat } from "../chat/controllers/unifiedChat.controller.js";
import { FarmerMiddleware } from "../Middleware/FarmerMiddleware.js";

chatRouter.post('/handleChat', FarmerMiddleware, handleUnifiedChat);