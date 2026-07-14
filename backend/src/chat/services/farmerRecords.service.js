import { Op } from "sequelize";
import { EntryRecord, Crop } from "../../Models/associations.js";

export const fetchFarmerRecords = async ({
  shopId,
  farmerId,
  sqlFrom,
  sqlTo,
}) => {
  if (sqlFrom === sqlTo) {
    return EntryRecord.findAll({
      where: {
        shopId,
        farmerId,
        date: sqlFrom,
      },
      include: [
        {
          model: Crop,
          attributes: ["id", "name"],
        },
      ],
    });
  }

  return EntryRecord.findAll({
    where: {
      shopId,
      farmerId,
      date: {
        [Op.between]: [sqlFrom, sqlTo],
      },
    },
    include: [
      {
        model: Crop,
        attributes: ["id", "name"],
      },
    ],
    order: [["date", "ASC"]],
  });
};
