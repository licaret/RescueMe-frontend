<template>
    <IntroNavbar/>
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-gray-800 text-3xl font-bold mb-4">Connect with Our Team</h1>
        <p class="text-gray-600 text-sm">
          Have questions about working or helping deliver service?<br>
          Reach out, and we'll be happy to assist you on your journey to making a difference for you in need.
        </p>
      </div>
  
      <!-- Contact Grid -->
      <div class="grid md:grid-cols-2 gap-10 mb-16">
        <!-- Contact Form -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-gray-800 text-xl font-semibold mb-6">Get in Touch with Us</h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <input 
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full name"
                  class="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <input 
                  v-model="form.email"
                  type="email"
                  placeholder="Enter your email"
                  class="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="About your message/request"
                  class="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
  
        <!-- Contact Details -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-gray-800 text-xl font-semibold mb-6">Contact Details</h2>
          <p class="text-sm text-gray-600 mb-6">
            Whether you're looking to apply, partner, or have questions,
            our friendly staff is here to help.
          </p>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p class="text-gray-800 font-medium">Mobile</p>
                <p class="text-gray-600">(+40) 743 060 122</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-gray-800 font-medium">Email</p>
                <p class="text-gray-600">rescueme.care@gmail.com</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-gray-800 font-medium">Availability</p>
                <p class="text-gray-600">09:00 am - 06:00 pm</p>
              </div>
            </div>
          </div>
  
          <!-- Social Media -->
          <div>
            <h3 class="text-gray-800 font-medium mb-4">Social Media:</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-600 hover:text-black">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-600 hover:text-black">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-600 hover:text-black">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <!-- FAQ Section with Image -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- FAQ List -->
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border rounded-lg shadow-md">
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span class="font-medium text-gray-800">{{ faq.question }}</span>
              <svg
                class="w-5 h-5 transform transition-transform duration-200"
                :class="{ 'rotate-180': faq.isOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="faq.isOpen" class="px-6 py-4 border-t">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="flex justify-center items-center">
          <img src="@/assets/faq-image.png" alt="Dog with phones" class="rounded-lg shadow-lg w-full md:w-3/4">
        </div>
      </div>
    </div>
    <Footer></Footer>
  </template>
  
  <script>
  import IntroNavbar from '@/components/IntroNavbar.vue';
  import Footer from '@/components/Footer.vue';

  export default {
    components: {
        IntroNavbar,
        Footer
    },
    data() {
      return {
        form: {
          fullName: '',
          email: '',
          message: ''
        },
        faqs: [
          {
            question: 'Can I donate directly to a specific shelter?',
            answer: 'Yes, you can donate directly to a specific shelter. Please contact us with your preferred shelter details.',
            isOpen: false
          },
          {
            question: 'How do I start the adoption process?',
            answer: 'To start, visit the "Available Pets" section and browse through the profiles. Once you find a pet you are interested in, click on their profile to learn more and contact the shelter directly through our platform to ask questions or arrange a visit. The shelter will guide you through the rest of the process from there!',
            isOpen: false
          },
          {
            question: 'What are the adoption requirements?',
            answer: 'Adoption requirements include being 18+ years old, having a stable living situation, and being able to provide proper care for the pet.',
            isOpen: false
          },
          {
            question: "Are there any fees associated with the adoption process?",
            answer: "Yes, adoption fees vary depending on the shelter and the type of pet. These fees cover vaccinations, spaying/neutering, and other medical costs to ensure the pet is healthy.",
            isOpen: false,
          },
          {
            question: "Can I return a pet if things don’t work out?",
            answer: "While we encourage you to fully consider the commitment before adoption, we understand that circumstances can change. Please contact the shelter for guidance on returning the pet.",
            isOpen: false,
          },
          {
            question: "Can I volunteer to help at the shelters?",
            answer: "Yes, most shelters welcome volunteers! You can contact the shelter directly through our platform or visit their profile to see available volunteer opportunities.",
            isOpen: false,
          }
        ]
      }
    },
    methods: {
      handleSubmit() {
        console.log('Form submitted:', this.form)
        this.form = {
          fullName: '',
          email: '',
          message: ''
        }
      },
      toggleFaq(index) {
        this.faqs[index].isOpen = !this.faqs[index].isOpen
      }
    }
  }
</script>



<style>
* {
  user-select: none; 
}

input, textarea {
  user-select: text; 
  pointer-events: auto;
  cursor: text; 
}

button {
  pointer-events: auto; 
  cursor: pointer; 
}

img {
  pointer-events: none; 
}


a {
  pointer-events: auto; 
  cursor: pointer; 
}
</style>





