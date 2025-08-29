import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "@/components/molecules/RestaurantCard";
import DishCard from "@/components/molecules/DishCard";
import FilterChips from "@/components/molecules/FilterChips";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { recommendationService } from "@/services/api/recommendationService";
import { toast } from "react-toastify";

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("restaurants");
  const [activeFilter, setActiveFilter] = useState("forYou");

  const loadRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await recommendationService.getPersonalizedRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError("Failed to load recommendations. Please try again.");
      console.error("Recommendations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleRestaurantClick = (restaurant) => {
    navigate(`/restaurant/${restaurant.Id}`);
  };

  const handleAddToCart = (dish) => {
    toast.success(`${dish.name} added to cart!`);
  };

  const tabs = [
    { id: "restaurants", label: "Restaurants", icon: "Store" },
    { id: "dishes", label: "Dishes", icon: "UtensilsCrossed" }
  ];

  const restaurantFilters = [
    { id: "topPicks", label: "Top Picks", icon: "Star" },
    { id: "trending", label: "Trending", icon: "TrendingUp" },
    { id: "quickDelivery", label: "Quick Delivery", icon: "Zap" },
    { id: "vegetarian", label: "Vegetarian", icon: "Leaf" }
  ];

  const dishFilters = [
    { id: "forYou", label: "For You", icon: "Heart" },
    { id: "trending", label: "Popular", icon: "Flame" },
    { id: "contextual", label: "Perfect for Now", icon: "Clock" },
    { id: "dietary", label: "Your Diet", icon: "Leaf" }
  ];

  if (loading) {
    return <Loading type="recommendations" />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadRecommendations}
        type="recommendations"
      />
    );
  }

  if (!recommendations) {
    return <Empty type="recommendations" onAction={loadRecommendations} actionText="Refresh" />;
  }

  const currentRestaurants = recommendations.restaurants[activeFilter] || [];
  const currentDishes = recommendations.dishes[activeFilter] || [];
  const filters = activeTab === "restaurants" ? restaurantFilters : dishFilters;

  return (
    <div className="space-y-6">
      {/* Header with Context */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Smart Recommendations
          </h1>
          <p className="text-primary-100 mb-4 max-w-2xl">
            AI-powered suggestions based on your preferences, order history, and current context
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30">
              <ApperIcon name="Clock" size={14} />
              {recommendations.context.timeOfDay}
            </Badge>
            <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30">
              <ApperIcon name="Cloud" size={14} />
              {recommendations.context.weather} weather
            </Badge>
            <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30">
              <ApperIcon name="User" size={14} />
              {recommendations.context.userPreferences.join(", ")} preferences
            </Badge>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 opacity-20">
          <ApperIcon name="Brain" size={80} />
        </div>
      </motion.section>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab(tab.id);
              setActiveFilter(tab.id === "restaurants" ? "topPicks" : "forYou");
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm flex-1 justify-center transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter.id
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                : "bg-white text-secondary-600 border border-gray-200 hover:border-primary-300"
            }`}
          >
            <ApperIcon name={filter.icon} size={16} />
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.section
        key={`${activeTab}-${activeFilter}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-secondary-700">
            {filters.find(f => f.id === activeFilter)?.label}
          </h2>
          <Badge variant="secondary" size="md">
            {activeTab === "restaurants" ? currentRestaurants.length : currentDishes.length} items
          </Badge>
        </div>

        {activeTab === "restaurants" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <RestaurantCard
                  restaurant={restaurant}
                  onClick={handleRestaurantClick}
                />
                
                {/* AI Recommendation Reason */}
                <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Brain" size={16} className="text-blue-600" />
                    <span className="text-blue-700 font-medium">AI Insight:</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">{restaurant.reason}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="bg-blue-200 rounded-full px-2 py-1">
                      <span className="text-xs font-bold text-blue-800">
                        {restaurant.affinityScore}% match
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentDishes.map((dish, index) => (
              <motion.div
                key={dish.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <DishCard
                  dish={dish}
                  onAddToCart={handleAddToCart}
                />
                
                {/* AI Recommendation Overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="info" size="xs" className="bg-blue-600 text-white">
                    <ApperIcon name="Brain" size={10} />
                    {dish.affinityScore}% match
                  </Badge>
                </div>
                
                {/* Recommendation Reason */}
                <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Sparkles" size={14} className="text-purple-600" />
                    <span className="text-sm text-purple-700 font-medium">{dish.reason}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "restaurants" && currentRestaurants.length === 0) ||
          (activeTab === "dishes" && currentDishes.length === 0)) && (
          <Empty
            type="search"
            onAction={() => setActiveFilter(activeTab === "restaurants" ? "topPicks" : "forYou")}
            actionText="Show Top Picks"
          />
        )}
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-display font-bold text-secondary-700 mb-4">
          Discover More
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/search")}
            leftIcon="Search"
            className="h-12"
          >
            Search All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            leftIcon="Home"
            className="h-12"
          >
            Browse Home
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecommendations}
            leftIcon="RefreshCw"
            className="h-12"
          >
            Refresh AI
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/account")}
            leftIcon="Settings"
            className="h-12"
          >
            Preferences
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default RecommendationsPage;