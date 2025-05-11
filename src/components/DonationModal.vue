<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300" @click="close"></div>
      <div class="bg-white w-full max-w-lg mx-auto rounded-2xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 scale-100">
        <div class="bg-gradient-to-r from-red-600 to-red-700 px-8 py-5 text-white">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-medium tracking-tight">Support {{ shelterName }}</h3>
            <button @click="close" class="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="px-8 py-6">
          <!-- Donation steps -->
          <div v-if="step === 'amount'" class="space-y-5">
            <p class="text-gray-700 leading-relaxed">Your contribution will directly help provide essential care, shelter, and medical attention for animals in need.</p>
            
            <!-- Donation amount selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Donation Amount</label>
              <div class="grid grid-cols-2 gap-3 mb-4">
                <button 
                  v-for="amount in donationAmounts" 
                  :key="amount"
                  @click="selectedAmount = amount"
                  class="px-4 py-3.5 rounded-2xl text-center transition-all duration-200"
                  :class="selectedAmount === amount 
                    ? 'bg-red-50 border-2 border-red-500 text-red-700 font-bold shadow-sm' 
                    : 'bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'"
                >
                  {{ amount }} LEI
                </button>
              </div>
                
              <!-- Custom amount -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                <div class="relative rounded-2xl shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="text-gray-500 font-medium">LEI</span>
                  </div>
                  <input 
                    type="number" 
                    v-model="customAmount" 
                    @input="selectedAmount = Number(customAmount)"
                    class="focus:ring-red-500 focus:border-red-500 block w-full pl-14 pr-4 py-3.5 text-gray-700 border border-gray-300 rounded-2xl shadow-sm transition-all duration-200" 
                    placeholder="Enter amount" 
                    min="1"
                  />
                </div>
              </div>
            </div>
            
            <!-- Donation message -->
            <div class="mt-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Add a Personal Message (Optional)
              </label>
              <textarea 
                v-model="message" 
                rows="3"
                class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full text-gray-700 sm:text-sm border border-gray-300 rounded-2xl px-4 py-3 transition-all duration-200"
                placeholder="Share why you're supporting this shelter..."
              ></textarea>
            </div>
            
            
            <!-- Continue button -->
            <div class="mt-6">
              <button 
                @click="goToPayment"
                :disabled="!selectedAmount || selectedAmount <= 0"
                class="w-full py-4 px-6 rounded-2xl text-white font-medium text-center focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                :class="selectedAmount && selectedAmount > 0 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                  : 'bg-gray-300 cursor-not-allowed'"
              >
                Continue to Payment
              </button>
            </div>
          </div>
          
          <!-- Payment step -->
          <div v-else-if="step === 'payment'" class="space-y-5">
            <div class="mb-6 text-center">
              <div class="inline-block bg-red-50 text-red-700 font-bold px-4 py-2 rounded-2xl mb-2">
                {{ selectedAmount }} LEI
              </div>
              <p class="text-gray-600">Your generous donation</p>
              
              <div v-if="message" class="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-gray-700 italic">
                "{{ message }}"
              </div>
            </div>
            
            <!-- Payment form -->
            <div class="border border-gray-300 rounded-2xl p-5 bg-white shadow-sm">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Payment Information</h4>
              <div id="payment-element" class="mb-4">
                <!-- Stripe Elements -->
              </div>
            </div>
            
            <div class="mt-6">
              <button 
                @click="processPayment"
                :disabled="isProcessing"
                class="w-full py-4 px-6 rounded-2xl text-white font-medium text-center focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-md bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 flex items-center justify-center"
              >
                <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isProcessing ? 'Processing...' : 'Complete Donation' }}
              </button>
            </div>
            
            <div class="text-center">
              <button 
                @click="step = 'amount'" 
                class="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium flex items-center justify-center mx-auto"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to donation details
              </button>
            </div>
          </div>
          
          <!-- Confirmation step -->
          <div v-else-if="step === 'confirmation'" class="py-8 text-center">
            <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Thank You for Your Support!</h3>
            <p class="text-gray-600 mb-8 max-w-md mx-auto">
              Your generous donation of <span class="font-medium text-red-600">{{ selectedAmount }} LEI</span> will make a real difference in the lives of animals at {{ shelterName }}.
            </p>
            
            <div class="flex flex-col space-y-3">
              <button 
                @click="close" 
                class="inline-flex items-center px-8 py-3.5 bg-red-600 text-white font-medium rounded-3xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 mx-auto"
              >
                Close
              </button>
              
              <p class="text-sm text-gray-500 mt-3">
                You can view your donation in your donation history.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer with security badges -->
        <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-center justify-center space-x-4">
            <div class="flex items-center text-gray-500 text-xs">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Secure Payment
            </div>
            <div class="flex items-center text-gray-500 text-xs">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Verified Nonprofit
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getStripePromise } from '@/utils/stripeClient';
  import { createDonationIntent } from '@/services/donation_service';
  
  export default {

    name: 'DonationModal',

    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      shelterId: {
        type: Number,
        required: true
      },
      shelterName: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        step: 'amount',
        donationAmounts: [10, 20, 50, 100],
        selectedAmount: 20,
        customAmount: '',
        message: '',
        isAnonymous: false,
        isProcessing: false,
        stripeElements: null,
        paymentElement: null
      };
    },
    watch: {
      isOpen(val) {
        if (val) {
          this.step = 'amount';
          this.selectedAmount = 20;
          this.customAmount = '';
          this.message = '';
          this.isAnonymous = false;
          this.isProcessing = false;
        }
      }
    },
    methods: {

      close() {
        this.$emit('close');
      },
      
      async goToPayment() {
        if (!this.selectedAmount || this.selectedAmount <= 0) return;

        try {
          const donationData = {
            shelterId: this.shelterId,
            amount: this.selectedAmount,
            message: this.message,
            isAnonymous: this.isAnonymous,
            userId: localStorage.getItem('Id') || null
          };

          const { clientSecret } = await createDonationIntent(donationData);

          this.step = 'payment';

          this.$nextTick(() => {
            this.initializeStripe(clientSecret);
          });
        } catch (error) {
          console.error('Error creating donation intent:', error);
          alert('There was an error setting up your donation. Please try again.');
        }
      },
      

      async initializeStripe(clientSecret) {
        try {
          const stripe = await getStripePromise();
          
          const options = {
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#ef4444',
              },
            },
          };
          
          this.stripeElements = stripe.elements(options);
          
          this.paymentElement = this.stripeElements.create('payment');
          this.paymentElement.mount('#payment-element');
        } catch (error) {
          console.error('Error initializing Stripe:', error);
          alert('There was an error initializing the payment form. Please try again.');
          this.step = 'amount';
        }
      },
      
      async processPayment() {
        if (!this.stripeElements) {
          alert('Error processing payment. Please try again.');
          return;
        }
        
        this.isProcessing = true;
        
        try {
          const stripe = await getStripePromise();
          const { error } = await stripe.confirmPayment({
            elements: this.stripeElements,
            confirmParams: {
              return_url: `${window.location.origin}/donation-complete`,
            },
            redirect: 'if_required',
          });
          
          if (error) {
            console.error('Payment error:', error);
            this.isProcessing = false;
            return;
          }
          
          this.step = 'confirmation';
        } catch (error) {
          console.error('Payment processing error:', error);
        } finally {
          this.isProcessing = false;
        }
      }
    }
  }
  </script>