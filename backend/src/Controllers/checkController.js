import jwt from 'jsonwebtoken'
import { Shop } from '../Models/associations.js';
import { Farmer } from '../Models/associations.js';


export const checkController = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (payload.role === 'farmer') {
      const farmer = await Farmer.findOne({ where: { emailId: payload.emailId } });
      if (!farmer) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const reply = {
        _id: farmer.id,
        name: farmer.name,
        location: farmer.location,
        phoneNo: farmer.phoneNo,
        emailId: farmer.emailId,
        role: "farmer"
      };
      
      return res.status(200).json({ user: reply, message: "Farmer authenticated successfully" });
    } 
    else if (payload.role === 'shop') {
      const shop = await Shop.findOne({ where: { emailId: payload.emailId } });
      if (!shop) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      
      const reply = {
      _id: shop.id,
      name: shop.name,
      ownerName: shop.ownerName,
      emailId: shop.emailId,
      role: "Shop"
    };

      return res.status(200).json({ user: reply, message: "Shop authenticated successfully" });
    } 
    else {
      return res.status(401).json({ error: "Invalid role" });
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    } 
    else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    
    console.error("Auth check error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}; 

