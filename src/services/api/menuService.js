import menuItemsData from "@/services/mockData/menuItems.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const menuService = {
  async getAll() {
    await delay(300);
    return [...menuItemsData];
  },

  async getById(id) {
    await delay(200);
    const item = menuItemsData.find(m => m.Id === id);
    if (!item) {
      throw new Error("Menu item not found");
    }
    return { ...item };
  },

  async getByRestaurantId(restaurantId) {
    await delay(400);
    const items = menuItemsData.filter(m => m.restaurantId === restaurantId);
    return items.map(item => ({ ...item }));
  },

  async create(menuItem) {
    await delay(500);
    const newId = Math.max(...menuItemsData.map(m => m.Id)) + 1;
    const newItem = { ...menuItem, Id: newId };
    menuItemsData.push(newItem);
    return { ...newItem };
  },

  async update(id, updates) {
    await delay(400);
    const index = menuItemsData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Menu item not found");
    }
    menuItemsData[index] = { ...menuItemsData[index], ...updates };
    return { ...menuItemsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = menuItemsData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Menu item not found");
    }
    const deleted = menuItemsData.splice(index, 1)[0];
    return { ...deleted };
  }
};