import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";

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

      if (product.status !== "ACTIVATE") {
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

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const confirmOrder = async ( req, res)=> {
    try {
        const { orderId} = req.params;

        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found"});

        const inventory = await Inventory.findOne({ product: order.product});

        inventory.reservedQuantity -= order.quantity;
        await inventory.save();

        order.status = "CONFIRMED";
        await order.save();

        res.json(order);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId} = req.params;

        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found"});

        const inventory = await Inventory.findOne({ product: order.product});

        inventory.availableQuantity += order.quantity;
        inventory.reservedQuantity -= order.quantity;
        await inventory.save();

        order.status = "CANCELLED";
        await order.save();

        res.json(order);
    } catch(err){
        res.status(500).json({ error: err.message});
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