<template>
    <Navbar></Navbar>
    <div class="p-14 mt-20 space-y-12 max-w-6xl mx-auto">
      <!-- Back button -->
      <div class="flex items-center mb-6">
        <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <svg 
            class="w-5 h-5 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Available Pets
        </button>
      </div>
  
      <!-- Shelter Header with Dynamic Profile Picture -->
      <div class="bg-white rounded-xl border border-gray-300 shadow-lg overflow-hidden">
        <div class="relative h-64 w-full">
          <!-- Use base64 profile picture if available -->
          <img 
            v-if="shelter.profilePicture"
            :src="'data:image/jpeg;base64,' + shelter.profilePicture" 
            :alt="shelter.username"
            class="w-full h-full object-cover" 
          />
          <!-- Fallback to default image if no profile picture -->
          <img 
            v-else
            src="/src/assets/blank_profile_picture.jpg" 
            :alt="shelter.username"
            class="w-full h-full object-cover" 
          />
          <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 class="text-3xl font-bold text-white">{{ shelter.username || shelter.name }}</h1>
            <p class="text-white/90">{{ shelter.city }}, {{ shelter.county || shelter.location }}</p>
          </div>
        </div>
      </div>
  
      <!-- Shelter Information Sections -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left Column: About -->
        <div class="md:col-span-2 space-y-8">
          <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">About {{ shelter.name }}</h2>
            <p class="text-gray-700">{{ shelter.description }}</p>
            
            <div class="mt-6 space-y-4">
              <div v-if="shelter.foundedYear" class="flex items-start">
                <div class="bg-gray-100 p-2 rounded-full mr-4">
                  <svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Founded</h3>
                  <p class="text-gray-600">{{ shelter.foundedYear }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-gray-100 p-2 rounded-full mr-4">
                  <svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Location</h3>
                  <p class="text-gray-600">{{ shelter.fullAddress || shelter.location }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-gray-100 p-2 rounded-full mr-4">
                  <svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Contact</h3>
                  <p class="text-gray-600">{{ shelter.phone || 'Phone not available' }}</p>
                  <p class="text-gray-600">{{ shelter.email || 'Email not available' }}</p>
                </div>
              </div>
  
              <div class="flex items-start">
                <div class="bg-gray-100 p-2 rounded-full mr-4">
                  <svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Hours of Operation</h3>
                  <p class="text-gray-600">{{ shelter.hours || 'Monday - Friday: 9AM - 5PM, Saturday: 10AM - 4PM, Sunday: Closed' }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p class="text-gray-700">{{ shelter.mission || 'Our mission is to find loving forever homes for all animals in our care. We believe every pet deserves a chance at a happy life with a family that will cherish them. Through compassionate care, education, and community outreach, we strive to end animal homelessness and promote responsible pet ownership.' }}</p>
          </div>
        </div>
  
        <!-- Right Column: Stats, Donate and Volunteer -->
        <div class="space-y-8">
          <!-- Shelter Stats -->
          <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Shelter Stats</h2>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                <span class="text-gray-600">Pets Currently Housed:</span>
                <span class="font-semibold">{{ shelter.petCount || shelter.pets?.length || 'N/A' }}</span>
              </div>
              
              <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                <span class="text-gray-600">Adoptions This Year:</span>
                <span class="font-semibold">{{ shelter.adoptionsThisYear || '124' }}</span>
              </div>
              
              <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                <span class="text-gray-600">Dogs:</span>
                <span class="font-semibold">{{ shelter.dogCount || shelter.pets?.filter(p => p.species === 'Dog').length || 'N/A' }}</span>
              </div>
              
              <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                <span class="text-gray-600">Cats:</span>
                <span class="font-semibold">{{ shelter.catCount || shelter.pets?.filter(p => p.species === 'Cat').length || 'N/A' }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Urgent Adoptions Needed:</span>
                <span class="font-semibold text-red-600">{{ shelter.urgentCount || shelter.pets?.filter(p => p.urgentAdoptionNeeded).length || 'N/A' }}</span>
              </div>
            </div>
          </div>
  
          <!-- Get Involved -->
          <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Get Involved</h2>
            
            <div class="space-y-4">
              <button class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Donate Now
              </button>
              
              <button class="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Volunteer
              </button>
              
              <button class="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Contact Us
              </button>
            </div>
          </div>
  
          <!-- Social Media -->
          <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Follow Us</h2>
            
            <div class="flex justify-between">
              <a href="#" class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a href="#" class="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-colors">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a href="#" class="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-colors">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a href="#" class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Pet Showcase -->
      <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Our Available Pets</h2>
          <button @click="viewAllPets" class="text-red-600 font-medium hover:text-red-800 transition-colors">
            View All →
          </button>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="pet in shelter.pets?.slice(0, 4)" :key="pet.id" class="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow overflow-hidden">
            <div class="h-48 overflow-hidden">
              <img 
                v-if="pet.photos && pet.photos.length > 0"
                :src="pet.photos[0]?.url" 
                :alt="pet.name" 
                class="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500">No photo</span>
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg">{{ pet.name }}</h3>
                <span :class="`px-2 py-1 rounded-full text-xs font-semibold ${
                  pet.status === 'AVAILABLE' 
                    ? 'bg-green-100 text-green-800'
                    : pet.status === 'PENDING' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800' 
                }`">
                  {{ pet.status }}
                </span>
              </div>
              <p class="text-gray-500 text-sm mb-3">{{ pet.breed }} • {{ formatAge(pet.age) }}</p>
              <button 
                v-if="pet.status === 'AVAILABLE'"
                @click="adoptPet(pet.id)"
                class="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                Adopt Me
              </button>
              <button 
                v-else
                disabled
                class="w-full bg-gray-300 text-gray-600 text-sm font-medium py-2 px-3 rounded-lg cursor-not-allowed"
              >
                {{ pet.status === 'PENDING' ? 'Pending Adoption' : 'Adopted' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Navbar from "@/components/Navbar.vue";
  import { useRouter } from "vue-router";
  
  export default {
    name: 'ShelterProfile',
    components: {
      Navbar
    },
    props: {
      id: {
        type: [Number, String],
        required: true
      }
    },
    setup(props) {
      const shelter = ref({});
      const loading = ref(true);
  
      const loadShelterData = async () => {
        try {
          // In a real app, this would be an API call
          // const response = await fetch(`/api/shelters/${props.id}`);
          // shelter.value = await response.json();
          
          // For demo purposes, using sample data
          shelter.value = {
            id: 1,
            name: "Snuggles & Whiskers Home",
            location: "Baia Mare, Maramureș",
            fullAddress: "Strada Victoriei 15, Baia Mare, Maramureș, România",
            description: "We're dedicated to finding loving homes for dogs and cats of all ages and breeds. Our shelter provides temporary care and rehabilitation for abandoned and rescued animals.",
            mission: "Our mission at Snuggles & Whiskers Home is to provide shelter, care, and love to abandoned animals while finding them forever homes. We believe in creating a compassionate community where every animal is valued and respected.",
            imageUrl: "/api/placeholder/1200/400",
            phone: "+40 743 123 456",
            email: "info@snugglesandwhiskers.org",
            foundedYear: "2010",
            hours: "Monday - Friday: 10AM - 6PM, Saturday: 10AM - 4PM, Sunday: Closed",
            adoptionsThisYear: 148,
            petCount: 42,
            dogCount: 18,
            catCount: 24,
            urgentCount: 5,
            pets: [
              {
                id: 101,
                name: "Banjo",
                breed: "French Bulldog",
                species: "Dog",
                sex: "Male",
                age: 3,
                size: "Small",
                status: "AVAILABLE",
                healthStatus: "Healthy",
                vaccinated: true,
                neutered: true,
                urgentAdoptionNeeded: false,
                timeSpentInShelter: 0.5, // 6 months
                photos: [
                  { url: "/api/placeholder/400/400" },
                  { url: "/api/placeholder/400/300" }
                ],
                story: "Banjo is a sweet and gentle soul who is looking for a kind, loving, and experienced home where he can thrive and feel secure."
              },
              {
                id: 102,
                name: "Luna",
                breed: "Siamese Mix",
                species: "Cat",
                sex: "Female",
                age: 1.5,
                size: "Medium",
                status: "AVAILABLE",
                healthStatus: "Healthy",
                vaccinated: true,
                neutered: true,
                urgentAdoptionNeeded: false,
                timeSpentInShelter: 0.25, // 3 months
                photos: [{ url: "/api/placeholder/400/400" }],
                story: "Luna is a playful and affectionate cat who loves to cuddle and play with toys."
              },
              {
                id: 103,
                name: "Max",
                breed: "Golden Retriever",
                species: "Dog",
                sex: "Male",
                age: 5,
                size: "Large",
                status: "PENDING",
                healthStatus: "Healthy",
                vaccinated: true,
                neutered: true,
                urgentAdoptionNeeded: false,
                timeSpentInShelter: 0.75, // 9 months
                photos: [{ url: "/api/placeholder/400/400" }],
                story: "Max is a gentle giant who loves to play fetch and go for long walks."
              },
              {
                id: 104,
                name: "Whiskers",
                breed: "Tabby",
                species: "Cat",
                sex: "Male",
                age: 2,
                size: "Small",
                status: "AVAILABLE",
                healthStatus: "Healthy",
                vaccinated: true,
                neutered: false,
                urgentAdoptionNeeded: true,
                timeSpentInShelter: 1.5, // 1.5 years
                photos: [{ url: "/api/placeholder/400/400" }],
                story: "Whiskers was found abandoned and needs a loving home urgently."
              }
            ]
          };
        } catch (error) {
          console.error("Error loading shelter data:", error);
        } finally {
          loading.value = false;
        }
      };
  
      const formatAge = (age) => {
        if (!age && age !== 0) return 'Unknown';
        
        const ageInMonths = Math.round(age * 12);
        if (ageInMonths >= 12) {
          return `${Math.floor(age)} ${Math.floor(age) === 1 ? 'year' : 'years'}`;
        } else {
          return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
        }
      };
  
      const adoptPet = (petId) => {
        alert(`Starting adoption process for this pet!`);
        // In a real app, you would navigate to adoption form
      };
  
      const goBack = () => {
        this.$router.push('/available-pets');
      };
  
      const viewAllPets = () => {
        // In a real app with Vue Router
        // router.push('/available-pets');
        
        // For demo
        alert("Viewing all pets from this shelter");
      };
  
      onMounted(loadShelterData);
  
      return {
        shelter,
        loading,
        formatAge,
        adoptPet,
        goBack,
        viewAllPets
      };
    }
  };
  </script>
  
  <style scoped>
  /* Any additional component-specific styles would go here */
  </style>