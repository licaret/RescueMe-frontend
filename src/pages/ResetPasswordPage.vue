<template>
  <IntroNavbar />
  <section class="bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8 flex flex-col items-center">
      <div class="w-full sm:max-w-md">
        <a 
          @click.prevent="navigateToLogin"
          class="mb-8 text-sm text-gray-600 hover:text-red-600 font-medium dark:text-gray-300 dark:hover:text-white block"
        >
          ← Return to Login
        </a>

        <div class="p-6 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl dark:text-white mb-4">
            Reset Password
          </h1>

          <div 
            v-if="message" 
            :class="{
              'bg-green-100 text-green-700 border border-green-400': success, 
              'bg-red-100 text-red-700 border border-red-400': !success
            }" 
            class="px-4 py-3 rounded relative mb-4"
          >
            {{ message }}
          </div>

          <form @submit.prevent="resetPassword" class="space-y-4 md:space-y-6">
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                New Password
              </label>
              <div class="relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  @input="validatePassword($event.target.value)"
                  :class="{
                    'border-red-600 focus:ring-red-600 focus:border-red-600': passwordError,
                    'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !passwordError,
                  }"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  required
                >
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                  <svg 
                    v-if="showPassword"
                    class="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg 
                    v-else
                    class="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="passwordError" class="mt-2 text-sm text-red-600">{{ passwordError }}</p>
            </div>

            <div>
              <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <div class="relative">
                <input 
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  :class="{
                    'border-red-600 focus:ring-red-600 focus:border-red-600': confirmPasswordError,
                    'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !confirmPasswordError,
                  }"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                  required
                  @input="validateConfirmPassword"
                >
                <button 
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                  <svg 
                    v-if="showConfirmPassword"
                    class="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg 
                    v-else
                    class="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="confirmPasswordError" class="mt-2 text-sm text-red-600">{{ confirmPasswordError }}</p>
            </div>

            <button 
              type="submit"
              class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

  
<script>
import { resetPassword } from "@/services/user_service";
import { useRoute, useRouter } from "vue-router";
import IntroNavbar from "@/components/IntroNavbar.vue";

export default {

  components: {
    IntroNavbar, 
  },

  data() {
    return {
      password: "",
      confirmPassword: "",
      message: "",
      success: false,
      showPassword: false,
      showConfirmPassword: false,
      passwordError: "",
      confirmPasswordError: ""
    };
  },

  mounted() {
      const token = this.$route.query.token;
      console.log("Component mounted. Token in URL:", token);
      if (!token) {
          this.message = "Missing reset token. Please use the link from your email.";
          this.success = false;
      }
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    return { route, router };
  },

  methods: {
    
    validatePassword(password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
      if (!passwordRegex.test(password)) {
        this.passwordError = "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      } else {
        this.passwordError = "";
      }
      this.validateConfirmPassword();
    },


    validateConfirmPassword() {
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = "Passwords do not match.";
      } else {
        this.confirmPasswordError = "";
      }
    },

    navigateToLogin() {
      this.$router.push('/login'); 
      },

    async resetPassword(event) {
      console.log("Form submission event:", event);
      
      if (this.passwordError || this.confirmPasswordError) {
          console.log("Validation errors prevent submission");
          return;
      }

      try {
          const token = this.$route.query.token;
          console.log("About to call API with token:", token);
          
          if (!token) {
          this.message = "Missing reset token. Please use the link from your email.";
          this.success = false;
          return;
          }
          
          const response = await resetPassword(token, this.password);
          console.log("API response:", response);
          
          if (response && response.message) {
              this.message = response.message; 
              this.success = true;

              setTimeout(() => this.$router.push("/login"), 3000);
          } else {
              this.message = "Unexpected response from server";
              this.success = false;
          }
      } catch (error) {
          console.error("Reset password error:", error);
          console.log("Error response:", error.response);
          this.message = error.response?.data?.message || "An error occurred. Please try again.";
          this.success = false;
      }
    }
  },
};
</script>