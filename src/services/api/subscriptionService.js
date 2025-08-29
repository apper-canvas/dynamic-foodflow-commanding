import subscriptionsData from "@/services/mockData/subscriptions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const subscriptionService = {
  async getAll() {
    await delay(300);
    return [...subscriptionsData];
  },

  async getById(id) {
    await delay(400);
    const subscription = subscriptionsData.find(s => s.Id === id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    return { ...subscription };
  },

  async create(subscription) {
    await delay(500);
    const newId = subscriptionsData.length > 0 
      ? Math.max(...subscriptionsData.map(s => s.Id)) + 1 
      : 1;
    
    const newSubscription = {
      Id: newId,
      userId: "user1", // In real app, get from auth context
      ...subscription,
      createdDate: new Date().toISOString().split('T')[0],
      skippedDates: [],
      totalSkips: 0,
      nextDelivery: subscription.startDate
    };
    
    subscriptionsData.push(newSubscription);
    return { ...newSubscription };
  },

  async update(id, updates) {
    await delay(400);
    const index = subscriptionsData.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Subscription not found");
    }
    
    subscriptionsData[index] = { 
      ...subscriptionsData[index], 
      ...updates,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    
    return { ...subscriptionsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = subscriptionsData.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Subscription not found");
    }
    
    const deleted = subscriptionsData.splice(index, 1)[0];
    return { ...deleted };
  },

  async skipDay(subscriptionId, date) {
    await delay(300);
    const index = subscriptionsData.findIndex(s => s.Id === subscriptionId);
    if (index === -1) {
      throw new Error("Subscription not found");
    }

    const subscription = subscriptionsData[index];
    
    // Check if date is already skipped
    if (subscription.skippedDates.includes(date)) {
      throw new Error("Date is already skipped");
    }

    // Add to skipped dates
    subscription.skippedDates.push(date);
    subscription.totalSkips = (subscription.totalSkips || 0) + 1;
    subscription.updatedDate = new Date().toISOString().split('T')[0];

    return { ...subscription };
  },

  async unskipDay(subscriptionId, date) {
    await delay(300);
    const index = subscriptionsData.findIndex(s => s.Id === subscriptionId);
    if (index === -1) {
      throw new Error("Subscription not found");
    }

    const subscription = subscriptionsData[index];
    
    // Check if date is actually skipped
    if (!subscription.skippedDates.includes(date)) {
      throw new Error("Date is not skipped");
    }

    // Remove from skipped dates
    subscription.skippedDates = subscription.skippedDates.filter(d => d !== date);
    subscription.totalSkips = Math.max((subscription.totalSkips || 0) - 1, 0);
    subscription.updatedDate = new Date().toISOString().split('T')[0];

    return { ...subscription };
  },

  async getUpcomingDeliveries(subscriptionId, days = 7) {
    await delay(200);
    const subscription = subscriptionsData.find(s => s.Id === subscriptionId);
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Calculate upcoming deliveries logic would go here
    // For now, return empty array as this is complex date calculation
    return [];
  },

  async pauseSubscription(subscriptionId) {
    return this.update(subscriptionId, { status: "paused" });
  },

  async resumeSubscription(subscriptionId) {
    return this.update(subscriptionId, { status: "active" });
  },

  async cancelSubscription(subscriptionId) {
    return this.update(subscriptionId, { status: "cancelled" });
  }
};