import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "general" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Problem",
          subtitle: "Check your internet connection and try again"
        };
      case "restaurants":
        return {
          icon: "Store",
          title: "No Restaurants Found",
          subtitle: "We couldn't find any restaurants in your area"
        };
      case "menu":
        return {
          icon: "MenuSquare",
          title: "Menu Unavailable",
          subtitle: "This restaurant's menu is currently unavailable"
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Oops! Something went wrong",
          subtitle: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-full p-6 mb-6">
        <ApperIcon name={errorContent.icon} size={48} className="text-error" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-secondary-600 mb-2">
        {errorContent.title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        {errorContent.subtitle}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={18} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;