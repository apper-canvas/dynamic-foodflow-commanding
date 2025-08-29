import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { subscriptionService } from "@/services/api/subscriptionService";
import { restaurantService } from "@/services/api/restaurantService";
import { format, addDays, startOfWeek, isSameDay, isAfter, isBefore } from "date-fns";

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const [formData, setFormData] = useState({
    restaurantId: "",
    mealType: "lunch",
    frequency: "weekly",
    days: [],
    startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    mealPreferences: "",
    specialInstructions: ""
  });

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = [
    { value: "breakfast", label: "Breakfast", icon: "Coffee" },
    { value: "lunch", label: "Lunch", icon: "UtensilsCrossed" },
    { value: "dinner", label: "Dinner", icon: "Moon" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subscriptionsData, restaurantsData] = await Promise.all([
        subscriptionService.getAll(),
        restaurantService.getSubscriptionMeals()
      ]);
      setSubscriptions(subscriptionsData);
      setRestaurants(restaurantsData);
    } catch (err) {
      console.error("Failed to load subscription data:", err);
      setError("Failed to load subscription data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = (startDate) => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  };

  const handleCreateSubscription = async () => {
    try {
      if (!formData.restaurantId || formData.days.length === 0) {
        toast.error("Please select restaurant and delivery days");
        return;
      }

      const restaurant = restaurants.find(r => r.Id === parseInt(formData.restaurantId));
      const newSubscription = await subscriptionService.create({
        ...formData,
        restaurantId: parseInt(formData.restaurantId),
        restaurantName: restaurant.name,
        status: "active"
      });

      setSubscriptions(prev => [newSubscription, ...prev]);
      setShowCreateForm(false);
      setFormData({
        restaurantId: "",
        mealType: "lunch",
        frequency: "weekly",
        days: [],
        startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        mealPreferences: "",
        specialInstructions: ""
      });
      toast.success("Subscription created successfully!");
    } catch (err) {
      console.error("Failed to create subscription:", err);
      toast.error("Failed to create subscription. Please try again.");
    }
  };

  const handleSkipDay = async (subscriptionId, date) => {
    try {
      const updatedSubscription = await subscriptionService.skipDay(subscriptionId, date);
      setSubscriptions(prev =>
        prev.map(sub => sub.Id === subscriptionId ? updatedSubscription : sub)
      );
      toast.success("Day skipped successfully");
    } catch (err) {
      console.error("Failed to skip day:", err);
      toast.error("Failed to skip day. Please try again.");
    }
  };

  const handleUnskipDay = async (subscriptionId, date) => {
    try {
      const updatedSubscription = await subscriptionService.unskipDay(subscriptionId, date);
      setSubscriptions(prev =>
        prev.map(sub => sub.Id === subscriptionId ? updatedSubscription : sub)
      );
      toast.success("Day restored successfully");
    } catch (err) {
      console.error("Failed to restore day:", err);
      toast.error("Failed to restore day. Please try again.");
    }
  };

  const handlePauseSubscription = async (subscriptionId) => {
    try {
      const updatedSubscription = await subscriptionService.update(subscriptionId, { 
        status: "paused" 
      });
      setSubscriptions(prev =>
        prev.map(sub => sub.Id === subscriptionId ? updatedSubscription : sub)
      );
      toast.success("Subscription paused");
    } catch (err) {
      console.error("Failed to pause subscription:", err);
      toast.error("Failed to pause subscription. Please try again.");
    }
  };

  const handleResumeSubscription = async (subscriptionId) => {
    try {
      const updatedSubscription = await subscriptionService.update(subscriptionId, { 
        status: "active" 
      });
      setSubscriptions(prev =>
        prev.map(sub => sub.Id === subscriptionId ? updatedSubscription : sub)
      );
      toast.success("Subscription resumed");
    } catch (err) {
      console.error("Failed to resume subscription:", err);
      toast.error("Failed to resume subscription. Please try again.");
    }
  };

  const isDateSkipped = (subscription, date) => {
    return subscription.skippedDates?.some(skippedDate => 
      isSameDay(new Date(skippedDate), date)
    );
  };

  const isDeliveryDay = (subscription, date) => {
    const dayName = format(date, 'EEEE');
    return subscription.days.includes(dayName);
  };

  const canSkipDay = (date) => {
    const tomorrow = addDays(new Date(), 1);
    return isAfter(date, tomorrow) || isSameDay(date, tomorrow);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary-700">
              Meal Subscriptions
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your regular meal deliveries
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            leftIcon="Plus"
            className="bg-gradient-to-r from-primary-500 to-accent-500"
          >
            New Subscription
          </Button>
        </motion.div>

        {/* Active Subscriptions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-display font-semibold mb-4">Active Subscriptions</h2>
          
          {subscriptions.length === 0 ? (
            <Empty 
              message="No subscriptions yet"
              description="Create your first meal subscription to get regular deliveries"
              actionLabel="Create Subscription"
              onAction={() => setShowCreateForm(true)}
            />
          ) : (
            <div className="grid gap-4">
              {subscriptions.map(subscription => (
                <Card key={subscription.Id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display font-semibold text-lg">
                          {subscription.restaurantName}
                        </h3>
                        <Badge 
                          variant={subscription.status === 'active' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <ApperIcon name={mealTypes.find(t => t.value === subscription.mealType)?.icon || "UtensilsCrossed"} size={16} />
                          <span className="capitalize">{subscription.mealType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" size={16} />
                          <span>{subscription.days.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Clock" size={16} />
                          <span>{subscription.frequency}</span>
                        </div>
                      </div>
                      {subscription.mealPreferences && (
                        <p className="text-sm text-gray-600">
                          Preferences: {subscription.mealPreferences}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubscription(selectedSubscription?.Id === subscription.Id ? null : subscription)}
                      >
                        {selectedSubscription?.Id === subscription.Id ? "Hide Calendar" : "View Calendar"}
                      </Button>
                      {subscription.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePauseSubscription(subscription.Id)}
                        >
                          Pause
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResumeSubscription(subscription.Id)}
                        >
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Calendar View */}
                  {selectedSubscription?.Id === subscription.Id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t pt-4 mt-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Weekly Calendar</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
                            leftIcon="ChevronLeft"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
                            rightIcon="ChevronRight"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2">
                        {getWeekDates(currentWeek).map((date, index) => {
                          const isDelivery = isDeliveryDay(subscription, date);
                          const isSkipped = isDateSkipped(subscription, date);
                          const canSkip = canSkipDay(date);
                          const isPast = isBefore(date, new Date());

                          return (
                            <div
                              key={index}
                              className={`
                                p-3 rounded-lg border text-center transition-all
                                ${isDelivery && !isSkipped && !isPast ? 'bg-accent-50 border-accent-200' : ''}
                                ${isSkipped ? 'bg-gray-100 border-gray-200 opacity-60' : ''}
                                ${isPast ? 'opacity-40' : ''}
                                ${!isDelivery ? 'border-gray-100' : ''}
                              `}
                            >
                              <div className="text-xs text-gray-500 mb-1">
                                {weekDays[index].slice(0, 3)}
                              </div>
                              <div className="text-sm font-medium mb-2">
                                {format(date, 'd')}
                              </div>
                              
                              {isDelivery && (
                                <div className="space-y-1">
                                  {!isPast && (
                                    isSkipped ? (
                                      <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => handleUnskipDay(subscription.Id, format(date, 'yyyy-MM-dd'))}
                                        className="text-xs h-6 px-2"
                                      >
                                        <ApperIcon name="RotateCcw" size={12} />
                                      </Button>
                                    ) : canSkip ? (
                                      <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => handleSkipDay(subscription.Id, format(date, 'yyyy-MM-dd'))}
                                        className="text-xs h-6 px-2 hover:bg-red-50 hover:text-red-600"
                                      >
                                        <ApperIcon name="X" size={12} />
                                      </Button>
                                    ) : null
                                  )}
                                  <div className="text-xs">
                                    {isSkipped ? (
                                      <span className="text-red-600">Skipped</span>
                                    ) : (
                                      <span className="text-accent-600">
                                        {subscription.mealType}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </motion.section>

        {/* Create Subscription Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-semibold">
                  Create New Subscription
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Restaurant Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Restaurant</label>
                  <select
                    value={formData.restaurantId}
                    onChange={(e) => setFormData(prev => ({ ...prev, restaurantId: e.target.value }))}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a restaurant</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.Id} value={restaurant.Id}>
                        {restaurant.name} - {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meal Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {mealTypes.map(mealType => (
                      <button
                        key={mealType.value}
                        onClick={() => setFormData(prev => ({ ...prev, mealType: mealType.value }))}
                        className={`
                          p-3 rounded-xl border text-center transition-all
                          ${formData.mealType === mealType.value 
                            ? 'border-primary-500 bg-primary-50 text-primary-700' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <ApperIcon name={mealType.icon} size={20} className="mx-auto mb-1" />
                        <div className="text-sm font-medium">{mealType.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Days */}
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Days</label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            days: prev.days.includes(day)
                              ? prev.days.filter(d => d !== day)
                              : [...prev.days, day]
                          }));
                        }}
                        className={`
                          p-2 rounded-lg text-xs font-medium transition-all
                          ${formData.days.includes(day)
                            ? 'bg-accent-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      min={formData.startDate}
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meal Preferences</label>
                  <Input
                    placeholder="e.g., No spicy food, extra vegetables..."
                    value={formData.mealPreferences}
                    onChange={(e) => setFormData(prev => ({ ...prev, mealPreferences: e.target.value }))}
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions</label>
                  <textarea
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Delivery instructions, dietary requirements, etc..."
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSubscription}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500"
                  >
                    Create Subscription
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;