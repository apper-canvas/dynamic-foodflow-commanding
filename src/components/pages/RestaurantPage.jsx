import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import MenuDisplay from "@/components/organisms/MenuDisplay";
import CartSummary from "@/components/molecules/CartSummary";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { restaurantService } from "@/services/api/restaurantService";
import { menuService } from "@/services/api/menuService";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [isFavorite, setIsFavorite] = useState(false);
const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [showInteractiveFeatures, setShowInteractiveFeatures] = useState(true);
  const loadRestaurantData = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const [restaurantData, menuData] = await Promise.all([
        restaurantService.getById(parseInt(id)),
        menuService.getByRestaurantId(parseInt(id))
      ]);
      setRestaurant(restaurantData);
      setMenu(menuData);
    } catch (err) {
      setError("Failed to load restaurant data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadRestaurantData();
}
  }, [id]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (restaurant) {
        try {
          const { favoritesService } = await import("@/services/api/favoritesService");
          const favorite = await favoritesService.isFavorite(restaurant.Id, 'restaurant');
          setIsFavorite(favorite);
        } catch (err) {
          console.error("Failed to check favorite status:", err);
        }
      }
    };
    checkFavoriteStatus();
  }, [restaurant]);
  const handleAddToCart = (dish) => {
    if (dish.quantity === 0) {
      setCart(prev => prev.filter(item => item.Id !== dish.Id));
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.Id === dish.Id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...dish };
        return updated;
      }
      return [...prev, { ...dish }];
    });
  };

  const calculateCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant?.deliveryFee || 0;
    const total = subtotal + deliveryFee;
    
    return {
      subtotal,
      deliveryFee,
      discount: 0,
      total
    };
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    navigate("/checkout", { 
      state: { 
        restaurant, 
        cart, 
        totals: calculateCartTotals() 
      } 
    });
  };

const toggleFavorite = async () => {
    if (!restaurant || loadingFavorite) return;
    
    setLoadingFavorite(true);
    try {
      const { favoritesService } = await import("@/services/api/favoritesService");
      const result = await favoritesService.toggleFavorite({
        ...restaurant,
        type: 'restaurant'
      });
      setIsFavorite(result.action === 'added');
      toast.success(result.action === 'added' ? `${restaurant.name} added to favorites` : `${restaurant.name} removed from favorites`);
    } catch (err) {
      toast.error("Failed to update favorites");
    } finally {
      setLoadingFavorite(false);
    }
  };

  if (loading) {
    return <Loading type="menu" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadRestaurantData}
        type="restaurants"
      />
    );
  }

  if (!restaurant) {
    return (
      <Error 
        message="Restaurant not found" 
        onRetry={() => navigate("/")}
        type="restaurants"
      />
    );
  }

  const totals = calculateCartTotals();

  return (
<div className="space-y-4 sm:space-y-6 pb-24 sm:pb-8">
      {/* Restaurant Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 sm:px-0"
      >
<Card className="p-0 overflow-hidden interactive-restaurant-card">
          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300">
{restaurant.image ? (
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ApperIcon name="Store" size={48} className="text-gray-400 sm:w-16 sm:h-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Back Button */}
<Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 text-secondary-700 hover:bg-white min-h-[44px] min-w-[44px]"
            >
              <ApperIcon name="ArrowLeft" size={18} className="sm:w-5 sm:h-5" />
            </Button>

            {/* Favorite Button */}
<Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] ${
                isFavorite 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-white/90 text-secondary-700 hover:bg-white"
              }`}
            >
              <ApperIcon name="Heart" size={18} className={`${isFavorite ? "fill-current" : ""} sm:w-5 sm:h-5`} />
            </Button>
          </div>

<div className="p-4 sm:p-6">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-secondary-700 mb-1 sm:mb-2 line-clamp-2">
                  {restaurant.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                  {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine}
                </p>
              </div>
            </div>

<div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <div className="bg-gradient-to-r from-accent-500 to-success p-0.5 sm:p-1 rounded">
                  <ApperIcon name="Star" size={12} className="text-white fill-current sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600">
                <ApperIcon name="Clock" size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{restaurant.deliveryTime} min</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600 col-span-2 sm:col-span-1">
                <ApperIcon name="IndianRupee" size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee} delivery`}</span>
              </div>

              {restaurant.minOrder && (
                <div className="flex items-center gap-1 text-gray-600 col-span-2 sm:col-span-1">
                  <ApperIcon name="ShoppingBag" size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>Min ₹{restaurant.minOrder}</span>
                </div>
              )}
            </div>

            {/* Offers */}
{restaurant.offers && restaurant.offers.length > 0 && (
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {restaurant.offers.map((offer, index) => (
                  <Badge key={index} variant="primary" size="sm" className="text-xs">
                    <ApperIcon name="Percent" size={10} className="sm:w-3 sm:h-3" />
                    {offer}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Menu */}
      <MenuDisplay
        menu={menu}
        loading={loading}
        error={error}
        onAddToCart={handleAddToCart}
        onRetry={loadRestaurantData}
      />

      {/* Floating Cart */}
      {cart.length > 0 && (
        <CartSummary
          items={cart}
          subtotal={totals.subtotal}
          deliveryFee={totals.deliveryFee}
          discount={totals.discount}
          total={totals.total}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default RestaurantPage;