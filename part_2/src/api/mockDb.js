// In-memory + localStorage-backed mock "database" so the app is fully usable
// even when the hosted assignment API (https://187.127.214.49) is unreachable.
//
// It mirrors the documented API behaviour (search/category/status/sort/pagination)
// closely enough for UI development and review.

const STORAGE_KEY = "aivinix-mock-products-v1";

const CATEGORIES = [
  "Accessories",
  "Electronics",
  "Office Supplies",
  "Furniture",
  "Networking",
  "Storage",
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function seedProducts() {
  const names = [
    "Wireless Keyboard",
    "Wireless Mouse",
    "27-inch Monitor",
    "USB-C Hub",
    "Mechanical Keyboard",
    "Noise Cancelling Headset",
    "Standing Desk",
    "Ergonomic Chair",
    "Webcam 1080p",
    "Laptop Stand",
    "External SSD 1TB",
    "Portable Charger",
    "Desk Lamp",
    "Router Wi-Fi 6",
    "Network Switch 8-port",
    "Bluetooth Speaker",
    "Whiteboard 90x60",
    "Printer Paper A4 (box)",
    "Stapler Heavy Duty",
    "Filing Cabinet 3-drawer",
    "Cable Organizer Set",
    "Document Scanner",
    "Graphics Tablet",
    "Conference Microphone",
    "HDMI Cable 2m",
    "Ethernet Cable 5m",
    "Surge Protector",
    "Mouse Pad XL",
    "Monitor Arm",
    "Under-desk Footrest",
  ];

  return names.map((name, index) => {
    const id = index + 1;
    const createdDaysAgo = randomBetween(1, 240);
    const createdAt = new Date(Date.now() - createdDaysAgo * 86400000).toISOString();
    return {
      id,
      name,
      category: CATEGORIES[index % CATEGORIES.length],
      price: Number((randomBetween(9, 899) + 0.99).toFixed(2)),
      stock: randomBetween(0, 120),
      status: index % 5 === 0 ? "inactive" : "active",
      description: `${name} — sample product used for the AiVinix frontend assignment (mock data).`,
      createdAt,
    };
  });
}

function loadDb() {
  if (typeof window === "undefined") return seedProducts();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedProducts();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("invalid shape");
    return parsed;
  } catch {
    // Corrupted / invalid localStorage value: reset instead of crashing.
    const seeded = seedProducts();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    } catch {
      /* ignore quota errors */
    }
    return seeded;
  }
}

let db = loadDb();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* ignore quota errors */
  }
}

function nextId() {
  return db.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function simulateLatency(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class MockApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors || null;
  }
}

function validate(payload) {
  const errors = {};
  if (!payload.name || String(payload.name).trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }
  if (!payload.category || String(payload.category).trim().length === 0) {
    errors.category = "Category is required.";
  }
  const price = Number(payload.price);
  if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than 0.";
  }
  const stock = Number(payload.stock);
  if (Number.isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number 0 or greater.";
  }
  if (!["active", "inactive"].includes(payload.status)) {
    errors.status = "Status must be active or inactive.";
  }
  if (payload.description && String(payload.description).length > 500) {
    errors.description = "Description must be at most 500 characters.";
  }
  if (Object.keys(errors).length > 0) {
    throw new MockApiError("Validation failed", 400, errors);
  }
}

export async function mockFetchProducts(params = {}) {
  await simulateLatency();

  let items = [...db];

  if (params.search) {
    const q = String(params.search).toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (params.category) {
    items = items.filter((p) => p.category === params.category);
  }
  if (params.status) {
    items = items.filter((p) => p.status === params.status);
  }

  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;
  items.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === bv) return 0;
    if (typeof av === "string") return av.localeCompare(bv) * sortOrder;
    return (av > bv ? 1 : -1) * sortOrder;
  });

  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const pageSize = Number(params.pageSize) > 0 ? Number(params.pageSize) : 10;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    data: pageItems,
    meta: { page, pageSize, total, totalPages },
  };
}

export async function mockFetchProduct(id) {
  await simulateLatency(200);
  const product = db.find((p) => String(p.id) === String(id));
  if (!product) {
    throw new MockApiError("Product not found", 404);
  }
  return product;
}

export async function mockCreateProduct(payload) {
  await simulateLatency();
  validate(payload);
  const product = {
    id: nextId(),
    name: payload.name.trim(),
    category: payload.category,
    price: Number(payload.price),
    stock: Number(payload.stock),
    status: payload.status,
    description: payload.description || "",
    createdAt: new Date().toISOString(),
  };
  db = [product, ...db];
  persist();
  return product;
}

export async function mockUpdateProduct(id, payload) {
  await simulateLatency();
  validate(payload);
  const index = db.findIndex((p) => String(p.id) === String(id));
  if (index === -1) {
    throw new MockApiError("Product not found", 404);
  }
  const updated = {
    ...db[index],
    name: payload.name.trim(),
    category: payload.category,
    price: Number(payload.price),
    stock: Number(payload.stock),
    status: payload.status,
    description: payload.description || "",
  };
  db = [...db.slice(0, index), updated, ...db.slice(index + 1)];
  persist();
  return updated;
}

export async function mockDeleteProduct(id) {
  await simulateLatency();
  const exists = db.some((p) => String(p.id) === String(id));
  if (!exists) {
    throw new MockApiError("Product not found", 404);
  }
  db = db.filter((p) => String(p.id) !== String(id));
  persist();
  return { success: true };
}

export const MOCK_CATEGORIES = CATEGORIES;
