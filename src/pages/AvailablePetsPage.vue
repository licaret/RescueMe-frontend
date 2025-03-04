<template>
    <Navbar></Navbar>
    <div class="p-14 mt-20 space-y-20">

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

          <!-- <input type="number" v-model="filters.age" placeholder="Filter by age..." class="filter-input"/> -->

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

          <!-- <input type="number" v-model="filters.timeSpentInShelter" placeholder="Days in shelter..." class="filter-input"/> -->

          <!-- <select v-model="sortOrder" class="filter-input">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select> -->

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
  
      
  
      <!-- Shelters Section -->
      <div v-for="shelter in sheltersWithPets" :key="shelter.id" class="mb-12">
        <!-- Shelter Header -->
        <div class="bg-white rounded-xl border border-gray-300 shadow-lg overflow-hidden mb-6">
          <div class="flex flex-col md:flex-row">
            <!-- Shelter Image -->
            <div class="w-full md:w-1/4 h-48 md:h-auto">
              <img :src="shelter.imageUrl" :alt="shelter.name" class="w-full h-full object-cover" />
            </div>
            <!-- Shelter Info -->
            <div class="w-full md:w-3/4 p-6 flex flex-col justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ shelter.name }}</h2>
                <p class="text-gray-600">{{ shelter.location }}</p>
                <p class="text-gray-700 mt-4">{{ shelter.description }}</p>
              </div>
              <div class="flex justify-end mt-4">
                <button class="px-4 py-2 text-red-600 font-medium hover:text-red-800 transition-colors">
                  View Shelter Profile →
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Shelter's Pets Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="pet in shelter.pets" :key="pet.id" class="mb-8">
            <!-- Using modified version of your PetCard component -->
            <div class="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow flex flex-col justify-between relative h-full">
              <!-- Card Header -->
              <div class="p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-bold">{{ pet.name || '' }}</h3>
                    <p class="text-sm text-gray-500">{{ pet.breed || '' }}</p>
                  </div>
                  <span :class="`px-3 py-1 rounded-full text-sm font-semibold ${
                    pet.status === 'AVAILABLE' 
                      ? 'bg-green-100 text-green-800'
                      : pet.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800' 
                  }`">
                    {{ pet.status || '' }}
                  </span>
                </div>
              </div>
  
              <!-- Pet Image -->
              <div class="p-4 pt-0 relative">
                <div class="flex items-center justify-center">
                  <img
                    v-if="pet.photos && pet.photos.length > 0"
                    :src="pet.photos[0]?.url"
                    alt="Pet Photo"
                    class="w-full h-48 object-cover rounded-lg"
                  />
                  <p v-else class="text-gray-500">No photo available</p>
                </div>
              </div>
  
              <!-- Pet Details -->
              <div class="p-4 pt-0">
                <div class="flex flex-wrap gap-2">
                  <div class="border border-gray-300 rounded-full px-3 py-1 text-sm bg-gray-50">
                    <span class="font-semibold">Age:</span> {{ formatAge(pet.age) }}
                  </div>
                  <div class="border border-gray-300 rounded-full px-3 py-1 text-sm bg-gray-50">
                    <span class="font-semibold">Sex:</span> {{ pet.sex }}
                  </div>
                  <div class="border border-gray-300 rounded-full px-3 py-1 text-sm bg-gray-50">
                    <span class="font-semibold">Size:</span> {{ pet.size }}
                  </div>
                  <div v-if="pet.urgentAdoptionNeeded" class="border border-red-600 rounded-full px-3 py-1 text-sm bg-red-50 text-red-600 font-bold">
                    Urgent Adoption Needed
                  </div>
                </div>
              </div>
  
              <!-- Adopt Button -->
              <div class="p-4 pt-0 text-center">
                <button class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  ADOPT NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- No Results State -->
      <div v-if="sheltersWithPets.length === 0" class="text-center py-20">
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
  import { ref, computed, onMounted } from 'vue';
  import Navbar from "@/components/Navbar.vue";

  export default {
    name: 'AvailablePets',
    components: {
        Navbar, 
    },
    setup() {
      const shelters = ref([]);
      const loading = ref(true);
      const showFilters = ref(false);
      
      const filters = ref({
        name: "",
        species: "",
        sex: "",
        size: "",
        healthStatus: "",
        vaccinated: "",
        neutered: "",
        urgentAdoptionNeeded: "",
        status: "AVAILABLE", // Default to only showing available pets
      });
  
      const resetFilters = () => {
        filters.value = {
          name: "",
          species: "",
          sex: "",
          size: "",
          healthStatus: "",
          vaccinated: "",
          neutered: "",
          urgentAdoptionNeeded: "",
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
            return pet.name?.toLowerCase().includes(filters.value.name.toLowerCase());
          }
  
          return pet[key]?.toString().toLowerCase() === filters.value[key].toLowerCase();
        });
      };
  
      const sheltersWithPets = computed(() => {
        return shelters.value
          .map(shelter => {
            // Apply filters to each shelter's pets
            const filteredPets = shelter.pets.filter(filterPet);
            
            // Return a new shelter object with only the filtered pets
            return {
              ...shelter,
              pets: filteredPets
            };
          })
          // Only include shelters that have pets matching the filters
          .filter(shelter => shelter.pets.length > 0);
      });
  
      // Load shelter and pet data
      const loadData = async () => {
        try {
          // This would normally be an API call
          shelters.value = [
            {
              id: 1,
              name: "Snuggles & Whiskers Home",
              location: "Baia Mare, Maramureș",
              description: "We're dedicated to finding loving homes for dogs and cats of all ages and breeds. Our shelter provides temporary care and rehabilitation for abandoned and rescued animals.",
              imageUrl: "/api/placeholder/800/400", // Replace with actual image path
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
                  photos: [{ url: "/api/placeholder/400/400" }],
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
                  status: "AVAILABLE",
                  healthStatus: "Healthy",
                  vaccinated: true,
                  neutered: true,
                  urgentAdoptionNeeded: false,
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
                  photos: [{ url: "/api/placeholder/400/400" }],
                  story: "Whiskers was found abandoned and needs a loving home urgently."
                }
              ]
            },
            {
              id: 2,
              name: "Paws & Claws Rescue",
              location: "Cluj-Napoca, Cluj",
              description: "Our mission is to rescue, rehabilitate, and rehome abandoned and abused animals. We focus on providing medical care and finding the perfect forever homes.",
              imageUrl: "/api/placeholder/800/400", // Replace with actual image path
              pets: [
                {
                  id: 201,
                  name: "Rocky",
                  breed: "Pitbull Mix",
                  species: "Dog",
                  sex: "Male",
                  age: 4,
                  size: "Large",
                  status: "AVAILABLE",
                  healthStatus: "Healthy",
                  vaccinated: true,
                  neutered: true,
                  urgentAdoptionNeeded: false,
                  photos: [{ url: "/api/placeholder/400/400" }],
                  story: "Rocky is a gentle soul who loves people and other dogs. He's looking for an active family."
                },
                {
                  id: 202,
                  name: "Mittens",
                  breed: "Calico",
                  species: "Cat",
                  sex: "Female",
                  age: 3,
                  size: "Small",
                  status: "AVAILABLE",
                  healthStatus: "Healthy",
                  vaccinated: true,
                  neutered: true,
                  urgentAdoptionNeeded: false,
                  photos: [{ url: "/api/placeholder/400/400" }],
                  story: "Mittens is a sweet lap cat who loves to be petted and cuddled."
                },
                {
                  id: 203,
                  name: "Buddy",
                  breed: "Labrador Retriever",
                  species: "Dog",
                  sex: "Male",
                  age: 2,
                  size: "Large",
                  status: "AVAILABLE",
                  healthStatus: "Minor Issues",
                  vaccinated: true,
                  neutered: false,
                  urgentAdoptionNeeded: true,
                  photos: [{ url: "/api/placeholder/400/400" }],
                  story: "Buddy was rescued from a bad situation and needs a patient, loving home to help him overcome his past."
                }
              ]
            }
          ];
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(loadData);
  
      return {
        shelters,
        sheltersWithPets,
        loading,
        filters,
        showFilters,
        resetFilters,
        isAnyFilterApplied,
        formatAge
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
  </style>