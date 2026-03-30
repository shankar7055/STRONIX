import Shipment from "../models/Shipment.js";
import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js";
import Distributor from "../models/Distributor.js";



export const createShipment = async (req, res) => {
  try {
    const { orderId, address } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not Found" });

    if (order.status !== "CONFIRMED") {
      return res.status(400).json({ message: "Order not paid yet" });
    }

    const shipment = await Shipment.create({
      order: orderId,
      address
    });

    res.json(shipment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const updateShipmentStatus = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status } = req.body;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.status = status;

    
    shipment.tracking.push({
      status,
      timestamp: new Date()
    });

    
    if (status === "DELIVERED") {
      shipment.deliveredAt = new Date();

      if (shipment.distributor) {
        const distributor = await Distributor.findById(shipment.distributor);

        if (distributor) {
          distributor.currentLoad -= 1;
          distributor.totalDeliveries += 1;
          distributor.successfulDeliveries += 1;

          
          if (shipment.assignedAt) {
            const timeTaken =
              (shipment.deliveredAt - shipment.assignedAt) / (1000 * 60);

            distributor.avgDeliveryTime =
              (distributor.avgDeliveryTime + timeTaken) / 2;
          }

          await distributor.save();
        }
      }

      
      await AuditLog.create({
        user: req.user._id,
        action: "DELIVERED",
        entity: "Shipment",
        entityId: shipment._id
      });
    }

    await shipment.save();

    res.json({ message: "Status updated", shipment });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const assignDistributor = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }


    const distributor = await Distributor.findOne({
      serviceArea: { $regex: shipment.address, $options: "i" },
      status: "ACTIVE",
      $expr: { $lt: ["$currentLoad", "$maxCapacity"] }
    }).sort({
      rating: -1,       
      currentLoad: 1    
    });

    if (!distributor) {
      return res.status(404).json({ message: "No distributor available" });
    }

    shipment.distributor = distributor._id;
    shipment.status = "ASSIGNED";
    shipment.assignedAt = new Date();

    shipment.tracking.push({
      status: "ASSIGNED",
      timestamp: new Date()
    });

    await shipment.save();

    distributor.currentLoad += 1;
    await distributor.save();

    
    await AuditLog.create({
      user: req.user._id,
      action: "ASSIGN_DISTRIBUTOR",
      entity: "Shipment",
      entityId: shipment._id
    });

    res.json({ message: "Distributor assigned", shipment });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const markFailed = async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    shipment.status = "FAILED";

    shipment.tracking.push({
      status: "FAILED",
      timestamp: new Date()
    });

    // update distributor safely
    if (shipment.distributor) {
      const distributor = await Distributor.findById(shipment.distributor);

      if (distributor) {
        distributor.currentLoad -= 1;
        distributor.failedDeliveries += 1;

        await distributor.save();
      }
    }

    shipment.distributor = null;

    await shipment.save();

    // audit log
    await AuditLog.create({
      user: req.user._id,
      action: "SHIPMENT_FAILED",
      entity: "Shipment",
      entityId: shipment._id
    });

    res.json({
      message: "Shipment failed, ready for reassignment",
      shipment
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dispachShipment = async(req, res) => {
    try {
        const { shipmentId} = req.params;

        const shipment = await Shipment.findById(shipmentId);

        if(!shipment){
            return res.status(404).json({ message: "Shipment not found"});
        }

        shipment.tracking.push({
            status: "DISPATCHED_FROM_WAREHOUSE",
            timestamp: new Date()
        });

        await shipment.save();

        res.json({ message: "Order despatched", shipment});
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};