<template>
  <div class="bg-white max-w-[90rem] mx-auto rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
      <h2 class="text-xl font-bold text-gray-800 mb-1">Filter Your Favorites</h2>
      <p class="text-gray-500 text-sm">Find the perfect match among your saved pets</p>
    </div>

    <!-- Top Row: Search & Toggle Filters -->
    <div class="px-6 py-8 flex flex-col md:flex-row gap-6 md:items-center">
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

      <div class="flex flex-wrap items-center gap-4 md:justify-end">
        <!-- Sort Button/Dropdown -->
        <div class="relative">
          <select 
            v-model="sortBy" 
            class="appearance-none pl-4 pr-10 py-3.5 font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm"
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
          class="flex items-center gap-2 px-5 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm relative"
          :class="{'ring-2 ring-red-500 bg-red-50': showFilters || isAnyFilterApplied}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="isAnyFilterApplied ? 'text-red-500' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="font-medium" :class="isAnyFilterApplied ? 'text-red-600' : ''">{{ showFilters ? "Hide Filters" : "Show Filters" }}</span>
          <span v-if="isAnyFilterApplied" class="flex items-center justify-center min-w-5 h-5 px-1.5 absolute -top-2 -right-2 text-xs font-bold text-white bg-red-500 rounded-full shadow-md animate-pulse-slow">
            {{ countAppliedFilters() }}
          </span>
        </button>
      </div>
    </div>

    <!-- Filters Section-->
    <transition 
      name="fade"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showFilters" class="px-6 py-5 border-t border-gray-100 bg-gray-50">
        <!-- Active Filters Display -->
        <div v-if="isAnyFilterApplied" class="mb-6 flex flex-wrap gap-2">
          <div class="text-sm text-gray-500 flex items-center">
            <span class="mr-2">Active filters:</span>
          </div>
          
          <div v-for="(value, key) in activeFilters" :key="key" 
              class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1.5 rounded-full">
            <span>{{ formatFilterLabel(key) }}: {{ formatFilterValue(key, value) }}</span>
            <button @click="clearSingleFilter(key)" class="ml-1.5 text-red-600 hover:text-red-800">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <button 
            @click="resetFilters" 
            class="text-xs font-medium text-red-700 hover:text-red-800 hover:underline flex items-center ml-auto"
          >
            Clear All
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          
          <!-- Filter Fields -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Species</label>
            <div class="relative">
              <select v-model="filters.species" class="enhanced-filter-input">
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Breed Dropdown-->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Breed</label>
            <div class="relative group">
              <select 
                v-model="filters.breed" 
                class="enhanced-filter-input"
                :class="{'cursor-not-allowed bg-gray-100 text-gray-400': !filters.species}"
                :disabled="!filters.species"
              >
                <option value="">All Breeds</option>
                <option v-for="breed in breedOptions" :key="breed" :value="breed">
                  {{ breed }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!--  Tooltip message on hover -->
              <div 
                v-if="!filters.species" 
                class="absolute left-0 -bottom-12 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg w-48"
              >
                Please select a species first
                <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Gender</label>
            <div class="relative">
              <select v-model="filters.sex" class="enhanced-filter-input">
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Size</label>
            <div class="relative">
              <select v-model="filters.size" class="enhanced-filter-input">
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Health Status</label>
            <div class="relative">
              <select v-model="filters.healthStatus" class="enhanced-filter-input">
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
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- County Filter -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">County</label>
            <div class="relative">
              <select v-model="filters.county" class="enhanced-filter-input" @change="handleCountyChange">
                <option value="">All Counties</option>
                <option v-for="county in counties" :key="county.code" :value="county.code">
                  {{ county.name }} ({{ county.code }})
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- City Filter -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">City</label>
            <div class="relative group">
              <select 
                v-model="filters.city" 
                class="enhanced-filter-input"
                :class="{'cursor-not-allowed bg-gray-100 text-gray-400': !filters.county}"
                :disabled="!filters.county"
              >
                <option value="">All Cities</option>
                <option v-for="city in availableCities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!--  Tooltip message on hover -->
              <div 
                v-if="!filters.county" 
                class="absolute left-0 -bottom-12 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg w-48"
              >
                Please select a county first
                <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
              </div>
            </div>
          </div>

          <!-- Checkboxes and Clear Filters Button on same line -->
          <div class="lg:col-span-5 flex flex-wrap items-center justify-between gap-6 mt-4">
            <!-- Checkboxes -->
            <div class="flex flex-wrap gap-6">
              <!-- Vaccinated -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="vaccinated" 
                  v-model="filters.vaccinated" 
                  class="w-5 h-5 rounded text-red-500 border-gray-300 focus:ring-red-500"
                >
                <label for="vaccinated" class="ml-2 text-gray-700 font-medium">Only Vaccinated</label>
              </div>

              <!-- Neutered -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="neutered" 
                  v-model="filters.neutered" 
                  class="w-5 h-5 rounded text-red-500 border-gray-300 focus:ring-red-500"
                >
                <label for="neutered" class="ml-2 text-gray-700 font-medium">Only Neutered</label>
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
            <button 
              v-if="isAnyFilterApplied"
              @click="resetFilters"
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'FilterSearchFavorites',

  props: {
    shelters: {
      type: Array,
      required: true
    },
    countyData: {
      type: Object,
      required: true
    }
  },

  emits: ['update:filters', 'update:sortBy'],

  setup(props, { emit }) {
    const showFilters = ref(false);
    const sortBy = ref("");
    
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
      status: "", 
      county: "", 
      city: ""
    });


    const activeFilters = computed(() => {
      const result = {};
      for (const [key, value] of Object.entries(filters.value)) {
        if (value && value !== "" && value !== false) {
          result[key] = value;
        }
      }
      return result;
    });


    const formatFilterLabel = (key) => {
      const labels = {
        name: "Name",
        species: "Species",
        breed: "Breed",
        sex: "Gender",
        size: "Size",
        healthStatus: "Health",
        vaccinated: "Vaccinated",
        neutered: "Neutered",
        urgentAdoptionNeeded: "Urgent",
        status: "Status",
        county: "County",
        city: "City"
      };
      return labels[key] || key;
    };


    const formatFilterValue = (key, value) => {
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      if (key === 'status') {
        const statusLabels = {
          'AVAILABLE': 'Available',
          'PENDING': 'Pending',
          'ADOPTED': 'Adopted'
        };
        return statusLabels[value] || value;
      }
      return value;
    };


    const clearSingleFilter = (key) => {
      if (typeof filters.value[key] === 'boolean') {
        filters.value[key] = false;
      } else {
        filters.value[key] = "";
      }
      emitFilters();
    };


    const countAppliedFilters = () => {
      return Object.values(filters.value).filter(value => value !== "" && value !== false).length;
    };


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
        status: "",
        county: "",
        city: ""
      };
      emitFilters();
    };


    const handleCountyChange = () => {
      filters.value.city = ""; 
      emitFilters();
    };


    const counties = computed(() => {
      return props.countyData.counties || [];
    });


    const availableCities = computed(() => {
      if (!filters.value.county) return [];
      
      const county = filters.value.county.toUpperCase();
      const citiesByCounty = props.countyData.citiesByCounty || {};
      
      if (citiesByCounty[county]) {
        return citiesByCounty[county];
      }
      
      const countyCodeToName = props.countyData.countyCodeToName || {};
      const countyNameToCode = props.countyData.countyNameToCode || {};
      
      const countyName = countyCodeToName[county];
      if (countyName) {
        const countyCode = countyNameToCode[countyName];
        if (countyCode && citiesByCounty[countyCode]) {
          return citiesByCounty[countyCode];
        }
      }
      
      return [];
    });


    const breedOptions = computed(() => {
      if (!filters.value.species) return [];
      
      const allBreeds = props.shelters
        .flatMap(shelter => (shelter.pets || []))
        .filter(pet => pet && pet.species && 
                pet.species.toLowerCase() === filters.value.species.toLowerCase())
        .map(pet => pet.breed)
        .filter(breed => breed); 
      
      return [...new Set(allBreeds)].sort();
    });


    const isAnyFilterApplied = computed(() => {
      return Object.values(filters.value).some(value => {
        return value !== "" && value !== false;
      });
    });


    const emitFilters = () => {
      emit('update:filters', filters.value);
    };


    watch(filters, () => {
      emitFilters();
    }, { deep: true });


    watch(sortBy, (newValue) => {
      emit('update:sortBy', newValue);
    });


    return {
      filters,
      showFilters,
      sortBy,
      activeFilters,
      counties,
      availableCities,
      breedOptions,
      isAnyFilterApplied,
      
      formatFilterLabel,
      formatFilterValue,
      clearSingleFilter,
      countAppliedFilters,
      resetFilters,
      handleCountyChange
    };
  }
};
</script>

<style scoped>
.enhanced-filter-input {
  @apply appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl w-full shadow-sm transition duration-200 ease-in-out;
  @apply hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none;
}

.enhanced-filter-input:disabled {
  @apply cursor-not-allowed bg-gray-100 text-gray-400;
}

[type="checkbox"] {
  @apply rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200;
}

[type="checkbox"]:checked {
  @apply bg-red-500 border-transparent;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>