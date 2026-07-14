
import {Mandi} from "../Models/associations.js"; 
import {Farmer} from "../Models/associations.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Shop } from "../Models/associations.js";

export const loginUser = async (req, res) => {
    console.log(req.body); 
  try {
    const { emailId, password, role } = req.body;

    // Validate input
    if (!emailId || !password || !role) {
      return res.status(400).json({ error: "Email, password and role are required" });
    }

    let Model;
    let roleSpecificData = {};

    // Determine model based on role
    if (role === "shop") {
      Model = Shop;
    } else if (role === "farmer") {
      Model = Farmer;
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Find user
    const user = await Model.findOne({ where: { emailId } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const passOk = await bcrypt.compare(password, user.passwordHash || user.password);
    if (!passOk) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Role-specific data processing
    if (role === "shop") {
      const mandi = user.mandiId ? await Mandi.findByPk(user.mandiId) : null;
      roleSpecificData = {
        mandi_name: mandi ? mandi.name : null,
        mandi_location: mandi ? mandi.location : null
      };
    } else if (role === "farmer") {
      roleSpecificData = {
        location: user.location,
        phoneNo: user.phoneNo
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: user.id, 
        emailId: user.emailId, 
        role: role 
      },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    // Prepare response
    const reply = {
      _id: user.id,
      name: user.name,
      emailId: user.emailId,
      role: role,
      ...roleSpecificData
    };

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    });

    return res.status(200).json({ 
      user: reply, 
      message: `${role} logged in successfully` 
    });

  } catch (err) {
    return res.status(500).json({ error: "Error: " + (err.message || err) });
  }
};