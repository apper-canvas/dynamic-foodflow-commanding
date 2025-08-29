import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const OrderTracker = ({ order, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const orderSteps = [
    {
      id: "confirmed",
      label: "Order Confirmed",
      description: "Restaurant is preparing your order",
      icon: "CheckCircle",
      time: "2 min ago"
    },
    {
      id: "preparing",
      label: "Preparing",
      description: "Your food is being cooked with love",
      icon: "ChefHat",
      time: "15 min"
    },
    {
      id: "ready",
      label: "Ready for Pickup",
      description: "Order is ready, delivery partner assigned",
      icon: "Package",
      time: "5 min"
    },
    {
      id: "picked_up",
      label: "On the Way",
      description: "Delivery partner has picked up your order",
      icon: "Truck",
      time: "10 min"
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Enjoy your meal!",
      icon: "Home",
      time: ""
    }
  ];

  useEffect(() => {
    if (order?.status) {
      const stepIndex = orderSteps.findIndex(step => step.id === order.status);
      setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <Card className={className}>
        <div className="text-center py-8 text-gray-500">
          No active order to track
        </div>
      </Card>
    );
  }

  const getEstimatedTime = () => {
    const remainingSteps = orderSteps.slice(currentStep + 1);
    const totalMinutes = remainingSteps.reduce((sum, step) => {
      const time = parseInt(step.time);
      return sum + (isNaN(time) ? 0 : time);
    }, 0);
    return totalMinutes;
  };

  return (
    <div className={className}>
      {/* Order Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-secondary-700">
              Order #{order.Id}
            </h3>
            <p className="text-gray-600">{order.restaurantName}</p>
          </div>
          <div className="text-right">
            <Badge 
              variant={currentStep === orderSteps.length - 1 ? "success" : "primary"}
              size="md"
            >
              {orderSteps[currentStep]?.label}
            </Badge>
            {currentStep < orderSteps.length - 1 && (
              <p className="text-sm text-gray-500 mt-1">
                {getEstimatedTime()} min remaining
              </p>
            )}
          </div>
        </div>

        {/* Live Map Placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-48 flex items-center justify-center mb-4">
          <div className="text-center">
            <ApperIcon name="MapPin" size={48} className="text-primary-500 mx-auto mb-2" />
            <p className="text-gray-600">Live tracking map</p>
            <p className="text-sm text-gray-500">Your order is on the way!</p>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-full">
            <ApperIcon name="User" size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-secondary-700">Delivery Partner</p>
            <p className="text-sm text-gray-600">Rajesh Kumar • +91 98765 43210</p>
          </div>
        </div>
      </Card>

      {/* Progress Steps */}
      <Card>
        <h4 className="font-display font-semibold text-secondary-700 mb-6">Order Progress</h4>
        
        <div className="space-y-6">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Step Icon */}
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isCompleted ? "#00B894" : "#E5E7EB"
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-success text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <ApperIcon name={step.icon} size={20} />
                  </motion.div>
                  
                  {index < orderSteps.length - 1 && (
                    <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-6 ${
                      isCompleted ? "bg-success" : "bg-gray-200"
                    }`} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className={`font-semibold ${
                      isCompleted ? "text-secondary-700" : "text-gray-500"
                    }`}>
                      {step.label}
                    </h5>
                    {step.time && (
                      <span className={`text-sm ${
                        isCurrent ? "text-primary-600" : "text-gray-500"
                      }`}>
                        {step.time}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isCompleted ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {step.description}
                  </p>
                  
                  {isCurrent && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <div className="flex items-center gap-2 text-primary-600 text-sm">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                        In Progress
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default OrderTracker;