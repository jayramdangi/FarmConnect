import { Crop} from "../Models/associations.js";

export const createCrop = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Crop name required" });

    const existing = await Crop.findOne({ where: { name } });
    if (existing) return res.status(409).json({ error: "Crop already exists" });

    const crop = await Crop.create({ name });

    return res.status(201).json({ crop });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const { cropId } = req.params;
    const { name } = req.body;

    const crop = await Crop.findByPk(cropId);
    if (!crop) return res.status(404).json({ error: "Crop not found" });

    crop.name = name ?? crop.name;
    await crop.save();

    return res.status(200).json({ crop });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { cropId } = req.params;

    const crop = await Crop.findByPk(cropId);
    if (!crop) return res.status(404).json({ error: "Crop not found" });

    await crop.destroy();
    return res.status(200).json({ message: "Crop deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.findAll({ order: [["name", "ASC"]] });
    return res.status(200).json({ crops });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


