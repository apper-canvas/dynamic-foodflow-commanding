import addressesData from "@/services/mockData/addresses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const addressService = {
  async getAll() {
    await delay(200);
    return [...addressesData];
  },

  async getById(id) {
    await delay(200);
    const address = addressesData.find(a => a.Id === id);
    if (!address) {
      throw new Error("Address not found");
    }
    return { ...address };
  },

  async create(address) {
    await delay(300);
    const newId = Math.max(...addressesData.map(a => a.Id)) + 1;
    const newAddress = { ...address, Id: newId };
    addressesData.push(newAddress);
    return { ...newAddress };
  },

  async update(id, updates) {
    await delay(300);
    const index = addressesData.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Address not found");
    }
    addressesData[index] = { ...addressesData[index], ...updates };
    return { ...addressesData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = addressesData.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Address not found");
    }
    const deleted = addressesData.splice(index, 1)[0];
    return { ...deleted };
  }
};