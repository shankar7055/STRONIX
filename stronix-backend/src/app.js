import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js";
import warehouseManagerRoutes from "./routes/warehouseManagerRoutes.js";
dotenv.config();

const app = express(); 

// Enable CORS and JSON body parsing before mounting routes
app.use(cors()); 
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes); // use plural path for REST consistency
app.use("/products", productRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/payments", paymentRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/purchase-orders", purchaseRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/reports", reportRoutes);
app.use("/distributors", distributorRoutes);
app.use("/warehouse-manager", warehouseManagerRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

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
