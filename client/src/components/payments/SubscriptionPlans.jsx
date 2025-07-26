import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PlanCard = ({ plan, onSelectPlan, isSelected }) => {
  const isMonthly = plan.interval === 'month';
  
  return (
    <div 
      className={`border rounded-lg p-6 transition-all cursor-pointer ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectPlan(plan);
      }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {plan.name}
        </h3>
        {isSelected && (
          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 text-xs px-2 py-1 rounded-full">
            Selected
          </span>
        )}
      </div>
      
      <div className="mt-4 flex items-baseline">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          ${plan.amount}
        </span>
        <span className="ml-1 text-gray-500 dark:text-gray-400">
          /{isMonthly ? 'mo' : 'yr'}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {plan.description}
      </p>
      
      <ul className="mt-4 space-y-2">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SubscriptionPlans = ({ onPlanSelect }) => {
  // Define fallback plans directly to avoid flickering
  const fallbackPlans = [
    {
      id: 'basic_monthly',
      name: 'Basic Plan',
      description: 'Perfect for casual traders',
      amount: 9.99,
      currency: 'USD',
      interval: 'month',
      features: ['100 coins access', '5 watchlist items', 'Basic charts', 'Email support']
    },
    {
      id: 'premium_monthly',
      name: 'Pro Plan',
      description: 'For serious memecoin traders',
      amount: 29.99,
      currency: 'USD',
      interval: 'month',
      features: ['All coins access', '25 watchlist items', 'Advanced charts', 'Priority support', 'API access']
    },
    {
      id: 'premium_yearly',
      name: 'Enterprise',
      description: 'Maximum features and support',
      amount: 99.99,
      currency: 'USD',
      interval: 'month',
      features: ['Everything in Pro', 'Unlimited watchlist', 'Custom alerts', 'Phone support', 'White-label option']
    }
  ];
  
  const [plans, setPlans] = useState(fallbackPlans);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/payments/plans`, { timeout: 5000 });
        
        if (response.data && response.data.length > 0) {
          setPlans(response.data);
        }
      } catch (apiError) {
        console.error('Error fetching plans from API:', apiError);
        setError('Using default plans - could not connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    console.log('Plan selected:', plan);
    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading plans...</p>
      </div>
    );
  }

  // Show warning banner if there was an error but we're using fallback plans
  const errorBanner = error && (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 text-center mb-6">
      <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
      >
        Try again
      </button>
    </div>
  );

  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No subscription plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorBanner}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelectPlan={handleSelectPlan}
            isSelected={selectedPlan?.id === plan.id}
          />
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        By subscribing, you agree to our{' '}
        <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionPlans;