const paypal = require('@paypal/checkout-server-sdk');

// PayPal client setup
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  
  return new paypal.core.PayPalHttpClient(environment);
}

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        },
        description: description || 'Sollarity Premium Subscription'
      }]
    });
    
    const client = getPayPalClient();
    const response = await client.execute(request);
    
    return res.status(200).json({
      orderId: response.result.id,
      status: response.result.status,
      links: response.result.links
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Capture payment for an order
exports.capturePayment = async (req, res) => {
  try {
    const { orderId } = req.query;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const client = getPayPalClient();
    const response = await client.execute(request);
    
    // Save subscription info to database
    // This would typically include user ID, subscription details, etc.
    
    return res.status(200).json({
      captureId: response.result.purchase_units[0].payments.captures[0].id,
      status: response.result.status,
      payer: response.result.payer
    });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get subscription plans
exports.getPlans = async (req, res) => {
  try {
    // In a real app, these would come from your database
    const plans = [
      {
        id: 'basic_monthly',
        name: 'Basic Plan',
        description: 'Access to basic features and analytics',
        amount: 9.99,
        currency: 'USD',
        interval: 'month'
      },
      {
        id: 'premium_monthly',
        name: 'Premium Plan',
        description: 'Full access to all features and priority support',
        amount: 19.99,
        currency: 'USD',
        interval: 'month'
      },
      {
        id: 'premium_yearly',
        name: 'Premium Annual',
        description: 'Full access with 2 months free',
        amount: 199.99,
        currency: 'USD',
        interval: 'year'
      }
    ];
    
    // Return plans immediately without delay
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    // Even on error, return default plans to prevent UI failure
    const defaultPlans = [
      {
        id: 'basic_monthly',
        name: 'Basic Plan',
        description: 'Access to basic features and analytics',
        amount: 9.99,
        currency: 'USD',
        interval: 'month'
      },
      {
        id: 'premium_monthly',
        name: 'Premium Plan',
        description: 'Full access to all features and priority support',
        amount: 19.99,
        currency: 'USD',
        interval: 'month'
      }
    ];
    res.status(200).json(defaultPlans);
  }
};