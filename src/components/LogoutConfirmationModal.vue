<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Modal backdrop with blur effect -->
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" @click="closeModal"></div>
      
      <!-- Modal content -->
      <div class="bg-white rounded-2xl shadow-2xl w-96 p-8 z-10 relative transform transition-all duration-300 ease-in-out scale-100">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="text-center mb-6">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Are you sure you want to logout?</h3>
          <p class="text-gray-500 mt-3">You will be redirected to the login page.</p>
        </div>
        
        <div class="flex justify-center space-x-4 mt-8">
          <button 
            @click="closeModal"
            class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-3xl font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-200 shadow-sm"
          >
            Cancel
          </button>
          <button 
            @click="confirmLogout"
            class="px-5 py-2.5 bg-red-600 text-white rounded-3xl font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LogoutConfirmationModal',
    
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    
    methods: {
      closeModal() {
        this.$emit('close');
      },
      
      confirmLogout() {
        this.$emit('confirm');
      }
    }
  };
  </script>