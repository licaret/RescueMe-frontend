<template>
  <section class="bg-white dark:bg-gray-900">
      <div class="flex flex-col items-center px-6 pt-8 pb-16 mx-auto lg:pt-0 lg:pb-8">
          <div class="w-full pt-12 sm:pt-16">
              <div class="w-full bg-white rounded-2xl shadow-lg dark:border border-gray-100 sm:max-w-md mx-auto xl:p-0 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
                  <div class="p-6 pb-12 space-y-4 md:space-y-6 sm:p-8 sm:pb-12">
                      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl dark:text-white">
                          Sign in to your account
                      </h1>

                      <div v-if="loginError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {{ loginError }}
                      </div>

                      <!-- Email field -->
                      <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6 mb-8">
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
                              class="bg-gray-50 border rounded-full block w-full pl-10 p-2.5 transition-colors duration-200 ease-in-out text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-red-500"
                              placeholder="name@company.com" 
                              required
                            >
                          </div>
                          <p v-if="emailError" class="text-sm text-red-600 mt-2">{{ emailError }}</p>
                        </div>
                        
                        <!-- Password field -->
                        <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Password</label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                            <input 
                              v-model="password" 
                              :type="showPassword ? 'text' : 'password'" 
                              name="password" 
                              id="password" 
                              placeholder="••••••••" 
                              class="bg-gray-50 border border-gray-300 text-gray-900 rounded-full block w-full pl-10 p-2.5 transition-colors duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-red-500 focus:border-red-500 dark:focus:border-red-500" 
                              required
                            >
                            <button 
                              type="button"
                              @click="togglePasswordVisibility"
                              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 cursor-pointer focus:outline-none"
                            >
                            <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            </button>
                          </div>
                          <p v-if="passwordError" class="text-sm text-red-600 mt-2">{{ passwordError }}</p>
                        </div>
                        
                        <!-- Forgot password -->
                        <div class="flex items-center justify-between">
                          <a 
                            @click.prevent="navigateToRequestResetPassword" 
                            class="text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200 hover:underline dark:text-red-500"
                          >
                            Forgot password?
                          </a>
                        </div>
                        
                        <!-- Sign in button -->
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
                            Signing in...
                          </span>
                          <span v-else>Sign In</span>
                        </button>
                        
                        <!-- Sign up link -->
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                          Don't have an account yet? 
                          <a 
                            @click.prevent="navigateToSignUp" 
                            class="font-medium text-red-600 hover:text-red-700 transition-colors duration-200 hover:underline dark:text-red-500"
                          >
                            Sign up
                          </a>
                        </p>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </section>
</template>

<script>
import {login} from '@/services/user_service.js';
import {getShelterProfile, checkWelcomeStatus } from "@/services/shelter_profile_service";

export default {

  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loginError:"",
      emailError: "",
      passwordError: "",
      successMessage: "",
      isLoading: false, //spinner pt cand apesi pe Sign In
    };
  },

  methods: {

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    navigateToSignUp() {
      this.$router.push('/signup'); 
    },

    navigateToRequestResetPassword() {
      this.$router.push('/request-reset-password'); 
    },

    validateEmail() {
      const emailRegex = /^(?!.*\s)[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(this.email)) {
        this.emailError = "Invalid email format. Please include '@' and a domain.";
      } else {
        this.emailError = ""; 
      }
    },

    async handleLogin() {
      this.loginError = "";
      this.successMessage = "";
      this.isLoading = true; 
      this.validateEmail();

      if (this.emailError || this.passwordError) {
        this.isLoading = false; 
        return; 
      }

      try {
        const data = await login(this.email, this.password);

        //ADMIN
        if (data.role === "ADMIN") {
            this.successMessage = "Admin login successful! Redirecting to dashboard...";
            setTimeout(() => {
                this.$router.push("/admin-dashboard");
            }, 2000);
            return;
        }

        //SHELTER
        if (data.role === "SHELTER") {
          try {
            const profileData = await getShelterProfile(data.id);
            const profileStatus = profileData.status; 
            
            localStorage.setItem("shelterProfileStatus", profileStatus);
            
            console.log("Shelter login: Profile status =", profileStatus);
            
            if (profileStatus === 'NEW' || profileStatus === 'DRAFT') {
              this.successMessage = "Login successful! Redirecting to complete your shelter profile...";
              setTimeout(() => {
                this.$router.push("/shelter-profile-completion");
              }, 2000);
            } else if (profileStatus === 'PENDING_APPROVAL') {
              this.successMessage = "Login successful! Your profile is pending approval...";
              setTimeout(() => {
                this.$router.push("/shelter-profile-completion");
              }, 2000);
            } else if (profileStatus === 'APPROVED') {
                // FIRST LOGIN CHACK
                try {
                  const welcomeData = await checkWelcomeStatus(data.id);
                  console.log("Welcome check response:", welcomeData);
                  
                  if (welcomeData.showWelcome) {
                    this.successMessage = "Login successful! Redirecting to dashboard...";
                    setTimeout(() => {
                      this.$router.push("/welcome");
                    }, 2000);
                  } else {
                    this.successMessage = "Login successful! Redirecting to dashboard...";
                    setTimeout(() => {
                      this.$router.push("/shelter-dashboard/");
                    }, 2000);
                  }
                } catch (welcomeError) {
                  console.error("Error checking welcome status:", welcomeError);
                  this.successMessage = "Login successful! Redirecting to dashboard...";
                  setTimeout(() => {
                    this.$router.push("/shelter-dashboard/");
                  }, 2000);
                }
              } else {
              this.successMessage = "Login successful! Redirecting to dashboard...";
              setTimeout(() => {
                this.$router.push("/shelter-dashboard/");
              }, 2000);
            }
          } catch (profileError) {
            console.error("Error fetching shelter profile:", profileError);
            this.successMessage = "Login successful! Redirecting...";
            setTimeout(() => {
              this.$router.push("/shelter-profile-completion");
            }, 2000);
          }
        } else {
          // ADOPTER
          this.successMessage = "Login successful! Redirecting...";
          setTimeout(() => {
            this.$router.push("/home");
          }, 2000);
        }
      } catch (error) {
        this.loginError = "Invalid email or password. Please try again or reset your password.";
        this.isLoading = false;
      }
    }

  },
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