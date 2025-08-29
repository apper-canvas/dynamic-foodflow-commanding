import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const BottomNavigation = ({ cartItemCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: "/",
      icon: "Home",
      label: "Home"
    },
    {
      path: "/search",
      icon: "Search",
      label: "Search"
    },
    {
      path: "/recommendations",
      icon: "Brain",
      label: "AI Picks"
    },
    {
      path: "/orders",
      icon: "ShoppingBag",
      label: "Orders",
      badge: cartItemCount > 0 ? cartItemCount : null
    },
    {
      path: "/account",
      icon: "User",
      label: "Account"
    }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === "/" && location.pathname === "/");
          
          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                isActive
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="relative">
                <ApperIcon 
                  name={item.icon} 
                  size={24} 
                  className={isActive ? "text-primary-600" : "text-current"}
                />
                
                {item.badge && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="primary" size="xs" className="min-w-[18px] h-5 flex items-center justify-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  </div>
                )}
              </div>
              
              <span className={`text-xs font-medium ${
                isActive ? "text-primary-600" : "text-current"
              }`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;