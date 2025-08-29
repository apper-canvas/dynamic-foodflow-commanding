import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const BottomNavigation = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "Home",
      path: "/",
      badge: null
    },
    {
      id: "search",
      label: "Search",
      icon: "Search",
      path: "/search",
      badge: null
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: "Calendar",
      path: "/subscriptions",
      badge: null
    },
    {
      id: "orders",
      label: "Orders",
      icon: "Package",
      path: "/orders",
      badge: null
    },
    {
      id: "account",
      label: "Account",
      icon: "User",
      path: "/account",
      badge: cartItemCount > 0 ? cartItemCount : null
    }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-50"
    >
      <div className="flex items-center justify-around px-4 py-2 safe-area-padding-bottom">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 relative ${
                active 
                  ? "text-primary-600 bg-primary-50" 
                  : "text-gray-500 hover:text-secondary-600"
              }`}
            >
              <div className="relative">
                <ApperIcon 
                  name={item.icon} 
                  size={22} 
                  className={active ? "text-primary-600" : "text-gray-500"}
                />
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge variant="primary" size="xs" className="min-w-[16px] h-4 flex items-center justify-center text-xs">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${
                active ? "text-primary-600" : "text-gray-500"
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;