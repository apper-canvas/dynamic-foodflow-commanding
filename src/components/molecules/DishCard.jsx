import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const DishCard = ({ dish, onAddToCart, className }) => {
const [quantity, setQuantity] = useState(0);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAllergenInfo, setShowAllergenInfo] = useState(false);

  const getDietaryBadge = () => {
const badges = [];
    
    if (dish.dietary?.includes("veg")) {
      badges.push(<Badge key="veg" variant="veg" size="xs"><ApperIcon name="Leaf" size={10} />Veg</Badge>);
    }
    if (dish.dietary?.includes("non-veg")) {
      badges.push(<Badge key="non-veg" variant="nonveg" size="xs"><ApperIcon name="Drumstick" size={10} />Non-Veg</Badge>);
    }
    if (dish.dietary?.includes("jain")) {
      badges.push(<Badge key="jain" variant="jain" size="xs"><ApperIcon name="Heart" size={10} />Jain</Badge>);
    }
    if (dish.allergens && dish.allergens.length === 0) {
      badges.push(<Badge key="allergen-free" variant="allergen-free" size="xs"><ApperIcon name="Shield" size={10} />Allergen-Free</Badge>);
    }
    
    return badges.length > 0 ? badges : null;
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
<div className="flex flex-wrap items-center gap-2 mb-2">
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
                  {dish.allergens && dish.allergens.length > 0 && (
                    <Badge variant="danger" size="xs">
                      <ApperIcon name="AlertTriangle" size={10} />
                      Contains Allergens
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
            
<div className="flex flex-wrap gap-2 mb-3">
              {dish.addOns && dish.addOns.length > 0 && (
                <button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <ApperIcon name="Plus" size={12} />
                  Customizable
                </button>
              )}
              
              {(dish.ingredients || dish.allergens) && (
                <button
                  onClick={() => setShowAllergenInfo(!showAllergenInfo)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <ApperIcon name="Info" size={12} />
                  View Ingredients
                </button>
              )}
            </div>
            
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

        {showAllergenInfo && (dish.ingredients || dish.allergens) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 p-4 bg-blue-50"
          >
            <h5 className="font-medium text-secondary-700 mb-3 flex items-center gap-2">
              <ApperIcon name="List" size={16} />
              Ingredients & Allergen Information
            </h5>
            
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 mb-2">INGREDIENTS:</p>
                <div className="flex flex-wrap gap-1">
                  {dish.ingredients.map((ingredient, index) => {
                    const isAllergen = dish.allergens?.includes(ingredient.toLowerCase());
                    return (
                      <span
                        key={index}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          isAllergen 
                            ? "bg-red-100 text-red-700 border border-red-200" 
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {ingredient}
                        {isAllergen && <ApperIcon name="AlertTriangle" size={12} className="ml-1 inline" />}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {dish.allergens && dish.allergens.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                  <ApperIcon name="AlertTriangle" size={14} />
                  ALLERGEN WARNING:
                </p>
                <p className="text-sm text-red-700">
                  This dish contains: {dish.allergens.join(', ')}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Please inform staff of any allergies before ordering.
                </p>
              </div>
            )}

            {(!dish.allergens || dish.allergens.length === 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <ApperIcon name="Shield" size={16} />
                  This dish is free from common allergens.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default DishCard;