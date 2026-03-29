import Distributor from "../models/Distributor.js";

export const createDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.create(req.body);
    res.json(distributor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find();
    res.json(distributors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};