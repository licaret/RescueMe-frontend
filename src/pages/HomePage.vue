<template>
  <Navbar v-if="isLoggedIn" />
  <IntroNavbar v-else />
  <!-- Hero Section -->
  <section class="relative min-h-screen bg-gradient-to-b from-white via-white to-black">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between py-12 sm:py-16 lg:py-0">
      <!-- Image Container -->
      <div class="w-full lg:w-1/2 flex justify-center lg:justify-end relative mb-8 lg:mb-0 -ml-12">
        <img
          src="../assets/dog_hanging_in_blanket.png"
          alt="Dog wrapped in white fabric"
          class="w-full sm:w-3/4 lg:w-4/5 object-contain"
        >
      </div>

      <!-- Text Container -->
      <div class="w-full lg:w-1/2 text-center lg:text-right transform -translate-x-12">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          <span class="text-black opacity-70">WE<br/>ARE<br/>THE<br/>VOICE</span>
          <br/>
          <span class="text-red-700 opacity-90">FOR<br/>THE VOICELESS</span>
        </h1>
      </div>
    </div>
  </section>

 <!-- Quick Stats Section - New section with original colors -->
 <section class="py-10 bg-gray-100 border-y border-gray-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="bg-white p-4 rounded-2xl shadow-md">
          <p class="text-4xl font-bold text-red-700 mb-2">350+</p>
          <p class="text-gray-800">Animals Rescued</p>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-md">
          <p class="text-4xl font-bold text-red-700 mb-2">200+</p>
          <p class="text-gray-800">Successful Adoptions</p>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-md">
          <p class="text-4xl font-bold text-red-700 mb-2">50+</p>
          <p class="text-gray-800">Volunteers</p>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-md">
          <p class="text-4xl font-bold text-red-700 mb-2">10</p>
          <p class="text-gray-800">Years of Service</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Mission Statement-->
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center bg-gray-50 p-8 rounded-3xl shadow-lg">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p class="text-lg sm:text-xl text-gray-700 mb-8">
          We rescue, rehabilitate, and provide a chance for a happy life to abandoned animals. 
          Every animal deserves love, respect, and a permanent home.
        </p>
        <div class="flex justify-center">
          <button 
            @click="handleAdoptNow"
            class="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg"
          >
            Adopt Now
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Animals -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Animals Looking for a Home</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <PetCard
          v-for="pet in displayedPets"
          :key="pet.id"
          :pet="pet"
          :favorited="false"
        />
      </div>

      <div class="mt-12 text-center">
        <button
          @click="handleSeeAllAnimals"
          class="inline-block px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-md"
        >
          See All Animals
        </button>
      </div>
    </div>
  </section>


  <!-- Adoption Process -->
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Adoption Process</h2>

      <div class="relative">
        <!-- Connection line -->
        <div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2 z-0"></div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <!-- Step 1 -->
          <div class="bg-white rounded-3xl p-6 shadow-lg text-center">
            <div class="w-16 h-16 mx-auto bg-red-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Browse</h3>
            <p class="text-gray-700">Explore available pets and choose the one you feel a connection with.</p>
          </div>

          <!-- Step 2 -->
          <div class="bg-white rounded-3xl p-6 shadow-lg text-center">
            <div class="w-16 h-16 mx-auto bg-red-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Contact</h3>
            <p class="text-gray-700">Reach out to the shelter for more details or to arrange a visit.</p>
          </div>

          <!-- Step 3 -->
          <div class="bg-white rounded-3xl p-6 shadow-lg text-center">
            <div class="w-16 h-16 mx-auto bg-red-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Apply</h3>
            <p class="text-gray-700">Submit your adoption application and wait for approval from the shelter.</p>
          </div>

          <!-- Step 4 -->
          <div class="bg-white rounded-3xl p-6 shadow-lg text-center">
            <div class="w-16 h-16 mx-auto bg-red-600 text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">4</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Bring Them Home</h3>
            <p class="text-gray-700">Once approved, welcome your new furry friend into your family!</p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- Success Stories -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Successful Stories</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Story 1 -->
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-3xl shadow-md">
          <div class="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-200">
            <img src="../assets/successfulstory1.jpeg" alt="Bella și familia ei" class="w-full h-full object-cover">
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Bella and Maria</h3>
            <p class="text-gray-700 mb-4">
              "Adopting Bella was the best decision I have ever made. She has brought so much joy into my life, and we share a special bond I never thought possible. Thank you for bringing us together!"
            </p>
            <p class="text-gray-600 italic">- Maria P., adopted in July 2024</p>
          </div>
        </div>

        <!-- Story 2 -->
        <div class="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-3xl shadow-md">
          <div class="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-200">
            <img src="../assets/successfulstory2.jpg" alt="Oscar și familia lui" class="w-full h-full object-cover">
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Oscar and the Popescu Family</h3>
            <p class="text-gray-700 mb-4">
              "Oscar was a very shy dog when we adopted him, but with patience and love, he transformed. Now he is an indispensable member of our family and makes every day brighter."
            </p>
            <p class="text-gray-600 italic">- The Popescu Family, adopted in September 2024</p>
          </div>
        </div>
      </div>

      <!-- <div class="mt-12 text-center">
        <router-link to="/success-stories" class="inline-block px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-md">
          Read more stories
        </router-link>
      </div> -->
    </div>
  </section>

  <!-- How to Help -->
  <section class="py-16 text-black" style="background-color: rgba(0, 0, 0, 0.05);">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">How You Can Help</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Option 1 -->
        <div class="text-center bg-white p-6 rounded-3xl shadow-md">
          <div class="bg-red-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Adopt</h3>
          <p class="text-gray-700">Give an animal a permanent home and a life full of love and care.</p>
        </div>
        
        <!-- Option 2 -->
        <div class="text-center bg-white p-6 rounded-3xl shadow-md">
          <div class="bg-red-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Donate</h3>
          <p class="text-gray-700">Support shelters through donations that help care for the animals.</p>
        </div>
        
        <!-- Option 3 -->
        <div class="text-center bg-white p-6 rounded-3xl shadow-md">
          <div class="bg-red-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Attend Events</h3>
          <p class="text-gray-700">Join adoption events and fundraising activities to support animal welfare.</p>
        </div>
        
        <!-- Option 4 -->
        <div class="text-center bg-white p-6 rounded-3xl shadow-md">
          <div class="bg-red-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Spread the Message</h3>
          <p class="text-gray-700">Help us increase visibility by sharing our stories with your friends and family.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Events Calendar -->
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Upcoming Events</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EventCard
          v-for="event in displayedEvents"
          :key="event.id"
          :event="event"
          @status-updated="updateEventStatus"
          @event-updated="onEventUpdated"
        />
      </div>
      
      <div class="mt-12 text-center">
        <button
          @click="handleViewEvents"
          class="inline-block px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-md"
        > 
          View all events
        </button>
      </div>
    </div>
  </section>

  <!-- Emergency Banner-->
  <!-- Emergency Banner-->
  <section class="py-4 bg-red-600 text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="flex items-center mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="font-bold">Emergency: We urgently need foster homes for {{ urgentPetsCount }} {{ urgentPetsCount === 1 ? 'pet' : 'pets' }} needing immediate adoption!</p>
        </div>
        <button
          @click="handleEmergencyFoster"
          class="px-4 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
        >
          Learn More
        </button>
      </div>
    </div>
  </section>

  <!-- Newsletter-->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center bg-white p-8 rounded-3xl shadow-lg">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Stay Updated</h2>
        <p class="text-lg text-gray-700 mb-8">
          Sign up to receive updates on animals available for adoption and success stories.
        </p>
        
        <form @submit.prevent="subscribeNewsletter" class="flex flex-col sm:flex-row gap-4">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Your Email Address" 
            class="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            required
          >
          <button 
            type="submit" 
            class="px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-300 shadow-md"
          >
            Subscribe
          </button>
        </form>
        
        <p class="mt-4 text-sm text-gray-600">
          By subscribing, you agree to receive emails from us. You can unsubscribe at any time.
        </p>
      </div>
    </div>
  </section>
  <Footer></Footer>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import IntroNavbar from "@/components/IntroNavbar.vue";
import Footer from "@/components/Footer.vue";
import PetCard from "@/components/PetCard.vue";
import EventCard from "@/components/EventCard.vue";
import { fetchAllEvents } from '@/services/event_service';

export default {
  name: 'HomePage',

  components: {
    Navbar,
    Footer,
    PetCard,
    IntroNavbar,
    EventCard
  },

  data() {
    return {
      email: '',
      availablePets: [],
      displayedPets: [],
      intervalId: null,
      activeEvents: [],
      displayedEvents: [],
      eventIntervalId: null,
      urgentPetsCount: 0,
    }
  },

  mounted() {
    this.fetchAvailablePets();
    this.fetchActiveEvents();
    this.fetchUrgentPetsCount();
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('Id');
    }
  },

  methods: {
    handleAdoptNow() {
    this.$router.push(this.isLoggedIn ? '/available-pets' : '/login');
    },
    handleSeeAllAnimals() {
      this.$router.push(this.isLoggedIn ? '/available-pets' : '/login');
    },
    handleViewEvents() {
      this.$router.push(this.isLoggedIn ? '/events' : '/login');
    },
    handleEmergencyFoster() {
      if (this.isLoggedIn) {
        this.$router.push({ 
          path: '/available-pets',
          query: { urgent: 'true' } 
        });
      } else {
        this.$router.push('/login');
      }
    },
    subscribeNewsletter() {
      alert('Thank you for subscribing!');
      this.email = '';
    },
    subscribeNewsletter() {
      alert('Thank you for subscribing!');
      this.email = '';
    },
    async fetchAvailablePets() {
      try {
        const response = await fetch(`http://localhost:8080/pets/available`);
        const allPets = await response.json();
        this.availablePets = allPets;
        this.updateRandomPets();

        this.intervalId = setInterval(() => {
          this.updateRandomPets();
        }, 30000);
      } catch (error) {
        console.error("Failed to fetch available pets:", error);
      }
    },
    updateRandomPets() {
      if (this.availablePets.length <= 3) {
        this.displayedPets = this.availablePets;
        return;
      }
      const shuffled = [...this.availablePets].sort(() => 0.5 - Math.random());
      this.displayedPets = shuffled.slice(0, 3);
    },
    async fetchActiveEvents() {
      try {
        const events = await fetchAllEvents();
        // Filter for active events only if needed
        this.activeEvents = events.filter(event => event.isActive);
        this.updateDisplayedEvents();
        // ...
      } catch (error) {
        console.error("Failed to fetch active events:", error);
      }
    },
    updateDisplayedEvents() {
      if (this.activeEvents.length <= 3) {
        this.displayedEvents = this.activeEvents;
      } else {
        const shuffled = [...this.activeEvents].sort(() => 0.5 - Math.random());
        this.displayedEvents = shuffled.slice(0, 3);
      }
    },
    updateEventStatus({ id, newStatus }) {
      const target = this.displayedEvents.find(e => e.id === id);
      if (target) {
        target.participationStatus = newStatus;
      }

      const activeTarget = this.activeEvents.find(e => e.id === id);
      if (activeTarget) {
        activeTarget.participationStatus = newStatus;
      }
    },
    onEventUpdated(updatedEvent) {
      // Update in displayedEvents array
      const displayIndex = this.displayedEvents.findIndex(e => e.id === updatedEvent.id);
      if (displayIndex !== -1) {
        // In Vue 3, just assign directly
        this.displayedEvents[displayIndex] = updatedEvent;
      }

      // Also update in the main activeEvents array
      const activeIndex = this.activeEvents.findIndex(e => e.id === updatedEvent.id);
      if (activeIndex !== -1) {
        this.activeEvents[activeIndex] = updatedEvent;
      }
    },
    async fetchUrgentPetsCount() {
      try {
        const response = await fetch('http://localhost:8080/pets/available');
        if (!response.ok) {
          console.error("Failed to fetch pets for emergency banner");
          return;
        }
        const pets = await response.json();
        this.urgentPetsCount = pets.filter(pet => pet.urgentAdoptionNeeded).length;
      } catch (error) {
        console.error("Error fetching urgent pets count:", error);
      }
    },
  }
}
</script>


<style>
h1, img {
  user-select: none;
}

html {
  scroll-behavior: smooth;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section {
  animation: fadeIn 0.8s ease-out forwards;
}

.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

button, a.inline-block {
  transition: all 0.3s ease;
}

button:hover, a.inline-block:hover {
  transform: translateY(-2px);
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #c1c1c1;
}
</style>