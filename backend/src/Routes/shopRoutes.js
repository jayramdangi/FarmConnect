
import express from "express";
const shopRouter = express.Router();

import {
  listFarmers,
  createEntryRecord,
  getShopRecordsByDate,
  updateEntryRecord,
  deleteEntryRecord,
  bulkUpdateEntryRecords
} from "../Controllers/RecordController.js";

import { ShopMiddleware } from "../Middleware/ShopMiddleware.js";



shopRouter.get(
  "/records",
  ShopMiddleware,
  getShopRecordsByDate
);


shopRouter.post(
  "/records",
  ShopMiddleware,
  createEntryRecord
);


shopRouter.patch(
  "/records/:id",
  ShopMiddleware,
  updateEntryRecord
);


shopRouter.patch(
  "/records/bulk",
  ShopMiddleware,
  bulkUpdateEntryRecords
);


shopRouter.delete(
  "/records/:id",
  ShopMiddleware,
  deleteEntryRecord
);




shopRouter.get("/list" , ShopMiddleware , listFarmers); 

export { shopRouter };
