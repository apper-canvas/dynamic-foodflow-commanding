import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      case "preparing":
      case "confirmed":
        return "warning";
      case "on_way":
      case "picked_up":
        return "info";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Order Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      case "picked_up":
        return "Picked Up";
      case "on_way":
        return "On the Way";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "active") {
      return !["delivered", "cancelled"].includes(order.status);
    }
    return ["delivered", "cancelled"].includes(order.status);
  });

  const handleTrackOrder = (orderId) => {
    navigate(`/track/${orderId}`);
  };

  const handleReorder = (order) => {
    navigate(`/restaurant/${order.restaurantId}`, {
      state: { reorderItems: order.items }
    });
  };

  if (loading) {
    return <Loading type="orders" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadOrders}
        type="orders"
      />
    );
  }

  return (
<div className="space-y-4 sm:space-y-6 pb-24 sm:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0"
      >
        <h1 className="text-2xl font-display font-bold text-secondary-700">
          Your Orders
        </h1>
        <Badge variant="secondary" size="md">
          {filteredOrders.length} orders
        </Badge>
      </motion.div>

      {/* Tabs */}
<div className="flex bg-gray-100 rounded-xl p-1">
        {[
          { id: "active", label: "Active Orders" },
          { id: "past", label: "Order History" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] ${
              activeTab === tab.id
                ? "bg-white text-secondary-700 shadow-sm"
                : "text-gray-600 hover:text-secondary-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Empty
          type="orders"
          onAction={() => navigate("/")}
          actionText="Start Ordering"
        />
      ) : (
<div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200">
<div className="flex items-start gap-3 sm:gap-4">
{/* Restaurant Info */}
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50 w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Store" size={20} className="text-primary-600 sm:w-6 sm:h-6" />
                  </div>

<div className="flex-1 min-w-0">
                    {/* Order Header */}
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-secondary-700 text-base sm:text-lg line-clamp-1">
                          {order.restaurantName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Order #{order.Id} • {order.items?.length || 0} items
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(order.status)} size="sm" className="self-start text-xs">
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>

{/* Order Items */}
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {order.items?.map(item => item.name).join(", ") || "Order items"}
                      </p>
                    </div>

{/* Order Meta */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>{order.orderDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="IndianRupee" size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>₹{order.total}</span>
                      </div>
                      {order.deliveryTime && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Clock" size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span>{order.deliveryTime} min</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
<div className="flex flex-wrap gap-2 sm:gap-3">
                      {activeTab === "active" && (
                        <Button
                          size="sm"
                          onClick={() => handleTrackOrder(order.Id)}
                          leftIcon="MapPin"
                          className="text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
                        >
                          Track Order
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order)}
                        leftIcon="RotateCcw"
                        className="text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
                      >
                        Reorder
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/order/${order.Id}`)}
                        leftIcon="Eye"
                        className="text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;