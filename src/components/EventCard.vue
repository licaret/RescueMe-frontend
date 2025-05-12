<template>
  <div class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative flex flex-col h-full border border-gray-100">
    <!-- Card Header with Date/Calendar -->
    <div class="w-full bg-red-600 p-4 text-white">
      <div class="flex flex-col">
        <!-- Date Display -->
        <div class="text-3xl font-bold">{{ formatDay(event.startDateTime) }}</div>
        <div class="text-sm">{{ formatMonthYear(event.startDateTime) }}</div>
      </div>
    </div>

      <!-- Card Content -->
      <div class="p-4 flex-1 flex flex-col">
        <div class="mb-2">

        <!-- Title -->
        <h2 class="text-xl font-bold text-gray-900">{{ event.title }}</h2>
        <!-- Shelter Info (only for adopters) -->
        <div 
          v-if="!isShelter && event.shelterName && event.shelterId"
          class="mt-1 text-sm text-gray-500"
          title="Organized by"
        >
          Organized by 
          <a
            :href="`/shelter/${event.shelterId}`"
            class="ml-1 text-red-600 hover:text-red-800 hover:underline font-medium transition"
          >
            {{ event.shelterName }}
          </a>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4">{{ event.description }}</p>
      
      <!-- Time -->
      <div class="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-gray-700">{{ formatTime(event.startDateTime) }} - {{ formatTime(event.endDateTime) }}</span>
      </div>
      
      <!-- Location -->
      <div class="flex items-start mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div class="ml-2">
          <div class="font-medium text-gray-900">{{ event.location }}, {{ event.address }}</div>
          <div class="text-xs text-gray-500">{{ event.city }}, {{ event.county }}</div>
        </div>
      </div>
      
      <!-- Attendance Stats -->
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </span>
            <span class="text-sm font-medium text-gray-600">{{ event.interestedCount || 0 }}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span class="text-sm font-medium text-gray-600">{{ event.goingCount || 0 }}</span>
          </div>
        </div>

        <!-- Max Attendees -->
        <div v-if="event.maxAttendees" class="text-sm text-gray-600">
          <span class="font-medium">Max:</span> {{ event.maxAttendees }}
        </div>
      </div>
    </div>

    <!-- Card Actions -->
    <div class="border-t border-gray-100 p-3 bg-gray-50">
      <!-- SHELTER View - Edit, Delete, Details buttons -->
      <div v-if="isShelter" class="flex justify-between items-center">
        <button 
          @click="$emit('edit-event', event)" 
          class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
        >
          Edit
        </button>
        
        <div class="flex items-center gap-3">
          <button 
            @click="openDeleteConfirm" 
            class="text-red-600 hover:text-red-800 font-medium text-sm flex items-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>

          <div class="h-4 w-px bg-gray-300"></div>
          
          <button 
            @click="showDetails" 
            class="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200"
          >
            Details
          </button>
        </div>
      </div>

      <!-- ADOPTER View - Attendance dropdown -->
      <div v-else class="flex justify-end relative">
        <div class="relative inline-block text-left">
          <button 
            @click="isLoggedIn ? toggleDropdown() : null" 
            :class="[
              'inline-flex justify-center items-center px-3 py-1.5 text-sm font-medium border rounded-2xl shadow-sm transition',
              !isLoggedIn ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300' :
              userAttendanceStatus === 'GOING' 
                ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                : userAttendanceStatus === 'INTERESTED' 
                  ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
            :title="isLoggedIn ? '' : 'Please login to set attendance'"
          >
            {{ userAttendanceStatus ? formatStatusLabel(userAttendanceStatus) : 'Attendance' }}
            <svg 
              class="ml-2 -mr-1 h-4 w-4 transform rotate-180"
              :class="{
                'text-green-500': userAttendanceStatus === 'GOING',
                'text-red-500': userAttendanceStatus === 'INTERESTED',
                'text-gray-500': !userAttendanceStatus || !isLoggedIn
              }"
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Dropdown that opens upward -->
          <div 
            v-if="dropdownOpen" 
            @mouseleave="dropdownOpen = false"
            class="absolute bottom-full mb-2 right-0 w-40 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          >
            <div class="py-1 text-sm">
              <button 
                @click="updateAttendance('INTERESTED'); dropdownOpen = false" 
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Interested
              </button>
              <button 
                @click="updateAttendance('GOING'); dropdownOpen = false" 
                :disabled="isEventFull && userAttendanceStatus !== 'GOING'"
                class="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
              >
                Going
              </button>
              <button 
                v-if="userAttendanceStatus" 
                @click="removeAttendance(); dropdownOpen = false" 
                class="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Not Attending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <EventDetailsModal
      :isOpen="detailsModalOpen"
      :event="event"
      :userAttendanceStatus="userAttendanceStatus"
      :isEventFull="isEventFull"
      @close="detailsModalOpen = false"
      @attendance-updated="handleAttendanceUpdated"
      @attendance-removed="handleAttendanceRemoved"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirmModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" @click="cancelDelete"></div>

      <!-- Modal content -->
      <div class="bg-white rounded-2xl shadow-2xl w-[460px] p-8 z-10 relative transform transition-all duration-300 ease-in-out scale-100">
        <!-- Close button -->
        <button @click="cancelDelete" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Icon + Text -->
        <div class="text-center mb-6">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Are you sure you want to delete this event?</h3>
          <p class="text-gray-500 mt-3">This action will permanently remove <strong>{{ event.title }}</strong>.</p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center space-x-4 mt-8">
          <button 
            @click="cancelDelete"
            class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-3xl font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-200 shadow-sm"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="px-5 py-2.5 bg-red-600 text-white rounded-3xl font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { deleteEvent, updateEventAttendance, removeEventAttendance } from '@/services/event_service.js';
import EventDetailsModal from '@/components/EventDetailsModal.vue';

export default defineComponent({
  name: 'EventCard',
  
  components: {
    EventDetailsModal
  },

  props: {
    event: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['eventDeleted', 'event-updated'],
  
  setup(props, { emit }) {
    const detailsModalOpen = ref(false);
    const deleteConfirmModalOpen = ref(false);
    const dropdownOpen = ref(false);

    const userAttendanceStatus = ref(props.event.userAttendanceStatus || null);
    
    const toggleDropdown = () => {
      if (!isLoggedIn.value) return;
      dropdownOpen.value = !dropdownOpen.value;
    };

    const formatStatusLabel = (status) => {
      switch (status) {
        case 'INTERESTED': return 'Interested';
        case 'GOING': return 'Going';
        default: return 'Not Attending';
      }
    };

    const isLoggedIn = computed(() => {
      return !!localStorage.getItem('Id');
    });
    
    const isShelter = computed(() => {
      return localStorage.getItem('Role') === 'SHELTER';
    });
    
    const isEventFull = computed(() => {
      return props.event.maxAttendees && 
             props.event.goingCount >= props.event.maxAttendees;
    });

    const openDeleteConfirm = () => {
      deleteConfirmModalOpen.value = true;
    };

    const cancelDelete = () => {
      deleteConfirmModalOpen.value = false;
    };

    const confirmDelete = async () => {
      try {
        const shelterId = localStorage.getItem("Id");
        await deleteEvent(props.event.id, shelterId);
        emit('eventDeleted', props.event.id);
      } catch (error) {
        console.error('Error deleting event:', error);
      } finally {
        deleteConfirmModalOpen.value = false;
      }
    };
    
    const showAdminElements = computed(() => {
      return props.isAdmin;
    });

    const bucharestTZ = 'Europe/Bucharest';

    
    const formatDay = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        timeZone: bucharestTZ
      }).format(new Date(dateString));
    };


    const formatMonthYear = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: bucharestTZ
      }).format(new Date(dateString));
    };


    const formatTime = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: bucharestTZ
      }).format(new Date(dateString));
    };


    const formatFullDate = (dateString) => {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: bucharestTZ
      }).format(new Date(dateString));
    };

    
    const formatEventType = (type) => {
      if (!type) return 'Other';
      
      const typeMap = {
        'adoption': 'Adoption',
        'fundraising': 'Fundraising',
        'volunteer': 'Volunteer',
        'educational': 'Educational',
        'other': 'Other'
      };
      
      return typeMap[type.toLowerCase()] || type;
    };
    

    const getEventTypeClasses = (type) => {
      if (!type) return 'bg-gray-100 text-gray-800';
      
      const classMap = {
        'adoption': 'bg-green-100 text-green-800',
        'fundraising': 'bg-purple-100 text-purple-800',
        'volunteer': 'bg-blue-100 text-blue-800',
        'educational': 'bg-yellow-100 text-yellow-800',
        'other': 'bg-gray-100 text-gray-800'
      };
      
      return classMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };
    

    const showDetails = () => {
      detailsModalOpen.value = true;
    };


    const updateAttendance = async (status) => {
      if (userAttendanceStatus.value === status) {
        return;
      }
      
      try {
        const userId = localStorage.getItem("Id");
        if (!userId) {
          console.error("User ID not found. User might not be logged in.");
          return;
        }
        
        const attendanceData = {
          interested: status === 'INTERESTED',
          going: status === 'GOING'
        };
        
        const updatedEvent = await updateEventAttendance(
          props.event.id, 
          userId, 
          attendanceData
        );
        
        userAttendanceStatus.value = status;
        
        emit('event-updated', updatedEvent);
      } catch (error) {
        console.error('Error updating attendance:', error);
      }
    };
    

    const removeAttendance = async () => {
      try {
        const userId = localStorage.getItem("Id");
        if (!userId) return;

        const updatedEvent = await removeEventAttendance(props.event.id, userId);

        userAttendanceStatus.value = null;
        emit('event-updated', updatedEvent);
      } catch (error) {
        console.error('Error removing attendance:', error);
      }
    };

    const handleAttendanceUpdated = ({ status, updatedEvent }) => {
      userAttendanceStatus.value = status;
      emit('event-updated', updatedEvent);
    };

    const handleAttendanceRemoved = (updatedEvent) => {
      userAttendanceStatus.value = null;
      emit('event-updated', updatedEvent);
    };

    
    watch(() => props.event.userAttendanceStatus, (newValue) => {
      userAttendanceStatus.value = newValue;
    });
    
    
    return { 
      formatDay,
      formatMonthYear,
      formatTime,
      formatFullDate,
      formatEventType,
      getEventTypeClasses,
      confirmDelete,
      showDetails,
      openDeleteConfirm,
      cancelDelete,
      updateAttendance,
      removeAttendance,
      toggleDropdown,
      formatStatusLabel,
      handleAttendanceUpdated,
      handleAttendanceRemoved,

      isLoggedIn,
      detailsModalOpen,
      showAdminElements,
      deleteConfirmModalOpen,
      isShelter,
      userAttendanceStatus,
      isEventFull,
      dropdownOpen,
    };
    }
  });
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>