import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");

  // Mock user data
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    preferences: {
      dietary: ["vegetarian"],
      cuisines: ["indian", "italian"],
      budget: "medium"
    }
  });

  const [addresses, setAddresses] = useState([
    {
      Id: 1,
      label: "Home",
      street: "123 Main Street, Apartment 4B",
      landmark: "Near Central Mall",
      isDefault: true
    },
    {
      Id: 2,
      label: "Work",
      street: "456 Business Park, Tower A",
      landmark: "Opposite Metro Station",
      isDefault: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      Id: 1,
      type: "card",
      name: "HDFC Credit Card",
      number: "**** **** **** 1234",
      isDefault: true
    },
    {
      Id: 2,
      type: "upi",
      name: "GPay",
      number: "john.doe@okaxis",
      isDefault: false
    }
  ]);

  const menuItems = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: "User",
      description: "Manage your personal information"
    },
    {
      id: "addresses",
      label: "Delivery Addresses",
      icon: "MapPin",
      description: "Manage your saved addresses"
    },
    {
      id: "payments",
      label: "Payment Methods",
      icon: "CreditCard",
      description: "Manage your payment options"
    },
    {
      id: "preferences",
      label: "Food Preferences",
      icon: "Settings",
      description: "Dietary and cuisine preferences"
    },
    {
      id: "support",
      label: "Help & Support",
      icon: "HelpCircle",
      description: "Get help and contact support"
    }
  ];

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleAddAddress = () => {
    toast.info("Add address feature coming soon!");
  };

  const handleAddPayment = () => {
    toast.info("Add payment method feature coming soon!");
  };

  const renderProfileSection = () => (
    <Card>
      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold text-secondary-700">
          Profile Information
        </h3>
        
        <div className="grid gap-4">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
          />
          
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
          />
        </div>
        
        <Button onClick={handleSaveProfile} className="w-full">
          Save Changes
        </Button>
      </div>
    </Card>
  );

  const renderAddressesSection = () => (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-secondary-700">
            Delivery Addresses
          </h3>
          <Button size="sm" onClick={handleAddAddress} leftIcon="Plus">
            Add Address
          </Button>
        </div>
        
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.Id} className="p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2 rounded-lg">
                    <ApperIcon name={address.label === "Home" ? "Home" : "Briefcase"} size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-secondary-700">{address.label}</h4>
                      {address.isDefault && (
                        <Badge variant="primary" size="xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{address.street}</p>
                    <p className="text-gray-500 text-xs">{address.landmark}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Edit3" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderPaymentsSection = () => (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold text-secondary-700">
            Payment Methods
          </h3>
          <Button size="sm" onClick={handleAddPayment} leftIcon="Plus">
            Add Payment
          </Button>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.Id} className="p-4 border-2 border-gray-100 rounded-xl hover:border-primary-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-50 p-2 rounded-lg">
                    <ApperIcon name={method.type === "card" ? "CreditCard" : "Smartphone"} size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-secondary-700">{method.name}</h4>
                      {method.isDefault && (
                        <Badge variant="accent" size="xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{method.number}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="MoreVertical" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderPreferencesSection = () => (
    <Card>
      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold text-secondary-700">
          Food Preferences
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-secondary-700 mb-3">Dietary Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {["vegetarian", "non-vegetarian", "vegan", "jain"].map((diet) => (
                <Button
                  key={diet}
                  variant={profile.preferences.dietary.includes(diet) ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    const updated = profile.preferences.dietary.includes(diet)
                      ? profile.preferences.dietary.filter(d => d !== diet)
                      : [...profile.preferences.dietary, diet];
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, dietary: updated }
                    });
                  }}
                >
                  {diet.charAt(0).toUpperCase() + diet.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary-700 mb-3">Favorite Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {["indian", "chinese", "italian", "thai", "mexican", "american"].map((cuisine) => (
                <Button
                  key={cuisine}
                  variant={profile.preferences.cuisines.includes(cuisine) ? "accent" : "outline"}
                  size="sm"
                  onClick={() => {
                    const updated = profile.preferences.cuisines.includes(cuisine)
                      ? profile.preferences.cuisines.filter(c => c !== cuisine)
                      : [...profile.preferences.cuisines, cuisine];
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, cuisines: updated }
                    });
                  }}
                >
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Button onClick={() => toast.success("Preferences saved!")} className="w-full">
          Save Preferences
        </Button>
      </div>
    </Card>
  );

  const renderSupportSection = () => (
    <Card>
      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold text-secondary-700">
          Help & Support
        </h3>
        
        <div className="space-y-4">
          {[
            { icon: "MessageCircle", label: "Live Chat", description: "Chat with our support team" },
            { icon: "Phone", label: "Call Support", description: "+91 1800-123-4567" },
            { icon: "Mail", label: "Email Us", description: "support@foodflow.com" },
            { icon: "FileText", label: "FAQ", description: "Frequently asked questions" }
          ].map((item, index) => (
            <button
              key={index}
              className="w-full p-4 text-left border-2 border-gray-100 rounded-xl hover:border-primary-200 transition-colors"
              onClick={() => toast.info(`${item.label} feature coming soon!`)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-info/10 p-2 rounded-lg">
                  <ApperIcon name={item.icon} size={20} className="text-info" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-700">{item.label}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "addresses":
        return renderAddressesSection();
      case "payments":
        return renderPaymentsSection();
      case "preferences":
        return renderPreferencesSection();
      case "support":
        return renderSupportSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar Menu */}
      <div className="w-80 space-y-2">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 w-12 h-12 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-700">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveSection(item.id)}
              className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                  : "hover:bg-gray-50 text-secondary-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <ApperIcon name={item.icon} size={20} />
                <div>
                  <h4 className="font-medium text-sm">{item.label}</h4>
                  <p className={`text-xs ${
                    activeSection === item.id ? "text-white/70" : "text-gray-500"
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;