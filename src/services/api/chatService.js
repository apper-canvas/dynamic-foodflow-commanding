const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock chat messages storage
let chatMessages = [];

// Mock support agents
const supportAgents = [
  {
    id: 1,
    name: "Sarah",
    status: "online",
    avatar: "👩‍💼",
    speciality: "orders"
  },
  {
    id: 2, 
    name: "Mike",
    status: "online",
    avatar: "👨‍💼",
    speciality: "technical"
  },
  {
    id: 3,
    name: "Emma",
    status: "online", 
    avatar: "👩‍🍳",
    speciality: "food_quality"
  }
];

// Mock chat responses based on message content
const generateResponse = (userMessage, currentOrder) => {
  const message = userMessage.toLowerCase();
  
  // Order status inquiries
  if (message.includes('order') && message.includes('status')) {
    if (currentOrder) {
      return {
        text: `I can see your order #${currentOrder.Id} is currently ${currentOrder.status}. ${getStatusMessage(currentOrder.status)}`,
        type: "order_status",
        orderDetails: {
          id: currentOrder.Id,
          status: currentOrder.status
        }
      };
    }
    return { text: "I don't see any active orders in your account. Would you like me to help you place a new order?" };
  }
  
  // Delivery time questions
  if (message.includes('delivery') && (message.includes('time') || message.includes('when'))) {
    if (currentOrder) {
      const estimatedTime = getEstimatedDeliveryTime(currentOrder.status);
      return {
        text: `Based on your order status, estimated delivery time is ${estimatedTime}. I'll keep you updated if anything changes!`,
        type: "delivery_estimate"
      };
    }
    return { text: "Delivery times typically range from 20-45 minutes depending on your location and restaurant preparation time." };
  }
  
  // Cancellation requests
  if (message.includes('cancel')) {
    if (currentOrder && (currentOrder.status === 'confirmed' || currentOrder.status === 'preparing')) {
      return {
        text: "I can help you cancel this order. Please note that cancellation may not be possible once the restaurant starts preparing your food. Would you like me to proceed?",
        type: "quick_actions",
        actions: [
          { type: "cancel_order", label: "Yes, cancel order" },
          { type: "keep_order", label: "No, keep order" }
        ]
      };
    }
    return { text: "I can help with order cancellations. Could you please provide your order number?" };
  }
  
  // Food quality issues
  if (message.includes('wrong') || message.includes('missing') || message.includes('cold') || message.includes('quality')) {
    return {
      text: "I'm sorry to hear about the issue with your order. Let me connect you with our food quality team to resolve this immediately. We'll make sure to make this right!",
      type: "escalate_quality"
    };
  }
  
  // Payment issues
  if (message.includes('payment') || message.includes('charged') || message.includes('refund')) {
    return {
      text: "I understand your payment concern. Let me check your order details and processing status. For refunds, we typically process them within 3-5 business days.",
      type: "payment_help"
    };
  }
  
  // General greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
    const quickActions = currentOrder ? [
      { type: "check_status", label: "Check order status" },
      { type: "delivery_time", label: "Delivery time" },
      { type: "modify_order", label: "Modify order" }
    ] : [
      { type: "place_order", label: "Place new order" },
      { type: "track_order", label: "Track existing order" },
      { type: "account_help", label: "Account help" }
    ];
    
    return {
      text: "Hi there! I'm here to help with any questions about your orders or account. What can I assist you with today?",
      type: "quick_actions",
      actions: quickActions
    };
  }
  
  // Default response
  return {
    text: "Thanks for reaching out! I'm here to help with orders, deliveries, payments, and any other questions. Could you please provide more details so I can assist you better?",
    type: "general_help"
  };
};

const getStatusMessage = (status) => {
  const statusMessages = {
    'confirmed': "Your order has been confirmed and the restaurant is preparing it.",
    'preparing': "The restaurant is currently preparing your delicious meal!",
    'out_for_delivery': "Great news! Your order is on its way to you.",
    'delivered': "Your order has been delivered. Hope you enjoyed it!",
    'cancelled': "This order was cancelled."
  };
  return statusMessages[status] || "I'll check the latest status for you.";
};

const getEstimatedDeliveryTime = (status) => {
  const timeEstimates = {
    'confirmed': "25-35 minutes",
    'preparing': "15-25 minutes", 
    'out_for_delivery': "5-15 minutes",
    'delivered': "Already delivered!"
  };
  return timeEstimates[status] || "20-30 minutes";
};

export const chatService = {
  async getMessages() {
    await delay(300);
    return [...chatMessages];
  },

  async sendMessage(text, currentOrder = null) {
    await delay(500 + Math.random() * 1000);
    
    const response = generateResponse(text, currentOrder);
    const agentMessage = {
      id: Date.now() + Math.random(),
      text: response.text,
      sender: "agent",
      timestamp: new Date().toISOString(),
      type: response.type || "text",
      actions: response.actions,
      orderDetails: response.orderDetails
    };
    
    chatMessages.push(agentMessage);
    return agentMessage;
  },

  async assignAgent() {
    await delay(200);
    // Randomly assign an available agent
    const availableAgents = supportAgents.filter(agent => agent.status === "online");
    const randomAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
    return randomAgent;
  },

  async sendWelcomeMessage(currentOrder = null) {
    await delay(100);
    
    let welcomeText = "Hello! Welcome to FoodFlow Support. I'm here to help you with any questions.";
    
    if (currentOrder) {
      welcomeText += ` I can see you have an active order (#${currentOrder.Id}) that is currently ${currentOrder.status}.`;
    }
    
    const welcomeMessage = {
      id: Date.now(),
      text: welcomeText,
      sender: "agent", 
      timestamp: new Date().toISOString(),
      type: "welcome"
    };
    
    chatMessages.push(welcomeMessage);
    return welcomeMessage;
  },

  async markMessageAsRead(messageId) {
    await delay(100);
    const message = chatMessages.find(m => m.id === messageId);
    if (message) {
      message.status = "read";
    }
    return message;
  },

  async getUnreadCount() {
    await delay(100);
    return chatMessages.filter(m => m.sender === "agent" && m.status !== "read").length;
  }
};