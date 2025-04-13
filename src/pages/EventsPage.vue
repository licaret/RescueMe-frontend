<template>
  <Navbar />

  <div class="bg-gradient-to-b from-gray-90 to-gray-100 min-h-screen p-3 md:p-5 lg:p-6 mt-28 space-y-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-medium text-gray-800 relative inline-block">
        <span class="relative z-10">Explore Upcoming Events</span>
        <span class="absolute -bottom-3 left-0 w-full h-4 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20 rounded-lg"></span>
      </h1>
      <p class="text-gray-600 mt-6 max-w-2xl mx-auto">Discover animal-related events organized by shelters across the country</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white max-w-[90rem] mx-auto rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
        <h2 class="text-xl font-bold text-gray-800 mb-1">Explore Upcoming Events</h2>
        <p class="text-gray-500 text-sm">Filter and search to find events that interest you</p>
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
              <option value="attendeesCount-desc">Most Popular</option>
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

            <!-- Attendance Status Filter -->
            <div class="space-y-2" v-if="isLoggedIn">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Your Attendance</label>
              <div class="relative">
                <select v-model="filters.attendanceStatus" class="enhanced-filter-input">
                  <option value="">All Events</option>
                  <option value="attending">Events I'm Attending</option>
                  <option value="maybe">Events I'm Interested In</option>
                  <option value="noResponse">Events I Haven't Responded To</option>
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

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block relative">
        <div class="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-red-500"></div>
        <div class="absolute top-0 left-0 h-14 w-14 rounded-full border-4 border-red-300 border-t-transparent animate-pulse opacity-50"></div>
      </div>
      <p class="mt-6 text-gray-600 font-medium animate-pulse">Loading events...</p>
    </div>

    <div v-if="!loading && filteredEvents.length" class="max-w-[90rem] mx-auto space-y-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <EventCard
          v-for="event in paginatedEvents"
          :key="event.id"
          :event="event"
          :isAdmin="isAdmin"
          @event-updated="handleEventUpdated"
          @eventDeleted="handleEventDeleted"
          class="w-full transition-transform duration-300 hover:-translate-y-1"
        />
      </div>
      
      <!-- Pagination Component -->
      <div v-if="totalPages > 1" class="flex justify-center py-5">
        <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- First page -->
          <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
            :class="{'cursor-not-allowed bg-gray-100': currentPage === 1, 'hover:text-gray-700': currentPage !== 1}"
          >
            <span class="sr-only">First</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M13.28 3.97a.75.75 0 010 1.06L6.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0zm4.28 0a.75.75 0 010 1.06L10.53 12l7.03 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Previous page -->
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
            :class="{'cursor-not-allowed bg-gray-100': currentPage === 1, 'hover:text-gray-700': currentPage !== 1}"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Page numbers -->
          <template v-for="page in displayedPages" :key="page">
            <span 
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
            <button
              v-else
              @click="goToPage(page)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0"
              :class="currentPage === page 
                ? 'z-10 bg-red-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600' 
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </template>

          <!-- Next page -->
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
            :class="{'cursor-not-allowed bg-gray-100': currentPage === totalPages, 'hover:text-gray-700': currentPage !== totalPages}"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Last page -->
          <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
            :class="{'cursor-not-allowed bg-gray-100': currentPage === totalPages, 'hover:text-gray-700': currentPage !== totalPages}"
          >
            <span class="sr-only">Last</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M6.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L13.69 12 6.72 5.03a.75.75 0 010-1.06zm-4.28 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L10.47 12 3.44 5.03a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <!-- No Results from Filters -->
    <div v-else-if="isAnyFilterApplied && filteredEvents.length === 0 && !loading" class="w-full py-16 text-center">
      <!-- Text content -->
      <h2 class="text-2xl font-bold text-gray-800 mb-3">No matching events found</h2>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any events that match your current filters. Try adjusting or clearing your filters to see more events.
      </p>
      
      <!-- Applied filters summary -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-md mx-auto">
        <h3 class="text-sm font-medium text-gray-500 mb-2">Applied filters:</h3>
        <div class="flex flex-wrap gap-2 justify-center">
          <div v-for="(value, key) in getActiveFilters()" :key="key" 
               class="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 flex items-center">
            <span>{{ formatFilterName(key) }}: {{ formatFilterValue(value) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Call to action button -->
      <button 
        @click="resetFilters" 
        class="group bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2 mx-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear All Filters
      </button>
    </div>

    <!-- Modals Container with High Z-Index -->
    <div class="fixed inset-0 pointer-events-none z-[9999]">
      <!-- Any global modals or event card modals will be rendered here -->
    </div>

    <div v-if="!loading && !events.length && !isAnyFilterApplied" class="text-center py-20 max-w-xl mx-auto">
      <div class="rounded-2xl">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-red-600 mb-3">No events available yet</h2>
        <p class="text-gray-600">Please check back later for upcoming animal-related events!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, watch } from 'vue';
import Navbar from '@/components/Navbar.vue';
import EventCard from '@/components/EventCard.vue';
import { fetchAllEvents } from '@/services/event_service';
import judete from "@/assets/judete.json";

export default {
  name: 'EventsPage',
  components: {
    Navbar,
    EventCard
  },
  setup() {
    const events = ref([]);
    const loading = ref(true);
    const showFilters = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 12;
    
    // User state
    const isLoggedIn = computed(() => {
      return localStorage.getItem('token') !== null;
    });

    const userId = computed(() => {
      return localStorage.getItem('Id');
    });
    
    // Determine if user is admin (shelter)
    const isAdmin = computed(() => {
      return localStorage.getItem('Role') === 'SHELTER';
    });

    // Filter state
    const filters = ref({
      title: "",
      eventType: "",
      location: "",
      dateRange: "",
      county: "",
      city: "",
      attendanceStatus: ""
    });

    const sortBy = ref("");

    // Get counties from judete.json
    const counties = computed(() => 
      judete.judete.map(judet => judet.nume).sort()
    );
    
    // Get cities based on selected county
    const filteredCities = computed(() => {
      if (!filters.value.county) return [];
      
      const selectedCounty = judete.judete.find(judet => 
        judet.nume === filters.value.county
      );
      
      return selectedCounty 
        ? selectedCounty.localitati.map(loc => loc.nume).sort() 
        : [];
    });

    // Reset city when county changes
    watch(() => filters.value.county, () => {
      filters.value.city = '';
    });

    // Get active filters as an object
    const getActiveFilters = () => {
      const active = {};
      for (const [key, value] of Object.entries(filters.value)) {
        if (value !== "" && value !== false && value !== null && value !== undefined) {
          active[key] = value;
        }
      }
      return active;
    };

    // Format filter names for display
    const formatFilterName = (key) => {
      // Convert camelCase to Title Case with spaces
      const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      // Special cases
      switch (key) {
        case 'eventType': return 'Event Type';
        case 'dateRange': return 'Date Range';
        case 'attendanceStatus': return 'Attendance';
        default: return formatted;
      }
    };

    // Format filter values for display
    const formatFilterValue = (value) => {
      // For attendance status values
      if (value === 'attending') return 'Attending';
      if (value === 'maybe') return 'Interested';
      if (value === 'notAttending') return 'Not Attending';
      if (value === 'noResponse') return 'No Response';
      
      // For date range values
      if (value === 'today') return 'Today';
      if (value === 'tomorrow') return 'Tomorrow';
      if (value === 'thisWeek') return 'This Week';
      if (value === 'nextWeek') return 'Next Week';
      if (value === 'thisMonth') return 'This Month';
      
      return value;
    };

    // Apply date range filter to an event
    const applyDateRangeFilter = (event) => {
      if (!filters.value.dateRange) return true;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + 7 - today.getDay());
      
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const eventDate = new Date(event.startDateTime);
      
      switch(filters.value.dateRange) {
        case 'today':
          return eventDate.toDateString() === today.toDateString();
        case 'tomorrow':
          return eventDate.toDateString() === tomorrow.toDateString();
        case 'thisWeek': {
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return eventDate >= today && eventDate <= weekEnd;
        }
        case 'nextWeek': {
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          return eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
        }
        case 'thisMonth':
          return eventDate >= today && eventDate <= thisMonthEnd;
        default:
          return true;
      }
    };

    // Apply attendance status filter to an event
    const applyAttendanceStatusFilter = (event) => {
      if (!filters.value.attendanceStatus || !userId.value) return true;
      
      // Find the user's attendance record for this event
      const userAttendance = event.attendees ? 
        event.attendees.find(a => a.userId.toString() === userId.value.toString()) : null;
      
      switch(filters.value.attendanceStatus) {
        case 'attending':
          return userAttendance && userAttendance.status === 'ATTENDING';
        case 'maybe':
          return userAttendance && userAttendance.status === 'MAYBE';
        case 'notAttending':
          return userAttendance && userAttendance.status === 'NOT_ATTENDING';
        case 'noResponse':
          return !userAttendance;
        default:
          return true;
      }
    };

    const resetFilters = () => {
      filters.value = {
        title: "",
        eventType: "",
        location: "",
        dateRange: "",
        county: "",
        city: "",
        attendanceStatus: ""
      };
      currentPage.value = 1;
    };

    // Clear a single filter
    const clearSingleFilter = (key) => {
      filters.value[key] = '';
    };

    const activeFilterCount = computed(() => {
      return Object.values(filters.value).filter(value => 
        value !== "" && value !== false && value !== null && value !== undefined
      ).length;
    });

    // Computed value for checking if any filter is applied
    const isAnyFilterApplied = computed(() => {
      return activeFilterCount.value > 0;
    });

    // Load events on component mount
    onMounted(async () => {
      try {
        const response = await fetchAllEvents();
        events.value = response;
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        loading.value = false;
      }
    });

    // Handle event updates (like attendance changes)
    const handleEventUpdated = (updatedEvent) => {
      const index = events.value.findIndex(e => e.id === updatedEvent.id);
      if (index !== -1) {
        // Replace the entire event object to ensure Vue detects the change
        events.value[index] = {...updatedEvent};
      }
    };
    
    // Handle event deletion
    const handleEventDeleted = (eventId) => {
      events.value = events.value.filter(event => event.id !== eventId);
    };

    // Computed filtered events based on filters
    const filteredEvents = computed(() => {
      if (!events.value || events.value.length === 0) {
        return [];
      }

      return events.value
        .filter(event => {
          // Apply all filters
          if (filters.value.title && !event.title.toLowerCase().includes(filters.value.title.toLowerCase())) {
            return false;
          }
          
          if (filters.value.eventType && event.eventType !== filters.value.eventType) {
            return false;
          }
          
          if (filters.value.location && !event.location.toLowerCase().includes(filters.value.location.toLowerCase())) {
            return false;
          }

          // County filter
          if (filters.value.county && event.county !== filters.value.county) {
            return false;
          }
          
          // City filter
          if (filters.value.city && event.city !== filters.value.city) {
            return false;
          }
          
          // Check the date range filter
          if (!applyDateRangeFilter(event)) {
            return false;
          }

          // Check attendance status filter
          if (!applyAttendanceStatusFilter(event)) {
            return false;
          }
          
          return true;
        })
        .sort((a, b) => {
          if (!sortBy.value) return 0;

          // Handle different sort options
          if (sortBy.value === "startDateTime-desc") {
            return new Date(b.startDateTime) - new Date(a.startDateTime);
          }
          
          if (sortBy.value === "startDateTime") {
            return new Date(a.startDateTime) - new Date(b.startDateTime);
          }
          
          if (sortBy.value === "title") {
            return a.title.localeCompare(b.title);
          }
          
          if (sortBy.value === "attendeesCount-desc") {
            const countA = a.attendees ? a.attendees.filter(att => att.status === 'ATTENDING').length : 0;
            const countB = b.attendees ? b.attendees.filter(att => att.status === 'ATTENDING').length : 0;
            return countB - countA;
          }
          
          return 0;
        });
    });

    // Pagination calculations
    const totalPages = computed(() => {
      if (!filteredEvents.value || filteredEvents.value.length === 0) {
        return 0;
      }
      return Math.ceil(filteredEvents.value.length / itemsPerPage);
    });

    const paginatedEvents = computed(() => {
      if (!filteredEvents.value || filteredEvents.value.length === 0) {
        return [];
      }
      
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, filteredEvents.value.length);
      return filteredEvents.value.slice(startIndex, endIndex);
    });

    // Pagination display
    const displayedPages = computed(() => {
      if (!totalPages.value || totalPages.value <= 0) {
        return [];
      }

      if (totalPages.value <= 7) {
        return Array.from({ length: totalPages.value }, (_, i) => i + 1);
      }

      const pages = [1];
      
      let startPage = Math.max(2, currentPage.value - 1);
      let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
      
      if (startPage > 2) {
        pages.push('...');
      } else if (startPage === 2) {
        pages.push(2);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages.value) {
          pages.push(i);
        }
      }
      
      if (endPage < totalPages.value - 1) {
        pages.push('...');
      } else if (endPage === totalPages.value - 1) {
        pages.push(totalPages.value - 1);
      }
      
      if (totalPages.value > 1) {
        pages.push(totalPages.value);
      }
      
      return pages;
    });

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // Reset to first page when filters change
    watch(() => [filters.value, sortBy.value], () => {
      currentPage.value = 1;
    }, { deep: true });

    return {
      events,
      loading,
      isAdmin,
      isLoggedIn,
      handleEventUpdated,
      handleEventDeleted,
      showFilters,
      filters,
      sortBy,
      resetFilters,
      filteredEvents,
      paginatedEvents,
      currentPage,
      totalPages,
      displayedPages,
      goToPage,
      counties,
      filteredCities,
      getActiveFilters,
      formatFilterName,
      formatFilterValue,
      clearSingleFilter,
      isAnyFilterApplied,
      activeFilterCount
    };
  }
}
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