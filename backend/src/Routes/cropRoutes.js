import express from "express";
import {
  createCrop,
  updateCrop,
  deleteCrop,
  getAllCrops
} from "../Controllers/CropController.js";
import { MandiMiddleware } from "../Middleware/MandiMiddleware.js";

export const cropRouter = express.Router();


cropRouter.post(
  "/create",
  MandiMiddleware,
  createCrop
);

cropRouter.put(
  "/update/:cropId",
  MandiMiddleware,
  updateCrop
);


cropRouter.delete(
  "/delete/:cropId",
  MandiMiddleware,
  deleteCrop
);


cropRouter.get(
  "/list",
  getAllCrops
);
