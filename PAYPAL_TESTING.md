# PayPal Integration Testing Guide

## Overview
This guide explains how to test the PayPal integration in Sollarity's subscription system using PayPal's sandbox environment.

## Prerequisites
- The application is running locally or deployed
- You have access to PayPal sandbox accounts

## PayPal Sandbox Accounts

### Accessing Sandbox Accounts
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal developer account
3. Navigate to "Sandbox" > "Accounts"
4. You should see at least two accounts:
   - A Business account (merchant)
   - A Personal account (customer)

### Default Sandbox Test Account
For testing, you can use these credentials:
- **Email**: sb-43mfk28377099@personal.example.com
- **Password**: 12345678

## Testing the PayPal Integration

### Step 1: Access the Subscription Page
1. Navigate to the Subscription page in Sollarity
2. Select a subscription plan (Basic, Premium Monthly, or Premium Annual)
3. Click "Continue to Payment"

### Step 2: Complete the PayPal Payment Flow
1. Click on the PayPal button
2. A PayPal popup window will appear
3. Log in using the sandbox personal account credentials
4. Review the payment details
5. Click "Pay Now" or "Subscribe"
6. Wait for the payment to process
7. You should be redirected to the Thank You page

### Testing Different Scenarios

#### Successful Payment
- Use the default sandbox account with sufficient funds
- Complete the payment flow as described above

#### Failed Payment
To simulate a failed payment:
1. In the PayPal Developer Dashboard, go to your sandbox personal account
2. Reduce the balance to below the subscription amount
3. Attempt to make a payment
4. The payment should fail, and you should see an error message

#### Cancelled Payment
1. Start the payment process
2. In the PayPal popup, click "Cancel" or close the window
3. You should be returned to the subscription page without completing the payment

## Troubleshooting

### Common Issues

#### PayPal Button Not Appearing
- Check that `REACT_APP_PAYPAL_CLIENT_ID` is correctly set in your `.env` file
- Ensure the PayPal script is loading correctly (check browser console for errors)
- Verify that you're not blocking third-party cookies or scripts

#### Payment Processing Errors
- Check the browser console for specific error messages
- Verify that the sandbox account has sufficient funds
- Ensure the payment amount is valid (greater than zero)

#### Redirect Issues
- Check that the success and cancel URLs are correctly configured
- Verify that your application can handle the PayPal return parameters

## Testing in Production

When moving to production:
1. Replace the sandbox client ID with your live PayPal client ID
2. Update the `.env` file with the production credentials
3. Test with a small real payment to ensure everything works correctly

**Note:** Always use sandbox accounts for testing. Never test with real money unless you're in production and ready to accept actual payments.