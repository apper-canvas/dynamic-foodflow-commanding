import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RestaurantGrid from "@/components/organisms/RestaurantGrid";
import FilterChips from "@/components/molecules/FilterChips";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { restaurantService } from "@/services/api/restaurantService";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const searchSuggestions = [
    "Pizza", "Burger", "Biryani", "Chinese", "Italian", "North Indian", 
    "South Indian", "Fast Food", "Healthy", "Desserts", "Ice Cream",
    "Sandwich", "Rolls", "Pasta", "Noodles", "Thai", "Mexican"
  ];

  const filters = [
    { id: "fast_delivery", label: "Fast Delivery", icon: "Zap", count: 0 },
    { id: "free_delivery", label: "Free Delivery", icon: "Truck", count: 0 },
    { id: "vegetarian", label: "Pure Veg", icon: "Leaf", count: 0 },
    { id: "offers", label: "Great Offers", icon: "Percent", count: 0 },
    { id: "top_rated", label: "Top Rated", icon: "Star", count: 0 },
    { id: "new", label: "New Arrivals", icon: "Sparkles", count: 0 }
  ];

  const popularSearches = [
    { term: "Pizza", count: 234 },
    { term: "Biryani", count: 189 },
    { term: "Burger", count: 156 },
    { term: "Chinese", count: 142 },
    { term: "Ice Cream", count: 98 },
    { term: "Healthy Food", count: 76 }
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

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, restaurants]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(restaurant => {
      const nameMatch = restaurant.name.toLowerCase().includes(query.toLowerCase());
      const cuisineMatch = Array.isArray(restaurant.cuisine) 
        ? restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
        : restaurant.cuisine.toLowerCase().includes(query.toLowerCase());
      
      return nameMatch || cuisineMatch;
    });

    setFilteredRestaurants(filtered);
  };

  const handleRestaurantClick = (restaurant) => {
    navigate(`/restaurant/${restaurant.Id}`);
  };

  const handlePopularSearchClick = (term) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  const applyFilters = (restaurants) => {
    if (activeFilters.length === 0) return restaurants;
    
    return restaurants.filter(restaurant => {
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
  };

  const finalRestaurants = applyFilters(searchQuery ? filteredRestaurants : restaurants);

  const showEmptyState = !loading && !error && searchQuery && finalRestaurants.length === 0;
  const showPopularSearches = !loading && !error && !searchQuery;

  return (
<div className="space-y-4 sm:space-y-6 pb-24 sm:pb-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm py-3 sm:py-4 -mx-4 px-3 sm:px-4 border-b border-gray-100"
      >
        <SearchBar
          placeholder="Search restaurants, dishes, cuisines..."
          suggestions={searchSuggestions}
          onSearch={handleSearch}
        />
      </motion.div>

      {/* Popular Searches */}
      {showPopularSearches && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-display font-bold text-secondary-700 mb-4">
            Popular right now
          </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {popularSearches.map((search, index) => (
              <motion.button
                key={search.term}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePopularSearchClick(search.term)}
                className="bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left border border-gray-100 min-h-[60px] sm:min-h-[auto]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-secondary-700 mb-1 text-sm sm:text-base line-clamp-1">{search.term}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{search.count} restaurants</p>
                  </div>
                  <ApperIcon name="TrendingUp" size={16} className="text-primary-500 flex-shrink-0 ml-2 sm:w-5 sm:h-5" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Search Results */}
      {(searchQuery || activeFilters.length > 0) && !showPopularSearches && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-secondary-700">
              {searchQuery ? `Results for "${searchQuery}"` : "All Restaurants"}
            </h2>
            <Badge variant="secondary" size="md">
              {finalRestaurants.length} found
            </Badge>
          </div>

          <FilterChips
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        </>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <Empty
          type="search"
          onAction={() => {
            setSearchQuery("");
            setActiveFilters([]);
            handleSearch("");
          }}
          actionText="Clear Search"
        />
      )}

      {/* Results Grid */}
      {!showPopularSearches && !showEmptyState && (
        <RestaurantGrid
          restaurants={finalRestaurants}
          loading={loading}
          error={error}
          onRestaurantClick={handleRestaurantClick}
          onRetry={loadRestaurants}
        />
      )}
    </div>
  );
};

export default SearchPage;