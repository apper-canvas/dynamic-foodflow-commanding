import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const SwipeGestures = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  leftAction = 'Favorite',
  rightAction = 'Add to Cart',
  className 
}) => {
  const [dragX, setDragX] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const dragStartRef = useRef(null);

  const handleDragStart = (event, info) => {
    dragStartRef.current = info.point.x;
    setIsSwipeActive(true);
  };

  const handleDrag = (event, info) => {
    const dragDistance = info.point.x - dragStartRef.current;
    setDragX(dragDistance);
  };

  const handleDragEnd = (event, info) => {
    const dragDistance = info.point.x - dragStartRef.current;
    const swipeThreshold = 80;

    if (Math.abs(dragDistance) > swipeThreshold) {
      if (dragDistance > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (dragDistance < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setDragX(0);
    setIsSwipeActive(false);
    dragStartRef.current = null;
  };

  const getActionColor = () => {
    if (!isSwipeActive) return '';
    
    if (dragX > 80) {
      return 'bg-green-100 border-green-300';
    } else if (dragX < -80) {
      return 'bg-red-100 border-red-300';
    }
    return '';
  };

  const getActionIcon = () => {
    if (!isSwipeActive) return null;
    
    if (dragX > 80) {
      return (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 font-medium text-sm">
          ❤️ {rightAction}
        </div>
      );
    } else if (dragX < -80) {
      return (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 font-medium text-sm">
          ⭐ {leftAction}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.3}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={`relative transition-colors duration-200 ${getActionColor()}`}
        style={{ x: dragX }}
      >
        {children}
      </motion.div>
      
      {/* Action Indicators */}
      {getActionIcon()}
      
      {/* Swipe Hint */}
      {!isSwipeActive && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-30">
          <div className="flex items-center text-xs text-gray-500">
            <span>← Swipe →</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeGestures;