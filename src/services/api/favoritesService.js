import favoritesData from "@/services/mockData/favorites.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const favoritesService = {
  async getAll() {
    await delay(300);
    return [...favoritesData];
  },

  async getById(id) {
    await delay(200);
    const favorite = favoritesData.find(f => f.Id === id);
    if (!favorite) {
      throw new Error("Favorite not found");
    }
    return { ...favorite };
  },

  async create(item) {
    await delay(400);
    const newId = Math.max(...favoritesData.map(f => f.Id), 0) + 1;
    const newFavorite = { 
      ...item, 
      Id: newId,
      dateAdded: new Date().toISOString().split("T")[0],
      quickOrder: item.type === 'dish' // Dishes can be quick ordered
    };
    favoritesData.push(newFavorite);
    return { ...newFavorite };
  },

  async delete(id) {
    await delay(300);
    const index = favoritesData.findIndex(f => f.Id === id);
    if (index === -1) {
      throw new Error("Favorite not found");
    }
    const deleted = favoritesData.splice(index, 1)[0];
    return { ...deleted };
  },

  async isFavorite(itemId, itemType) {
    await delay(100);
    return favoritesData.some(f => 
      (f.originalId === itemId || f.Id === itemId) && f.type === itemType
    );
  },

  async toggleFavorite(item) {
    await delay(300);
    const existingIndex = favoritesData.findIndex(f => 
      (f.originalId === item.Id || f.Id === item.Id) && f.type === item.type
    );
    
    if (existingIndex >= 0) {
      // Remove from favorites
      const deleted = favoritesData.splice(existingIndex, 1)[0];
      return { action: 'removed', item: { ...deleted } };
    } else {
      // Add to favorites
      const newId = Math.max(...favoritesData.map(f => f.Id), 0) + 1;
      const newFavorite = { 
        ...item,
        Id: newId,
        originalId: item.Id,
        dateAdded: new Date().toISOString().split("T")[0],
        quickOrder: item.type === 'dish'
      };
      favoritesData.push(newFavorite);
      return { action: 'added', item: { ...newFavorite } };
    }
  }
};