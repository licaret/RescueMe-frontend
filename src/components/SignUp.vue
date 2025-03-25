<template>
  <section class="bg-white dark:bg-gray-900">
    <div 
      v-if="showSuccessToast" 
      class="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center transition-all duration-300 ease-in-out z-50"
    >
      <div class="flex-shrink-0 mr-2">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        {{ successMessage }}
      </div>
      <button @click="showSuccessToast = false" class="ml-4 text-gray-500 hover:text-gray-800">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="min-h-screen flex flex-col items-center px-6 py-8 pb-16 mx-auto lg:py-0 lg:pb-16">
      <div class="w-full pt-8">
        <div class="flex justify-center space-x-4 mb-6">
          <button
            :class="{
              'text-red-600 font-bold': isAdopter,
              'text-gray-500': !isAdopter
            }"
            @click="isAdopter = true"
            class="text-sm md:text-base"
          >
            Adopter
          </button>
          <button
            :class="{
              'text-red-600 font-bold': !isAdopter,
              'text-gray-500': isAdopter
            }"
            @click="isAdopter = false"
            class="text-sm md:text-base"
          >
            Shelter
          </button>
        </div>
        <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md mx-auto xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 pb-12 space-y-4 md:space-y-6 sm:p-8 sm:pb-12">
            <div  v-if="errorMessageEmail" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {{ errorMessageEmail }}
            </div>
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <!-- Adopter Form -->
            <form v-if="isAdopter" @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6 mb-8">
              <div>
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input 
                  v-model="formData.username"
                  @input="validateUsername"  
                  type="text" name="username" 
                  id="username" 
                  :class="{
                    'border-red-600 focus:ring-red-600 focus:border-red-600': usernameError ,
                    'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !usernameError,
                  }"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Your username" 
                  required="true"
                >
                <p v-if="usernameError" class="text-sm text-red-600 mt-2">
                  {{ usernameError }}
                </p>
              </div>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  v-model="formData.email"
                  @input="validateEmail" 
                  type="email"
                  name="email"
                  id="email"
                  :class="{
                    'border-red-600 focus:ring-red-600 focus:border-red-600': emailError || wrongFormatedEmail,
                    'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !emailError || !wrongFormatedEmail,
                  }"
                  class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  required
                >
                <p v-if="wrongFormatedEmail" class="text-sm text-red-600 mt-2">
                  {{ wrongFormatedEmail }}
                </p>
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <div class="relative">
                  <input 
                    v-model="formData.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••" 
                    @input="validatePassword($event.target.value)"
                    :class="{
                      'border-red-600 focus:ring-red-600 focus:border-red-600': passwordError,
                      'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !passwordError,
                    }"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    required="true"
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
                <label for="phone-number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                <input v-model="formData.phoneNumber" type="tel" name="phone-number" id="phone-number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+40 xxx xxx xxx" required="true">
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    id="terms" 
                    aria-describedby="terms" 
                    type="checkbox" 
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                    required="true"
                    />
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="font-light text-gray-500 dark:text-gray-300">
                    I accept the 
                    <a 
                      @click.prevent="showTermsModal = true" 
                      class="font-medium text-red-600 hover:underline dark:text-primary-500" 
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <TermsModal v-model="showTermsModal" />

              <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Adopter Account</button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? 
                <a @click.prevent="navigateToLogin" class="font-medium text-red-600 hover:underline dark:text-primary-500" >
                  Login here
                </a>
              </p>
            </form>
    
              <!-- Shelter Form -->
              <form v-else @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6 mb-8">
                <div>
                  <label for="shelter-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input 
                    v-model="formData.username" 
                    @input="validateUsername"
                    type="text" 
                    name="shelter-name" 
                    id="shelter-name" 
                    :class="{
                      'border-red-600 focus:ring-red-600 focus:border-red-600': usernameError,
                      'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !usernameError,
                    }"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Your Shelter's Name" 
                    required="true"
                  >
                  <p v-if="usernameError" class="text-sm text-red-600 mt-2">
                    {{ usernameError }}
                  </p>
                </div>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input 
                  v-model="formData.email" 
                  @input="validateEmail" 
                  type="email" 
                  name="email" 
                  id="email"
                  :class="{
                    'border-red-600 focus:ring-red-600 focus:border-red-600': wrongFormatedEmail,
                    'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !wrongFormatedEmail,
                  }" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="shelter@domain.com" 
                  required="true"
                  >
                  <p v-if="wrongFormatedEmail" class="text-sm text-red-600 mt-2">
                    {{ wrongFormatedEmail }}
                  </p>
                </div>
                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <div class="relative">
                    <input 
                      v-model="formData.password" 
                      :type="showPassword ? 'text' : 'password'" 
                      name="password" 
                      id="password" 
                      placeholder="••••••••" 
                      @input="validatePassword($event.target.value)"
                      :class="{
                        'border-red-600 focus:ring-red-600 focus:border-red-600': passwordError,
                        'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !passwordError,
                      }"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      required="true"
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
                  <label for="phone-number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                  <input v-model="formData.phoneNumber" type="tel" name="phone-number" id="phone-number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+40 xxx xxx xxx" required="true">
                </div>
                <div>
                  <label for="shelter-type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Shelter Type</label>
                  <select v-model="selectedShelterType" id="shelter-type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                    <option value="">Select Shelter Type</option>
                    <option v-for="type in shelterTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input 
                      id="terms" 
                      aria-describedby="terms" 
                      type="checkbox" 
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                      required="true"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="terms" class="font-light text-gray-500 dark:text-gray-300">
                      I accept the 
                      <a 
                        @click.prevent="showTermsModal = true" 
                        class="font-medium text-red-600 hover:underline dark:text-primary-500" 
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <TermsModal v-model="showTermsModal" />
                <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Shelter Account</button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? 
                  <a @click.prevent="navigateToLogin" class="font-medium text-red-600 hover:underline dark:text-primary-500" >
                    Login here
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
import { registerAdopter, registerShelter, checkEmailExists, checkUsernameExists } from "@/services/user_service";
import TermsModal from '@/components/TermsModal.vue';
import judete from "@/assets/judete.json";


export default {

  components: {
    TermsModal,
  },

  data() {
    return {
      isAdopter: true,
      showPassword: false,
      showTermsModal: false,
      emailExists: false,
      usernameExists: false,
      passwordError: "",
      emailError: false, //pt bordura rosie
      wrongFormatedEmail: "", // daca lipseste @ sau .
      errorMessageEmail: "", //pt invalid or taken email
      usernameError: "",
      formData: {
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
      selectedCounty: '',
      selectedCity: '',
      selectedShelterType: '',
      counties: [],
      cities: [],
      shelterTypes: [
        'Municipal Shelter',
        'Private Shelter',
        'Rescue Organization',
        'Foster-based Rescue',
        'Sanctuary',
        'Veterinary Clinic with Shelter',
        'Specialized Shelter (specific breeds/species)',
        'Emergency/Temporary Shelter'
      ],
      showSuccessToast: false,
      successMessage: "",
      toastTimeout: null,
    };
  },

  mounted() {
    this.counties = judete.judete;
  },

  methods: {

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    navigateToLogin() {
      this.$router.push('/login'); 
    },

    validateEmail() {
      this.errorMessageEmail = "";
      this.emailError = false; 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(this.formData.email)) {
        this.wrongFormatedEmail = "Invalid email format. Please include '@' and a domain.";
      } else {
        this.wrongFormatedEmail = ""; 
      }
    },

    validateUsername() {
      const usernameRegex = /^[^\s]{3,20}$/;
      if (!usernameRegex.test(this.formData.username)) {
        this.usernameError = "Username must be 3-20 characters long and cannot contain spaces.";
      } else {
        this.usernameError = ""; 
      }
    },


    validatePassword(password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
      if (!passwordRegex.test(password)) {
        this.passwordError = "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      } else {
        this.passwordError = "";
      }
    },


    handleCountyChange() {
      this.selectedCity = ""; 
      const selectedCountyObj = this.counties.find(county => county.auto === this.selectedCounty);
      if (selectedCountyObj) {
        this.selectedCountyName = selectedCountyObj.nume;  
        this.cities = selectedCountyObj.localitati.map(loc => loc.nume);
      } else {
        this.selectedCountyName = "";
        this.cities = [];
      }
    },


    showToast(message) {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      
      this.successMessage = message;
      this.showSuccessToast = true;
      
      this.toastTimeout = setTimeout(() => {
        this.showSuccessToast = false;
      }, 3000);
    },


    async handleSubmit() {
      this.emailError = false;
      this.wrongFormatedEmail = "";
      this.errorMessageEmail = ""; 
      this.usernameError = "";

      this.validateUsername();
      this.validateEmail();
      this.validatePassword(this.formData.password);

      if (this.usernameError || this.wrongFormatedEmail || this.passwordError) {
        return;
      }

      try {
        const emailExists = await checkEmailExists(this.formData.email); 
        if (emailExists) {
          this.emailError = true;
          this.errorMessageEmail = "Email is invalid or taken. Please login or click Forgot password to reset.";
          return; 
        }

        const usernameExists = await checkUsernameExists(this.formData.username); 
        if (usernameExists) {
          this.usernameError = "Username is already taken. Please choose a different one.";
          return; 
        }
        
        if (this.isAdopter) {
          const response = await registerAdopter({
            username: this.formData.username,
            email: this.formData.email,
            phoneNumber: this.formData.phoneNumber,
            password: this.formData.password,
          });
          this.showToast("Account created successfully! Redirecting to login...");
          setTimeout(() => {
            this.$router.push('/login');
          }, 3000);
        } else {
          try {
            const response = await registerShelter({
              username: this.formData.username,
              email: this.formData.email,
              phoneNumber: this.formData.phoneNumber,
              password: this.formData.password,
              shelterType: this.selectedShelterType,
            });

            console.log("Shelter registration response:", response);

            this.showToast("Account created successfully! Redirecting to complete your profile...");
            setTimeout(() => {
              this.$router.push('/shelter-profile-completion');
            }, 3000);
          } catch (error) {
            console.error('Shelter registration error:', error);
            this.errorMessageEmail = "An error occurred during registration. Please try again.";
          }
        }
      } catch (error) {
        console.error('Submit error:', error);
        this.errorMessageEmail = "An unexpected error occurred. Please try again later.";
      }
    }
    
  }
};
</script>



<style scoped>
  section, section * {
    user-select: none;
    cursor: default;
  }

  input, textarea, select, button {
    user-select: auto;
    cursor: text;
  }

  button {
    user-select: none;
    cursor: pointer;
  }

  a, .terms-button, .login-button {
    cursor: pointer;
  }
</style>