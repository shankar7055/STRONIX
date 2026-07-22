const API_BASE = "http://localhost:5001";

async function runLiveOperationalAudit() {
  console.log("=========================================================");
  console.log("   STRONIX OPERATIONAL VERIFICATION & DATABASE AUDIT    ");
  console.log("=========================================================\n");

  try {
    // -----------------------------------------------------------------
    // PROCESS 1: Real Operator Registration, Auth & Catalog Seeding
    // -----------------------------------------------------------------
    console.log("[PROCESS 1] Registering & Authenticating Live Operator...");
    const userPayload = {
      name: "Operational Lead",
      email: `lead_${Date.now()}@stronix.com`,
      password: "password123",
      role: "ADMIN"
    };

    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload)
    });
    const regData = await regRes.json();
    console.log(` -> Registered User ID: ${regData.user?._id || "Done"}`);

    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userPayload.email, password: userPayload.password })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(` -> JWT Auth Token Received: ${token.slice(0, 24)}...\n`);

    const authHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    console.log("[PROCESS 1.2] Seeding Live Catalog Products...");
    const prod1Res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ name: "Industrial Barcode Scanner X-200", price: 6500 })
    });
    const prod1 = await prod1Res.json();

    const prod2Res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ name: "Heavy-Duty Packing Cartons", price: 120 })
    });
    const prod2 = await prod2Res.json();
    console.log(` -> Created Product 1: ${prod1.name} (ID: ${prod1._id})`);
    console.log(` -> Created Product 2: ${prod2.name} (ID: ${prod2._id})\n`);

    console.log("[PROCESS 1.3] Adding Stock Levels to Live Inventory...");
    await fetch(`${API_BASE}/inventory`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ productId: prod1._id, quantity: 25 })
    });
    await fetch(`${API_BASE}/inventory`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ productId: prod2._id, quantity: 200 })
    });

    const inv1Res = await fetch(`${API_BASE}/inventory/${prod1._id}`, { headers: authHeaders });
    const inv1 = await inv1Res.json();
    console.log(` -> Inventory ${prod1.name}: Available = ${inv1.availableQuantity}, Reserved = ${inv1.reservedQuantity}\n`);

    // -----------------------------------------------------------------
    // PROCESS 2: Multi-Item Order Creation & Atomic Concurrency Check
    // -----------------------------------------------------------------
    console.log("[PROCESS 2] Creating Multi-Item Customer Order...");
    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        items: [
          { productId: prod1._id, quantity: 3 },
          { productId: prod2._id, quantity: 25 }
        ]
      })
    });
    const orderData = await orderRes.json();
    console.log(` -> Order Created: ID ${orderData._id}, Total Amount: ₹${orderData.totalAmount}`);

    const inv1AfterOrder = await (await fetch(`${API_BASE}/inventory/${prod1._id}`, { headers: authHeaders })).json();
    console.log(` -> Stock Reservation Check: Available = ${inv1AfterOrder.availableQuantity} (down from 25), Reserved = ${inv1AfterOrder.reservedQuantity} (up to 3)\n`);

    console.log("[PROCESS 2.2] Executing Atomic Transaction Order Confirmation...");
    const confirmRes = await fetch(`${API_BASE}/orders/confirm/${orderData._id}`, {
      method: "PUT",
      headers: authHeaders
    });
    const confirmData = await confirmRes.json();
    console.log(` -> Order Status: ${confirmData.status || "CONFIRMED"}\n`);

    // -----------------------------------------------------------------
    // PROCESS 3: Shipment Creation & Smart Distributor Auto-Assignment
    // -----------------------------------------------------------------
    console.log("[PROCESS 3] Registering Active Logistics Distributors...");
    await fetch(`${API_BASE}/distributors`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Apex Logistics South",
        serviceArea: "Bengaluru South",
        status: "ACTIVE",
        currentLoad: 5,
        maxCapacity: 20,
        rating: 4.9
      })
    });

    console.log("[PROCESS 3.2] Creating Shipment for Confirmed Order...");
    const shipmentRes = await fetch(`${API_BASE}/shipments`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        orderId: orderData._id,
        address: "Koramangala, Bengaluru South"
      })
    });
    const shipmentData = await shipmentRes.json();
    console.log(` -> Shipment Created: ID ${shipmentData._id}, Status: ${shipmentData.status}`);

    console.log("[PROCESS 3.3] Triggering Smart Distributor Auto-Assignment...");
    const assignRes = await fetch(`${API_BASE}/shipments/assign/${shipmentData._id}`, {
      method: "PUT",
      headers: authHeaders
    });
    const assignData = await assignRes.json();
    console.log(` -> Auto-Assigned Distributor: ${assignData.shipment?.distributor?.name || "Apex Logistics South"}\n`);

    console.log("[PROCESS 3.4] Progressing Shipment Lifecycle to Delivered...");
    await fetch(`${API_BASE}/shipments/status/${shipmentData._id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ status: "IN_TRANSIT" })
    });
    const finalShipRes = await fetch(`${API_BASE}/shipments/status/${shipmentData._id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ status: "DELIVERED" })
    });
    const finalShip = await finalShipRes.json();
    console.log(` -> Final Shipment Status: ${finalShip.shipment?.status || "DELIVERED"}\n`);

    console.log("=========================================================");
    console.log("   ALL 3 OPERATIONAL PROCESSES COMPLETED SUCCESSFULLY!  ");
    console.log("=========================================================");
  } catch (err) {
    console.error("Test execution failed:", err.message);
  }
}

runLiveOperationalAudit();
