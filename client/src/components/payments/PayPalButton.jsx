import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const PayPalButton = ({ amount, description, onSuccess, onError }) => {
  const [isPending, setIsPending] = useState(false);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amount.toString(),
          currency_code: 'USD'
        },
        description: description || 'Sollarity Premium Subscription'
      }]
    });
  };

  const onApprove = (data, actions) => {
    setIsPending(true);
    
    return actions.order.capture().then(details => {
      setIsPending(false);
      console.log('Payment completed', details);
      
      // Call backend to record subscription (optional)
      try {
        axios.post('/api/payments/record-payment', {
          orderId: data.orderID,
          paymentDetails: details
        });
      } catch (err) {
        console.error('Error recording payment:', err);
      }
      
      if (onSuccess) onSuccess(details);
      
      // Redirect to thank you page
      window.location.href = '/thank-you';
    }).catch(err => {
      setIsPending(false);
      console.error('Payment error:', err);
      if (onError) onError(err);
    });
  };

  return (
    <div className="w-full">
      {isPending && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Processing payment...</p>
        </div>
      )}
      
      <div className="paypal-button-container">
        <PayPalButtons
          style={{
            color: 'blue',
            shape: 'rect',
            label: 'subscribe',
            height: 50
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error('PayPal error:', err);
            if (onError) onError(err);
          }}
          disabled={isPending}
          forceReRender={[amount, description]}
        />
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Your payment is securely processed by PayPal. We do not store your payment details.
      </div>
    </div>
  );
};

export default PayPalButton;