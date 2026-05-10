import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js";
import Inventory from "../models/Inventory.js";
import Warehouse from "../models/Warehouse.js";
import StockMovement from "../models/StockMovement.js";

const getOrCreateDefaultWarehouseId = async () => {
  const existing = await Warehouse.findOne({ code: "DEFAULT" });
  if (existing) return existing._id;
  const created = await Warehouse.create({ code: "DEFAULT", name: "Default Warehouse" });
  return created._id;
};

export const initiatePayment = async(req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) return res.status(404).json({ message: "Order not found"});

        const payment = await Payment.create({
            order: orderId,
            amount: order.totalAmount
        });

        await AuditLog.create({
            user: req.user._id,
            action: "PAYMENT_INITIATED",
            entity: "Payment",
            entityId: payment._id
        });

        res.json(payment);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    
    payment.status = "SUCCESS";
    await payment.save();

    const order = await Order.findById(payment.order);
    order.status = "CONFIRMED";
    await order.save();

    await AuditLog.create({
      user: req.user._id,
      action: "PAYMENT_SUCCESS",
      entity: "Payment",
      entityId: payment._id
    });

    await AuditLog.create({
      user: req.user._id,
      action: "CONFIRM_ORDER",
      entity: "Order",
      entityId: order._id
    });

    res.json({ message: "Payment successful", payment });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const paymentFailed = async(req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if(!payment) {
            return res.status(404).json({ message: "Payment not found"});
        }

        payment.status = "FAILED";
        await payment.save();

        const order = await Order.findById(payment.order).populate("items");
        if (!order) return res.status(404).json({ message: "Order not found" });

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
            reference: { entityType: "Order", entityId: String(order._id), reason: "PAYMENT_FAILED" },
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
            action: "PAYMENT_FAILED",
            entity: "Payment",
            entityId: payment._id
        });

        res.json({ message: "Payment failed", payment});
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const refundPayment = async(req, res) => {
    try{
        const { orderId } = req.params;

        const payment = await Payment.findOne({ order: orderId});

        if(!payment || payment.status !== "SUCCESS"){
            return res.status(400).json({ message: "No successful payment found"});
        }
        payment.status = "REFUNDED";
        await payment.save();

        await AuditLog.create({
            user: req.user._id,
            action: "PAYMENT_REFUNDED",
            entity: "Payment",
            entityId: payment._id
        });

        res.json({ message: "Refund processed", payment});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
}
