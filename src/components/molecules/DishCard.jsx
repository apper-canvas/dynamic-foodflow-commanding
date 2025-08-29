import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import RatingSystem from "@/components/molecules/RatingSystem";
import ShareButton from "@/components/molecules/ShareButton";
import SwipeGestures from "@/components/molecules/SwipeGestures";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const DishCard = ({ dish, onAddToCart, className }) => {
const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAllergenInfo, setShowAllergenInfo] = useState(false);
  const [showRating, setShowRating] = useState(false);
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

const showRecommendationBadge = dish.affinityScore && dish.affinityScore > 80;
  const isRecommended = dish.reason || dish.affinityScore;
  const hasOffer = dish.discount && dish.discount > 0;

return (
    <SwipeGestures
      onSwipeLeft={async () => {
        try {
          const { favoritesService } = await import("@/services/api/favoritesService");
          const result = await favoritesService.toggleFavorite({...dish, type: 'dish'});
          setIsFavorite(result.action === 'added');
          toast.success(result.action === 'added' ? 'Added to favorites' : 'Removed from favorites');
        } catch (err) {
          toast.error("Failed to update favorites");
        }
      }}
      onSwipeRight={() => handleAddToCart()}
      leftAction="Favorite"
      rightAction="Add to Cart"
      className="swipe-container"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className={`p-0 overflow-hidden dish-card-hover relative ${
          isRecommended ? 'ring-2 ring-blue-300 ring-opacity-60 shadow-lg' : ''
        } ${hasOffer ? 'ring-2 ring-primary-300 ring-opacity-80 shadow-lg' : ''}`}>
          <div className="absolute top-2 left-2 z-10 flex gap-1">
            {hasOffer && (
              <Badge variant="primary" size="xs" className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white font-bold shadow-md animate-pulse">
                <ApperIcon name="Percent" size={10} />
                {dish.discount}% OFF
              </Badge>
            )}
            {showRecommendationBadge && !hasOffer && (
              <Badge variant="info" size="xs" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                <ApperIcon name="Brain" size={10} />
                {dish.affinityScore}% match
              </Badge>
            )}
          </div>
          
          <div className="flex gap-4 p-4">
            {/* Dish Info */}
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                <div className="flex-1">
{/* Header Section - Name and Key Badges */}
                  <div className="mb-3">
                    <h4 className="font-display font-bold text-secondary-700 text-xl leading-tight mb-2">
                      {dish.name}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2">
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
                          Allergens
                        </Badge>
                      )}
                    </div>
                  </div>
                  
{/* Pricing Section */}
                    {dish.name}
<div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-secondary-700">
                        {hasOffer ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-lg">₹{dish.price}</span>
                            <span className="text-primary-600">₹{Math.round(dish.price * (1 - dish.discount/100))}</span>
                          </div>
                        ) : (
                          <span>₹{dish.price}</span>
                        )}
                      </div>
                      {dish.originalPrice && dish.originalPrice > dish.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{dish.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {isSpicy && (
                      <div className="flex items-center gap-1">
                        <div className="flex text-red-500">
                          {Array(dish.spiceLevel).fill(0).map((_, i) => (
                            <ApperIcon key={i} name="Flame" size={14} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">Spicy</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
{/* Description Section */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {dish.description}
                </p>
              </div>
              
{/* Recommendation Reason */}
              {dish.reason && (
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <ApperIcon name="Brain" size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-700 mb-1">Why we recommend this:</p>
                      <p className="text-xs text-blue-800 leading-relaxed">{dish.reason}</p>
                    </div>
                  </div>
                </div>
              )}
              
{/* Interactive Options */}
              <div className="flex flex-wrap gap-3 mb-4">
                {dish.addOns && dish.addOns.length > 0 && (
                  <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1.5 interactive-button bg-primary-50 px-2 py-1 rounded-full transition-colors"
                  >
                    <ApperIcon name="Plus" size={12} />
                    Customizable
                  </button>
                )}
                
                {(dish.ingredients || dish.allergens) && (
                  <button
                    onClick={() => setShowAllergenInfo(!showAllergenInfo)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 interactive-button bg-blue-50 px-2 py-1 rounded-full transition-colors"
                  >
                    <ApperIcon name="Info" size={12} />
                    Ingredients
                  </button>
                )}
                
                <button
                  onClick={() => setShowRating(!showRating)}
                  className="text-xs text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1.5 interactive-button bg-yellow-50 px-2 py-1 rounded-full transition-colors"
                >
                  <ApperIcon name="Star" size={12} />
                  Rate Dish
                </button>
              </div>

              {/* Interactive Rating System */}
              {showRating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-yellow-50 rounded-lg"
                >
                  <RatingSystem
                    dishId={dish.Id}
                    initialRating={dish.userRating || 0}
                    onRatingSubmit={async (dishId, rating) => {
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 500));
                      dish.userRating = rating;
                    }}
                  />
                </motion.div>
              )}

              {/* Social Sharing */}
{/* Bottom Section - Share and Prep Time */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <ShareButton item={dish} type="dish" className="text-xs" />
                
                {dish.prepTime && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ApperIcon name="Clock" size={12} />
                    <span className="font-medium">{dish.prepTime} min</span>
                    <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      />
                    </div>
                  </div>
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
        
        {/* Favorite Button */}
        <button
          onClick={async () => {
            try {
              const { favoritesService } = await import("@/services/api/favoritesService");
              const result = await favoritesService.toggleFavorite({
                ...dish,
                type: 'dish'
              });
              setIsFavorite(result.action === 'added');
              toast.success(result.action === 'added' ? `${dish.name} added to favorites` : `${dish.name} removed from favorites`);
            } catch (err) {
              toast.error("Failed to update favorites");
            }
          }}
          className="absolute top-2 right-2 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white"
        >
          <ApperIcon 
            name={isFavorite ? "Heart" : "Heart"} 
            size={14} 
            className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"}
          />
        </button>
        
        {isRecommended && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white rounded-full p-1.5 shadow-lg"
          >
            <ApperIcon name="Sparkles" size={12} className="animate-pulse" />
          </motion.div>
        )}
      </motion.div>
    </SwipeGestures>
  );
};

export default DishCard;