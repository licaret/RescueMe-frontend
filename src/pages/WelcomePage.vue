<!-- WelcomePage.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-10">
      <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-600">Loading...</p>
    </div>
    
    <!-- Show approval message -->
    <div v-else-if="showWelcome" class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Congratulations! Your Shelter Has Been Approved!</h1>
        <p class="text-gray-600 mb-6">
          Your shelter account has been verified and approved by our administrators.
          You can now start adding animals and managing your shelter profile.
        </p>
        
        <div class="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Ready to start helping animals?</h2>
          <p class="text-gray-600 mb-6">
            Your shelter dashboard is now available where you can add animals, manage your shelter profile, and more.
          </p>
          
          <button 
            @click="acknowledgeAndGoToDashboard" 
            class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
    
    <!-- If no welcome needed, redirect -->
    <div v-else>
      <p class="text-center text-gray-600">Redirecting to dashboard...</p>
    </div>
  </div>
</template>

<script>
import { checkWelcomeStatus, acknowledgeWelcome } from '@/services/admin_dashboard_service';

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
      const shelterId = this.getCurrentShelterId();
      
      if (!shelterId) {
        this.goToDashboard();
        return;
      }
      
      // Check if welcome should be shown
      const response = await checkWelcomeStatus(shelterId);
      this.showWelcome = response.showWelcome;
      
      this.loading = false;
      
      // If welcome shouldn't be shown, redirect to dashboard
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
        const shelterId = this.getCurrentShelterId();
        await acknowledgeWelcome(shelterId);
      } catch (error) {
        console.error('Error acknowledging welcome:', error);
      }
      
      this.goToDashboard();
    },
    goToDashboard() {
      this.$router.push('/shelter-dashboard');
    },
    getCurrentShelterId() {
      return localStorage.getItem('shelterId') || localStorage.getItem('Id');
    }
  }
}
</script>