import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CartSummary = ({ 
  items = [], 
  subtotal = 0, 
  deliveryFee = 0, 
  discount = 0, 
  total = 0, 
  onCheckout,
  className 
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`floating-cart ${className}`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <ApperIcon name="ShoppingBag" size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
            <div className="text-white/80 text-sm">
              ₹{total.toFixed(2)}
            </div>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onCheckout}
          className="bg-white text-primary-600 hover:bg-white/90 shadow-lg"
        >
          Checkout
          <ApperIcon name="ArrowRight" size={16} />
        </Button>
      </div>
      
      {/* Detailed breakdown for expanded view */}
      {items.length > 0 && (
        <div className="border-t border-white/20 px-4 py-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-white/90">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-white/90">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-green-300">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CartSummary;