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
    { id: "offers", label: "Great Offers", icon: "Percent", count: 6 },
    { id: "top_rated", label: "Top Rated", icon: "Star", count: 10 },
    { id: "new", label: "New Arrivals", icon: "Sparkles", count: 4 }
  ];

  const quickCategories = [
    { name: "Pizza", icon: "Pizza", restaurants: 24 },
    { name: "Burgers", icon: "Cookie", restaurants: 18 },
    { name: "Chinese", icon: "Soup", restaurants: 32 },
    { name: "Indian", icon: "Flame", restaurants: 45 },
    { name: "Desserts", icon: "IceCream", restaurants: 16 },
    { name: "Healthy", icon: "Salad", restaurants: 12 }
  ];

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

  useEffect(() => {
    loadRestaurants();
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
    <div className="space-y-8">
      {/* Hero Section */}
<motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Delicious food,<br />delivered fast
          </h1>
          <p className="text-primary-100 mb-6 max-w-md text-lg">
            Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/search")}
              leftIcon="Search"
              className="bg-white text-primary-600 hover:bg-gray-50"
            >
              Explore Restaurants
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/subscriptions")}
              leftIcon="Calendar"
              className="border-white text-white hover:bg-white/10"
            >
              Meal Subscriptions
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <ApperIcon name="UtensilsCrossed" size={120} />
        </div>
      </motion.section>

      {/* Quick Categories */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-display font-bold text-secondary-700 mb-6"
        >
          What are you craving?
        </motion.h2>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold text-secondary-700">
            Restaurants near you
          </h2>
          <Badge variant="secondary" size="md">
            {filteredRestaurants.length} restaurants
          </Badge>
        </div>
        
        <FilterChips
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          className="mb-6"
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