import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterChips = ({ filters, activeFilters, onFilterChange, className }) => {
  const handleFilterClick = (filterId) => {
    const newActiveFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newActiveFilters);
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
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
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white border-transparent shadow-md transform scale-[1.02]" 
                : "bg-white text-secondary-600 border-gray-200 hover:border-primary-500 hover:text-primary-600 shadow-sm hover:shadow-md"
            )}
          >
            {filter.icon && (
              <ApperIcon 
                name={filter.icon} 
                size={16} 
                className={isActive ? "text-white" : "text-current"}
              />
            )}
            {filter.label}
            {filter.count && (
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold",
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
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