<template>
    <div class="bg-gradient-to-b from-gray-90 to-gray-100 min-h-screen p-4 pl-2 mt-4 space-y-4">
  
      <!-- Header Section -->
      <div class="max-w-full">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Manage Events</h1>
            <p class="text-gray-600 mt-1">Create, edit and manage your shelter events</p>
          </div>
          <button 
            @click="showAddEditEventForm = true" 
            class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all duration-200 hover:translate-y-[-2px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </button>
        </div>
  
        <!-- Search and Filter Section -->
        <SearchFilterEventsForShelters 
          v-model:filters="filters" 
          v-model:sort="sortBy" 
          @reset-filters="resetFilters"
          @active-filters="activeFilters = $event"
        />
  
        <!-- Events Grid Section -->
        <div v-if="filteredEvents.length > 0" class="space-y-6 mt-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            <EventCard 
              v-for="event in paginatedEvents" 
              :key="event.id" 
              :event="event" 
              @eventDeleted="removeEventFromList" 
              @event-updated="updateEventInList"
              @edit-event="openEditForm"
            />
          </div>
          
          <!-- Pagination Component -->
          <div v-if="totalPages > 1" class="flex justify-center py-5">
            <nav class="inline-flex -space-x-px" aria-label="Pagination">
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
        <div v-else-if="isAnyFilterApplied && filteredEvents.length === 0" class="w-full py-16 text-center">
          <!-- Text content -->
          <h2 class="text-2xl font-bold text-gray-800 mb-3">No matching events found</h2>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any events that match your current filters. Try adjusting or clearing your filters to see more events.
          </p>
          
          <!-- Applied filters summary -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-md mx-auto">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Applied filters:</h3>
            <div class="flex flex-wrap gap-2 justify-center">
              <div v-for="(value, key) in activeFilters" :key="key" 
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
        
        <!-- No Events at All -->
        <div v-else-if="events.length === 0 && !isAnyFilterApplied" class="w-full py-16 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Create your first event</h2>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't created any events yet. Start organizing events to engage your community and help animals find their forever homes.
          </p>
          
          <!-- Create Your First Event button -->
          <button 
            @click="showAddEditEventForm = true" 
            class="group bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Event
          </button>
        </div>
  
      </div>
  
      <Teleport to="body" v-if="showAddEditEventForm">
        <div class="fixed inset-0 z-[10001] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
          <AddEditEventForm 
            :eventToEdit="eventToEdit"
            @close="closeForm"
            @event-added="handleEventAdded"
            @event-updated="updateEventInList"
            :key="formKey"
          />
        </div>
      </Teleport>
  
    </div>
  </template>
  
  <script>
  import { useRoute } from 'vue-router';
  import { ref, computed, onMounted, watch  } from 'vue';
  import { fetchShelterEvents } from "@/services/event_service.js";
  import AddEditEventForm from '@/components/AddEditEventForm.vue';
  import EventCard from '@/components/EventCard.vue';
  import SearchFilterEventsForShelters from '@/components/SearchFilterEventsForShelters.vue';
  
  export default {
    name: 'ManageEvents',
    components: {
      EventCard,
      AddEditEventForm,
      SearchFilterEventsForShelters
    },
  
    setup() {
      const route = useRoute();

      const events = ref([]);
      const Id = localStorage.getItem("Id");
      const showAddEditEventForm = ref(false);
      const formKey = ref(0);

      const eventToEdit = ref(null);
  
      const itemsPerPage = 12;
      const currentPage = ref(1);
      
      const activeFilters = ref({});
      const sortBy = ref(""); 
  
      const filters = ref({
        title: "",
        eventType: "",
        location: "",
        dateRange: "",
        isActive: "",
        county: "",
        city: ""
      });

      const openEditForm = (event) => {
        eventToEdit.value = event;
        formKey.value++; 
        showAddEditEventForm.value = true;
      };

      const closeForm = () => {
        showAddEditEventForm.value = false;
        eventToEdit.value = null;
      };


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
        currentPage.value = 1;
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


      const activeFilterCount = computed(() => {
        return Object.values(filters.value).filter(value => 
          value !== "" && value !== false && value !== null && value !== undefined
        ).length;
      });


      const isAnyFilterApplied = computed(() => {
        return activeFilterCount.value > 0;
      });
  
  
      const loadEvents = async () => {
        if (!Id) {
          console.error("No shelter ID found");
          return;
        }
        try {
          console.log("Loading events...");
          const eventsData = await fetchShelterEvents(Id);
  
          if (!eventsData) {
            console.error("fetchShelterEvents returned null!");
            return;
          }
  
          events.value = eventsData;
          console.log("Events stored in state:", events.value);
        } catch (error) {
          console.error("Error loading events:", error);
        }
      };
  

      const handleEventAdded = async (newEvent) => {   
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await loadEvents(); 
      };
      

      const removeEventFromList = (eventId) => {
        events.value = events.value.filter((event) => event.id !== eventId);
        console.log(`Event with ID ${eventId} removed from local list`);
      };
  

      const updateEventInList = (updatedEvent) => {
        const index = events.value.findIndex((e) => e.id === updatedEvent.id);
        if (index !== -1) {
          events.value = [
            ...events.value.slice(0, index),
            updatedEvent,
            ...events.value.slice(index + 1)
          ];
        }
      };


      const filteredEvents = computed(() => {
      if (!events.value || events.value.length === 0) {
        return [];
      }

      return events.value
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
          
          if (filters.value.isActive) {
            const isActiveFilter = filters.value.isActive === "true";
            if (event.isActive !== isActiveFilter) {
              return false;
            }
          }
          
          if (!applyDateRangeFilter(event)) {
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
          
          if (sortBy.value === "location") {
            return a.location.localeCompare(b.location);
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

    
    watch(() => [filters.value, sortBy.value], () => {
      currentPage.value = 1;
    }, { deep: true });


    onMounted(async () => {
      await loadEvents();
      if (route.query.openForm === 'true') {
        showAddEditEventForm.value = true;
      }
    });

    
    return { 
      events, 
      filteredEvents,
      showAddEditEventForm, 
      formKey, 
      filters,  
      sortBy,
      activeFilters,
      activeFilterCount,
      isAnyFilterApplied,
      currentPage,
      totalPages,
      paginatedEvents,
      eventToEdit,
      displayedPages,
      
      goToPage,
      handleEventAdded, 
      resetFilters, 
      removeEventFromList, 
      updateEventInList, 
      formatFilterName,
      formatFilterValue,
      openEditForm,
      closeForm
    };
  },
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

.primary-button {
  @apply shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out;
  @apply hover:-translate-y-0.5;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>