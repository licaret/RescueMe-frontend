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
    <SearchAndFilterEvents 
      :filters="filters"
      :sort-by="sortBy"
      :is-logged-in="isLoggedIn"
      :counties="counties"
      :is-any-filter-applied="isAnyFilterApplied"
      :active-filter-count="activeFilterCount"
      @update:filters="filters = $event"
      @update:sort-by="sortBy = $event"
      @clear-filters="resetFilters"
      @clear-single-filter="clearSingleFilter"
      :getActiveFilters="getActiveFilters"
      :formatFilterName="formatFilterName"
      :formatFilterValue="formatFilterValue"
    />

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
      
      <!-- Clear All Filters button -->
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

    <div class="fixed inset-0 pointer-events-none z-[9999]">
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
import { fetchAllEvents } from '@/services/event_service';
import Navbar from '@/components/Navbar.vue';
import EventCard from '@/components/EventCard.vue';
import SearchAndFilterEvents from '@/components/SearchAndFilterEvents.vue';
import judete from "@/assets/judete.json";

export default {
  name: 'EventsPage',
  components: {
    Navbar,
    EventCard,
    SearchAndFilterEvents
  },
  setup() {
    const events = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = 12;
    const sortBy = ref("");
    

    const isLoggedIn = computed(() => {
      return localStorage.getItem('token') !== null;
    });

    
    const isAdmin = computed(() => {
      return localStorage.getItem('Role') === 'SHELTER';
    });


    const filters = ref({
      title: "",
      eventType: "",
      location: "",
      dateRange: "",
      county: "",
      city: "",
      attendanceStatus: ""
    });


    const counties = computed(() => 
      judete.judete.map(judet => judet.nume).sort()
    );
    

    watch(() => filters.value, () => {
      currentPage.value = 1;
    }, { deep: true });

    watch(() => sortBy.value, () => {
      currentPage.value = 1;
    });


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
        case 'attendanceStatus': return 'Attendance';
        default: return formatted;
      }
    };

    
    const formatFilterValue = (value) => {
      if (value === 'attending') return 'Attending';
      if (value === 'maybe') return 'Interested';
      if (value === 'notAttending') return 'Not Attending';
      if (value === 'noResponse') return 'No Response';
      
      if (value === 'today') return 'Today';
      if (value === 'tomorrow') return 'Tomorrow';
      if (value === 'thisWeek') return 'This Week';
      if (value === 'nextWeek') return 'Next Week';
      if (value === 'thisMonth') return 'This Month';
      
      return value;
    };

    
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

    
    const applyAttendanceStatusFilter = (event) => {
      const status = event.userAttendanceStatus;

      switch (filters.value.attendanceStatus) {
        case 'attending':
          return status === 'GOING';
        case 'maybe':
          return status === 'INTERESTED';
        case 'noResponse':
          return status === null || status === undefined;
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


    const clearSingleFilter = (key) => {
      filters.value[key] = '';
    };


    const activeFilterCount = computed(() => {
      return Object.values(filters.value).filter(value => 
        value !== "" && value !== false && value !== null && value !== undefined
      ).length;
    });


    const isAnyFilterApplied = computed(() => {
      return activeFilterCount.value > 0;
    });


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


    const handleEventUpdated = (updatedEvent) => {
      const index = events.value.findIndex(e => e.id === updatedEvent.id);
      if (index !== -1) {
        events.value[index] = {...updatedEvent};
      }
    };
    

    const handleEventDeleted = (eventId) => {
      events.value = events.value.filter(event => event.id !== eventId);
    };


    const filteredEvents = computed(() => {
      if (!events.value || events.value.length === 0) {
        return [];
      }
      return events.value
        .filter(event => event.isActive)
        .filter(event => {
          if (filters.value.title && !event.title.toLowerCase().includes(filters.value.title.toLowerCase())) {
            return false;
          }
          
          if (filters.value.eventType && event.eventType !== filters.value.eventType) {
            return false;
          }
          
          if (filters.value.location && !event.location.toLowerCase().includes(filters.value.location.toLowerCase())) {
            return false;
          }
          
          if (filters.value.county && event.county !== filters.value.county) {
            return false;
          }
          
          if (filters.value.city && event.city !== filters.value.city) {
            return false;
          }
          
          if (!applyDateRangeFilter(event)) {
            return false;
          }

          if (!applyAttendanceStatusFilter(event)) {
            return false;
          }
          
          return true;
        })
        .sort((a, b) => {
          if (!sortBy.value) return 0;

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

    
    watch(filters, () => {
      currentPage.value = 1;
    }, { deep: true });

    watch(sortBy, () => {
      currentPage.value = 1;
    });


    return {
      events,
      loading,
      isAdmin,
      isLoggedIn,
      filters,
      sortBy,
      filteredEvents,
      paginatedEvents,
      currentPage,
      totalPages,
      displayedPages,
      counties,
      isAnyFilterApplied,
      activeFilterCount,

      handleEventUpdated,
      handleEventDeleted,
      resetFilters,
      getActiveFilters,
      formatFilterName,
      formatFilterValue,
      clearSingleFilter,
      goToPage
    };
  }
}
</script>