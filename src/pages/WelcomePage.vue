<template>
  <section class="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-12 px-4">
    <!-- Loading state with spinner -->
    <div v-if="loading" class="text-center py-10">
      <div class="flex flex-col items-center">
        <div class="relative">
          <div class="h-24 w-24 rounded-full border-t-4 border-b-4 border-red-600 animate-spin"></div>
          <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-gray-200 opacity-20"></div>
        </div>
        <p class="mt-6 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
    
    <!-- Show approval message -->
    <div v-else-if="showWelcome" class="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-3xl w-full mx-auto transition-all duration-500 transform hover:shadow-2xl">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8 animate__animated animate__bounceIn">
          <svg class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-400 text-transparent bg-clip-text">
          Congratulations! Your Shelter Has Been Approved!
        </h1>
        
        <p class="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
          Your shelter account has been verified and approved by our administrators.
          You can now start managing your shelter profile and helping animals find loving homes.
        </p>
        
        <!-- Features section -->
        <div class="grid md:grid-cols-3 gap-6 mb-10">
          <div class="bg-red-50 p-6 rounded-2xl border border-red-100 transition-all duration-300 hover:shadow-md">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">Add Animals</h3>
            <p class="text-gray-600 text-sm">Start adding animals to your shelter profile that need to find a home.</p>
          </div>
          
          <div class="bg-red-50 p-6 rounded-2xl border border-red-100 transition-all duration-300 hover:shadow-md">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">Manage Adoptions</h3>
            <p class="text-gray-600 text-sm">Track and oversee the adoption process for your animals.</p>
          </div>
          
          <div class="bg-red-50 p-6 rounded-2xl border border-red-100 transition-all duration-300 hover:shadow-md">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">Update Profile</h3>
            <p class="text-gray-600 text-sm">Keep your shelter information up to date for potential adopters.</p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-red-50 to-red-100 p-8 rounded-2xl mb-8 relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Ready to start helping animals?</h2>
            <p class="text-gray-700 mb-6">
              Your shelter dashboard is now available where you can add animals, manage your shelter profile, and connect with potential adopters.
            </p>
            
            <button 
              @click="acknowledgeAndGoToDashboard" 
              class="inline-flex items-center px-8 py-4 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <span>Go to Dashboard</span>
              <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-red-200 opacity-50"></div>
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 rounded-full bg-red-200 opacity-50"></div>

        </div>
        
        <p class="text-gray-500 text-sm">
          Have questions? Contact our support team at <a href="mailto:rescueme.care@gmail.com" class="text-red-600 hover:underline">rescueme.care@gmail.com</a>
        </p>
      </div>
    </div>
    
    <!-- If no welcome needed -->
    <div v-else class="text-center py-10">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 text-lg">Redirecting to dashboard...</p>
      </div>
    </div>
  </section>
</template>



<script>
import { checkWelcomeStatus, acknowledgeWelcome } from '@/services/shelter_profile_service.js';

export default {
  name: 'WelcomePage',

  data() {
    return {
      loading: true,
      showWelcome: false
    }
  },

  async mounted() {
    try {
      const Id = this.getCurrentId();
      
      if (!Id) {
        this.goToDashboard();
        return;
      }
      
      const response = await checkWelcomeStatus(Id);
      this.showWelcome = response.showWelcome;
      
      this.loading = false;
      
      if (!this.showWelcome) {
        this.goToDashboard();
      }
    } catch (error) {
      console.error('Error checking welcome status:', error);
      this.loading = false;
      this.goToDashboard();
    }
  },


  methods: {

    async acknowledgeAndGoToDashboard() {
      try {
        const Id = this.getCurrentId();
        await acknowledgeWelcome(Id);
      } catch (error) {
        console.error('Error acknowledging welcome:', error);
      }
      
      this.goToDashboard();
    },

    goToDashboard() {
      this.$router.push('/shelter-dashboard/');
    },

    getCurrentId() {
      return localStorage.getItem('Id') || localStorage.getItem('Id');
    }
  }
}
</script>



<style scoped>
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate__animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animate__bounceIn {
  animation-name: bounceIn;
  animation-duration: 0.75s;
}

@keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

section, section * {
  user-select: none;
  -webkit-user-drag: none;
}

button, a {
  cursor: pointer;
}
</style>