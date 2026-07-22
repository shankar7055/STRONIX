import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Distributor from "../models/Distributor.js";

const demoProducts = [
  { name: "Handheld barcode scanner (SKU-SCN-201)", price: 5499, status: "ACTIVE" },
  { name: "Thermal labels — 100 × 150 mm (SKU-LBL-100)", price: 480, status: "ACTIVE" },
  { name: "Carton sealing tape — 48 mm (SKU-TAPE-48)", price: 95, status: "ACTIVE" },
  { name: "Corrugated carton — medium (SKU-BOX-M)", price: 58, status: "ACTIVE" },
  { name: "Reusable pallet — EUR (SKU-PALLET-EUR)", price: 1250, status: "ACTIVE" },
  { name: "RFID label pack — 50 (SKU-RFID-50)", price: 1750, status: "ACTIVE" },
];

const demoDistributors = [
  {
    name: "Aster Last Mile",
    serviceArea: "Bengaluru South, Bengaluru East",
    currentLoad: 18,
    maxCapacity: 32,
    rating: 4.9,
    status: "ACTIVE",
    totalDeliveries: 1260,
    successfulDeliveries: 1238,
    failedDeliveries: 22,
    avgDeliveryTime: 6.8
  },
  {
    name: "RouteForge Logistics",
    serviceArea: "Bengaluru South, Bengaluru Central",
    currentLoad: 12,
    maxCapacity: 24,
    rating: 4.7,
    status: "ACTIVE",
    totalDeliveries: 908,
    successfulDeliveries: 881,
    failedDeliveries: 27,
    avgDeliveryTime: 7.4
  },
  {
    name: "Harborline Distribution",
    serviceArea: "Bengaluru North, Mysuru",
    currentLoad: 10,
    maxCapacity: 18,
    rating: 4.8,
    status: "ACTIVE",
    totalDeliveries: 724,
    successfulDeliveries: 705,
    failedDeliveries: 19,
    avgDeliveryTime: 8.2
  }
];

export const seedDatabase = async (req, res) => {
  try {
    // Seed Distributors if none exist
    const existingDist = await Distributor.find();
    if (existingDist.length === 0) {
      await Distributor.insertMany(demoDistributors);
    }

    // Seed Products & Inventories if none exist
    const existingProds = await Product.find();
    const seededProducts = [];

    if (existingProds.length === 0) {
      for (const p of demoProducts) {
        const prod = await Product.create(p);
        seededProducts.push(prod);

        // Initial inventory
        let avail = 50;
        let resv = 5;
        if (p.name.includes("Thermal labels")) avail = 480;
        if (p.name.includes("barcode scanner")) avail = 11;
        if (p.name.includes("Corrugated carton")) avail = 190;

        await Inventory.create({
          product: prod._id,
          availableQuantity: avail,
          reservedQuantity: resv,
          warehouse: "Main Hub Alpha"
        });
      }
    }

    if (res) {
      res.json({ message: "Database seeded successfully with Stronix demo dataset." });
    }
  } catch (err) {
    if (res) {
      res.status(500).json({ error: err.message });
    }
  }
};
