import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OrderTracker from "@/components/organisms/OrderTracker";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";

const TrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await orderService.getById(parseInt(orderId));
      setOrder(data);
    } catch (err) {
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadOrder}
        type="general"
      />
    );
  }

  if (!order) {
    return (
      <Error 
        message="Order not found" 
        onRetry={() => navigate("/orders")}
        type="general"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon="ArrowLeft"
        >
          Back
        </Button>
        <h1 className="text-2xl font-display font-bold text-secondary-700">
          Track Order
        </h1>
      </motion.div>

      {/* Order Tracking */}
      <OrderTracker order={order} />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/support")}
          leftIcon="MessageCircle"
        >
          Contact Support
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
          leftIcon="RotateCcw"
        >
          Order Again
        </Button>
      </motion.div>
    </div>
  );
};

export default TrackingPage;