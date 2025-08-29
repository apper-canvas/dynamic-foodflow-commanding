import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RestaurantGrid from "@/components/organisms/RestaurantGrid";
import FilterChips from "@/components/molecules/FilterChips";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { restaurantService } from "@/services/api/restaurantService";

const HomePage = ({ onSearch }) => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const filters = [
    { id: "fast_delivery", label: "Fast Delivery", icon: "Zap", count: 12 },
    { id: "free_delivery", label: "Free Delivery", icon: "Truck", count: 8 },
    { id: "vegetarian", label: "Pure Veg", icon: "Leaf", count: 15 },
{ id: "offers", label: "Special Offers", icon: "Percent", count: 8, interactive: true },
    { id: "top_rated", label: "Top Rated", icon: "Star", count: 10, interactive: true },
    { id: "new", label: "New Arrivals", icon: "Sparkles", count: 4, interactive: true },
    { id: "flash_deals", label: "Flash Deals", icon: "Zap", count: 4, interactive: true },
    { id: "trending", label: "Trending Now", icon: "TrendingUp", count: 6, interactive: true },
    { id: "healthy", label: "Healthy Choice", icon: "Apple", count: 5, interactive: true }
  ];

  const quickCategories = [
    { name: "Pizza", icon: "Pizza", restaurants: 24 },
    { name: "Burgers", icon: "Cookie", restaurants: 18 },
    { name: "Chinese", icon: "Soup", restaurants: 32 },
    { name: "Indian", icon: "Flame", restaurants: 45 },
    { name: "Desserts", icon: "IceCream", restaurants: 16 },
    { name: "Healthy", icon: "Salad", restaurants: 12 }
  ];

const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [specialOffers, setSpecialOffers] = useState([]);
  const loadRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (err) {
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const { recommendationService } = await import("@/services/api/recommendationService");
      const data = await recommendationService.getPersonalizedRecommendations();
      setRecommendations(data);
      // Extract special offers from recommendations
      setSpecialOffers(data.restaurants.specialOffers || []);
    } catch (err) {
      console.error("Failed to load recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
loadRecommendations();
  }, []);
  const handleRestaurantClick = (restaurant) => {
    navigate(`/restaurant/${restaurant.Id}`);
  };

  const handleCategoryClick = (category) => {
    onSearch?.(category);
    navigate(`/search?q=${encodeURIComponent(category)}`);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (activeFilters.length === 0) return true;
    
    return activeFilters.some(filter => {
      switch (filter) {
        case "fast_delivery":
          return restaurant.deliveryTime <= 30;
        case "free_delivery":
          return restaurant.deliveryFee === 0;
        case "vegetarian":
return restaurant.isVegetarian;
        case "offers":
          return restaurant.discount > 0;
        case "flash_deals":
          return restaurant.discount >= 25;
        case "top_rated":
          return restaurant.rating >= 4.5;
        case "new":
          return restaurant.isNew;
        default:
          return true;
      }
    });
  });

return (
<div className="space-y-6 sm:space-y-8 pb-24 sm:pb-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 via-primary-600 through-accent-500 to-primary-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl"
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Delicious food,<br />delivered fast ⚡
          </h1>
          <p className="text-primary-100 mb-6 max-w-md text-lg leading-relaxed">
            Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep with AI-powered recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/recommendations")}
              leftIcon="Brain"
              className="bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              AI Recommendations
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/search")}
              leftIcon="Search"
              className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
            >
              Explore All
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-10">
          <ApperIcon name="UtensilsCrossed" size={120} />
        </div>
        <div className="absolute -bottom-2 -right-2 opacity-5">
          <ApperIcon name="Sparkles" size={80} />
        </div>
      </motion.section>

{/* Interactive Special Offers Section */}
{specialOffers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 interactive-section"
        >
          <motion.div 
            className="flex items-center justify-between mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ApperIcon name="Percent" size={20} className="text-primary-500" />
              </motion.div>
              <h2 className="text-lg font-display font-semibold text-secondary-700">
                Special Offers Just for You ✨
              </h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Badge variant="accent" size="sm" className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 shadow-lg interactive-badge">
                <ApperIcon name="Clock" size={12} />
                Limited Time
              </Badge>
            </motion.div>
          </motion.div>
          <RestaurantGrid
            restaurants={specialOffers}
            onRestaurantClick={handleRestaurantClick}
className="grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          />
        </motion.div>
      )}
      {/* AI Recommendations Section */}
      {recommendations && !loadingRecommendations && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ApperIcon name="Brain" size={24} className="text-primary-600" />
              <h2 className="text-2xl font-display font-bold text-secondary-700">
                Recommended for You
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/recommendations")}
              rightIcon="ArrowRight"
            >
              View All
            </Button>
          </div>
<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Sparkles" size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Smart picks based on your preferences and current context
              </span>
            </div>
            
            {/* Featured Dishes Section */}
            {recommendations.dishes?.forYou && recommendations.dishes.forYou.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-700 mb-4 flex items-center gap-2">
                  <ApperIcon name="UtensilsCrossed" size={20} />
                  Recommended Dishes for You
                </h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {recommendations.dishes.forYou.slice(0, 2).map((dish, index) => (
                    <motion.div
                      key={dish.Id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="UtensilsCrossed" size={20} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-secondary-700 truncate">{dish.name}</h4>
                            <Badge variant="info" size="xs" className="flex-shrink-0 ml-2">
                              {dish.affinityScore}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary-600">₹{dish.price}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <ApperIcon name="Star" size={12} className="text-accent-500" />
                              {dish.rating || "4.5"}
                            </div>
                          </div>
                          {dish.reason && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-700 flex items-center gap-1">
                                <ApperIcon name="Brain" size={12} />
                                {dish.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Top Restaurant Picks */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-4 flex items-center gap-2">
                <ApperIcon name="Store" size={20} />
                Top Restaurant Picks
              </h3>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {recommendations.restaurants.topPicks.slice(0, 3).map((restaurant, index) => (
                  <motion.div
                    key={restaurant.Id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleRestaurantClick(restaurant)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Store" size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-700">{restaurant.name}</h3>
                        <p className="text-sm text-gray-500">{restaurant.cuisine?.join(", ")}</p>
                      </div>
                      <Badge variant="info" size="xs">
                        {restaurant.affinityScore}% match
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Star" size={12} className="text-accent-500" />
                        {restaurant.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={12} />
                        {restaurant.deliveryTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Truck" size={12} />
                        {restaurant.deliveryFee === 0 ? "Free" : `₹${restaurant.deliveryFee}`}
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <ApperIcon name="Brain" size={12} />
                        {restaurant.reason}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Quick Categories */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-display font-bold text-secondary-700 mb-6"
        >
          What are you craving?
        </motion.h2>
        
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {quickCategories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center group"
            >
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:from-primary-100 group-hover:to-accent-100 transition-colors">
                <ApperIcon name={category.icon} size={24} className="text-primary-600" />
              </div>
              <div className="text-sm font-medium text-secondary-700 mb-1">
                {category.name}
              </div>
              <div className="text-xs text-gray-500">
                {category.restaurants} places
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Filters */}
<section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-secondary-700">
            Restaurants near you
          </h2>
          <Badge variant="secondary" size="md" className="self-start sm:self-auto">
            {filteredRestaurants.length} restaurants
          </Badge>
        </div>
        
<FilterChips
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          className="mb-4 sm:mb-6"
        />
      </section>

      {/* Restaurants Grid */}
      <RestaurantGrid
        restaurants={filteredRestaurants}
        loading={loading}
        error={error}
        onRestaurantClick={handleRestaurantClick}
        onRetry={loadRestaurants}
      />
    </div>
  );
};

export default HomePage;