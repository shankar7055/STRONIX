import crypto from "crypto";
import { razorpay } from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js";

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
            return res.json(404).json({ message: "Payment not found"});
        }

        payment.status = "FAILED";
        await payment.save();

        const order = await Order.findById(payment.order);
        order.status = "CANCELLED";
        await order.save();

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
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Amount needs to be in paise (smallest currency unit for INR)
    const amountInPaise = Math.round(order.totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${order._id}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create internal Payment document with INITIATED status
    const payment = await Payment.create({
      order: orderId,
      amount: order.totalAmount,
      status: "INITIATED",
      razorpayOrderId: razorpayOrder.id
    });

    const auditLog = new AuditLog({
      user: req.user._id,
      action: "PAYMENT_INITIATED",
      entity: "Payment",
      entityId: payment._id
    });
    await auditLog.save();

    res.status(201).json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!paymentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing verification parameters" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (!isSignatureValid) {
      payment.status = "FAILED";
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order) {
        order.status = "CANCELLED";
        await order.save();
      }

      const auditLog = new AuditLog({
        user: req.user._id,
        action: "PAYMENT_FAILED",
        entity: "Payment",
        entityId: payment._id
      });
      await auditLog.save();

      return res.status(400).json({ message: "Invalid payment signature", status: "FAILED" });
    }

    // Signature is valid, process success logic
    payment.status = "SUCCESS";
    await payment.save();

    const order = await Order.findById(payment.order);
    if (!order) {
      return res.status(404).json({ message: "Associated order not found" });
    }

    order.status = "CONFIRMED";
    await order.save();

    const paymentSuccessLog = new AuditLog({
      user: req.user._id,
      action: "PAYMENT_SUCCESS",
      entity: "Payment",
      entityId: payment._id
    });
    await paymentSuccessLog.save();

    const orderConfirmLog = new AuditLog({
      user: req.user._id,
      action: "CONFIRM_ORDER",
      entity: "Order",
      entityId: order._id
    });
    await orderConfirmLog.save();

    res.json({ message: "Payment verified successfully", payment, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
