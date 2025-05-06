<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div class="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div v-if="status === 'success'" class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
            <svg class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900">Donation Successful!</h1>
          <p class="text-gray-600">
            Thank you for your generosity! Your donation will help animals in need of care and shelter.
          </p>
          
          <router-link 
            to="/" 
            class="inline-block mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1"
          >
            Back to Home Page
          </router-link>
        </div>
        
        <div v-else-if="status === 'failed'" class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
            <svg class="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900">Donation Failed</h1>
          <p class="text-gray-600">
            Unfortunately, there was a problem processing your payment. Please try again.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <router-link 
              :to="returnPath" 
              class="px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1"
            >
              Back to Shelter
            </router-link>
            
            <button 
              @click="tryAgain" 
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        </div>
        
        <div v-else class="space-y-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
            <svg class="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900">Checking Your Payment...</h1>
          <p class="text-gray-600">
            Please wait while we verify the status of your payment.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getStripePromise } from '@/utils/stripeClient';
  
  export default {
    name: 'DonationComplete',
    setup() {
      const route = useRoute();
      const router = useRouter();
      
      const status = ref('loading');
      const returnPath = ref('/');
      
      const checkPaymentStatus = async () => {
        try {
          // Get the payment intent client secret from the URL query parameters
          const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
          );
          
          if (!clientSecret) {
            status.value = 'failed';
            return;
          }
          
          // Retrieve the payment intent using the client secret
          const stripe = await getStripePromise();
          const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
          
          if (paymentIntent.status === 'succeeded') {
            status.value = 'success';
          } else {
            status.value = 'failed';
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          status.value = 'failed';
        }
      };
      
      const tryAgain = () => {
        router.go(-1); // Go back to previous page
      };
      
      onMounted(() => {
        // Try to extract shelter ID from previous route or from local storage
        const previousPath = document.referrer;
        if (previousPath && previousPath.includes('/shelter/')) {
          const match = previousPath.match(/\/shelter\/(\d+)/);
          if (match && match[1]) {
            returnPath.value = `/shelter/${match[1]}`;
          }
        }
        
        checkPaymentStatus();
      });
      
      return {
        status,
        returnPath,
        tryAgain
      };
    }
  }
  </script>