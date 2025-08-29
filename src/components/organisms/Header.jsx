import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import LocationSelector from "@/components/molecules/LocationSelector";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
const Header = ({ 
  currentAddress, 
  savedAddresses, 
  onLocationSelect, 
  onCurrentLocationClick,
  cartItemCount = 0,
  onSearch,
  onChatToggle
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isHomePage = location.pathname === "/";
  const isSearchPage = location.pathname.includes("/search");
  
  // Common search suggestions
  const searchSuggestions = [
    "Pizza", "Burger", "Biryani", "Chinese", "Italian", 
    "North Indian", "South Indian", "Desserts", "Healthy Food"
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
    >
<div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-4">
{/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
              <ApperIcon name="UtensilsCrossed" size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                FoodFlow
              </h1>
            </div>
          </motion.div>

{/* Location Selector - Show on all pages */}
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2 sm:mx-0">
            <LocationSelector
              currentAddress={currentAddress}
              savedAddresses={savedAddresses}
              onLocationSelect={onLocationSelect}
              onCurrentLocationClick={onCurrentLocationClick}
            />
          </div>

          {/* Search Bar - Show on home and search pages */}
{(isHomePage || isSearchPage) && (
            <div className="hidden lg:block flex-1 max-w-md ml-4">
              <SearchBar
                placeholder="Search restaurants, dishes..."
                suggestions={searchSuggestions}
                onSearch={onSearch}
              />
            </div>
          )}

{/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="lg:hidden p-2"
            >
              <ApperIcon name="Search" size={18} />
            </Button>

            {/* Cart Button */}
            <motion.div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/cart")}
                className="relative"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="primary" size="xs" className="min-w-[20px] h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
{/* Support Chat Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Trigger chat widget toggle through global event
              if (typeof window !== 'undefined' && window.CustomEvent) {
                const event = new window.CustomEvent('toggleChat');
                window.dispatchEvent(event);
              }
            }}
            className="relative p-2 hover:bg-primary-50"
          >
            <ApperIcon name="MessageCircle" size={20} className="text-secondary-600" />
          </Button>
            {/* Profile Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <ApperIcon name="User" size={20} />
              </Button>

              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <ApperIcon name="Package" size={16} />
                    Your Orders
</button>
                  <button
                    onClick={() => {
                      navigate("/subscriptions");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <ApperIcon name="Calendar" size={16} />
                    Subscriptions
                  </button>
                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <ApperIcon name="Heart" size={16} />
                    Favorites
                  </button>
                  <button
                    onClick={() => {
                      navigate("/account");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <ApperIcon name="Settings" size={16} />
                    Account Settings
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
{(isHomePage || isSearchPage) && (
          <div className="lg:hidden mt-3 px-3 sm:px-4">
            <SearchBar
              placeholder="Search restaurants, dishes..."
              suggestions={searchSuggestions}
              onSearch={onSearch}
            />
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;