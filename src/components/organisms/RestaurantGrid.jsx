import { motion } from "framer-motion";
import RestaurantCard from "@/components/molecules/RestaurantCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const RestaurantGrid = ({ 
  restaurants, 
  loading, 
  error, 
  onRestaurantClick, 
  onRetry,
  className = "" 
}) => {
  if (loading) {
    return <Loading type="restaurants" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        type="restaurants"
      />
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <Empty 
        type="restaurants"
        onAction={onRetry}
        actionText="Refresh"
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {restaurants.map((restaurant, index) => (
        <motion.div
          key={restaurant.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <RestaurantCard
            restaurant={restaurant}
            onClick={onRestaurantClick}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default RestaurantGrid;