import PurchaseOrder from "../models/PurchaseOrder.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import AuditLog from "../models/AuditLog.js";
import Warehouse from "../models/Warehouse.js";
import StockMovement from "../models/StockMovement.js";

const getOrCreateDefaultWarehouseId = async () => {
    const existing = await Warehouse.findOne({ code: "DEFAULT" });
    if (existing) return existing._id;
    const created = await Warehouse.create({ code: "DEFAULT", name: "Default Warehouse" });
    return created._id;
};



export const createPurchaseOrder = async(req, res)=> {
    try {
        const { supplierId, items, warehouseId } = req.body;

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
            warehouse: warehouseId || (await getOrCreateDefaultWarehouseId()),
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
        const { warehouseId } = req.body;

        const po = await PurchaseOrder.findById(poId);

        if(!po) return res.status(404).json({ message: "PO not found"});

        if(po.status === "RECEIVED") {
            return res.status(400).json({ message: "Already received"});
        }

        const targetWarehouseId = warehouseId || po.warehouse || (await getOrCreateDefaultWarehouseId());
        if (!po.warehouse) {
            po.warehouse = targetWarehouseId;
        }

        for(let item of po.items) {
            await Inventory.findOneAndUpdate(
                { product: item.product, warehouse: targetWarehouseId },
                {
                    $inc: { availableQuantity: item.quantity },
                    $setOnInsert: {
                        product: item.product,
                        warehouse: targetWarehouseId,
                        reservedQuantity: 0
                    }
                },
                { upsert: true, new: true }
            );

            await StockMovement.create({
                type: "RECEIPT",
                product: item.product,
                warehouse: targetWarehouseId,
                quantity: item.quantity,
                availableDelta: item.quantity,
                reservedDelta: 0,
                reference: {
                    entityType: "PurchaseOrder",
                    entityId: String(po._id),
                    reason: "PO_RECEIVED"
                },
                createdBy: req.user?._id
            });
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
