import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DonationWidget from './components/DonationWidget';

import Dashboard from './pages/Dashboard';
import CoinDetail from './pages/CoinDetail';
import About from './pages/About';
import Subscription from './pages/Subscription';
import ThankYou from './pages/ThankYou';
import ScamAlertsPage from './pages/ScamAlertsPage';
import Auth from './pages/Auth';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import Advertise from './pages/Advertise';
import NotFound from './pages/NotFound';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Sitemap from './pages/Sitemap';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture"
    }}>
      <Router>
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/coin/:address" element={<CoinDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/scam-alerts" element={<ScamAlertsPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/advertise" element={<Advertise />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <DonationWidget />
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;