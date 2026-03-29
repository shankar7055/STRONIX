import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const initiatePayment = async(req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) return res.status(404).json({ message: "Order not found"});

        const payment = await Payment.create({
            order: orderId,
            amount: order.totalAmount
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

        res.json({ message: "Refund processed", payment});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
}