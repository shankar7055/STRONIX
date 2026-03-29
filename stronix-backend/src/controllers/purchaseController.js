import PurchaseOrder from "../models/PurchaseOrder.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import AuditLog from "../models/AuditLog.js";



export const createPurchaseOrder = async(req, res)=> {
    try {
        const {supplierId, items} = req.body;

        let totalAmount = 0;

        for(let item of items){
            const product = await Product.findById(item.product);

            if(!product) {
                return res.status(404).json({ message: "Product not found"});
            }
            totalAmount += item.price * item.quantity;
        }

        const po = await PurchaseOrder.create({
            supplier: supplierId,
            items,
            totalAmount
        });

        await AuditLog.create({
            user: req.user._id,
            action: "CREATE_PO",
            entity: "PurchaseOrder",
            entityId: po._id
        });

        res.json(po);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};

export const receivePurchaseOrder = async(req, res) => {
    try {
        const {poId} = req.params;

        const po = await PurchaseOrder.findById(poId);

        if(!po) return res.status(404).json({ message: "PO not found"});

        if(po.status === "RECEIVED") {
            return res.status(400).json({ message: "Already received"});
        }

        for(let item of po.items) {
            let inventory = await Inventory.findOne({ product: item.product});

            if(!inventory) {
                inventory = await Inventory.create({
                    product: item.product,
                    availableQuantity: item.quantity  ,
                    reservedQuantity: 0
                });
            } else {
                inventory.availableQuantity += item.quantity;
                await inventory.save();
            }
        }

        po.status = "RECEIVED";
        await po.save();

        await AuditLog.create({
            user: req.user._id,
            action: "PO_RECEIVED",
            entity: "PurchaseOrder",
            entityId: po._id
        });

        res.json({ message: "Stock added successfull", po});
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};
