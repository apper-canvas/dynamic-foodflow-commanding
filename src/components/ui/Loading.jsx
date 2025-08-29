import { motion } from "framer-motion";

const Loading = ({ type = "restaurants" }) => {
  const getSkeletonItems = () => {
    if (type === "restaurants") {
      return Array(6).fill(null).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-32 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded w-3/4"></div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-1/2"></div>
              <div className="flex justify-between items-center mt-3">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-1/4"></div>
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ));
    }

    if (type === "menu") {
      return Array(8).fill(null).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-lg p-4 shadow-sm flex gap-4"
        >
          <div className="animate-pulse flex-1">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-full mb-2"></div>
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded w-1/3"></div>
          </div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 w-20 h-20 rounded-lg"></div>
        </motion.div>
      ));
    }

    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {getSkeletonItems()}
    </div>
  );
};

export default Loading;