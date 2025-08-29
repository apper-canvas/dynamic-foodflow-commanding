import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RestaurantCard = ({ restaurant, onClick, className }) => {
  const isPromoted = restaurant.isPromoted || false;
const hasDiscount = restaurant.discount && restaurant.discount > 0;
  const isSpecialOffer = hasDiscount && restaurant.discount >= 20;
return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${className} min-h-[180px] sm:min-h-[200px]`}
    >
      <Card 
        hover={true}
        onClick={() => onClick?.(restaurant)}
        className="overflow-hidden cursor-pointer p-0"
      >
        <div className="relative">
{/* Restaurant Image */}
          <div className="relative h-28 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            {restaurant.image ? (
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ApperIcon name="Store" size={28} className="text-gray-400 sm:w-8 sm:h-8" />
              </div>
            )}
            
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
{/* Badges */}
<div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex gap-1 sm:gap-2 flex-wrap">
              {isSpecialOffer && (
                <Badge variant="accent" size="xs" className="bg-gradient-to-r from-accent-500 via-primary-500 to-accent-600 text-white font-bold animate-pulse shadow-lg text-xs">
                  <ApperIcon name="Zap" size={8} className="animate-bounce" />
                  SPECIAL
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="primary" size="xs" className={`${isSpecialOffer ? "bg-gradient-to-r from-primary-600 to-primary-700 shadow-md" : "bg-gradient-to-r from-primary-500 to-primary-600 shadow-md"} text-xs`}>
                  <ApperIcon name="Percent" size={8} />
                  {restaurant.discount}% OFF
                </Badge>
              )}
              {isPromoted && !isSpecialOffer && (
                <Badge variant="accent" size="xs" className="bg-gradient-to-r from-accent-500 to-accent-600 shadow-md text-xs">
                  <ApperIcon name="Star" size={8} className="text-yellow-200" />
                  Promoted
                </Badge>
              )}
            </div>
            
            {/* Delivery time */}
<div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
              <Badge variant="default" size="xs" className="bg-white/90 text-secondary-700 text-xs">
                {restaurant.deliveryTime} min
              </Badge>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="p-4">
            <div className="mb-2">
<h3 className="font-display font-semibold text-secondary-700 text-base sm:text-lg leading-tight mb-1 line-clamp-1">
                {restaurant.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-1">
                {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine}
              </p>
            </div>
            
            {/* Rating and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
<div className="flex items-center gap-1">
                  <div className="bg-gradient-to-r from-accent-500 to-success p-0.5 sm:p-1 rounded">
                    <ApperIcon name="Star" size={10} className="text-white fill-current sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-secondary-600">
                    {restaurant.rating}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                  <ApperIcon name="IndianRupee" size={10} className="sm:w-3 sm:h-3" />
                  {restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee}`}
                </div>
              </div>
              
              {restaurant.minOrder && (
                <div className="text-xs text-gray-500 mt-1">
                  Min ₹{restaurant.minOrder}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;