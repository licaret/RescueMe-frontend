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

                    <div v-if="message" 
                        :class="{'bg-green-100 text-green-700 border border-green-400': success, 'bg-red-100 text-red-700 border border-red-400': !success}" 
                        class="px-4 py-3 rounded relative mb-4">
                        {{ message }}
                    </div>

                    <p class="text-gray-600 mb-8 text-sm">
                        Enter your account email address and we will send you an email to reset your password.
                    </p>

                    <form @submit.prevent="sendResetLink" class="space-y-4 md:space-y-6 mb-8">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input 
                                v-model="email" 
                                @input="validateEmail" 
                                type="email" 
                                name="email" 
                                id="email" 
                                :class="{
                                    'border-red-600 focus:ring-red-600 focus:border-red-600': emailError,
                                    'border-gray-300 focus:ring-primary-600 focus:border-primary-600': !emailError
                                }"
                                class="bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="name@company.com" 
                                required
                            >
                            <p v-if="emailError" class="text-sm text-red-600 mt-2">{{ emailError }}</p>
                        </div>
                        <button 
                            type="submit" 
                            class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                            Get reset link
                        </button>
                    </form>

                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don't have an account yet? 
                        <a @click.prevent="navigateToSignUp" class="font-medium text-red-600 hover:underline dark:text-red-500">
                            Sign up
                        </a>
                    </p>
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
      success: true
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

      const response = await requestPasswordReset(this.email);
      this.message = "If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.";
      this.success = true;
      this.email = "";

      if (!this.success) {
        console.error("Error: ", response.message);
      }
    }

  }
};
</script>