import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterChips = ({ filters, activeFilters, onFilterChange, className, showDietaryFilters = false }) => {
  const handleFilterClick = (filterId) => {
    const newActiveFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newActiveFilters);
  };

  return (
<div className={cn("flex flex-wrap gap-3", className)}>
      {showDietaryFilters && (
        <>
          {[
            { id: 'veg', label: 'Vegetarian', icon: 'Leaf', color: 'green' },
            { id: 'non-veg', label: 'Non-Vegetarian', icon: 'Drumstick', color: 'red' },
            { id: 'jain', label: 'Jain', icon: 'Heart', color: 'orange' },
            { id: 'allergen-free', label: 'Allergen-Free', icon: 'Shield', color: 'blue' }
          ].map((dietaryFilter, index) => {
            const isActive = activeFilters.includes(dietaryFilter.id);
            return (
              <motion.button
                key={dietaryFilter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterClick(dietaryFilter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 border-2",
                  isActive 
                    ? `bg-${dietaryFilter.color}-500 text-white border-transparent shadow-md transform scale-[1.02]`
                    : `bg-white text-${dietaryFilter.color}-600 border-${dietaryFilter.color}-200 hover:border-${dietaryFilter.color}-500 shadow-sm hover:shadow-md`
                )}
              >
                <ApperIcon 
                  name={dietaryFilter.icon} 
                  size={16} 
                  className={isActive ? "text-white" : "text-current"}
                />
                {dietaryFilter.label}
              </motion.button>
            );
          })}
          <div className="w-full border-t border-gray-200 my-2"></div>
        </>
      )}
      
      {filters.map((filter, index) => {
        const isActive = activeFilters.includes(filter.id);
        
        return (
          <motion.button
            key={filter.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterClick(filter.id)}
className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 border-2",
              isActive 
? filter.id === "offers" || filter.id === "flash_deals" 
                  ? "bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 text-white border-transparent shadow-lg transform scale-[1.02] animate-pulse" 
                  : "bg-gradient-to-r from-primary-500 to-accent-500 text-white border-transparent shadow-md transform scale-[1.02]"
                : "bg-white text-secondary-600 border-gray-200 hover:border-primary-500 hover:text-primary-600 shadow-sm hover:shadow-md"
            )}
          >
            {filter.icon && (
              <ApperIcon 
                name={filter.icon} 
                size={16} 
className={cn(
                  isActive ? "text-white" : "text-current",
                  (filter.id === "offers" || filter.id === "flash_deals") && isActive ? "animate-bounce" : ""
                )}
              />
            )}
            {filter.label}
            {filter.count && (
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold",
                isActive 
                  ? filter.id === "specialOffers" || filter.id === "flashSales"
                    ? "bg-white/30 text-white shadow-sm"
                    : "bg-white/20 text-white" 
                  : "bg-gray-100 text-gray-600"
              )}>
                {filter.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterChips;