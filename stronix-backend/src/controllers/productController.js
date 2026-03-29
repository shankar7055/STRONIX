import Product from "../models/Product.js";
import AuditLog from "../models/AuditLog.js";


export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    const product = await Product.create({ name, price });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "ACTIVE" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
