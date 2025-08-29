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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        hover={true}
        onClick={() => onClick?.(restaurant)}
        className="overflow-hidden cursor-pointer p-0"
      >
        <div className="relative">
          {/* Restaurant Image */}
          <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            {restaurant.image ? (
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ApperIcon name="Store" size={32} className="text-gray-400" />
              </div>
            )}
            
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
{/* Badges */}
            <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
              {isSpecialOffer && (
                <Badge variant="accent" size="xs" className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold animate-pulse">
                  <ApperIcon name="Zap" size={10} />
                  SPECIAL
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="primary" size="xs" className={isSpecialOffer ? "bg-primary-600" : "bg-primary-500"}>
                  <ApperIcon name="Percent" size={10} />
                  {restaurant.discount}% OFF
                </Badge>
              )}
              {isPromoted && !isSpecialOffer && (
                <Badge variant="accent" size="xs">
                  <ApperIcon name="Star" size={10} />
                  Promoted
                </Badge>
              )}
            </div>
            
            {/* Delivery time */}
            <div className="absolute top-2 right-2">
              <Badge variant="default" size="xs" className="bg-white/90 text-secondary-700">
                {restaurant.deliveryTime} min
              </Badge>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-display font-semibold text-secondary-700 text-lg leading-tight mb-1">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine}
              </p>
            </div>
            
            {/* Rating and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="bg-gradient-to-r from-accent-500 to-success p-1 rounded">
                    <ApperIcon name="Star" size={12} className="text-white fill-current" />
                  </div>
                  <span className="text-sm font-medium text-secondary-600">
                    {restaurant.rating}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ApperIcon name="IndianRupee" size={12} />
                  {restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee}`}
                </div>
              </div>
              
              {restaurant.minOrder && (
                <div className="text-xs text-gray-500">
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