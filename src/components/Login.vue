<template>
  <section class="bg-white dark:bg-gray-900">
      <div class=" flex flex-col items-center px-6 py-8 pb-16 mx-auto lg:py-0 lg:pb-16">
          <div class="w-full pt-16">
              <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md mx-auto xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div class="p-6 pb-12 space-y-4 md:space-y-6 sm:p-8 sm:pb-12">
                      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl dark:text-white">
                          Sign in to your account
                      </h1>
                      <div v-if="loginError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {{ loginError }}
                      </div>
                      <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6 mb-8" action="#">
                        <div>
                          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                          <input v-model="email" @input="validateEmail" type="email" name="email" id="email" 
                            :class="{
                              'border-red-600 focus:ring-red-600 focus:border-red-600': emailError,
                              'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !emailError
                            }"
                            class="bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="name@company.com" required>
                          <p v-if="emailError" class="text-sm text-red-600 mt-2">{{ emailError }}</p>
                        </div>
                        <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <div class="relative">
                            <input 
                              v-model="password" 
                              :type="showPassword ? 'text' : 'password'" 
                              name="password" id="password" 
                              placeholder="••••••••" 
                              class="bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                              required>
                            <button 
                              type="button"
                              @click="togglePasswordVisibility"
                              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            </button>
                          </div>
                          <p v-if="passwordError" class="text-sm text-red-600 mt-2">{{ passwordError }}</p>
                        </div>
                          <div class="flex items-center justify-between">
                              <div class="flex items-start">
                                  <div class="flex items-center h-5">
                                      <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-red-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-red-600 dark:ring-offset-gray-800" >
                                  </div>
                                  <div class="ml-3 text-sm">
                                      <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                                  </div>
                              </div>
                              <a @click.prevent="navigateToRequestResetPassword" class="text-sm font-medium text-red-600 hover:underline dark:text-red-500">Forgot password?</a>
                          </div>
                          <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Sign in</button>
                          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                              Don't have an account yet? 
                              <a @click.prevent="navigateToSignUp" class="font-medium text-red-600 hover:underline dark:text-red-500" href="#">
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
import TermsModal from './TermsModal.vue';

export default {
  components: {
    TermsModal,
  },
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loginError:"",
      emailError: "",
      passwordError: "",
      successMessage: "",
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
      this.validateEmail();
      // this.validatePassword();

      if (this.emailError || this.passwordError) return; 

      if (this.email === "rescueme.care@gmail.com" && this.password === "ParolaAdmin!") {
        // Set admin data in localStorage
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("Id", "admin-id");
        localStorage.setItem("Username", "Admin");
        localStorage.setItem("Role", "ADMIN");
        
        // Show success message and redirect
        this.successMessage = "Admin login successful! Redirecting to dashboard...";
        setTimeout(() => {
          this.$router.push("/admin-dashboard");
        }, 2000);
        return; // Exit function early
      }

      try {
        const response = await fetch("http://localhost:8080/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid email or password.");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("Id", data.id); 
        localStorage.setItem("Username", data.username);
        localStorage.setItem("Role", data.role);

        if (data.role === "SHELTER") {
          localStorage.setItem("shelterUsername", data.username);
          localStorage.setItem("shelterId", data.id);
          
          // Get the shelter profile status directly from backend after login
          try {
            const profileResponse = await fetch(`http://localhost:8080/api/v1/shelters/${data.id}/profile`, {
              headers: {
                "Authorization": `Bearer ${data.token}`
              }
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              const profileStatus = profileData.status; // Use the actual status from the backend
              
              // Store the status in localStorage for reference
              localStorage.setItem("shelterProfileStatus", profileStatus);
              
              console.log("Shelter login: Profile status =", profileStatus);
              
              if (profileStatus === 'NEW' || profileStatus === 'DRAFT') {
                // Profile needs completion
                this.successMessage = "Login successful! Redirecting to complete your shelter profile...";
                setTimeout(() => {
                  this.$router.push("/shelter-profile-completion");
                }, 2000);
              } else if (profileStatus === 'PENDING_APPROVAL') {
                // Profile is pending approval
                this.successMessage = "Login successful! Your profile is pending approval...";
                setTimeout(() => {
                  this.$router.push("/shelter-profile-completion");
                }, 2000);
              } else if (profileStatus === 'APPROVED') {
                // Check if this is the first login after approval
                try {
                  const welcomeResponse = await fetch(`http://localhost:8080/api/v1/shelters/${data.id}/check-welcome`, {
                    headers: {
                      "Authorization": `Bearer ${data.token}`
                    }
                  });
                  
                  if (welcomeResponse.ok) {
                    const welcomeData = await welcomeResponse.json();
                    console.log("Welcome check response:", welcomeData);
                    
                    if (welcomeData.showWelcome) {
                      this.successMessage = "Login successful! Redirecting to dashboard...";
                      setTimeout(() => {
                        this.$router.push("/welcome");
                      }, 2000);
                    } else {
                      // No welcome needed
                      this.successMessage = "Login successful! Redirecting to dashboard...";
                      setTimeout(() => {
                        this.$router.push("/shelter-dashboard");
                      }, 2000);
                    }
                  } else {
                    // Fallback if welcome check fails
                    this.successMessage = "Login successful! Redirecting to dashboard...";
                    setTimeout(() => {
                      this.$router.push("/shelter-dashboard");
                    }, 2000);
                  }
                } catch (welcomeError) {
                  console.error("Error checking welcome status:", welcomeError);
                  // Fallback to dashboard
                  this.successMessage = "Login successful! Redirecting to dashboard...";
                  setTimeout(() => {
                    this.$router.push("/shelter-dashboard");
                  }, 2000);
                }
              } else {
                // Default case - go to dashboard
                this.successMessage = "Login successful! Redirecting to dashboard...";
                setTimeout(() => {
                  this.$router.push("/shelter-dashboard");
                }, 2000);
              }
            } else {
              // If can't get profile info, default to profile completion page
              this.successMessage = "Login successful! Redirecting...";
              setTimeout(() => {
                this.$router.push("/shelter-profile-completion");
              }, 2000);
            }
          } catch (profileError) {
            console.error("Error fetching shelter profile:", profileError);
            // Default to profile completion on error
            this.successMessage = "Login successful! Redirecting...";
            setTimeout(() => {
              this.$router.push("/shelter-profile-completion");
            }, 2000);
          }
        } else {
          // For non-shelter users
          this.successMessage = "Login successful! Redirecting...";
          setTimeout(() => {
            this.$router.push("/home");
          }, 2000);
        }
      } catch (error) {
        this.loginError = "Invalid email or password. Please try again or reset your password.";
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
</style>