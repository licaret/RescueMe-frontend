<template>
    <IntroNavbar />
    <div class="max-w-6xl mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <div class="relative inline-block mb-8">
          <h2 class="text-xl text-gray-600 mb-2">WHO ARE WE?</h2>
          <div class="flex items-center justify-center">
            <h1 class="text-6xl font-bold text-gray-300">RESCUE</h1>
            <div class="relative mx-1">
              <img 
                src="@/assets/about-us-dog.png" 
                alt="Dog Portrait" 
                class="h-24 w-24 object-cover rounded-full border-4 border-white"
                onerror="this.src='https://via.placeholder.com/100'"
              />
            </div>
            <h1 class="text-6xl font-bold text-red-600">ME</h1>
          </div>
          <p class="text-sm text-gray-600 mt-2">HELPING ANIMALS FIND LOVING HOMES!</p>
        </div>
      </div>
  
      <div class="grid md:grid-cols-2 gap-16 mb-20">
        <!-- Our Mission and Purpose -->
        <div>
          <h2 class="text-2xl font-bold text-red-600 mb-6">OUR MISSION AND PURPOSE</h2>
          <p class="text-gray-700">
            RescueMe simplifies pet adoption by connecting shelters with loving people. Our mission is to help homeless animals find forever homes and build a community of caring individuals.
          </p>
        </div>
  
        <!-- How It Works -->
        <div>
          <h2 class="text-2xl font-bold text-red-600 mb-6">HOW IT WORKS</h2>
          <p class="text-gray-700">
            RescueMe brings shelters and adopters together in one simple, user-friendly space. Shelters add detailed profiles of animals in need, and prospective adopters can browse through them, learning about each animal's story and personality. With a few clicks, they can connect with shelters, ask questions, and start the adoption process.
          </p>
        </div>
      </div>
  
      <!-- Stats Section -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        <div class="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">300+</h3>
          <p class="text-gray-600 uppercase text-sm font-medium">Adoptions</p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">1,000+</h3>
          <p class="text-gray-600 uppercase text-sm font-medium">Rescues</p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">1,000+</h3>
          <p class="text-gray-600 uppercase text-sm font-medium">Available Pets</p>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">28</h3>
          <p class="text-gray-600 uppercase text-sm font-medium">Shelters</p>
        </div>
      </div>
  
      <!-- Our Story -->
      <div class="mb-20">
        <h2 class="text-2xl font-bold text-red-600 mb-6">OUR STORY</h2>
        <div class="bg-white p-8 rounded-xl shadow-md">
          <p class="text-gray-700">
            RescueMe was born out of a deep love for animals and the desire to help shelters find more efficient ways to connect pets with with families who will cherish them. After seeing the struggle shelters endure, we knew there had to be a better way. That's why we created a platform that not only makes adoption easier but also empowers people to change lives, both for the animals and themselves.
          </p>
        </div>
      </div>
  
      <!-- Testimonials Section -->
      <div class="mb-20">
        <h2 class="text-2xl font-bold text-red-600 mb-8 text-center">WHAT ADOPTERS SAY</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img src="@/assets/successfulstory1.jpeg" alt="Adopter" class="w-full h-full object-cover" 
                  onerror="this.src='https://via.placeholder.com/64?text=A'"/>
              </div>
              <div>
                <p class="font-medium text-gray-800">Andreea S.</p>
                <div class="text-yellow-400 flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "The process was so simple! In just a few days, I found Max and he has been the perfect addition to our family. Thank you RescueMe for connecting us!"
            </p>
            <div class="flex items-center">
              <img 
                src="@/assets/adopted-dog.jpg" 
                alt="Adopted dog Max" 
                class="w-16 h-16 object-cover rounded-lg"
                onerror="this.src='https://via.placeholder.com/64?text=Dog'"
              />
              <p class="text-sm text-gray-500 ml-3">Adopted Max in 2022</p>
            </div>
          </div>
  
           <!-- Testimonial 2 -->
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img src="@/assets/successfulstory2.jpg" alt="Shelter Manager" class="w-full h-full object-cover"
                  onerror="this.src='https://via.placeholder.com/64?text=C'"/>
              </div>
              <div>
                <p class="font-medium text-gray-800">Cristian M.</p>
                <div class="text-yellow-400 flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "As a shelter manager, RescueMe has been a game-changer. Our adoption rates have doubled since joining, and we're able to reach so many more potential adopters."
            </p>
            <div class="flex items-center">
              <img 
                src="@/assets/successfulstory3.jpeg" 
                alt="Happy Tails Shelter" 
                class="w-16 h-16 object-cover rounded-lg"
                onerror="this.src='https://via.placeholder.com/64?text=Shelter'"
              />
              <p class="text-sm text-gray-500 ml-3">Happy Tails Shelter</p>
            </div>
          </div>
  
          <!-- Testimonial 3 -->
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img src="@/assets/successfulstory2.jpg" alt="Adopter" class="w-full h-full object-cover" 
                  onerror="this.src='https://via.placeholder.com/64?text=D'"/>
              </div>
              <div>
                <p class="font-medium text-gray-800">Diana P.</p>
                <div class="text-yellow-400 flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "I was hesitant about adoption until I found RescueMe. The detailed profiles helped me find a pet that matched my lifestyle perfectly. Luna and I couldn't be happier!"
            </p>
            <div class="flex items-center">
              <img 
                src="@/assets/adopted-dog.jpg" 
                alt="Adopted cat Luna" 
                class="w-16 h-16 object-cover rounded-lg"
                onerror="this.src='https://via.placeholder.com/64?text=Cat'"
              />
              <p class="text-sm text-gray-500 ml-3">Adopted Luna in 2023</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Join Us Section -->
      <div class="bg-gray-100 rounded-xl p-8 shadow-md text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">JOIN OUR MISSION</h2>
        <p class="text-gray-700 max-w-3xl mx-auto mb-8">
          Whether you're looking to adopt, volunteer, or partner with us as a shelter, we welcome you to become part of our community dedicated to helping animals find their forever homes.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium inline-block transition-colors">Adopt a Pet</a>
          <a href="#" class="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-medium inline-block transition-colors">Partner as a Shelter</a>
          <a href="#" class="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium inline-block transition-colors">Volunteer with Us</a>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </template>
  


  <script>
  import IntroNavbar from '@/components/IntroNavbar.vue';
  import Footer from '@/components/Footer.vue';

  export default {
    name: 'AboutUs',
    components: {
      IntroNavbar,
      Footer
    }
  }
  </script>
  

  
  <style scoped>
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
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .grid > * {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .grid > *:nth-child(1) { animation-delay: 0.1s; }
  .grid > *:nth-child(2) { animation-delay: 0.2s; }
  .grid > *:nth-child(3) { animation-delay: 0.3s; }
  .grid > *:nth-child(4) { animation-delay: 0.4s; }
  </style>