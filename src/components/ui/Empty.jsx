import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "general", onAction, actionText = "Explore" }) => {
  const getEmptyContent = () => {
    switch (type) {
      case "restaurants":
        return {
          icon: "Store",
          title: "No restaurants found",
          subtitle: "Try adjusting your filters or search in a different area",
          gradient: "from-primary-500/10 to-accent-500/10"
        };
      case "cart":
        return {
          icon: "ShoppingCart",
          title: "Your cart is empty",
          subtitle: "Add some delicious items to get started!",
          gradient: "from-accent-500/10 to-success/10"
        };
      case "orders":
        return {
          icon: "Package",
          title: "No orders yet",
          subtitle: "Order your first meal and start your food journey",
          gradient: "from-info/10 to-primary-500/10"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          subtitle: "Try searching for something else or browse our categories",
          gradient: "from-warning/10 to-primary-500/10"
        };
      case "favorites":
        return {
          icon: "Heart",
          title: "No favorites yet",
          subtitle: "Start adding restaurants and dishes you love",
          gradient: "from-error/10 to-primary-500/10"
        };
      default:
        return {
          icon: "Smile",
          title: "Nothing here yet",
          subtitle: "Check back later for updates",
          gradient: "from-gray-500/10 to-gray-400/10"
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className={`bg-gradient-to-br ${emptyContent.gradient} rounded-full p-8 mb-6`}>
        <ApperIcon name={emptyContent.icon} size={64} className="text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-secondary-600 mb-3">
        {emptyContent.title}
      </h3>
      
      <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
        {emptyContent.subtitle}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;