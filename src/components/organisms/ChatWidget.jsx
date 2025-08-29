import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { chatService } from "@/services/api/chatService";
import { orderService } from "@/services/api/orderService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ChatMessage from "@/components/molecules/ChatMessage";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [supportAgent, setSupportAgent] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Global chat toggle listener
  useEffect(() => {
    const handleChatToggle = () => {
      setIsOpen(prev => !prev);
      if (!isOpen) {
        setUnreadCount(0);
      }
    };

    window.addEventListener('toggleChat', handleChatToggle);
    return () => window.removeEventListener('toggleChat', handleChatToggle);
  }, [isOpen]);

  // Load initial chat data
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Load existing messages
        const chatMessages = await chatService.getMessages();
        setMessages(chatMessages);
        
        // Detect current order context
        const orders = await orderService.getAll();
        const activeOrder = orders.find(o => 
          o.status === "preparing" || o.status === "confirmed" || o.status === "out_for_delivery"
        );
        setCurrentOrder(activeOrder);
        
        // Assign support agent
        const agent = await chatService.assignAgent();
        setSupportAgent(agent);
        
        if (chatMessages.length === 0) {
          // Send welcome message with order context
          const welcomeMessage = await chatService.sendWelcomeMessage(activeOrder);
          setMessages([welcomeMessage]);
        }
        
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast.error("Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sending"
    };

    try {
      // Add user message with sending status
      setMessages(prev => [...prev, userMessage]);
      
      // Send message to chat service
      const response = await chatService.sendMessage(messageText, currentOrder?.id);
      
      // Update user message to sent status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: "sent" }
            : msg
        )
      );
      
      // Add agent response if available
      if (response.agentResponse) {
        const agentMessage = {
          id: Date.now() + 1,
          text: response.agentResponse,
          sender: "agent",
          timestamp: new Date().toISOString(),
          agent: supportAgent
        };
        setMessages(prev => [...prev, agentMessage]);
      }
      
      // Show typing indicator for delayed responses
      if (response.willRespond) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Update message status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: "failed" }
            : msg
        )
      );
      
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOrderContextDisplay = () => {
    if (!currentOrder) return null;

    return (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="ShoppingBag" size={14} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Current Order Context</span>
        </div>
        <div className="space-y-1 text-xs text-blue-700">
          <p><span className="font-medium">Order #{currentOrder.Id}</span></p>
          <p>Status: <Badge size="xs" className="bg-blue-100 text-blue-800">{currentOrder.status}</Badge></p>
          <p>Restaurant: {currentOrder.restaurantName}</p>
          <p>Total: ₹{currentOrder.total}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl z-50 flex items-center justify-center"
          >
            <ApperIcon name="MessageCircle" size={24} />
            {unreadCount > 0 && (
              <Badge 
                size="xs" 
                className="absolute -top-1 -right-1 bg-red-500 text-white min-w-[1.25rem] h-5"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-6 right-6 w-80 h-96 z-50 sm:w-96 sm:h-[500px]"
          >
            <Card className="h-full flex flex-col p-0 shadow-2xl border-0">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="Headphones" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Support Chat</h3>
                    {supportAgent && (
                      <p className="text-xs text-white/80">
                        {supportAgent.name} • {supportAgent.status}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <ApperIcon name="X" size={18} />
                </Button>
              </div>

              {/* Order Context */}
              {currentOrder && (
                <div className="p-3 border-b border-gray-100">
                  {getOrderContextDisplay()}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage 
                        key={message.id} 
                        message={message} 
                        currentOrder={currentOrder}
                      />
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-gray-500"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={12} />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    size="sm"
                    className="px-3"
                  >
                    <ApperIcon name="Send" size={16} />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  We typically reply within a few minutes
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;