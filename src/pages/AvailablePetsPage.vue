<template>
  <Navbar></Navbar>
  <div class="p-14 mt-20 space-y-20">

    <!-- Error Message Display -->
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-[76rem] mx-auto mb-6">
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white p-4 max-w-[76rem] mx-auto rounded-xl border border-gray-300 shadow-lg">

      <!-- Top Row: Search & Toggle Filters -->
      <div class="flex justify-between items-center mb-6">
        <!-- Search Bar -->
        <div class="flex-1 min-w-[250px]">
          <div class="relative">
            <img src="../assets/search.png" alt="Search icon" class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              v-model="filters.name"
              placeholder="Search by name..."
              class="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div class="flex items-center gap-4 ml-4">
          <!-- Sort Button/Dropdown -->
          <select 
            v-model="sortBy" 
            class="flex focus:outline-none font-medium items-center gap-2 px-5 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            <option value="">Sort By</option>
            <option value="name">Sort By: Name</option>
            <option value="age">Sort By: Age</option>
            <option value="timeSpentInShelter">Sort By: Time in Shelter</option>
          </select>

          <!-- Filters Toggle Button -->
          <button 
            @click="showFilters = !showFilters"
            class="flex items-center gap-2 px-5 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            <img src="../assets/filter.png" alt="Filter icon" class="w-5 h-5" />
            <span class="font-medium">{{ showFilters ? "Hide Filters" : "Show Filters" }}</span>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <transition name="fade">
        <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 border-t pt-6">
          
          <!-- Filter Fields -->
          <select v-model="filters.species" class="filter-input">
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>

          <!-- Breed Dropdown with Tooltip on Hover -->
          <div class="relative group">
            <select 
              v-model="filters.breed" 
              class="filter-input w-full"
              :class="{'cursor-not-allowed bg-gray-200 text-gray-500': !filters.species}"
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
              class="absolute left-0 -bottom-10 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Please select a species first
              <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
            </div>
          </div>

          <select v-model="filters.sex" class="filter-input">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select v-model="filters.size" class="filter-input">
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>

          <select v-model="filters.healthStatus" class="filter-input">
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

          <select v-model="filters.status" class="filter-input">
            <option value="">All Availabilities</option>
            <option value="AVAILABLE">Available</option>
            <option value="PENDING">Pending</option>
            <option value="ADOPTED">Adopted</option>
          </select>

          <!-- Vaccinated -->
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="vaccinated" 
              v-model="filters.vaccinated" 
              class="form-checkbox h-5 w-5 text-blue-600"
            >
            <label for="vaccinated" class="text-gray-700">Only Vaccinated</label>
          </div>

          <!-- Neutered -->
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="neutered" 
              v-model="filters.neutered" 
              class="form-checkbox h-5 w-5 text-blue-600"
            >
            <label for="neutered" class="text-gray-700">Only Neutered</label>
          </div>

          <!-- Urgent Adoption Needed -->
          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="urgentAdoptionNeeded" 
              v-model="filters.urgentAdoptionNeeded" 
              class="h-5 w-5 border-2 border-red-600 bg-red-200 text-red-600 checked:bg-red-600 checked:border-red-600 focus:ring-red-500"
            >
            <label for="urgentAdoptionNeeded" class="text-red-600 font-medium">Urgent Adoption Needed</label>
          </div>

          <div class="flex items-center">
            <button 
              v-if="isAnyFilterApplied"
              @click="resetFilters"
              class="group relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 hover:border-gray-300"
            >
              <!-- Clear Icon -->
              <svg 
                class="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              
              <!-- Button Text -->
              <span>Clear Filters</span>

              <!-- Active Filters Badge -->
              <span 
                class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
              >
                {{ Object.values(filters).filter(value => value !== '' && value !== false).length }}
              </span>
            </button>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
      <p class="mt-2 text-gray-600">Loading shelters...</p>
    </div>
    

    <div v-else v-for="shelter in sheltersWithPets" :key="shelter.id" class="mb-16 mx-24 p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm">
      <!-- Shelter Header (Redesigned) -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden mb-8">
        <div class="flex items-center p-6">
          <!-- Shelter Image (Left side) -->
          <div class="mr-8">
            <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                v-if="shelter.profilePicture"
                :src="'data:image/jpeg;base64,' + shelter.profilePicture" 
                :alt="shelter.username"
                class="w-full h-full object-cover" 
              />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <span class="text-gray-400">No Image</span>
              </div>
            </div>
          </div>
          
          <!-- Shelter Info (Middle) -->
          <div class="flex-1">
            <div class="flex items-center mb-1">
              <h2 class="text-2xl font-bold text-gray-800">{{ shelter.username }}</h2>
              <span class="ml-3 px-3 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">{{ shelter.shelterType }}</span>
            </div>
            
            <div class="flex items-center text-gray-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ shelter.city }}, {{ shelter.county || "N/A" }}</span>
            </div>
            
            <div class="flex items-center gap-4 mb-4">
              <div class="flex items-center">
                <span class="font-semibold mr-2">{{ shelter.pets ? shelter.pets.length : 0 }}</span>
                <span class="text-gray-600">Pets</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold mr-2">{{ shelter.pets ? shelter.pets.filter(pet => pet.status === 'AVAILABLE').length : 0 }}</span>
                <span class="text-gray-600">Available</span>
              </div>
            </div>
            
            <div class="border-l-4 border-red-500 pl-3 italic text-gray-700">
              {{ shelter.biography || "This Shelter doesn't have a description yet." }}
            </div>
            
            <div class="flex items-center mt-4 gap-3">
              <button class="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact
              </button>
              <button class="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message Shelter
              </button>
              <button class="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
          
          <!-- View Profile Button (Right side) -->
          <div class="ml-4">
            <router-link 
              :to="`/shelter/${shelter.username}`"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center">
              View Profile
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      
      <!-- Shelter's Pets Grid -->
      <div v-if="shelter.pets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32">
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
      <div v-else class="text-center text-gray-500 py-6">
        <p>No pets available in this shelter.</p>
      </div>
    </div>

    <!-- No Results State -->
    <div v-if="!loading && sheltersWithPets.length === 0" class="text-center py-20">
      <img src="../assets/empty-state.png" alt="No Pets" class="mx-auto w-50 h-48 mb-6" />
      <h2 class="text-2xl font-bold text-gray-800">No pets match your search</h2>
      <p class="text-gray-600 max-w-md mx-auto">We couldn't find any pets matching your current filters. Try adjusting your filters to see more pets.</p>
      <button 
        @click="resetFilters" 
        class="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
      >
        <svg 
          class="w-4 h-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear All Filters
      </button>
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
.filter-input {
  @apply border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition;
}

.filter-input:focus {
  border-color: #5973A8; 
  box-shadow: 0 0 5px rgba(89, 115, 168, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>