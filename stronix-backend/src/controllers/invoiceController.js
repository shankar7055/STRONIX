import Invoice from "../models/invoice.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import AuditLog from "../models/AuditLog.js";

export const createInvoice = async(req, res)=> {
    try {
        const { poId, amount , fileUrl} = req.body;

        const po = await PurchaseOrder.findById(poId);

        if(!po){
            return res.status(404).json({ message: "PO not found"});
        }

        const invoice = await Invoice.create({
            PurchaseOrder: poId,
            supplier: po.supplier,
            amount,
            fileUrl
        });

        await AuditLog.create({
            user: req.user._id,
            action: "CREATE_INVOICE",
            entity: "Invoice",
            entityId: invoice._id
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markInvoicePaid = async(req, res)=> {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findById(invoiceId);

        if(!invoice){
            return res.status(404).json({ message: "Invoice not found"});
        }

        invoice.status = "PAID";
        await invoice.save();

        await AuditLog.create({
            user: req.user._id,
            action: "INVOICE_PAID",
            entity: "Invoice",
            entityId: invoice._id
        });

        res.json({ message: "Invoice paid", invoice});
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};
