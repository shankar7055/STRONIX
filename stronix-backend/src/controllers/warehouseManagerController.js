import express from "express";
import Inventory from "../models/Inventory.js";

export const viewInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find()
            .populate("product")
            .populate("warehouse");

            res.json(inventory);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};