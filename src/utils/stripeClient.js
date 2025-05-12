import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};