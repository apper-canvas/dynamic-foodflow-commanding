import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LocationSelector = ({ 
  currentAddress, 
  savedAddresses = [], 
  onLocationSelect, 
  onCurrentLocationClick,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleCurrentLocation = async () => {
    setDetectingLocation(true);
    try {
      await onCurrentLocationClick?.();
    } finally {
      setDetectingLocation(false);
      setIsOpen(false);
    }
  };

  const handleAddressSelect = (address) => {
    onLocationSelect?.(address);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
      >
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-lg">
          <ApperIcon name="MapPin" size={20} className="text-white" />
        </div>
        
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-secondary-600">Deliver to</div>
          <div className="text-xs text-gray-500 truncate">
            {currentAddress || "Select delivery location"}
          </div>
        </div>
        
        <ApperIcon 
          name="ChevronDown" 
          size={20} 
          className={cn(
            "text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon="Crosshair"
                  onClick={handleCurrentLocation}
                  loading={detectingLocation}
                  className="w-full justify-start text-primary-600 hover:bg-primary-50"
                >
                  {detectingLocation ? "Detecting..." : "Use current location"}
                </Button>
              </div>
              
              {savedAddresses.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Saved Addresses
                  </div>
                  {savedAddresses.map((address, index) => (
                    <motion.button
                      key={address.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <ApperIcon name={address.label === "Home" ? "Home" : address.label === "Work" ? "Briefcase" : "MapPin"} size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-secondary-600">{address.label}</div>
                        <div className="text-xs text-gray-500 truncate">{address.street}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;