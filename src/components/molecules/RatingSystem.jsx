import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RatingSystem = ({ dishId, initialRating = 0, onRatingSubmit, className }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(initialRating > 0);

  const handleStarClick = (starValue) => {
    if (hasRated) return;
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    if (hasRated) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (hasRated) return;
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    if (rating === 0 || hasRated) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onRatingSubmit) {
        await onRatingSubmit(dishId, rating);
      }
      
      setHasRated(true);
      toast.success(`Thank you for rating this dish ${rating} star${rating !== 1 ? 's' : ''}!`);
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Stars */}
      <div 
        className="flex space-x-1" 
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={hasRated}
            className={`p-1 rounded transition-transform ${hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            whileHover={!hasRated ? { scale: 1.2 } : {}}
            whileTap={!hasRated ? { scale: 0.9 } : {}}
          >
            <ApperIcon
              name="Star"
              size={24}
              className={`transition-colors duration-200 ${
                star <= displayRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Rating Text */}
      <div className="text-center">
        {hasRated ? (
          <p className="text-sm text-green-600 font-medium">
            ✨ Thanks for your rating!
          </p>
        ) : rating > 0 ? (
          <p className="text-sm text-gray-600">
            You rated this {rating} star{rating !== 1 ? 's' : ''}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Tap a star to rate this dish
          </p>
        )}
      </div>

      {/* Submit Button */}
      {!hasRated && rating > 0 && (
        <Button
          size="sm"
          onClick={handleSubmitRating}
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      )}
    </div>
  );
};

export default RatingSystem;