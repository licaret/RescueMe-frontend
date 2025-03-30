<template>
  <IntroNavbar />
  <section class="bg-white dark:bg-gray-900">
      <div class="flex flex-col items-center px-6 pt-8 pb-16 mx-auto lg:pt-0 lg:pb-8">
          <div class="w-full pt-12 sm:pt-16">
              <a 
                  @click.prevent="navigateToLogin"
                  class="mb-8 text-sm text-gray-600 hover:text-red-600 font-medium dark:text-gray-300 dark:hover:text-red-500 block w-full sm:max-w-md mx-auto transition-colors duration-200"
              >
                  ← Return to Login
              </a>

              <div class="w-full bg-white rounded-2xl shadow-lg dark:border border-gray-100 sm:max-w-md mx-auto xl:p-0 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                  <div class="p-6 pb-12 space-y-4 md:space-y-6 sm:p-8 sm:pb-12">
                      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl dark:text-white">
                          Reset Password
                      </h1>

                      <div v-if="message" 
                          :class="{'bg-green-100 text-green-700 border-l-4 border-green-500': success, 'bg-red-100 text-red-700 border-l-4 border-red-500': !success}" 
                          class="px-4 py-3 rounded relative mb-4">
                          {{ message }}
                      </div>

                      <p class="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                          Enter your account email address and we will send you an email to reset your password.
                      </p>

                      <form @submit.prevent="sendResetLink" class="space-y-4 md:space-y-6 mb-8">
                          <!-- Email field -->
                          <div>
                              <label for="email" class="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Your email</label>
                              <div class="relative">
                                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                      </svg>
                                  </div>
                                  <input 
                                      v-model="email" 
                                      @input="validateEmail" 
                                      type="email" 
                                      name="email" 
                                      id="email" 
                                      :class="{
                                          'border-red-500 focus:ring-red-500 focus:border-red-500': emailError,
                                          'border-gray-300 focus:ring-red-500 focus:border-red-500': !emailError
                                      }"
                                      class="bg-gray-50 border rounded-full block w-full pl-10 p-2.5 transition-colors duration-200 ease-in-out text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                      placeholder="name@company.com" 
                                      required
                                  >
                              </div>
                              <p v-if="emailError" class="text-sm text-red-600 mt-2">{{ emailError }}</p>
                          </div>
                          
                          <!-- Reset button -->
                          <button 
                              type="submit" 
                              class="w-full text-white bg-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-full text-sm px-5 py-3 text-center transition-colors duration-200 ease-in-out transform hover:translate-y-[-1px] shadow-sm hover:shadow dark:bg-red-600 dark:hover:bg-red-700"
                              :disabled="isLoading"
                          >
                              <span v-if="isLoading" class="inline-flex items-center">
                                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Sending...
                              </span>
                              <span v-else>Get reset link</span>
                          </button>
                      </form>

                      <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                          Don't have an account yet? 
                          <a 
                              @click.prevent="navigateToSignUp" 
                              class="font-medium text-red-600 hover:text-red-700 transition-colors duration-200 hover:underline dark:text-red-500"
                          >
                              Sign up
                          </a>
                      </p>
                  </div>
              </div>
          </div>
      </div>
  </section>
</template>

<script>
import IntroNavbar from "@/components/IntroNavbar.vue";
import { requestPasswordReset } from "@/services/user_service";

export default {
components: {
  IntroNavbar, 
},
data() {
  return {
    email: '',
    emailError: "",
    message: "",
    success: true,
    isLoading: false
  }
},
methods: {
  navigateToLogin() {
    this.$router.push('/login'); 
  },

  navigateToSignUp() {
    this.$router.push('/signup'); 
  },

  validateEmail() {
    const emailRegex = /^(?!.*\s)[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(this.email)) {
      this.emailError = "Invalid email format. Please include '@' and a domain.";
    } else {
      this.emailError = ""; 
    }
  },

  async sendResetLink() {
    if (this.emailError) return;
    
    this.isLoading = true;

    try {
      const response = await requestPasswordReset(this.email);
      this.message = "If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.";
      this.success = true;
      this.email = "";
    } catch (error) {
      console.error("Error: ", error);
      this.message = "An error occurred while processing your request. Please try again later.";
      this.success = false;
    } finally {
      this.isLoading = false;
    }
  }
}
};
</script>

<style>
section, section * {
user-select: none;
cursor: default;
}

input, textarea, select, button {
user-select: auto;
cursor: text;
}

button, a {
cursor: pointer;
user-select: none;
}

input:focus, 
button:focus,
button:active,
button:focus-visible {
outline: none !important;
box-shadow: none !important;
}

button[type="button"]:hover svg {
color: #dc2626;
}

@media (prefers-color-scheme: dark) {
button[type="button"]:hover svg {
  color: #f87171; 
}
}
</style>