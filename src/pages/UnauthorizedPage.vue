<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center border border-gray-100">
      <div class="mb-8">
        <div class="bg-red-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center">
          <svg class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
      <p class="text-gray-600 mb-8 text-lg">
        Oops! You don't have permission to access this page.
      </p>
      <div class="space-y-4">
        <button @click="goBack" class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Go Back
        </button>
        <button v-if="!isAuthenticated" @click="goToLogin" class="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200">
          Log In
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedPage',
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
      previousRoute: null
    };
  },
  created() {
    this.previousRoute = this.$route.query.from || null;
  },
  methods: {
    goBack() {
      if (this.previousRoute) {
        this.$router.push(this.previousRoute);
      } else if (window.history.length > 2) {
        this.$router.go(-1);
      } else {
        this.goToHome();
      }
    },
    goToHome() {
      if (this.isAuthenticated) {
        const userRole = localStorage.getItem('Role');
        
        if (userRole === 'ADOPTER') {
          this.$router.push('/available-pets');
        } else if (userRole === 'SHELTER') {
          this.$router.push('/shelter-dashboard');
        } else if (userRole === 'ADMIN') {
          this.$router.push('/admin-dashboard');
        } else {
          this.$router.push('/home');
        }
      } else {
        this.$router.push('/');
      }
    },
    goToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>