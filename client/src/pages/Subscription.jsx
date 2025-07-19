import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubscriptionPlans from '../components/payments/SubscriptionPlans';
import PayPalButton from '../components/payments/PayPalButton';

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('select-plan'); // 'select-plan' or 'payment'
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'error'
  const [paymentError, setPaymentError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [planSelectionStable, setPlanSelectionStable] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPlanSelectionStable(true);
  };

  const handleProceedToPayment = () => {
    if (selectedPlan) {
      setIsTransitioning(true);
      // Immediate state change to prevent flickering
      setStep('payment');
      // Short timeout just to show loading indicator
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }
  };

  const handlePaymentSuccess = (data) => {
    setPaymentStatus('success');
    // Here you would typically update the user's subscription status in your database
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    setPaymentError(error.message || 'Payment failed. Please try again.');
  };

  // Show loading state during transitions
  if (isTransitioning) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upgrade Your Experience
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Get premium features and support the development of Sollarity
          </p>
        </div>

        {step === 'select-plan' && (
          <div className="subscription-plan-container">
            <SubscriptionPlans onPlanSelect={handlePlanSelect} />
            
            <div className="mt-8 text-center">
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedPlan || !planSelectionStable}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="mt-8">
            {paymentStatus === 'success' ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
                  Payment Successful!
                </h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Thank you for subscribing to {selectedPlan?.name}. You will be redirected shortly.
                </p>
              </div>
            ) : paymentStatus === 'error' ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
                  Payment Failed
                </h3>
                <p className="mt-1 text-red-600 dark:text-red-400">
                  {paymentError}
                </p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Order Summary
                    </h2>
                    <button
                      onClick={() => {
                        setIsTransitioning(true);
                        setStep('select-plan');
                        setTimeout(() => {
                          setIsTransitioning(false);
                        }, 100);
                      }}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      disabled={isTransitioning}
                    >
                      Change plan
                    </button>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedPlan?.name} ({selectedPlan?.interval}ly)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${selectedPlan?.amount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Tax</span>
                    <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
                  </div>
                  
                  <div className="flex justify-between py-2 mt-2">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${selectedPlan?.amount}
                    </span>
                  </div>
                </div>
                
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Payment Details
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Complete your purchase securely with PayPal
                    </p>
                  </div>
                  
                  <PayPalButton
                    amount={selectedPlan?.amount}
                    description={`${selectedPlan?.name} (${selectedPlan?.interval}ly)`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
  );
};

export default Subscription;