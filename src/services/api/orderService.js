import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(400);
    return [...ordersData];
  },

  async getById(id) {
    await delay(300);
    const order = ordersData.find(o => o.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(order) {
    await delay(500);
    const newId = Math.max(...ordersData.map(o => o.Id)) + 1;
    const newOrder = { 
      ...order, 
      Id: newId,
      status: "confirmed",
      orderDate: new Date().toISOString().split("T")[0]
    };
    ordersData.push(newOrder);
    return { ...newOrder };
  },

  async update(id, updates) {
    await delay(400);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index] = { ...ordersData[index], ...updates };
    return { ...ordersData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    const deleted = ordersData.splice(index, 1)[0];
    return { ...deleted };
  }
};