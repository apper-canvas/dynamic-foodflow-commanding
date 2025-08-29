import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ChatMessage = ({ message, currentOrder }) => {
  const isUser = message.sender === "user";
  const isSystem = message.sender === "system";
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusIcon = () => {
    if (!isUser) return null;
    
    switch (message.status) {
      case "sending":
        return <ApperIcon name="Clock" size={12} className="text-gray-400" />;
      case "sent":
        return <ApperIcon name="Check" size={12} className="text-blue-500" />;
      case "delivered":
        return <ApperIcon name="CheckCheck" size={12} className="text-blue-500" />;
      case "failed":
        return <ApperIcon name="AlertCircle" size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    // Handle system messages with order actions
    if (message.type === "order_update") {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
            <span className="font-medium text-green-800 text-sm">Order Update</span>
          </div>
          <p className="text-sm text-green-700">{message.text}</p>
          {message.orderDetails && (
            <div className="mt-2 text-xs text-green-600">
              <p>Order #{message.orderDetails.id} • {message.orderDetails.status}</p>
            </div>
          )}
        </div>
      );
    }

    // Handle quick actions
    if (message.type === "quick_actions") {
      return (
        <div className="space-y-2">
          <p className="text-sm">{message.text}</p>
          <div className="flex flex-wrap gap-2">
            {message.actions?.map((action, index) => (
              <button
key={index}
                onClick={() => {
                  // Handle quick action clicks
                  if (typeof window !== 'undefined' && window.CustomEvent) {
                    const event = new window.CustomEvent('chatQuickAction', { 
                      detail: { action: action.type, orderId: currentOrder?.Id } 
                    });
                    window.dispatchEvent(event);
                  }
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Regular text message
    return <p className="text-sm">{message.text}</p>;
  };

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-primary-500 text-white" 
          : "bg-gray-200 text-gray-600"
      )}>
        <ApperIcon name={isUser ? "User" : "Headphones"} size={12} />
      </div>

      {/* Message Bubble */}
      <div className={cn(
        "rounded-lg px-3 py-2",
        isUser
          ? "bg-primary-500 text-white rounded-tr-none"
          : "bg-gray-100 text-gray-800 rounded-tl-none"
      )}>
        {renderMessageContent()}
        
        {/* Timestamp and Status */}
        <div className={cn(
          "flex items-center gap-1 mt-1",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span className={cn(
            "text-xs",
            isUser ? "text-white/70" : "text-gray-500"
          )}>
            {formatTime(message.timestamp)}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;