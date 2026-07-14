// index.js (top-level)
import express from "express";
import sequelize from "./src/Config/db.js"; // default import works
import { config as configDotenv } from "dotenv";
configDotenv();

import { shopAuthRouter } from "./src/Routes/shopAuth.js";
import { farmerAuthRouter } from "./src/Routes/FarmerAuth.js";
import { mandiAuthRouter } from "./src/Routes/MandiAuth.js";
import cookieParser from "cookie-parser";
import { shopRouter } from "./src/Routes/shopRoutes.js";



import { chatRouter } from "./src/Routes/chatRouter.js";
import { cropRouter } from "./src/Routes/cropRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import { loginUser } from "./src/Controllers/userAuth.js";
import { checkController } from "./src/Controllers/checkController.js";
import logoutController from "./src/Controllers/logoutController.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/shop/auth", shopAuthRouter);
app.use("/farmer/auth", farmerAuthRouter);
app.use("/mandi/auth", mandiAuthRouter);
app.use("/shop/manage", shopRouter);
app.use('/crop', cropRouter); 

app.get("/check", checkController);
app.post("/logout", logoutController);

app.post("/loginUser", loginUser);

app.use("/chat", chatRouter);

async function connect() {
  try {
    await Promise.all([
      (async () => {
        console.log(process.env.POSTGRESQL_URL);
        await sequelize.sync({ alter: true });
        console.log("✅ PostgreSQL synced successfully");
      })(),
      
    ]);

  
    app.listen(process.env.PORT, () => {
      console.log(`server listening to the port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error :", err);
  }
}

connect();
