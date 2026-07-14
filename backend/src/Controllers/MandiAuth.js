// controllers/mandiController.js
import { Mandi, Shop } from "../Models/associations.js";
import { sequelize } from "../Config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateMandi from "../Utils/validateMandi.js"; 
import validateShop  from '../Utils/validateShop.js'




export const registerMandi = async (req, res) => {
  try {
    console.log("somebody comes at register mandi")
    validateMandi(req.body);

    const { name, location, emailId, password } = req.body;

   
    const existing = await Mandi.findOne({ where: { emailId } });
    if (existing) return res.status(400).json({ error: "Email already registered" });

   
    const passwordHash = await bcrypt.hash(password, 10);

   
    const mandi = await Mandi.create({ name, location, emailId, passwordHash });

  
    const token = jwt.sign(
      { _id: mandi.id, emailId: mandi.emailId, role: "Mandi" },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    const reply = {
      _id: mandi.id,
      name: mandi.name,
      location: mandi.location,
      emailId: mandi.emailId,
      role: "Mandi",
    };

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 5, 
    });

    return res.status(201).json({ user: reply, message: "Mandi registered successfully" });
  } catch (err) {
    return res.status(400).json({ error: "Error: " + (err.message || err) });
  }
};


export const loginMandi = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) return res.status(400).json({ error: "Invalid credentials" });

    const mandi = await Mandi.findOne({ where: { emailId } });
    if (!mandi) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, mandi.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { _id: mandi.id, emailId: mandi.emailId, role: "Mandi" },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    const reply = {
      _id: mandi.id,
      name: mandi.name,
      location: mandi.location,
      emailId: mandi.emailId,
      role: "Mandi",
    };

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    });

    return res.status(200).json({ user: reply, message: "Mandi logged in successfully" });
  } catch (err) {
    return res.status(400).json({ error: "Error: " + (err.message || err) });
  }
};


export const registerShop = async (req, res) => {
  try {
    

     console.log("hello"); 
    const { name, ownerName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
 
     console.log("hello2"); 
     console.log(req.result.dataValues.id); 
   
    const shop = await Shop.create({
      name,
      ownerName,
      emailId,
      passwordHash,
      mandiId: req.result.dataValues.id
    });

    
   

    const reply = {
      _id: shop.id,
      name: shop.name,
      ownerName: shop.ownerName,
      emailId: shop.emailId,
      role: "Shop",
      mandi_name: req.result.dataValues.name,
      mandi_location: req.result.dataValues.location
    };

 

    return res.status(201).json({
      user: reply,
      message: "Shop registered successfully"
    });
  } catch (err) {
    console.log(err.name); 
    return res.status(400).json({ error: err.message || err });
  }
};


