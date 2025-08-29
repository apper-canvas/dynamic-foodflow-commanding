import restaurantsData from "@/services/mockData/restaurants.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const restaurantService = {
  async getAll() {
    await delay(300);
    return [...restaurantsData];
  },

  async getById(id) {
    await delay(400);
    const restaurant = restaurantsData.find(r => r.Id === id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    return { ...restaurant };
  },

  async getSubscriptionMeals() {
    await delay(300);
    // Return restaurants that offer subscription meals
    const subscriptionRestaurants = restaurantsData.filter(r => 
      r.subscriptionAvailable !== false
    );
    return [...subscriptionRestaurants];
  },

  async create(restaurant) {
    await delay(500);
    const newId = Math.max(...restaurantsData.map(r => r.Id)) + 1;
    const newRestaurant = { ...restaurant, Id: newId };
    restaurantsData.push(newRestaurant);
    return { ...newRestaurant };
  },

  async update(id, updates) {
    await delay(400);
    const index = restaurantsData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Restaurant not found");
    }
    restaurantsData[index] = { ...restaurantsData[index], ...updates };
    return { ...restaurantsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = restaurantsData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Restaurant not found");
    }
    const deleted = restaurantsData.splice(index, 1)[0];
    return { ...deleted };
  }
};