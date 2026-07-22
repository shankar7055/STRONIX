import mongoose from "mongoose";
import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";
import AuditLog from "../models/AuditLog.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; 
    // items = [{ productId, quantity }]

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.status !== "ACTIVE") {
        return res.status(400).json({ message: "Product not active" });
      }

      
      const inventory = await Inventory.findOneAndUpdate(
        {
          product: item.productId,
          availableQuantity: { $gte: item.quantity }
        },
        {
          $inc: {
            availableQuantity: -item.quantity,
            reservedQuantity: +item.quantity
          }
        },
        { new: true }
      );

      if (!inventory) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      const orderItem = await OrderItem.create({
        product: item.productId,
        quantity: item.quantity,
        price: product.price
      });

      orderItems.push(orderItem._id);
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount
    });

    await AuditLog.create({
      user: req.user._id,
      action: "CREATE_ORDER",
      entity: "Order",
      entityId: order._id
    });

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const confirmOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items").session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Order cannot be confirmed. Current status: ${order.status}` });
    }

    for (const item of order.items) {
      const inventory = await Inventory.findOneAndUpdate(
        {
          product: item.product,
          reservedQuantity: { $gte: item.quantity }
        },
        {
          $inc: { reservedQuantity: -item.quantity }
        },
        { new: true, session }
      );

      if (!inventory) {
        throw new Error(`Insufficient reserved stock or inventory not found for product: ${item.product}`);
      }
    }

    order.status = "CONFIRMED";
    await order.save({ session });

    const auditLog = new AuditLog({
      user: req.user._id,
      action: "CONFIRM_ORDER",
      entity: "Order",
      entityId: order._id
    });
    await auditLog.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items").session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Order cannot be cancelled. Current status: ${order.status}` });
    }

    for (const item of order.items) {
      const inventory = await Inventory.findOneAndUpdate(
        {
          product: item.product,
          reservedQuantity: { $gte: item.quantity }
        },
        {
          $inc: {
            reservedQuantity: -item.quantity,
            availableQuantity: item.quantity
          }
        },
        { new: true, session }
      );

      if (!inventory) {
        throw new Error(`Insufficient reserved stock or inventory not found for product: ${item.product}`);
      }
    }

    order.status = "CANCELLED";
    await order.save({ session });

    const auditLog = new AuditLog({
      user: req.user._id,
      action: "CANCEL_ORDER",
      entity: "Order",
      entityId: order._id
    });
    await auditLog.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate({
        path: "items",
        populate: {
          path: "product"
        }
      })
      .populate("user", "-password");

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "items",
        populate: {
          path: "product"
        }
      });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
  .populate({
    path: "items",
    populate: {
      path: "product"
    }
  })
  .populate("user", "-password");
        res.json(orders);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};
