import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const DishCard = ({ dish, onAddToCart, className }) => {
  const [quantity, setQuantity] = useState(0);
  const [showCustomization, setShowCustomization] = useState(false);

  const getDietaryBadge = () => {
    if (dish.dietary?.includes("veg")) {
      return <Badge variant="veg" size="xs"><ApperIcon name="Leaf" size={10} />Veg</Badge>;
    }
    if (dish.dietary?.includes("non-veg")) {
      return <Badge variant="nonveg" size="xs"><ApperIcon name="Drumstick" size={10} />Non-Veg</Badge>;
    }
    return null;
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
      onAddToCart?.({ ...dish, quantity: 1 });
      toast.success(`${dish.name} added to cart!`);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(0, newQuantity));
    if (newQuantity === 0) {
      onAddToCart?.({ ...dish, quantity: 0 });
      toast.info(`${dish.name} removed from cart`);
    } else {
      onAddToCart?.({ ...dish, quantity: newQuantity });
    }
  };

  const isSpicy = dish.spiceLevel && dish.spiceLevel > 2;
  const isPopular = dish.isPopular || false;
  const hasBestSeller = dish.isBestSeller || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-0 overflow-hidden dish-card-hover">
        <div className="flex gap-4 p-4">
          {/* Dish Info */}
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getDietaryBadge()}
                  {hasBestSeller && (
                    <Badge variant="accent" size="xs">
                      <ApperIcon name="TrendingUp" size={10} />
                      Bestseller
                    </Badge>
                  )}
                  {isPopular && (
                    <Badge variant="warning" size="xs">
                      <ApperIcon name="Flame" size={10} />
                      Popular
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-display font-semibold text-secondary-700 text-lg leading-tight mb-1">
                  {dish.name}
                </h4>
                
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-secondary-700">
                    ₹{dish.price}
                  </span>
                  {dish.originalPrice && dish.originalPrice > dish.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{dish.originalPrice}
                    </span>
                  )}
                  {isSpicy && (
                    <div className="flex text-red-500">
                      {Array(dish.spiceLevel).fill(0).map((_, i) => (
                        <ApperIcon key={i} name="Flame" size={12} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {dish.description}
            </p>
            
            {dish.addOns && dish.addOns.length > 0 && (
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium mb-3 flex items-center gap-1"
              >
                <ApperIcon name="Plus" size={12} />
                Customizable
              </button>
            )}
            
            {/* Quantity Controls */}
            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="w-full"
              >
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center justify-center bg-primary-50 rounded-lg p-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  <ApperIcon name="Minus" size={14} className="text-primary-600" />
                </button>
                
                <span className="mx-4 font-semibold text-primary-700 min-w-[2rem] text-center">
                  {quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  <ApperIcon name="Plus" size={14} className="text-primary-600" />
                </button>
              </div>
            )}
          </div>
          
          {/* Dish Image */}
          <div className="w-24 h-24 relative">
            {dish.image ? (
              <img 
                src={dish.image} 
                alt={dish.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <ApperIcon name="UtensilsCrossed" size={20} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Customization Options */}
        {showCustomization && dish.addOns && dish.addOns.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 p-4 bg-gray-50"
          >
            <h5 className="font-medium text-secondary-700 mb-3">Add-ons</h5>
            <div className="space-y-2">
              {dish.addOns.map((addon, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="flex-1 text-sm text-secondary-600">{addon.name}</span>
                  <span className="text-sm font-medium text-secondary-700">+₹{addon.price}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default DishCard;