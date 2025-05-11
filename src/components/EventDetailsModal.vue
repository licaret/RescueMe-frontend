<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div 
        class="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out"
        @click.stop
      >
        <div class="p-5 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Event Details</h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">×</span>
            </button>
          </div>
        </div>
        
        <div class="p-5 space-y-4">
          <!-- Event Type -->
          <div class="flex items-center" v-if="event.eventType">
            <span 
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
              :class="getEventTypeClasses(event.eventType)"
            >
              {{ formatEventType(event.eventType) }}
            </span>
            <span v-if="!event.isActive" class="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              Inactive
            </span>
          </div>
  
          <!-- Title -->
          <h2 class="text-xl font-bold text-gray-900">{{ event.title }}</h2>
          
          <!-- Date & Time -->
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div class="ml-2">
              <div class="font-medium text-gray-900">{{ formatFullDate(event.startDateTime) }}</div>
              <div class="text-sm text-gray-600">{{ formatTime(event.startDateTime) }} - {{ formatTime(event.endDateTime) }}</div>
            </div>
          </div>
  
          <!-- Location -->
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div class="ml-2">
              <div class="font-medium text-gray-900">{{ event.location }}, {{ event.address }}</div>
              <div class="text-xs text-gray-500">{{ event.city }}, {{ event.county }}</div>
            </div>
          </div>
  
          <!-- Description -->
          <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-1">Description</h4>
            <p class="text-gray-600">{{ event.description }}</p>
          </div>
  
          <!-- Attendance Stats -->
          <div class="flex items-center space-x-6 mt-4">
            <div class="flex items-center">
              <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              <div>
                <div class="text-xs text-gray-500">Interested</div>
                <div class="font-medium text-gray-900">{{ event.interestedCount || 0 }}</div>
              </div>
            </div>
            <div class="flex items-center">
              <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <div class="text-xs text-gray-500">Going</div>
                <div class="font-medium text-gray-900">{{ event.goingCount || 0 }}</div>
              </div>
            </div>
            <div v-if="event.maxAttendees" class="flex items-center">
              <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <div>
                <div class="text-xs text-gray-500">Max Attendees</div>
                <div class="font-medium text-gray-900">{{ event.maxAttendees }}</div>
              </div>
            </div>
          </div>
          
          <!-- ADOPTER Actions -->
          <div v-if="!isShelter" class="mt-6 flex flex-col gap-4">
            <div class="text-sm font-medium text-gray-700">Your attendance status:</div>
            <div class="flex gap-3">
              <button 
                @click="updateAttendance('INTERESTED')" 
                class="flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 font-medium transition-all duration-200"
                :class="[
                  userAttendanceStatus === 'INTERESTED' 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'text-red-600 hover:bg-red-50 bg-white border border-gray-200'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Interested
              </button>
              <button 
                @click="updateAttendance('GOING')" 
                class="flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 font-medium transition-all duration-200"
                :class="[
                  userAttendanceStatus === 'GOING' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'text-green-600 hover:bg-green-50 bg-white border border-gray-200'
                ]"
                :disabled="isEventFull && userAttendanceStatus !== 'GOING'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Going
              </button>
            </div>
            
            <!-- Remove attendance button -->
            <button 
              v-if="userAttendanceStatus"
              @click="removeAttendance" 
              class="py-2 mt-1 flex justify-center items-center gap-2 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Not Attending
            </button>
          </div>
        </div>
        
        <div class="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
          <button 
            @click="closeModal" 
            class="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed, watch } from 'vue';
  import { updateEventAttendance, removeEventAttendance } from '@/services/event_service.js';
  
  export default defineComponent({
    name: 'EventDetailsModal',
    
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      event: {
        type: Object,
        required: true
      },
      userAttendanceStatus: {
        type: String,
        default: null
      },
      isEventFull: {
        type: Boolean,
        default: false
      }
    },
    
    emits: ['close', 'attendance-updated', 'attendance-removed'],
    
    setup(props, { emit }) {
      const bucharestTZ = 'Europe/Bucharest';
      
      const isShelter = computed(() => {
        return localStorage.getItem('Role') === 'SHELTER';
      });
      
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
      
      const closeModal = () => {
        emit('close');
      };
  
      const updateAttendance = async (status) => {
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
          
          emit('attendance-updated', { status, updatedEvent });
        } catch (error) {
          console.error('Error updating attendance:', error);
        }
      };
      
      const removeAttendance = async () => {
        try {
          const userId = localStorage.getItem("Id");
          if (!userId) return;
  
          const updatedEvent = await removeEventAttendance(props.event.id, userId);
          
          emit('attendance-removed', updatedEvent);
        } catch (error) {
          console.error('Error removing attendance:', error);
        }
      };
      
      return {
        isShelter,
        formatTime,
        formatFullDate,
        formatEventType,
        getEventTypeClasses,
        closeModal,
        updateAttendance,
        removeAttendance
      };
    }
  });
  </script>