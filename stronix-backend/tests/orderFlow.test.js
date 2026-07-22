import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Inventory from "../src/models/Inventory.js";
import Order from "../src/models/Order.js";

const testDbName = "stronix_test";
const mongoUri = process.env.MONGO_URL 
  ? process.env.MONGO_URL.replace("/stronix", `/${testDbName}`) 
  : `mongodb://127.0.0.1:27018/${testDbName}?replicaSet=rs0`;

describe("Order & Inventory Transactional Integration Flow", () => {
  let adminToken;
  let testUser;
  let testProduct;
  let testInventory;

  beforeAll(async () => {
    // Establish connection to test database (Atlas replica set or local replica set)
    await mongoose.connect(mongoUri);

    // Clean up any leftovers
    await User.deleteMany({ email: /@test-suite\.com$/ });
    await Product.deleteMany({ name: /Test Product/ });
    await Order.deleteMany({});

    // 1. Create a test admin user to get JWT token
    const adminPassword = "password123";
    const userPayload = {
      name: "Test Admin",
      email: `admin_${Date.now()}@test-suite.com`,
      password: adminPassword,
      role: "ADMIN"
    };

    const registerRes = await request(app)
      .post("/auth/register")
      .send(userPayload);

    expect(registerRes.status).toBe(200);
    testUser = registerRes.body.user || registerRes.body;

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: userPayload.email, password: adminPassword });

    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    // Cleanup databases and close connections
    await User.deleteMany({ email: /@test-suite\.com$/ });
    await Product.deleteMany({ name: /Test Product/ });
    await Order.deleteMany({});
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Re-create a fresh product and inventory before each test to start at a known state (qty: 10)
    await Product.deleteMany({ name: /Test Product/ });
    await Order.deleteMany({});

    testProduct = await Product.create({
      name: "Test Product",
      price: 150,
      status: "ACTIVE"
    });

    testInventory = await Inventory.create({
      product: testProduct._id,
      availableQuantity: 10,
      reservedQuantity: 0
    });
  });

  test("Order creation correctly reserves stock (available down, reserved up)", async () => {
    const orderPayload = {
      items: [{ productId: testProduct._id.toString(), quantity: 3 }]
    };

    const orderRes = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(orderPayload);

    expect(orderRes.status).toBe(200);
    expect(orderRes.body.status).toBe("PENDING");

    // Fetch inventory status from DB
    const inv = await Inventory.findOne({ product: testProduct._id });
    expect(inv.availableQuantity).toBe(7);
    expect(inv.reservedQuantity).toBe(3);
  });

  test("Confirm correctly commits stock (reserved down, available unchanged)", async () => {
    // 1. Create order
    const orderPayload = {
      items: [{ productId: testProduct._id.toString(), quantity: 3 }]
    };
    const orderRes = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(orderPayload);

    const orderId = orderRes.body._id;

    // 2. Confirm order
    const confirmRes = await request(app)
      .put(`/orders/confirm/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(confirmRes.status).toBe(200);

    // 3. Verify final inventory
    const inv = await Inventory.findOne({ product: testProduct._id });
    expect(inv.availableQuantity).toBe(7);
    expect(inv.reservedQuantity).toBe(0);

    const order = await Order.findById(orderId);
    expect(order.status).toBe("CONFIRMED");
  });

  test("Cancel correctly releases stock (both restored)", async () => {
    // 1. Create order
    const orderPayload = {
      items: [{ productId: testProduct._id.toString(), quantity: 4 }]
    };
    const orderRes = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(orderPayload);

    const orderId = orderRes.body._id;

    // 2. Cancel order
    const cancelRes = await request(app)
      .put(`/orders/cancel/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(cancelRes.status).toBe(200);

    // 3. Verify final inventory restored to baseline
    const inv = await Inventory.findOne({ product: testProduct._id });
    expect(inv.availableQuantity).toBe(10);
    expect(inv.reservedQuantity).toBe(0);

    const order = await Order.findById(orderId);
    expect(order.status).toBe("CANCELLED");
  });

  test("rejects confirm when reserved stock insufficient and rolls back", async () => {
    // 1. Create order for 5 items
    const orderPayload = {
      items: [{ productId: testProduct._id.toString(), quantity: 5 }]
    };
    const orderRes = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(orderPayload);

    const orderId = orderRes.body._id;

    // 2. Modify DB state manually to cause a mismatch (available: 5, reserved: 2 instead of 5)
    await Inventory.updateOne(
      { product: testProduct._id },
      { $set: { reservedQuantity: 2 } }
    );

    // 3. Try to confirm order
    const confirmRes = await request(app)
      .put(`/orders/confirm/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(confirmRes.status).toBe(500);

    // 4. Verify that inventory remains unchanged (rolled back completely)
    const inv = await Inventory.findOne({ product: testProduct._id });
    expect(inv.availableQuantity).toBe(5);
    expect(inv.reservedQuantity).toBe(2);

    const order = await Order.findById(orderId);
    expect(order.status).toBe("PENDING"); // Order remains in PENDING state
  });
});
