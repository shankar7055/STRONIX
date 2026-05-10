import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";
import AuditLog from "../models/AuditLog.js";
import Warehouse from "../models/Warehouse.js";
import StockMovement from "../models/StockMovement.js";

const getOrCreateDefaultWarehouseId = async () => {
  const existing = await Warehouse.findOne({ code: "DEFAULT" });
  if (existing) return existing._id;
  const created = await Warehouse.create({ code: "DEFAULT", name: "Default Warehouse" });
  return created._id;
};

export const createOrder = async (req, res) => {
  try {
    const { items, warehouseId } = req.body; 
    // items = [{ productId, quantity }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items are required" });
    }

    const targetWarehouseId = warehouseId || (await getOrCreateDefaultWarehouseId());

    let totalAmount = 0;
    const orderItems = [];
    const movements = [];

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
          warehouse: targetWarehouseId,
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

      movements.push({
        type: "RESERVE",
        product: item.productId,
        warehouse: targetWarehouseId,
        quantity: item.quantity,
        availableDelta: -item.quantity,
        reservedDelta: item.quantity,
        reference: { entityType: "Order" },
        createdBy: req.user?._id
      });
    }

    const order = await Order.create({
      user: req.user._id,
      warehouse: targetWarehouseId,
      items: orderItems,
      totalAmount
    });

    if (movements.length > 0) {
      await StockMovement.insertMany(
        movements.map((m) => ({
          ...m,
          reference: { ...m.reference, entityId: String(order._id), reason: "ORDER_RESERVED" }
        }))
      );
    }

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


export const confirmOrder = async ( req, res)=> {
    try {
        const { orderId} = req.params;

        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message: "Order not found"});

        order.status = "CONFIRMED";
        await order.save();

        await AuditLog.create({
          user: req.user._id,
          action: "CONFIRM_ORDER",
          entity: "Order",
          entityId: order._id
        });

        res.json(order);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId} = req.params;

        const order = await Order.findById(orderId).populate("items");
        if(!order) return res.status(404).json({ message: "Order not found"});
        if (order.status === "CANCELLED") return res.json(order);

        const targetWarehouseId = order.warehouse || (await getOrCreateDefaultWarehouseId());
        if (!order.warehouse) {
          order.warehouse = targetWarehouseId;
        }

        const movements = [];
        for (const orderItem of order.items) {
          const qty = orderItem.quantity;

          const inventory = await Inventory.findOneAndUpdate(
            {
              product: orderItem.product,
              warehouse: targetWarehouseId,
              reservedQuantity: { $gte: qty }
            },
            { $inc: { availableQuantity: qty, reservedQuantity: -qty } },
            { new: true }
          );

          if (!inventory) {
            return res.status(400).json({ message: "Unable to unreserve stock for one or more items" });
          }

          movements.push({
            type: "UNRESERVE",
            product: orderItem.product,
            warehouse: targetWarehouseId,
            quantity: qty,
            availableDelta: qty,
            reservedDelta: -qty,
            reference: { entityType: "Order", entityId: String(order._id), reason: "ORDER_CANCELLED" },
            createdBy: req.user?._id
          });
        }

        order.status = "CANCELLED";
        await order.save();

        if (movements.length > 0) {
          await StockMovement.insertMany(movements);
        }

        await AuditLog.create({
          user: req.user._id,
          action: "CANCEL_ORDER",
          entity: "Order",
          entityId: order._id
        });

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
