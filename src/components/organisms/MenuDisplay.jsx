import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import DishCard from "@/components/molecules/DishCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";

const MenuDisplay = ({ 
  menu = [], 
  loading, 
  error, 
  onAddToCart, 
  onRetry,
  className = "",
  dietaryFilters = []
}) => {
  const [activeCategory, setActiveCategory] = useState("all");

  if (loading) {
    return <Loading type="menu" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        type="menu"
      />
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <Empty 
        type="search"
        onAction={onRetry}
        actionText="Refresh Menu"
      />
    );
  }

  // Group menu items by category
  const categorizedMenu = menu.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categories = ["all", ...Object.keys(categorizedMenu)];
  
// Apply dietary filters
  const dietaryFilteredMenu = menu.filter(item => {
    if (dietaryFilters.length === 0) return true;
    
    return dietaryFilters.some(filter => {
      switch (filter) {
        case 'veg':
          return item.dietary?.includes('veg');
        case 'non-veg':
          return item.dietary?.includes('non-veg');
        case 'jain':
          return item.dietary?.includes('jain');
        case 'allergen-free':
          return !item.allergens || item.allergens.length === 0;
        default:
          return true;
      }
    });
  });

const filteredItems = activeCategory === "all" 
    ? dietaryFilteredMenu 
    : dietaryFilteredMenu.filter(item => item.category === activeCategory);

  // Sort to prioritize recommended items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aRecommended = (a.affinityScore && a.affinityScore > 70) || a.reason;
    const bRecommended = (b.affinityScore && b.affinityScore > 70) || b.reason;
    
    if (aRecommended && !bRecommended) return -1;
    if (!aRecommended && bRecommended) return 1;
    if (a.affinityScore && b.affinityScore) return b.affinityScore - a.affinityScore;
    return 0;
  });

  return (
<div className={className}>
      {/* Dietary Filters */}
      {dietaryFilters.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-700 mb-2">Active Dietary Filters:</p>
          <div className="flex flex-wrap gap-2">
            {dietaryFilters.map(filter => (
              <Badge key={filter} variant="info" size="sm">
                {filter === 'veg' ? 'Vegetarian' : 
                 filter === 'non-veg' ? 'Non-Vegetarian' : 
                 filter === 'jain' ? 'Jain' : 
                 'Allergen-Free'}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Category Navigation */}
      {categories.length > 2 && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm py-4 mb-6 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                    : "bg-gray-100 text-secondary-600 hover:bg-gray-200"
                }`}
              >
                <ApperIcon 
                  name={category === "all" ? "Grid3x3" : "UtensilsCrossed"} 
                  size={16} 
                />
                {category === "all" ? "All Items" : category}
<span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {category === "all" ? dietaryFilteredMenu.length : dietaryFilteredMenu.filter(item => item.category === category).length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <Empty 
          type="search"
          onAction={() => setActiveCategory("all")}
          actionText="Show All Items"
        />
      ) : (
<div className="space-y-4">
          {sortedItems.map((dish, index) => (
            <motion.div
              key={dish.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DishCard
                dish={dish}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;