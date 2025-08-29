import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ShareButton = ({ item, type = 'dish', className }) => {
  const [isSharing, setIsSharing] = useState(false);

  const getShareData = () => {
    if (type === 'dish') {
      return {
        title: `Check out ${item.name}!`,
        text: `I found this amazing ${item.name} ${item.description ? `- ${item.description}` : ''} on FoodFlow!`,
        url: window.location.href
      };
    } else if (type === 'restaurant') {
      return {
        title: `${item.name} - Great Food Awaits!`,
        text: `Check out ${item.name} on FoodFlow! ${item.cuisine || ''} ${item.rating ? `⭐ ${item.rating}` : ''}`,
        url: window.location.href
      };
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const shareData = getShareData();
      
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Try clipboard as fallback
        try {
          const shareData = getShareData();
          await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
          toast.success('Link copied to clipboard!');
        } catch (clipboardError) {
          toast.error('Sharing failed. Please try again.');
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      disabled={isSharing}
      className={`flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ApperIcon
        name={isSharing ? "Loader2" : "Share"}
        size={16}
        className={`text-gray-600 ${isSharing ? 'animate-spin' : ''}`}
      />
      <span className="text-sm font-medium text-gray-700">
        {isSharing ? 'Sharing...' : 'Share'}
      </span>
    </motion.button>
  );
};

export default ShareButton;