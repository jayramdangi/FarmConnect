

import validate from "../Utils/validateFarmer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Farmer } from "../Models/associations.js";




export const registerFarmer = async(req , res)=>{
     try{
       
      console.log(req.body);
      validate(req.body); 
       console.log(req.body)

     


      const {name, location, phoneNo, emailId, password }= req.body; 

      const passwordHash = await bcrypt.hash(password, 10);

      const farmer = await Farmer.create({name, location , phoneNo, emailId, passwordHash}); 

       const token = jwt.sign(
            { _id: farmer.id, emailId: farmer.emailId, role: "Farmer"  },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
          );
          console.log(farmer); 
        
          const reply = {
            _id : farmer.id, 
            name: farmer.name, 
            location: farmer.location, 
            phoneNo: farmer.phoneNo, 
            emailId: farmer.emailId,
            role: 'Farmer'
          }; 


   
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none' ,
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    });

    return res.status(201).json({ user: reply, message: "Farmer registered successfully" });


}
catch(err)
{
   console.log(err);
     return res.status(400).json({ error: "Error: " + (err.message || err) });
}

     
     
}

export const loginFarmer = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Correct findOne
    const farmer = await Farmer.findOne({ where: { emailId } });
    if (!farmer) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    console.log(1); 
    const passOk = await bcrypt.compare(password, farmer.passwordHash || farmer.password);
    if (!passOk) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: farmer.dataValues.id, emailId: farmer.dataValues.emailId, role: "farmer" },
      process.env.JWT_KEY,
      { expiresIn: "5d" }
    );

    const reply = {
      _id: farmer.dataValues.id,
      name: farmer.dataValues.name,
      location: farmer.dataValues.location,
      phoneNo: farmer.dataValues.phoneNo,
      emailId: farmer.dataValues.emailId,
      role: "farmer"
    };

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    });
    console.log("okay")
    return res.status(200).json({ user: reply, message: "Farmer logged in successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error: " + (err.message || err) });
  }
};

