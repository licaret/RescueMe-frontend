<template>
  <Navbar></Navbar>
  <div class="bg-gradient-to-b from-gray-90 to-gray-100 min-h-screen p-6 md:p-10 lg:p-14 mt-16 space-y-12">

    <!-- Error Message Display -->
    <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-6xl mx-auto mb-6 flex items-center">
      <svg class="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span class="font-medium">{{ errorMessage }}</span>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white max-w-[80rem] mx-auto rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div class="px-6 py-5 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800 mb-1">Find Your Perfect Pet</h2>
        <p class="text-gray-500 text-sm">Search through available pets from our network of shelters</p>
      </div>

      <!-- Top Row: Search & Toggle Filters -->
      <div class="px-6 py-5 flex flex-col md:flex-row gap-4 md:items-center">
        <!-- Search Bar -->
        <div class="flex-1 min-w-[250px]">
          <div class="relative">
            <div class="absolute left-4 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              v-model="filters.name"
              placeholder="Search by pet name..."
              class="pl-12 pr-4 py-3.5 w-full border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 md:justify-end">
          <!-- Sort Button/Dropdown -->
          <div class="relative">
            <select 
              v-model="sortBy" 
              class="appearance-none pl-4 pr-10 py-3 font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm"
            >
              <option value="">Sort Pets</option>
              <option value="name">By Name</option>
              <option value="age">By Age</option>
              <option value="timeSpentInShelter">By Time in Shelter</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Filters Toggle Button -->
          <button 
            @click="showFilters = !showFilters"
            class="flex items-center gap-2 px-5 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="font-medium">{{ showFilters ? "Hide Filters" : "Show Filters" }}</span>
            <span v-if="isAnyFilterApplied" class="flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {{ Object.values(filters).filter(value => value !== '' && value !== false).length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <transition 
        name="fade"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="showFilters" class="px-6 py-5 border-t border-gray-100 bg-gray-50">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            
            <!-- Filter Fields -->
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-500 ml-1">Species</label>
              <select v-model="filters.species" class="custom-filter-input">
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>

            <!-- Breed Dropdown with Tooltip on Hover -->
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-500 ml-1">Breed</label>
              <div class="relative group">
                <select 
                  v-model="filters.breed" 
                  class="custom-filter-input w-full"
                  :class="{'cursor-not-allowed bg-gray-100 text-gray-400': !filters.species}"
                  :disabled="!filters.species"
                >
                  <option value="" disabled>All Breeds</option>
                  <option v-for="breed in breedOptions" :key="breed" :value="breed">
                    {{ breed }}
                  </option>
                </select>

                <!-- Tooltip message on hover -->
                <div 
                  v-if="!filters.species" 
                  class="absolute left-0 -bottom-10 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                >
                  Please select a species first
                  <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-500 ml-1">Gender</label>
              <select v-model="filters.sex" class="custom-filter-input">
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-500 ml-1">Size</label>
              <select v-model="filters.size" class="custom-filter-input">
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-500 ml-1">Health Status</label>
              <select v-model="filters.healthStatus" class="custom-filter-input">
                <option value="">All Health Statuses</option>
                <option value="Healthy">Healthy</option>
                <option value="Minor Issues">Minor Issues</option>
                <option value="Needs Medical Attention">Needs Medical Attention</option>
                <option value="Recovered">Recovered</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical Condition">Critical Condition</option>
                <option value="Needs Surgery">Needs Surgery</option>
                <option value="Disabled">Disabled</option>
                <option value="Senior Care">Senior Care</option>
                <option value="Special Needs">Special Needs</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-500 ml-1">Availability</label>
              <select v-model="filters.status" class="custom-filter-input">
                <option value="">All Availabilities</option>
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="ADOPTED">Adopted</option>
              </select>
            </div>

            <!-- Checkboxes in a row -->
            <div class="lg:col-span-2 flex flex-wrap gap-6">
              <!-- Vaccinated -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="vaccinated" 
                  v-model="filters.vaccinated" 
                  class="w-5 h-5 rounded text-red-500 border-gray-300 focus:ring-red-500"
                >
                <label for="vaccinated" class="ml-2 text-gray-700">Only Vaccinated</label>
              </div>

              <!-- Neutered -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="neutered" 
                  v-model="filters.neutered" 
                  class="w-5 h-5 rounded text-red-500 border-gray-300 focus:ring-red-500"
                >
                <label for="neutered" class="ml-2 text-gray-700">Only Neutered</label>
              </div>

              <!-- Urgent Adoption Needed -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="urgentAdoptionNeeded" 
                  v-model="filters.urgentAdoptionNeeded" 
                  class="w-5 h-5 rounded text-red-600 border-red-300 focus:ring-red-500"
                >
                <label for="urgentAdoptionNeeded" class="ml-2 text-red-600 font-medium">Urgent Adoption Needed</label>
              </div>
            </div>

            <!-- Clear Filters Button -->
            <div class="flex items-center md:justify-end lg:col-span-4 pt-2">
              <button 
                v-if="isAnyFilterApplied"
                @click="resetFilters"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-500"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading shelters...</p>
    </div>
    

    <div v-else v-for="shelter in sheltersWithPets" :key="shelter.id" class="max-w-7xl mx-auto mb-16 overflow-hidden">
      <!-- Shelter Header (Redesigned) -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center p-6 gap-6">
          <!-- Shelter Image (Left side) -->
          <div class="flex justify-center md:justify-start">
            <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white ring-2 ring-gray-100 shadow-lg transition-transform duration-300 hover:scale-105">
              <img 
                v-if="shelter.profilePicture"
                :src="'data:image/jpeg;base64,' + shelter.profilePicture" 
                :alt="shelter.username"
                class="w-full h-full object-cover" 
              />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Shelter Info (Middle) -->
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-center mb-2 gap-2">
              <h2 class="text-2xl font-bold text-gray-800">{{ shelter.username }}</h2>
              <span class="inline-flex ml-0 md:ml-3 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full self-center">{{ shelter.shelterType }}</span>
            </div>
            
            <div class="flex items-center justify-center md:justify-start text-gray-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ shelter.city }}, {{ shelter.county || "N/A" }}</span>
            </div>
            
            <div class="flex items-center justify-center md:justify-start gap-6 mb-4">
              <div class="flex items-center">
                <span class="font-semibold mr-2 text-gray-800">{{ shelter.pets ? shelter.pets.length : 0 }}</span>
                <span class="text-gray-600">Total Pets</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold mr-2 text-red-600">{{ shelter.pets ? shelter.pets.filter(pet => pet.status === 'AVAILABLE').length : 0 }}</span>
                <span class="text-gray-600">Available</span>
              </div>
            </div>
            
            <div class="border-l-4 border-red-500 pl-4 italic text-gray-700 bg-gray-50 p-3 rounded-r-lg">
              {{ shelter.biography || "This Shelter doesn't have a description yet." }}
            </div>
            
            <div class="flex flex-wrap items-center justify-center md:justify-start mt-5 gap-4">
              <button class="action-button flex items-center text-gray-700 hover:text-red-600 font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact
              </button>
              <button class="action-button flex items-center text-gray-700 hover:text-red-600 font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message
              </button>
              <button class="action-button flex items-center text-gray-700 hover:text-red-600 font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
          
          <!-- View Profile Button (Right side) -->
          <div class="flex justify-center md:block mt-4 md:mt-0">
            <router-link 
              :to="`/shelter/${shelter.username}`"
              class="primary-button px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2">
              View Profile
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      
      <!-- Shelter's Pets Grid -->
      <div v-if="shelter.pets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
        <PetCard 
          v-for="pet in shelter.pets" 
          :key="pet.id" 
          :pet="pet"
          userType="public"
          :favorited="isFavorited(pet.id)"
          @favorite="toggleFavorite"
          @adopt="adoptPet"
        />
      </div>

      <!-- No Pets Message -->
      <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <p class="text-lg font-medium text-gray-500">No pets available in this shelter.</p>
        <p class="text-gray-400 mt-1">Check back later or adjust your search filters</p>
      </div>
    </div>

    <!-- No Results State -->
    <div v-if="!loading && sheltersWithPets.length === 0" class="text-center py-20 max-w-xl mx-auto">
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <img src="../assets/empty-state.png" alt="No Pets" class="mx-auto w-48 h-48 mb-6" />
        <h2 class="text-2xl font-bold text-gray-800 mb-3">No pets match your search</h2>
        <p class="text-gray-600 mb-8">We couldn't find any pets matching your current filters. Try adjusting your filters to see more pets.</p>
        <button 
          @click="resetFilters" 
          class="primary-button px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue';
import Navbar from "@/components/Navbar.vue";
import PetCard from "@/components/PetCard.vue";

export default {
  name: 'AvailablePets',
  components: {
    Navbar, 
    PetCard
  },
  setup() {
    const shelters = ref([]);
    const loading = ref(true);
    const errorMessage = ref('');
    const showFilters = ref(false);
    const favorites = ref([]);
    const sortBy = ref("");
    const photoIndices = reactive({});
    const storyVisibility = reactive({});
    
    const filters = ref({
      name: "",
      species: "",
      breed: "",
      sex: "",
      size: "",
      healthStatus: "",
      vaccinated: false,
      neutered: false,
      urgentAdoptionNeeded: false,
      status: "", // Default to only showing available pets
    });

    const resetFilters = () => {
      filters.value = {
        name: "",
        species: "",
        breed: "",
        sex: "",
        size: "",
        healthStatus: "",
        vaccinated: false,
        neutered: false,
        urgentAdoptionNeeded: false,
        status: "AVAILABLE",
      };
    };

    const isAnyFilterApplied = computed(() => {
      return Object.values(filters.value).some(value => {
        if (value === "AVAILABLE" && filters.value.status === "AVAILABLE") {
          return false; // Don't count the default "AVAILABLE" status as a filter
        }
        return value !== "" && value !== false;
      });
    });

    const formatAge = (age) => {
      if (!age && age !== 0) return 'Unknown';
      
      const ageInMonths = Math.round(age * 12);
      if (ageInMonths >= 12) {
        return `${Math.floor(age)} ${Math.floor(age) === 1 ? 'year' : 'years'}`;
      } else {
        return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
      }
    };

    // Filter pets based on criteria
    const filterPet = (pet) => {
      if (!pet) return false;
      
      return Object.keys(filters.value).every(key => {
        if (!filters.value[key]) return true;

        if (key === "vaccinated" && filters.value.vaccinated) {
          return pet.vaccinated === true;
        }

        if (key === "neutered" && filters.value.neutered) {
          return pet.neutered === true;
        }

        if (key === "urgentAdoptionNeeded" && filters.value.urgentAdoptionNeeded) {
          return pet.urgentAdoptionNeeded === true;
        }

        if (key === "name") {
          return (pet.name || "").toLowerCase().includes(filters.value.name.toLowerCase());
        }

        if (key === "breed" && filters.value.breed) {
          return (pet.breed || "").toLowerCase() === filters.value.breed.toLowerCase();
        }

        if (key === "species" && filters.value.species) {
          // Infer species from breed if not directly available
          if (!pet.species) {
            const breed = pet.breed ? pet.breed.toLowerCase() : "";
            if (breed.includes("retriever") || breed.includes("shepherd")) {
              return filters.value.species.toLowerCase() === "dog";
            }
            if (breed.includes("siamese") || breed.includes("tabby")) {
              return filters.value.species.toLowerCase() === "cat";
            }
            return false;
          }
          return pet.species.toLowerCase() === filters.value.species.toLowerCase();
        }

        if (pet[key] === undefined) return false;
        return pet[key].toString().toLowerCase() === filters.value[key].toLowerCase();
      });
    };

    // Apply sorting to filtered pets
    const sortPets = (pets) => {
      if (!sortBy.value) return pets;
      
      return [...pets].sort((a, b) => {
        if (sortBy.value === 'name') {
          return (a.name || "").localeCompare(b.name || "");
        } else if (sortBy.value === 'age') {
          return (a.age || 0) - (b.age || 0);
        } else if (sortBy.value === 'timeSpentInShelter') {
          return (a.timeSpentInShelter || 0) - (b.timeSpentInShelter || 0);
        }
        return 0;
      });
    };

    // Improved sheltersWithPets computed property
    const sheltersWithPets = computed(() => {
      return shelters.value
        .map(shelter => {
          // Filter the pets based on all criteria
          const filteredPets = (shelter.pets || [])
            .filter(pet => filterPet(pet))
            .map(pet => ({
              // Add missing fields with default values if they don't exist
              ...pet,
              species: pet.species || (pet.breed?.toLowerCase().includes('retriever') || pet.breed?.toLowerCase().includes('shepherd') ? 'Dog' : 'Unknown'),
              sex: pet.sex || 'Unknown',
              size: pet.size || 'Medium',
              status: pet.status || 'AVAILABLE',
              name: pet.name || pet.breed || 'Unnamed Pet',
              story: pet.story || `I'm a ${pet.breed || 'lovely pet'} looking for a forever home!`,
              photos: pet.photos || [],
              timeSpentInShelter: pet.timeSpentInShelter || 0,
            }));
          
          // Apply sorting if needed
          const sortedPets = sortPets(filteredPets);
          
          return {
            ...shelter,
            pets: sortedPets
          };
        })
        .filter(shelter => shelter.pets.length > 0); // Only show shelters with matching pets
    });

    // Breed options based on selected species
    const breedOptions = computed(() => {
      if (!filters.value.species) return [];
      
      // Infer species from breed if species is not directly available in data
      const breedsBySpecies = shelters.value
        .flatMap(shelter => shelter.pets || [])
        .filter(pet => {
          if (!pet) return false;
          if (pet.species) return pet.species === filters.value.species;
          
          // Infer species from breed name
          const breed = pet.breed ? pet.breed.toLowerCase() : "";
          if (filters.value.species.toLowerCase() === "dog") {
            return breed.includes("retriever") || breed.includes("shepherd") || breed.includes("terrier");
          }
          if (filters.value.species.toLowerCase() === "cat") {
            return breed.includes("siamese") || breed.includes("tabby") || breed.includes("persian");
          }
          return false;
        })
        .map(pet => pet.breed);
      
      return [...new Set(breedsBySpecies)].filter(Boolean);
    });

    // Photo carousel navigation
    const getPetPhotoIndex = (petId) => {
      return photoIndices[petId] || 0;
    };

    const prevImage = (pet) => {
      if (!pet.photos || pet.photos.length <= 1) return;
      const currentIndex = photoIndices[pet.id] || 0;
      photoIndices[pet.id] = (currentIndex - 1 + pet.photos.length) % pet.photos.length;
    };

    const nextImage = (pet) => {
      if (!pet.photos || pet.photos.length <= 1) return;
      const currentIndex = photoIndices[pet.id] || 0;
      photoIndices[pet.id] = (currentIndex + 1) % pet.photos.length;
    };

    // Story visibility functions
    const showStory = (petId) => {
      storyVisibility[petId] = true;
    };

    const hideStory = (petId) => {
      storyVisibility[petId] = false;
    };
    
    // Favorites functionality
    const toggleFavorite = (petId) => {
      const index = favorites.value.indexOf(petId);
      
      if (index === -1) {
        favorites.value.push(petId);
        // Save to localStorage
        localStorage.setItem('favoritePets', JSON.stringify(favorites.value));
      } else {
        favorites.value.splice(index, 1);
        localStorage.setItem('favoritePets', JSON.stringify(favorites.value));
      }
    };

    const isFavorited = (petId) => {
      return favorites.value.includes(petId);
    };

    // Adoption functionality
    const adoptPet = (petId) => {
      // Find the pet to get its name
      let petName = "this pet";
      let foundPet = null;
      
      shelters.value.forEach(shelter => {
        if (!shelter.pets) return;
        const pet = shelter.pets.find(pet => pet && pet.id === petId);
        if (pet) {
          foundPet = pet;
          petName = pet.name || pet.breed || "this pet";
        }
      });
      
      // Navigate to adoption form or start adoption process
      alert(`Starting adoption process for ${petName}!`);
      // In a real app, you might change the pet's status to PENDING
      // or navigate to an adoption form page
    };

    const loadData = async () => {
      try {
        loading.value = true;
        errorMessage.value = '';
        
        // Fetch shelters from backend
        const response = await fetch("http://localhost:8080/users/shelters");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch shelters: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        shelters.value = data;

        // Initialize photo indices and story visibility for each pet
        shelters.value.forEach(shelter => {
          if (shelter.pets) {
            shelter.pets.forEach(pet => {
              if (!pet) return;
              
              photoIndices[pet.id] = 0;
              storyVisibility[pet.id] = false;
              
              // Make sure each pet has the minimum required fields
              pet.photos = pet.photos || [];
              pet.story = pet.story || "";
              pet.status = pet.status || "AVAILABLE";
            });
          }
        });

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favoritePets');
        if (savedFavorites) {
          favorites.value = JSON.parse(savedFavorites);
        }

      } catch (error) {
        console.error("Error loading data:", error);
        // Add user-visible error state
        errorMessage.value = "Could not load shelter data. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
      
      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem('favoritePets');
      if (savedFavorites) {
        try {
          favorites.value = JSON.parse(savedFavorites);
        } catch (error) {
          console.error('Error loading favorites from localStorage:', error);
          favorites.value = [];
        }
      }
    });

    return {
      shelters,
      sheltersWithPets,
      loading,
      errorMessage,
      filters,
      showFilters,
      resetFilters,
      isAnyFilterApplied,
      formatAge,
      breedOptions,
      prevImage,
      nextImage,
      getPetPhotoIndex,
      showStory,
      hideStory,
      storyVisibility,
      toggleFavorite,
      isFavorited,
      adoptPet,
      sortBy
    };
  }
};
</script>

<style scoped>
.custom-filter-input {
  @apply appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl w-full shadow-sm transition duration-200 ease-in-out;
}

.custom-filter-input:focus {
  @apply outline-none ring-2 ring-red-500 border-transparent;
}

.custom-filter-input:hover:not(:disabled) {
  @apply border-gray-300 bg-gray-50;
}

.custom-filter-input:disabled {
  @apply cursor-not-allowed;
}

/* Enhanced checkboxes */
[type="checkbox"] {
  @apply rounded border-gray-300;
}

[type="checkbox"]:checked {
  @apply bg-red-500 border-transparent;
}

[type="checkbox"]:focus {
  @apply ring-offset-white ring-red-500 ring-opacity-50;
}

/* Button styling */
.primary-button {
  @apply shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out;
}

.primary-button:hover {
  @apply -translate-y-0.5;
}

.action-button {
  @apply transform transition duration-200 ease-in-out;
}

.action-button:hover {
  @apply -translate-y-0.5;
}

/* Card effects */
.shelter-card {
  @apply transform transition duration-300 ease-in-out;
}

.shelter-card:hover {
  @apply -translate-y-1 shadow-lg;
}

/* Animation classes */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>