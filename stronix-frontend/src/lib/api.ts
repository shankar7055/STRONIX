// STRONIX Operations B2B API Client & Live Database Adapter
import { demoData } from "./demo-data";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "SUPPLIER" | "WAREHOUSE_MANAGER" | "DISTRIBUTOR";
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
}

export interface Inventory {
  _id?: string;
  product: string | Product;
  availableQuantity: number;
  reservedQuantity: number;
  warehouse?: string;
  updatedAt?: string;
}

export interface OrderItem {
  _id?: string;
  product: string | Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string | User;
  items: (string | OrderItem)[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface TrackingStep {
  status: string;
  timestamp: string;
}

export interface Shipment {
  _id: string;
  order: string | Order;
  address: string;
  distributor?: string | Distributor;
  status: "CREATED" | "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";
  assignedAt?: string;
  deliveredAt?: string;
  tracking: TrackingStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Distributor {
  _id: string;
  name: string;
  phone?: string;
  serviceArea: string;
  status: "ACTIVE" | "INACTIVE";
  currentLoad: number;
  maxCapacity: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  avgDeliveryTime: number;
  rating: number;
  createdAt?: string;
}

export interface CandidateScore {
  distributor: Distributor;
  rank: number;
  isEligible: boolean;
  isSelected: boolean;
  compositeScore: number;
  ineligibilityReason?: string;
  explanation: string;
}

export interface AuditLogItem {
  _id: string;
  user: string | User;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
}

// Token helper
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stronix_token");
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("stronix_token", token);
  }
};

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("stronix_token");
    localStorage.removeItem("stronix_user");
  }
};

// Generic Fetch Wrapper
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
  }

  return data as T;
}

// Transform Demo Models (Fallback ONLY when DB is brand new & unseeded)
const demoProductsMapped: Product[] = demoData.products.map((p) => ({
  _id: p.id,
  name: p.name,
  price: p.unitPrice,
  status: p.status as "ACTIVE",
  createdAt: "2026-07-20T00:00:00.000Z",
}));

const demoOrdersMapped: Order[] = demoData.orders.map((o) => ({
  _id: o.id,
  user: {
    _id: o.customerId,
    name: o.customer,
    email: `${o.customerId}@stronix.demo`,
    role: "CUSTOMER",
  },
  items: o.items.map((it) => ({
    _id: `item-${it.productId}`,
    product: {
      _id: it.productId,
      name: it.name,
      price: it.unitPrice,
      status: "ACTIVE",
    },
    quantity: it.quantity,
    price: it.unitPrice,
  })),
  totalAmount: o.totalAmount,
  status: o.status as "PENDING" | "CONFIRMED" | "CANCELLED",
  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
}));

const demoDistributorsMapped: Distributor[] = demoData.distributors.map((d) => ({
  _id: d.id,
  name: d.name,
  serviceArea: d.serviceAreas.join(", "),
  status: d.status as "ACTIVE",
  currentLoad: d.currentLoad,
  maxCapacity: d.maxCapacity,
  totalDeliveries: d.totalDeliveries,
  successfulDeliveries: d.successfulDeliveries,
  failedDeliveries: d.failedDeliveries,
  avgDeliveryTime: d.avgDeliveryHours,
  rating: d.rating,
}));

const demoShipmentsMapped: Shipment[] = demoData.shipments.map((s) => ({
  _id: s.id,
  order: {
    _id: s.orderNumber,
    user: "usr-customer-01",
    items: [],
    totalAmount: 12000,
    status: "CONFIRMED",
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  },
  address: s.destination,
  distributor: s.assignedDistributorId ? s.assignedDistributorName || "Aster Last Mile" : undefined,
  status: s.status as "ASSIGNED" | "IN_TRANSIT" | "CREATED",
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
  tracking: s.tracking.map((t) => ({ status: t.title, timestamp: t.at })),
}));

// API Methods
export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetchAPI<{ token: string; user?: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    fetchAPI<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const live = await fetchAPI<Product[]>("/products");
      return Array.isArray(live) && live.length > 0 ? live : (process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoProductsMapped : []);
    } catch {
      return process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoProductsMapped : [];
    }
  },

  createProduct: (payload: { name: string; price: number }) =>
    fetchAPI<Product>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Inventory
  getInventory: async (productId: string): Promise<Inventory> => {
    try {
      const live = await fetchAPI<Inventory>(`/inventory/${productId}`);
      if (live && (live.availableQuantity !== undefined || live.product)) return live;
    } catch {}

    if (process.env.NEXT_PUBLIC_ENABLE_DEMO) {
      const demoMatch = demoData.inventory.find((inv) => inv.productId === productId || inv.id === productId);
      if (demoMatch) {
        return {
          _id: demoMatch.id,
          product: {
            _id: demoMatch.productId,
            name: demoMatch.productName,
            price: 5499,
            status: "ACTIVE",
          },
          availableQuantity: demoMatch.availableQuantity,
          reservedQuantity: demoMatch.reservedQuantity,
          updatedAt: demoMatch.lastUpdated,
        };
      }
    }

    return {
      product: productId,
      availableQuantity: 0,
      reservedQuantity: 0,
      updatedAt: new Date().toISOString(),
    };
  },

  addStock: (payload: { productId: string; quantity: number }) =>
    fetchAPI<Inventory>("/inventory", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateStock: (payload: { productId: string; quantity: number }) =>
    fetchAPI<Inventory>("/inventory/stock", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // Orders
  getOrders: async (role?: string): Promise<Order[]> => {
    try {
      const endpoint = role === "CUSTOMER" ? "/orders/my-orders" : "/orders/all-orders";
      const live = await fetchAPI<Order[]>(endpoint).catch(() => fetchAPI<Order[]>("/orders/all"));
      return Array.isArray(live) && live.length > 0 ? live : (process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoOrdersMapped : []);
    } catch {
      return process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoOrdersMapped : [];
    }
  },

  getOrderById: (id: string) => fetchAPI<Order>(`/orders/${id}`),

  createOrder: (items: { productId: string; quantity: number }[]) =>
    fetchAPI<Order>("/orders", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),

  confirmOrder: (orderId: string) =>
    fetchAPI<Order>(`/orders/confirm/${orderId}`, {
      method: "PUT",
    }),

  cancelOrder: (orderId: string) =>
    fetchAPI<Order>(`/orders/cancel/${orderId}`, {
      method: "PUT",
    }),

  // Shipments
  getShipments: async (): Promise<Shipment[]> => {
    try {
      const live = await fetchAPI<Shipment[]>("/shipments");
      return Array.isArray(live) && live.length > 0 ? live : (process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoShipmentsMapped : []);
    } catch {
      return process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoShipmentsMapped : [];
    }
  },

  createShipment: (payload: { orderId: string; address: string }) =>
    fetchAPI<Shipment>("/shipments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  assignDistributor: (shipmentId: string) =>
    fetchAPI<{ message: string; shipment: Shipment }>(`/shipments/assign/${shipmentId}`, {
      method: "PUT",
    }),

  updateShipmentStatus: (shipmentId: string, status: string) =>
    fetchAPI<{ message: string; shipment: Shipment }>(`/shipments/status/${shipmentId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  markShipmentFailed: (shipmentId: string) =>
    fetchAPI<{ message: string; shipment: Shipment }>(`/shipments/failed/${shipmentId}`, {
      method: "PUT",
    }),

  // Distributors
  getDistributors: async (): Promise<Distributor[]> => {
    try {
      const live = await fetchAPI<Distributor[]>("/distributors");
      return Array.isArray(live) && live.length > 0 ? live : (process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoDistributorsMapped : []);
    } catch {
      return process.env.NEXT_PUBLIC_ENABLE_DEMO ? demoDistributorsMapped : [];
    }
  },

  createDistributor: (payload: Partial<Distributor>) =>
    fetchAPI<Distributor>("/distributors", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Reports & Audit
  getSalesReport: () => fetchAPI<any>("/reports/sales"),
  getInventoryReport: () => fetchAPI<any>("/reports/inventory"),
  getSupplierReport: () => fetchAPI<any>("/reports/supplier"),
};

/**
 * Score and evaluate distributor candidates for a shipment based on backend decision criteria
 */
export function evaluateDistributorCandidates(
  shipmentAddress: string,
  distributors: Distributor[],
  assignedDistributorId?: string
): CandidateScore[] {
  const activeDistributors = Array.isArray(distributors) && distributors.length > 0 ? distributors : [];
  const addressLower = (shipmentAddress || "").toLowerCase();

  const evaluated = activeDistributors.map((d) => {
    const areaLower = (d.serviceArea || "").toLowerCase();
    
    const coversArea = areaLower.length > 0 && (
      addressLower.includes(areaLower) || 
      areaLower.includes(addressLower) ||
      addressLower.split(/\s+/).some(part => part.length > 3 && areaLower.includes(part))
    );

    const hasCapacity = d.currentLoad < d.maxCapacity;
    const isActive = d.status === "ACTIVE";
    const isEligible = coversArea && hasCapacity && isActive;

    let ineligibilityReason = "";
    if (!isActive) ineligibilityReason = "Distributor account is INACTIVE";
    else if (!coversArea) ineligibilityReason = `Does not cover ${shipmentAddress.split(",")[0] || "destination"}`;
    else if (!hasCapacity) ineligibilityReason = `Capacity maxed (${d.currentLoad}/${d.maxCapacity} active loads)`;

    const ratingScore = ((d.rating || 5) / 5) * 50;
    const capacityScore = ((d.maxCapacity - d.currentLoad) / d.maxCapacity) * 50;
    const compositeScore = Math.round((ratingScore + capacityScore) * 10) / 10;

    const loadPct = Math.round((d.currentLoad / d.maxCapacity) * 100);
    const explanation = isEligible
      ? `Covers ${d.serviceArea || "destination"} · ${loadPct}% active load (${d.currentLoad}/${d.maxCapacity}) · ${d.rating || 5.0} rating`
      : ineligibilityReason;

    return {
      distributor: d,
      rank: 0,
      isEligible,
      isSelected: assignedDistributorId ? (d._id === assignedDistributorId || d.name === assignedDistributorId) : false,
      compositeScore: isEligible ? compositeScore : 0,
      ineligibilityReason,
      explanation,
    };
  });

  const eligible = evaluated.filter((e) => e.isEligible).sort((a, b) => {
    if (b.distributor.rating !== a.distributor.rating) {
      return b.distributor.rating - a.distributor.rating;
    }
    return a.distributor.currentLoad - b.distributor.currentLoad;
  });

  const ineligible = evaluated.filter((e) => !e.isEligible);

  eligible.forEach((e, idx) => {
    e.rank = idx + 1;
    if (!assignedDistributorId && idx === 0) {
      e.isSelected = true;
    }
  });

  return [...eligible, ...ineligible];
}
