import restaurantsData from "@/services/mockData/restaurants.json";
import menuItemsData from "@/services/mockData/menuItems.json";
import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated user preference data - in real app would come from user profile/analytics
const mockUserPreferences = {
  userId: "user1",
  dietaryPreferences: ["veg", "healthy"],
  cuisinePreferences: ["Italian", "Indian", "Healthy"],
  spiceLevelPreference: 2,
  allergens: ["nuts"],
  favoriteRestaurants: [1, 3, 5],
  orderHistory: ordersData,
  avgOrderValue: 450,
  preferredOrderTimes: ["12:00", "19:30"],
  lastOrderDate: "2024-01-15"
};

// AI Recommendation Algorithm
class RecommendationEngine {
  static getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 10) return "breakfast";
    if (hour < 15) return "lunch";
    if (hour < 18) return "snack";
    return "dinner";
  }

  static getWeatherContext() {
    // Mock weather - in real app would integrate with weather API
    const weatherConditions = ["sunny", "rainy", "cold", "hot"];
    return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  }

  static calculateRestaurantAffinity(restaurant, userPrefs) {
    let score = 0;
    
    // Base rating contribution
    score += restaurant.rating * 10;
    
    // Cuisine preference match
    if (Array.isArray(restaurant.cuisine)) {
      const cuisineMatch = restaurant.cuisine.some(c => 
        userPrefs.cuisinePreferences.includes(c)
      );
      if (cuisineMatch) score += 25;
    }
    
    // Previous order history
    if (userPrefs.favoriteRestaurants.includes(restaurant.Id)) {
      score += 30;
    }
    
    // Dietary compatibility
    if (restaurant.isVegetarian && userPrefs.dietaryPreferences.includes("veg")) {
      score += 20;
    }
    
    // Delivery preferences
    if (restaurant.deliveryFee === 0) score += 10;
    if (restaurant.deliveryTime <= 25) score += 10;
    
// Promotional boost - enhanced for special offers
    if (restaurant.isPromoted) score += 8;
    if (restaurant.discount > 0) {
      score += restaurant.discount * 0.8; // Higher boost for discounts
      if (restaurant.discount >= 20) score += 5; // Extra boost for significant discounts
    }
    return Math.min(score, 100); // Cap at 100
  }

  static calculateDishAffinity(dish, userPrefs, timeOfDay, weather) {
    let score = 0;
    
    // Base popularity score
    if (dish.isPopular) score += 15;
    if (dish.isBestSeller) score += 20;
    
    // Dietary preference match
    if (dish.dietary) {
      const dietaryMatch = dish.dietary.some(d => 
        userPrefs.dietaryPreferences.includes(d)
      );
      if (dietaryMatch) score += 25;
    }
    
    // Spice level preference
    const spiceDiff = Math.abs((dish.spiceLevel || 0) - userPrefs.spiceLevelPreference);
    score += Math.max(0, 10 - spiceDiff * 3);
    
    // Allergen check (negative scoring)
    if (dish.allergens && dish.allergens.some(a => userPrefs.allergens.includes(a))) {
      score -= 30;
    }
    
    // Time of day contextual scoring
    const timeBonus = this.getTimeBasedBonus(dish, timeOfDay);
    score += timeBonus;
    
    // Weather contextual scoring
    const weatherBonus = this.getWeatherBasedBonus(dish, weather);
    score += weatherBonus;
    
    // Price preference (favor items around user's avg order value)
    const priceScore = this.getPriceAffinityScore(dish.price, userPrefs.avgOrderValue);
score += priceScore;
    
    // Special offers boost
    if (dish.discount && dish.discount > 0) {
      score += dish.discount * 0.7;
      if (dish.discount >= 15) score += 4; // Extra boost for good deals
    }
    if (dish.isLimitedTime) score += 6;
    if (dish.isComboOffer) score += 5;
    
    return Math.max(0, Math.min(score, 100));
  }

  static getTimeBasedBonus(dish, timeOfDay) {
    const timePreferences = {
      breakfast: ["Beverages", "Sides"],
      lunch: ["Main Course", "Bowls", "Rice"],
      snack: ["Sides", "Desserts", "Beverages"],
      dinner: ["Main Course", "Pizza", "Burgers", "Thali"]
    };
    
    if (timePreferences[timeOfDay]?.includes(dish.category)) {
      return 15;
    }
    return 0;
  }

  static getWeatherBasedBonus(dish, weather) {
    const weatherPreferences = {
      cold: { categories: ["Main Course", "Thali"], spiceLevel: [3, 4, 5] },
      hot: { categories: ["Beverages", "Desserts", "Salads"], spiceLevel: [0, 1] },
      rainy: { categories: ["Pizza", "Burgers", "Main Course"], spiceLevel: [2, 3, 4] },
      sunny: { categories: ["Bowls", "Salads", "Beverages"], spiceLevel: [0, 1, 2] }
    };
    
    const weatherPref = weatherPreferences[weather];
    if (!weatherPref) return 0;
    
    let bonus = 0;
    if (weatherPref.categories.includes(dish.category)) bonus += 10;
    if (weatherPref.spiceLevel.includes(dish.spiceLevel || 0)) bonus += 8;
    
    return bonus;
  }

  static getPriceAffinityScore(dishPrice, avgOrderValue) {
    const idealPrice = avgOrderValue * 0.3; // Assume 30% of order value per dish
    const priceDiff = Math.abs(dishPrice - idealPrice);
    const maxDiff = idealPrice;
    
    return Math.max(0, 10 - (priceDiff / maxDiff) * 10);
  }

  static getRecommendationReason(item, context, score) {
    const reasons = [];
    
    if (score >= 80) reasons.push("Perfect match for your taste!");
    else if (score >= 60) reasons.push("Great choice based on your preferences");
    else if (score >= 40) reasons.push("You might like this");
    
    if (context.timeOfDay === "dinner" && item.category === "Main Course") {
      reasons.push("Perfect for dinner time");
    }
    
    if (context.weather === "cold" && (item.spiceLevel || 0) >= 3) {
      reasons.push("Spicy and warming for cold weather");
    }
    
    if (item.isPopular) reasons.push("Very popular with other users");
    if (item.isBestSeller) reasons.push("Bestseller item");
    
    return reasons[0] || "Recommended for you";
  }
}

export const recommendationService = {
async getPersonalizedRecommendations() {
    await delay(500);
    
    const timeOfDay = RecommendationEngine.getTimeOfDay();
    const weather = RecommendationEngine.getWeatherContext();
    const context = { timeOfDay, weather };
    
    // Get restaurant recommendations with offer prioritization
    const restaurantScores = restaurantsData.map(restaurant => ({
      ...restaurant,
      affinityScore: RecommendationEngine.calculateRestaurantAffinity(restaurant, mockUserPreferences),
      reason: RecommendationEngine.getRecommendationReason(restaurant, context, 
        RecommendationEngine.calculateRestaurantAffinity(restaurant, mockUserPreferences))
    })).sort((a, b) => b.affinityScore - a.affinityScore);

    // Get dish recommendations with offer scoring
    const dishScores = menuItemsData.map(dish => ({
      ...dish,
      affinityScore: RecommendationEngine.calculateDishAffinity(dish, mockUserPreferences, timeOfDay, weather),
      reason: RecommendationEngine.getRecommendationReason(dish, context,
        RecommendationEngine.calculateDishAffinity(dish, mockUserPreferences, timeOfDay, weather))
    })).sort((a, b) => b.affinityScore - a.affinityScore);
return {
      context: {
        timeOfDay,
        weather,
        userPreferences: mockUserPreferences.dietaryPreferences
      },
      restaurants: {
        topPicks: restaurantScores.slice(0, 6),
        trending: restaurantScores.filter(r => r.isPromoted).slice(0, 4),
        quickDelivery: restaurantScores.filter(r => r.deliveryTime <= 25).slice(0, 4),
        vegetarian: restaurantScores.filter(r => r.isVegetarian).slice(0, 4),
        specialOffers: restaurantScores.filter(r => r.discount > 0).slice(0, 6)
      },
      dishes: {
        forYou: dishScores.slice(0, 8),
        trending: dishScores.filter(d => d.isPopular).slice(0, 6),
        contextual: dishScores.filter(d => 
          RecommendationEngine.getTimeBasedBonus(d, timeOfDay) > 0
        ).slice(0, 6),
        dietary: dishScores.filter(d => 
          d.dietary?.some(diet => mockUserPreferences.dietaryPreferences.includes(diet))
        ).slice(0, 6),
        quickBites: dishScores.filter(d => 
          d.category === "Snacks" || d.category === "Appetizers" || d.prepTime <= 15
        ).slice(0, 6),
        comfortFood: dishScores.filter(d => 
          weather === "cold" && (d.category === "Main Course" || d.spiceLevel >= 2)
        ).slice(0, 6),
        healthyChoices: dishScores.filter(d => 
          d.dietary?.includes("veg") && d.calories < 400 && (!d.allergens || d.allergens.length === 0)
        ).slice(0, 6),
        budgetFriendly: dishScores.filter(d => d.price <= 200).slice(0, 6),
        specialOffers: dishScores.filter(d => d.discount && d.discount > 0).slice(0, 8),
        flashSales: dishScores.filter(d => d.discount >= 25).slice(0, 4),
        limitedTime: dishScores.filter(d => d.isLimitedTime).slice(0, 4),
        comboDeal: dishScores.filter(d => d.isComboOffer).slice(0, 4)
      }
    };
  },

  async getRestaurantRecommendations(restaurantId) {
    await delay(300);
    
    const restaurant = restaurantsData.find(r => r.Id === restaurantId);
    if (!restaurant) return null;

    const restaurantMenu = menuItemsData.filter(m => m.restaurantId === restaurantId);
    const timeOfDay = RecommendationEngine.getTimeOfDay();
    const weather = RecommendationEngine.getWeatherContext();
    
    const recommendedDishes = restaurantMenu.map(dish => ({
      ...dish,
      affinityScore: RecommendationEngine.calculateDishAffinity(dish, mockUserPreferences, timeOfDay, weather),
      reason: RecommendationEngine.getRecommendationReason(dish, { timeOfDay, weather },
        RecommendationEngine.calculateDishAffinity(dish, mockUserPreferences, timeOfDay, weather))
    })).sort((a, b) => b.affinityScore - a.affinityScore);

    return {
      restaurant,
      recommendations: {
        topPicks: recommendedDishes.slice(0, 4),
        basedOnHistory: recommendedDishes.filter(d => d.isPopular).slice(0, 3),
        perfectForNow: recommendedDishes.filter(d => 
          RecommendationEngine.getTimeBasedBonus(d, timeOfDay) > 0
        ).slice(0, 3)
      }
    };
  },

  async getContextualSuggestions(filters = {}) {
    await delay(200);
    
    const timeOfDay = RecommendationEngine.getTimeOfDay();
    const weather = RecommendationEngine.getWeatherContext();
    
    let suggestions = [...menuItemsData];
    
    // Apply filters
    if (filters.dietary) {
      suggestions = suggestions.filter(dish => 
        dish.dietary?.includes(filters.dietary)
      );
    }
    
    if (filters.maxPrice) {
      suggestions = suggestions.filter(dish => dish.price <= filters.maxPrice);
    }
    
    if (filters.cuisine) {
      const restaurantIds = restaurantsData
        .filter(r => r.cuisine?.includes(filters.cuisine))
        .map(r => r.Id);
      suggestions = suggestions.filter(dish => 
        restaurantIds.includes(dish.restaurantId)
      );
    }
    
    // Score and sort
    const scoredSuggestions = suggestions.map(dish => ({
      ...dish,
      affinityScore: RecommendationEngine.calculateDishAffinity(dish, mockUserPreferences, timeOfDay, weather),
      reason: RecommendationEngine.getRecommendationReason(dish, { timeOfDay, weather },
        RecommendationEngine.calculateDishAffinity(dish, mockUserPreferences, timeOfDay, weather))
    })).sort((a, b) => b.affinityScore - a.affinityScore);
    
    return {
      context: { timeOfDay, weather },
      suggestions: scoredSuggestions.slice(0, 10)
    };
  }
};