import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { favoritesService } from "@/services/api/favoritesService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const loadFavorites = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await favoritesService.getAll();
      setFavorites(data);
    } catch (err) {
      setError("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (item) => {
    setRemovingId(item.Id);
    try {
      await favoritesService.delete(item.Id);
      setFavorites(prev => prev.filter(fav => fav.Id !== item.Id));
      toast.success(`${item.name} removed from favorites`);
    } catch (err) {
      toast.error("Failed to remove from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  const handleReorder = (item) => {
    if (item.type === 'dish') {
      // Navigate to restaurant with specific dish
      navigate(`/restaurant/${item.restaurantId}`, {
        state: { highlightDish: item.Id }
      });
    } else if (item.type === 'restaurant') {
      // Navigate to restaurant
      navigate(`/restaurant/${item.Id}`);
    }
    toast.info(`Opening ${item.name}...`);
  };

  const getDietaryBadge = (dietary) => {
    const badges = [];
    
    if (dietary?.includes("veg")) {
      badges.push(<Badge key="veg" variant="veg" size="xs"><ApperIcon name="Leaf" size={10} />Veg</Badge>);
    }
    if (dietary?.includes("non-veg")) {
      badges.push(<Badge key="non-veg" variant="nonveg" size="xs"><ApperIcon name="Drumstick" size={10} />Non-Veg</Badge>);
    }
    if (dietary?.includes("jain")) {
      badges.push(<Badge key="jain" variant="jain" size="xs"><ApperIcon name="Heart" size={10} />Jain</Badge>);
    }
    
    return badges.length > 0 ? badges : null;
  };

  if (loading) {
    return <Loading type="favorites" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadFavorites}
        type="favorites"
      />
    );
  }

  return (
<div className="space-y-4 sm:space-y-6 pb-24 sm:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0"
      >
        <div className="flex items-center gap-3">
          <ApperIcon name="Heart" size={20} className="text-primary-600 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl font-display font-bold text-secondary-700">
            Your Favorites
          </h1>
        </div>
        <Badge variant="secondary" size="md" className="self-start sm:self-auto">
          {favorites.length} items
        </Badge>
      </motion.div>

      {/* Favorites Content */}
      {favorites.length === 0 ? (
        <Empty
          type="favorites"
          onAction={() => navigate("/")}
          actionText="Discover Food"
        />
      ) : (
        <div className="space-y-4">
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
          >
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <ApperIcon name="UtensilsCrossed" size={14} className="text-primary-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium text-primary-700">Dishes</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-primary-700">
                {favorites.filter(f => f.type === 'dish').length}
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <ApperIcon name="Store" size={14} className="text-accent-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium text-accent-700">Restaurants</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-accent-700">
                {favorites.filter(f => f.type === 'restaurant').length}
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <ApperIcon name="Zap" size={14} className="text-blue-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Quick Orders</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-blue-700">
                {favorites.filter(f => f.quickOrder).length}
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <ApperIcon name="Star" size={14} className="text-purple-600 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">Top Rated</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-purple-700">
                {favorites.filter(f => f.rating >= 4.5).length}
              </span>
            </div>
          </motion.div>

          {/* Favorites Grid */}
<div className="grid grid-cols-1 gap-3 sm:gap-4">
            {favorites.map((item, index) => (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 relative">
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                          <ApperIcon 
                            name={item.type === 'restaurant' ? 'Store' : 'UtensilsCrossed'} 
                            size={20} 
                            className="text-gray-400 sm:w-6 sm:h-6" 
                          />
                        </div>
                      )}
                      
                      {/* Type Badge */}
                      <div className="absolute -top-1 -right-1">
                        <Badge 
                          variant={item.type === 'restaurant' ? 'accent' : 'primary'} 
                          size="xs"
                          className="text-xs"
                        >
                          <ApperIcon 
                            name={item.type === 'restaurant' ? 'Store' : 'UtensilsCrossed'} 
                            size={8} 
                          />
                        </Badge>
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <h3 className="font-display font-semibold text-secondary-700 text-base sm:text-lg line-clamp-1 flex-1 pr-2">
                          {item.name}
                        </h3>
                        
                        <button
                          onClick={() => handleRemoveFavorite(item)}
                          disabled={removingId === item.Id}
                          className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center flex-shrink-0"
                        >
                          <ApperIcon 
                            name={removingId === item.Id ? "Loader2" : "HeartOff"} 
                            size={14} 
                            className={removingId === item.Id ? "animate-spin" : ""}
                          />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.description || item.cuisine?.join(", ") || "Delicious food awaits"}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        {item.dietary && getDietaryBadge(item.dietary)}
                        {item.rating && (
                          <Badge variant="secondary" size="xs" className="text-xs">
                            <ApperIcon name="Star" size={8} className="text-accent-500" />
                            {item.rating}
                          </Badge>
                        )}
                        {item.deliveryTime && (
                          <Badge variant="info" size="xs" className="text-xs">
                            <ApperIcon name="Clock" size={8} />
                            {item.deliveryTime} min
                          </Badge>
                        )}
                        {item.quickOrder && (
                          <Badge variant="accent" size="xs" className="text-xs">
                            <ApperIcon name="Zap" size={8} />
                            Quick Order
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                          {item.price && (
                            <span className="font-bold text-primary-600 text-sm sm:text-base">₹{item.price}</span>
                          )}
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleReorder(item)}
                          leftIcon="RotateCcw"
                          className="flex-shrink-0 text-xs sm:text-sm min-h-[36px] self-start sm:self-auto"
                        >
                          {item.type === 'restaurant' ? 'Visit' : 'Reorder'}
                        </Button>
                      </div>

                      {/* Added Date */}
                      <div className="flex items-center gap-1 mt-1 sm:mt-2 text-xs text-gray-500">
                        <ApperIcon name="Calendar" size={10} className="sm:w-3 sm:h-3" />
                        <span>Added {item.dateAdded}</span>
                      </div>
                    </div>
                  </div>
</Card>
              </motion.div>
            ))}
          </div>
</div>
      )}
    </div>
  );
};

export default FavoritesPage;