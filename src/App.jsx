import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import HomePage from "@/components/pages/HomePage";
import SearchPage from "@/components/pages/SearchPage";
import RestaurantPage from "@/components/pages/RestaurantPage";
import OrdersPage from "@/components/pages/OrdersPage";
import TrackingPage from "@/components/pages/TrackingPage";
import AccountPage from "@/components/pages/AccountPage";
import SubscriptionPage from "@/components/pages/SubscriptionPage";
import { addressService } from "@/services/api/addressService";

const App = () => {
  const [currentAddress, setCurrentAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const addresses = await addressService.getAll();
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        setCurrentAddress(addresses[0].street);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  const handleLocationSelect = (address) => {
    setCurrentAddress(address.street);
  };

  const handleCurrentLocationClick = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentAddress("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentAddress("Location unavailable");
        }
      );
    } else {
      setCurrentAddress("Geolocation not supported");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header 
          currentAddress={currentAddress}
          savedAddresses={savedAddresses}
          onLocationSelect={handleLocationSelect}
          onCurrentLocationClick={handleCurrentLocationClick}
          cartItemCount={cartItemCount}
          onSearch={handleSearch}
        />
        
        <main className="container mx-auto px-4 py-6 pb-24">
          <Routes>
            <Route 
              path="/" 
              element={<HomePage onSearch={handleSearch} />} 
            />
            <Route 
              path="/search" 
              element={<SearchPage />} 
            />
            <Route 
              path="/restaurant/:id" 
              element={<RestaurantPage />} 
            />
            <Route 
              path="/orders" 
              element={<OrdersPage />} 
            />
            <Route 
              path="/track/:orderId" 
              element={<TrackingPage />} 
            />
            <Route 
path="/account" 
              element={<AccountPage />} 
            />
            <Route 
              path="/subscriptions" 
              element={<SubscriptionPage />} 
            />
          </Routes>
        </main>
        
        <BottomNavigation cartItemCount={cartItemCount} />
        
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
};

export default App;