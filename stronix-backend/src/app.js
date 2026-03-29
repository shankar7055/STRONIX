import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
dotenv.config();

const app = express(); 

// Enable CORS and JSON body parsing before mounting routes
app.use(cors()); 
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes); // use plural path for REST consistency
app.use("/product", productRoutes);
app.use("/inventory", inventoryRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("STRONIX API RUNNING");
});

const PORT = process.env.PORT || 5001; // 5000 is reserved by some macOS services (AirPlay/ControlCenter)
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});