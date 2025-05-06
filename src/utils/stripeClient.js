import { loadStripe } from '@stripe/stripe-js';

// Singleton pentru inițializarea Stripe o singură dată
let stripePromise;

export const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};