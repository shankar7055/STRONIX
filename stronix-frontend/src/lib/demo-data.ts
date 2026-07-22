/**
 * Stronix UI demo data
 *
 * Use only behind a local DEMO_MODE flag. This is a front-end view model,
 * not a substitute for live API responses. Do not mix this file with Atlas
 * data in the same screen or present it as real operational data.
 */

export const demoMeta = {
  mode: "demo",
  label: "Demo workspace",
  updatedAt: "2026-07-22T10:41:00.000Z",
  disclaimer: "Sample operational data — not connected to production.",
} as const;

export const demoUsers = [
  { id: "usr-admin-01", name: "Aarav Mehta", email: "aarav@stronix.demo", role: "ADMIN" },
  { id: "usr-customer-01", name: "Rao Retail Group", email: "ops@raoretail.demo", role: "CUSTOMER" },
  { id: "usr-customer-02", name: "FreshCart Markets", email: "supply@freshcart.demo", role: "CUSTOMER" },
  { id: "usr-customer-03", name: "Northstar Office Co.", email: "buying@northstar.demo", role: "CUSTOMER" },
] as const;

export const demoProducts = [
  { id: "prd-1001", sku: "SKU-SCN-201", name: "Handheld barcode scanner", category: "Hardware", unitPrice: 5499, status: "ACTIVE", reorderLevel: 8 },
  { id: "prd-1002", sku: "SKU-LBL-100", name: "Thermal labels — 100 × 150 mm", category: "Packaging", unitPrice: 480, status: "ACTIVE", reorderLevel: 200 },
  { id: "prd-1003", sku: "SKU-TAPE-48", name: "Carton sealing tape — 48 mm", category: "Packaging", unitPrice: 95, status: "ACTIVE", reorderLevel: 40 },
  { id: "prd-1004", sku: "SKU-BOX-M", name: "Corrugated carton — medium", category: "Packaging", unitPrice: 58, status: "ACTIVE", reorderLevel: 100 },
  { id: "prd-1005", sku: "SKU-PALLET-EUR", name: "Reusable pallet — EUR", category: "Warehouse", unitPrice: 1250, status: "ACTIVE", reorderLevel: 10 },
  { id: "prd-1006", sku: "SKU-RFID-50", name: "RFID label pack — 50", category: "Hardware", unitPrice: 1750, status: "ACTIVE", reorderLevel: 75 },
] as const;

export const demoInventory = [
  { id: "inv-1001", productId: "prd-1001", sku: "SKU-SCN-201", productName: "Handheld barcode scanner", availableQuantity: 11, reservedQuantity: 5, totalQuantity: 16, reorderLevel: 8, lastUpdated: "2026-07-22T10:36:00.000Z" },
  { id: "inv-1002", productId: "prd-1002", sku: "SKU-LBL-100", productName: "Thermal labels — 100 × 150 mm", availableQuantity: 480, reservedQuantity: 120, totalQuantity: 600, reorderLevel: 200, lastUpdated: "2026-07-22T10:36:00.000Z" },
  { id: "inv-1003", productId: "prd-1003", sku: "SKU-TAPE-48", productName: "Carton sealing tape — 48 mm", availableQuantity: 76, reservedQuantity: 24, totalQuantity: 100, reorderLevel: 40, lastUpdated: "2026-07-22T10:36:00.000Z" },
  { id: "inv-1004", productId: "prd-1004", sku: "SKU-BOX-M", productName: "Corrugated carton — medium", availableQuantity: 190, reservedQuantity: 60, totalQuantity: 250, reorderLevel: 100, lastUpdated: "2026-07-22T10:36:00.000Z" },
  { id: "inv-1005", productId: "prd-1005", sku: "SKU-PALLET-EUR", productName: "Reusable pallet — EUR", availableQuantity: 8, reservedQuantity: 2, totalQuantity: 10, reorderLevel: 10, lastUpdated: "2026-07-22T10:36:00.000Z" },
  { id: "inv-1006", productId: "prd-1006", sku: "SKU-RFID-50", productName: "RFID label pack — 50", availableQuantity: 160, reservedQuantity: 40, totalQuantity: 200, reorderLevel: 75, lastUpdated: "2026-07-22T10:36:00.000Z" },
] as const;

export const demoOrders = [
  {
    id: "ord-1048", orderNumber: "SO-1048", customer: "Northstar Office Co.", customerId: "usr-customer-03",
    status: "CONFIRMED", paymentStatus: "SUCCESS", totalAmount: 13098,
    createdAt: "2026-07-22T08:25:00.000Z", updatedAt: "2026-07-22T09:04:00.000Z",
    items: [
      { productId: "prd-1001", sku: "SKU-SCN-201", name: "Handheld barcode scanner", quantity: 2, unitPrice: 5499, lineTotal: 10998 },
      { productId: "prd-1003", sku: "SKU-TAPE-48", name: "Carton sealing tape — 48 mm", quantity: 12, unitPrice: 95, lineTotal: 1140 },
      { productId: "prd-1004", sku: "SKU-BOX-M", name: "Corrugated carton — medium", quantity: 15, unitPrice: 58, lineTotal: 870 },
      { productId: "prd-1002", sku: "SKU-LBL-100", name: "Thermal labels — 100 × 150 mm", quantity: 3, unitPrice: 480, lineTotal: 1440 },
    ],
    lifecycle: [
      { at: "2026-07-22T08:25:00.000Z", type: "RESERVATION_PLACED", title: "Stock reserved", detail: "32 units held across 4 products." },
      { at: "2026-07-22T08:31:00.000Z", type: "PAYMENT_VERIFIED", title: "Payment verified", detail: "Razorpay sandbox payment verified." },
      { at: "2026-07-22T09:04:00.000Z", type: "ORDER_CONFIRMED", title: "Order confirmed", detail: "Reservation committed successfully." },
    ],
  },
  {
    id: "ord-1051", orderNumber: "SO-1051", customer: "Rao Retail Group", customerId: "usr-customer-01",
    status: "PENDING", paymentStatus: "INITIATED", totalAmount: 42678,
    createdAt: "2026-07-22T10:14:00.000Z", updatedAt: "2026-07-22T10:36:00.000Z",
    items: [
      { productId: "prd-1001", sku: "SKU-SCN-201", name: "Handheld barcode scanner", quantity: 2, unitPrice: 5499, lineTotal: 10998 },
      { productId: "prd-1002", sku: "SKU-LBL-100", name: "Thermal labels — 100 × 150 mm", quantity: 60, unitPrice: 480, lineTotal: 28800 },
      { productId: "prd-1003", sku: "SKU-TAPE-48", name: "Carton sealing tape — 48 mm", quantity: 12, unitPrice: 95, lineTotal: 1140 },
      { productId: "prd-1004", sku: "SKU-BOX-M", name: "Corrugated carton — medium", quantity: 30, unitPrice: 58, lineTotal: 1740 },
    ],
    lifecycle: [
      { at: "2026-07-22T10:14:00.000Z", type: "RESERVATION_PLACED", title: "Stock reserved", detail: "104 units held across 4 products." },
      { at: "2026-07-22T10:36:00.000Z", type: "PAYMENT_INITIATED", title: "Awaiting payment", detail: "Reservation remains active while payment is completed." },
    ],
  },
  {
    id: "ord-1054", orderNumber: "SO-1054", customer: "FreshCart Markets", customerId: "usr-customer-02",
    status: "PENDING", paymentStatus: "FAILED", totalAmount: 50677,
    createdAt: "2026-07-22T10:21:00.000Z", updatedAt: "2026-07-22T10:39:00.000Z",
    items: [
      { productId: "prd-1001", sku: "SKU-SCN-201", name: "Handheld barcode scanner", quantity: 3, unitPrice: 5499, lineTotal: 16497 },
      { productId: "prd-1002", sku: "SKU-LBL-100", name: "Thermal labels — 100 × 150 mm", quantity: 60, unitPrice: 480, lineTotal: 28800 },
      { productId: "prd-1003", sku: "SKU-TAPE-48", name: "Carton sealing tape — 48 mm", quantity: 12, unitPrice: 95, lineTotal: 1140 },
      { productId: "prd-1004", sku: "SKU-BOX-M", name: "Corrugated carton — medium", quantity: 30, unitPrice: 58, lineTotal: 1740 },
      { productId: "prd-1005", sku: "SKU-PALLET-EUR", name: "Reusable pallet — EUR", quantity: 2, unitPrice: 1250, lineTotal: 2500 },
    ],
    latestGuardResult: { outcome: "REJECTED", title: "Confirmation blocked", detail: "Stock revalidation failed. The transaction rolled back and inventory is unchanged." },
    lifecycle: [
      { at: "2026-07-22T10:21:00.000Z", type: "RESERVATION_PLACED", title: "Stock reserved", detail: "107 units held across 5 products." },
      { at: "2026-07-22T10:39:00.000Z", type: "CONFIRMATION_REJECTED", title: "Confirmation blocked", detail: "Stock revalidation failed. No inventory values changed." },
    ],
  },
  {
    id: "ord-1045", orderNumber: "SO-1045", customer: "Rao Retail Group", customerId: "usr-customer-01",
    status: "CANCELLED", paymentStatus: "FAILED", totalAmount: 3610,
    createdAt: "2026-07-21T15:10:00.000Z", updatedAt: "2026-07-21T15:29:00.000Z",
    items: [
      { productId: "prd-1002", sku: "SKU-LBL-100", name: "Thermal labels — 100 × 150 mm", quantity: 5, unitPrice: 480, lineTotal: 2400 },
      { productId: "prd-1003", sku: "SKU-TAPE-48", name: "Carton sealing tape — 48 mm", quantity: 8, unitPrice: 95, lineTotal: 760 },
      { productId: "prd-1004", sku: "SKU-BOX-M", name: "Corrugated carton — medium", quantity: 15, unitPrice: 58, lineTotal: 870 },
    ],
    lifecycle: [
      { at: "2026-07-21T15:10:00.000Z", type: "RESERVATION_PLACED", title: "Stock reserved", detail: "28 units held across 3 products." },
      { at: "2026-07-21T15:29:00.000Z", type: "RESERVATION_RELEASED", title: "Reservation released", detail: "Order cancelled; stock returned to available quantity." },
    ],
  },
] as const;

export const demoDistributors = [
  { id: "dst-01", name: "Aster Last Mile", serviceAreas: ["Bengaluru South", "Bengaluru East"], currentLoad: 18, maxCapacity: 32, rating: 4.9, totalDeliveries: 1260, successfulDeliveries: 1238, failedDeliveries: 22, avgDeliveryHours: 6.8, status: "ACTIVE" },
  { id: "dst-02", name: "RouteForge Logistics", serviceAreas: ["Bengaluru South", "Bengaluru Central"], currentLoad: 12, maxCapacity: 24, rating: 4.7, totalDeliveries: 908, successfulDeliveries: 881, failedDeliveries: 27, avgDeliveryHours: 7.4, status: "ACTIVE" },
  { id: "dst-03", name: "Harborline Distribution", serviceAreas: ["Bengaluru North", "Mysuru"], currentLoad: 10, maxCapacity: 18, rating: 4.8, totalDeliveries: 724, successfulDeliveries: 705, failedDeliveries: 19, avgDeliveryHours: 8.2, status: "ACTIVE" },
] as const;

export const demoShipments = [
  {
    id: "shp-3001", shipmentNumber: "SH-3001", orderNumber: "SO-1048", status: "ASSIGNED",
    destination: "HSR Layout, Bengaluru South", createdAt: "2026-07-22T09:10:00.000Z", updatedAt: "2026-07-22T09:20:00.000Z",
    assignedDistributorId: "dst-01", assignedDistributorName: "Aster Last Mile",
    tracking: [
      { at: "2026-07-22T09:10:00.000Z", title: "Shipment created", detail: "Ready for distributor assignment." },
      { at: "2026-07-22T09:20:00.000Z", title: "Distributor assigned", detail: "Aster Last Mile selected." },
    ],
    candidates: [
      { rank: 1, distributorId: "dst-01", name: "Aster Last Mile", eligible: true, score: 94, rating: 4.9, currentLoad: 18, maxCapacity: 32, reason: "Covers destination, highest rating, and 44% capacity remaining." },
      { rank: 2, distributorId: "dst-02", name: "RouteForge Logistics", eligible: true, score: 86, rating: 4.7, currentLoad: 12, maxCapacity: 24, reason: "Covers destination with capacity, but lower service rating." },
      { rank: 3, distributorId: "dst-03", name: "Harborline Distribution", eligible: false, score: null, rating: 4.8, currentLoad: 10, maxCapacity: 18, reason: "Does not cover Bengaluru South." },
    ],
  },
  {
    id: "shp-3002", shipmentNumber: "SH-3002", orderNumber: "SO-1039", status: "IN_TRANSIT",
    destination: "Indiranagar, Bengaluru East", createdAt: "2026-07-21T16:40:00.000Z", updatedAt: "2026-07-22T08:15:00.000Z",
    assignedDistributorId: "dst-01", assignedDistributorName: "Aster Last Mile",
    tracking: [
      { at: "2026-07-21T16:40:00.000Z", title: "Shipment created", detail: "Order prepared for dispatch." },
      { at: "2026-07-21T17:05:00.000Z", title: "Distributor assigned", detail: "Aster Last Mile selected." },
      { at: "2026-07-22T08:15:00.000Z", title: "In transit", detail: "Collected from the distribution hub." },
    ],
    candidates: [
      { rank: 1, distributorId: "dst-01", name: "Aster Last Mile", eligible: true, score: 91, rating: 4.9, currentLoad: 18, maxCapacity: 32, reason: "Covers destination with available delivery capacity." },
      { rank: 2, distributorId: "dst-02", name: "RouteForge Logistics", eligible: false, score: null, rating: 4.7, currentLoad: 12, maxCapacity: 24, reason: "Does not cover Bengaluru East." },
    ],
  },
  {
    id: "shp-3003", shipmentNumber: "SH-3003", orderNumber: "SO-1041", status: "CREATED",
    destination: "Koramangala, Bengaluru South", createdAt: "2026-07-22T10:05:00.000Z", updatedAt: "2026-07-22T10:05:00.000Z",
    assignedDistributorId: null, assignedDistributorName: null,
    tracking: [{ at: "2026-07-22T10:05:00.000Z", title: "Shipment created", detail: "Awaiting distributor assignment." }],
    candidates: [
      { rank: 1, distributorId: "dst-02", name: "RouteForge Logistics", eligible: true, score: 89, rating: 4.7, currentLoad: 12, maxCapacity: 24, reason: "Covers destination and has the lowest active load." },
      { rank: 2, distributorId: "dst-01", name: "Aster Last Mile", eligible: true, score: 88, rating: 4.9, currentLoad: 18, maxCapacity: 32, reason: "Covers destination with strong rating, but higher active load." },
      { rank: 3, distributorId: "dst-03", name: "Harborline Distribution", eligible: false, score: null, rating: 4.8, currentLoad: 10, maxCapacity: 18, reason: "Does not cover Bengaluru South." },
    ],
  },
] as const;

export const demoAuditEvents = [
  { id: "aud-901", at: "2026-07-22T10:39:00.000Z", action: "CONFIRMATION_REJECTED", entity: "Order", entityId: "SO-1054", actor: "Aarav Mehta", detail: "Stock revalidation failed; transaction rolled back." },
  { id: "aud-902", at: "2026-07-22T10:36:00.000Z", action: "RESERVATION_PLACED", entity: "Order", entityId: "SO-1051", actor: "Rao Retail Group", detail: "Inventory reserved across 4 order items." },
  { id: "aud-903", at: "2026-07-22T09:20:00.000Z", action: "DISTRIBUTOR_ASSIGNED", entity: "Shipment", entityId: "SH-3001", actor: "Aarav Mehta", detail: "Aster Last Mile selected for Bengaluru South." },
  { id: "aud-904", at: "2026-07-22T09:04:00.000Z", action: "ORDER_CONFIRMED", entity: "Order", entityId: "SO-1048", actor: "Aarav Mehta", detail: "Payment verified and reservation committed." },
  { id: "aud-905", at: "2026-07-21T15:29:00.000Z", action: "ORDER_CANCELLED", entity: "Order", entityId: "SO-1045", actor: "Aarav Mehta", detail: "Reservation released back into available inventory." },
] as const;

export const demoData = {
  meta: demoMeta,
  users: demoUsers,
  products: demoProducts,
  inventory: demoInventory,
  orders: demoOrders,
  distributors: demoDistributors,
  shipments: demoShipments,
  auditEvents: demoAuditEvents,
} as const;
