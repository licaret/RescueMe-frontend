/*
 * Singleton module for initializing and accessing the Stripe client
 * Ensures that the Stripe SDK is loaded only once throughout the application
 */

import { loadStripe } from '@stripe/stripe-js';

/**
 * Private variable to hold the Stripe client promise singleton
 * We use a singleton pattern to ensure only one instance of the Stripe client is created
 * This prevents unnecessary re-initializations and potential performance issues
 * @type {Promise<Stripe>|null}
 */
let stripePromise;

export const getStripePromise = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};