

import { Op } from "sequelize";
import { EntryRecord, Farmer, Crop } from "../Models/associations.js";


export const getShopRecordsByDate = async (req, res) => {
  try {
    const shopId = req.result.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    const records = await EntryRecord.findAll({
      where: { shopId, date },

      attributes: [
        "id",
        "farmerId",
        "cropId",
        "quantity",
        "rate",
        "date"
      ],

      include: [
        {
          model: Farmer,
          attributes: ["id", "name"]
        },
        {
          model: Crop,
          attributes: ["id", "name"]
        }
      ],

      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Shop records fetched successfully",
      records,
    });

  } catch (err) {
    console.error("getShopRecordsByDate error:", err);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
};


export const createEntryRecord = async (req, res) => {
  try {
    const shopId = req.result.id;
    const { farmerId, cropId, quantity, date } = req.body;

    if (!farmerId || !cropId || !quantity || !date) {
      return res.status(400).json({
        error: "farmerId, cropId, quantity, and date are required",
      });
    }

    const farmer = await Farmer.findByPk(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    const record = await EntryRecord.create({
      shopId,
      farmerId,
      cropId,
      quantity,
      date,
      mandiId:req.result.mandiId,

      rate: null,
      soldStatus: "notsold",
      transactionStatus: "notdone",
    });

    return res.status(201).json({
      message: "Entry record created successfully",
      record,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error: " + (err.message || err),
    });
  }
};


export const updateEntryRecord = async (req, res) => {
  try {
    const shopId = req.result.id;
    const { recordId, ...updateData } = req.body;

    if (!recordId) {
      return res.status(400).json({ error: "recordId is required" });
    }

    const record = await EntryRecord.findOne({
      where: { id: recordId, shopId },
    });

    if (!record) {
      return res.status(404).json({ error: "Entry record not found" });
    }

    await record.update(updateData);

    return res.status(200).json({
      message: "Entry record updated successfully",
      updatedRecord: record,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error: " + (err.message || err),
    });
  }
};


export const bulkUpdateEntryRecords = async (req, res) => {
  try {
    const shopId = req.result.id;
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        error: "updates must be a non-empty array",
      });
    }

    const updatedRecords = [];

    for (const upd of updates) {
      const { id, ...updateData } = upd;

      const record = await EntryRecord.findOne({
        where: { id, shopId },
      });

      if (!record) continue;

      await record.update(updateData);
      updatedRecords.push(record);
    }

    return res.status(200).json({
      message: "Bulk entry records update complete",
      updatedRecords,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error: " + (err.message || err),
    });
  }
};


export const deleteEntryRecord = async (req, res) => {
  try {
    const shopId = req.result.id;
    const { recordId } = req.params;

    const record = await EntryRecord.findOne({
      where: { id: recordId, shopId },
    });

    if (!record) {
      return res.status(404).json({ error: "Entry record not found" });
    }

    await record.destroy();

    return res.status(200).json({
      message: "Entry record deleted successfully",
      deletedRecordId: recordId,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error: " + (err.message || err),
    });
  }
};

export const deleteShopRecordsByDate = async (req, res) => {
  try {
    const shopId = req.result.id;
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    const deletedCount = await EntryRecord.destroy({
      where: { shopId, date },
    });

    return res.status(200).json({
      message: "Shop records deleted successfully",
      date,
      deletedCount,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error: " + (err.message || err),
    });
  }
};



export const listFarmers = async (req, res)=>{
   

    try{
       const {search}= req.query; 

       const where = {}; 


        if(search){
           where.name = {
            [Op.iLike]:`%${search}%`
           }
        }

      const farmers = await Farmer.findAll({
        where, 
        attributes: ["id", "name"], 
        order:[["name", "ASC"]], 
        limit: 20
      })
 
        res.status(200).json({
          farmers
        }); 

    }

     catch(err)
     {
       res.status(500).json({
        error: err.message || "Failed to fetch farmers"
       }); 
     }


}; 