<template>
  <div class="bg-white max-w-full mx-auto rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
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
            v-model="filters.title"
            placeholder="Search by event title..."
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
            <option value="">Sort Events</option>
            <option value="title">By Title</option>
            <option value="startDateTime">By Date (Soonest)</option>
            <option value="startDateTime-desc">By Date (Latest)</option>
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
            {{ activeFilterCount }}
          </span>
        </button>
      </div>
    </div>

    <!--  Filters Section -->
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
          
          <div v-for="(value, key) in getActiveFilters()" :key="key" 
              class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1.5 rounded-full">
            <span>{{ formatFilterName(key) }}: {{ formatFilterValue(value) }}</span>
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
          
          <!-- Filter Fields  -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Event Type</label>
            <div class="relative">
              <select v-model="filters.eventType" class="enhanced-filter-input">
                <option value="">All Types</option>
                <option value="adoption">Adoption</option>
                <option value="fundraising">Fundraising</option>
                <option value="volunteer">Volunteer</option>
                <option value="educational">Educational</option>
                <option value="other">Other</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">County</label>
            <div class="relative">
              <select v-model="filters.county" class="enhanced-filter-input">
                <option value="">All Counties</option>
                <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">City</label>
            <div class="relative">
                <select v-model="filters.city" class="enhanced-filter-input" :disabled="!filters.county">
                  <option value="">All Cities</option>
                  <option v-for="city in filteredCities" :key="city" :value="city">{{ city }}</option>
                </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Location</label>
            <input
              v-model="filters.location"
              type="text"
              placeholder="Search by location"
              class="enhanced-filter-input"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Date Range</label>
            <div class="relative">
              <select v-model="filters.dateRange" class="enhanced-filter-input">
                <option value="">Any Date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="thisWeek">This Week</option>
                <option value="nextWeek">Next Week</option>
                <option value="thisMonth">This Month</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Status filter -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Status</label>
            <div class="relative">
              <select v-model="filters.isActive" class="enhanced-filter-input">
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Clear Filters Button -->
          <div class="lg:col-span-5 flex flex-wrap items-center gap-6 mt-4">                
            <button 
              v-if="isAnyFilterApplied"
              @click="resetFilters"
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ml-auto"
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
import judete from "@/assets/judete.json";

export default {
  name: 'SearchFilterEventsForShelters',
  emits: ['update:filters', 'update:sort', 'reset-filters'],
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        title: "",
        eventType: "",
        location: "",
        dateRange: "",
        isActive: "",
        county: "",
        city: ""
      })
    },
    sort: {
      type: String,
      default: ""
    }
  },
  
  setup(props, { emit }) {

    const filters = ref({...props.modelValue});
    const sortBy = ref(props.sort);
    const showFilters = ref(false);


    watch(filters, (newFilters) => {
      emit('update:filters', newFilters);
    }, { deep: true });


    watch(sortBy, (newSort) => {
      emit('update:sort', newSort);
    });


    watch(() => props.modelValue, (newValue) => {
      filters.value = {...newValue};
    }, { deep: true });


    watch(() => props.sort, (newValue) => {
      sortBy.value = newValue;
    });


    const counties = computed(() => 
      judete.judete.map(judet => judet.nume).sort()
    );

    
    const filteredCities = computed(() => {
      if (!filters.value.county) return [];
      
      const selectedCounty = judete.judete.find(judet => 
        judet.nume === filters.value.county
      );
      
      return selectedCounty 
        ? selectedCounty.localitati.map(loc => loc.nume).sort() 
        : [];
    });


    watch(() => filters.value.county, () => {
      filters.value.city = '';
    });

    
    const resetFilters = () => {
      filters.value = {
        title: "",
        eventType: "",
        location: "",
        dateRange: "",
        isActive: "",
        county: "",
        city: ""
      };
      emit('reset-filters');
    };


    const getActiveFilters = () => {
      const active = {};
      for (const [key, value] of Object.entries(filters.value)) {
        if (value !== "" && value !== false && value !== null && value !== undefined) {
          active[key] = value;
        }
      }
      return active;
    };


    const formatFilterName = (key) => {
      const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      switch (key) {
        case 'eventType': return 'Event Type';
        case 'dateRange': return 'Date Range';
        case 'isActive': return 'Status';
        default: return formatted;
      }
    };

    
    const formatFilterValue = (value) => {
      if (value === 'true') return 'Active';
      if (value === 'false') return 'Inactive';
      
      if (value === 'today') return 'Today';
      if (value === 'tomorrow') return 'Tomorrow';
      if (value === 'thisWeek') return 'This Week';
      if (value === 'nextWeek') return 'Next Week';
      if (value === 'thisMonth') return 'This Month';
      
      return value;
    };


    const activeFilterCount = computed(() => {
      return Object.values(filters.value).filter(value => 
        value !== "" && value !== false && value !== null && value !== undefined
      ).length;
    });


    const isAnyFilterApplied = computed(() => {
      return activeFilterCount.value > 0;
    });


    const clearSingleFilter = (key) => {
      filters.value[key] = '';
    };

    watch(filters, (newFilters) => {
      emit('update:filters', newFilters);
      emit('active-filters', getActiveFilters());
    }, { deep: true });


    emit('active-filters', getActiveFilters());


    return {
      filters,
      sortBy,
      showFilters,
      isAnyFilterApplied,
      activeFilterCount,
      counties,
      filteredCities,

      resetFilters,
      getActiveFilters,
      formatFilterName,
      formatFilterValue,
      clearSingleFilter
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

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>