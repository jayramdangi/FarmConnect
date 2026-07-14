// controller/shopController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Shop, Mandi } from "../Models/associations.js";




export const loginShop = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const shop = await Shop.findOne({ where: { emailId } });
    if (!shop) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passOk = await bcrypt.compare(password, shop.passwordHash);
    if (!passOk) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const mandi = shop.mandiId
      ? await Mandi.findByPk(shop.mandiId)
      : null;

    const token = jwt.sign(
      { _id: shop.id, emailId: shop.emailId, role: "shop" },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    const reply = {
      _id: shop.id,
      name: shop.name,
      ownerName: shop.ownerName,
      emailId: shop.emailId,
      role: "shop",
      mandi_name: mandi?.name || null,
      mandi_location: mandi?.location || null
    };

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 5
    });

    return res.status(200).json({
      user: reply,
      message: "Login successful"
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || err });
  }
};










