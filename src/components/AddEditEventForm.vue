<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-8 z-50">
      <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
  
        <!-- Form Header -->
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">{{ eventToEdit ? 'Edit Event' : 'Create New Event' }}</h2>
            <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">×</span>
            </button>
          </div>
        </div>
  
        <!-- Form Content -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Event Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  v-model="eventData.title"
                  type="text"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  placeholder="e.g., Adoption Day, Fundraising Gala"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  v-model="eventData.eventType"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="adoption">Adoption</option>
                  <option value="fundraising">Fundraising</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="educational">Educational</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Max Attendees</label>
                <input
                  v-model="eventData.maxAttendees"
                  type="number"
                  min="1"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  placeholder="Leave blank for unlimited"
                />
              </div>
            </div>
          </div>
  
          <!-- Date & Time -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Date & Time</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <input
                  v-model="eventData.startDateTime"
                  type="datetime-local"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date & Time</label>
                <input
                  v-model="eventData.endDateTime"
                  type="datetime-local"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  required
                />
              </div>
            </div>
          </div>
  
          <!-- Location -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Location</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">County</label>
              <select
                v-model="eventData.county"
                class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Select County</option>
                <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <select
                v-model="eventData.city"
                class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                :disabled="!eventData.county"
                required
              >
                <option value="">Select City</option>
                <option v-for="city in filteredCities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
          </div>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Location Name</label>
                <input
                  v-model="eventData.location"
                  type="text"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  placeholder="e.g., Central Park, Community Center"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input
                  v-model="eventData.address"
                  type="text"
                  class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
                  placeholder="Enter full street address"
                  required
                />
              </div>
            </div>
          </div>
  
          <!-- Description -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Event Description</h3>
            <textarea
              v-model="eventData.description"
              rows="4"
              class="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2"
              placeholder="Describe your event, what attendees can expect, and any special instructions..."
              required
            ></textarea>
          </div>
  
          <!-- Status -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Event Status</h3>
            <div class="flex items-center">
              <input
                id="isActive"
                v-model="eventData.isActive"
                type="checkbox"
                class="rounded border-gray-300 text-red-600 focus:ring-red-500 h-5 w-5"
              />
              <label for="isActive" class="ml-2 text-sm text-gray-700">Active (visible to the public)</label>
            </div>
          </div>
  
          <!-- Submit Button -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-3xl text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700"
            >
              {{ eventToEdit ? 'Update Event' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, computed, nextTick } from 'vue';
  import { createEvent, updateEvent } from '@/services/event_service.js';
  import judete from "@/assets/judete.json";

  
  export default {
    name: 'AddEditEventForm',
    
    props: {
      eventToEdit: Object,
    },
  
    emits: ['close', 'event-added', 'event-updated'],
    
    setup(props, { emit }) {
      const eventData = ref({
        title: '',
        description: '',
        eventType: 'adoption',
        startDateTime: formatDateTimeForInput(new Date()),
        endDateTime: formatDateTimeForInput(new Date(Date.now() + 2 * 60 * 60 * 1000)), // Default to 2 hours later
        location: '',
        address: '',
        county: '',
        city: '',
        maxAttendees: '',
        isActive: true
      });

      const counties = computed(() => 
      judete.judete.map(judet => judet.nume).sort()
    );
    
      // Get cities based on selected county
      const filteredCities = computed(() => {
        if (!eventData.value.county) return [];
        
        const selectedCounty = judete.judete.find(judet => 
          judet.nume === eventData.value.county
        );
        
        return selectedCounty 
          ? selectedCounty.localitati.map(loc => loc.nume).sort() 
          : [];
      });

      // Reset city when county changes
      watch(() => eventData.value.county, () => {
        eventData.value.city = '';
      });

  
      // Helper function to format dates for datetime-local input
      function formatDateTimeForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
  
      // If we're editing an existing event, populate the form with its data
      watch(() => props.eventToEdit, (newEvent) => {
        console.log("Event to edit changed:", newEvent);
        if (newEvent) {
          try {
            // Creează un obiect temporar pentru a gestiona corect county și city
            const updatedData = { 
              ...newEvent,
              // Convert date strings to format expected by input
              startDateTime: formatDateTimeForInput(new Date(newEvent.startDateTime)),
              endDateTime: formatDateTimeForInput(new Date(newEvent.endDateTime))
            };
            
            // Setăm county și city separat pentru a fi siguri că watch-ul nu le șterge
            eventData.value = updatedData;
            
            // Dacă avem nevoie să forțăm încărcarea orașelor pentru county
            if (newEvent.county && newEvent.city) {
              // Dezactivează temporar watch-ul pentru county dacă este posibil
              // sau utilizați nextTick pentru a ne asigura că se încarcă corect
              nextTick(() => {
                // Verifică dacă orașul este disponibil în lista de orașe filtrate
                if (filteredCities.value.includes(newEvent.city)) {
                  eventData.value.city = newEvent.city;
                }
              });
            }
          } catch (error) {
            console.error("Error formatting dates:", error);
          }
        } else {
          // Reset form to defaults if not editing
          eventData.value = {
            title: '',
            description: '',
            eventType: 'adoption',
            startDateTime: formatDateTimeForInput(new Date()),
            endDateTime: formatDateTimeForInput(new Date(Date.now() + 2 * 60 * 60 * 1000)),
            location: '',
            address: '',
            county: '',
            city: '',
            maxAttendees: '',
            isActive: true
          };
        }
      }, { immediate: true });
  
      const handleSubmit = async () => {
        try {
          const shelterId = localStorage.getItem("Id");
          const isUpdate = !!props.eventToEdit;
          
          // Format dates to ISO strings for backend
          const formattedData = {
            ...eventData.value,
            startDateTime: new Date(eventData.value.startDateTime).toISOString(),
            endDateTime: new Date(eventData.value.endDateTime).toISOString()
          };
          
          // Don't send these fields during update
          if (isUpdate) {
            delete formattedData.shelterName;
            delete formattedData.shelterId;
            delete formattedData.interestedCount;
            delete formattedData.goingCount;
          }
  
          // Validate that end date is after start date
          const startDate = new Date(eventData.value.startDateTime);
          const endDate = new Date(eventData.value.endDateTime);
          
          if (endDate <= startDate) {
            alert("End date must be after start date");
            return;
          }
          
          // Validate max attendees is a positive number or empty
          if (eventData.value.maxAttendees && eventData.value.maxAttendees <= 0) {
            alert("Maximum attendees must be a positive number");
            return;
          }
  
          let savedEvent;
          if (isUpdate) {
            savedEvent = await updateEvent(props.eventToEdit.id, formattedData, shelterId);
            emit("event-updated", savedEvent);
          } else {
            savedEvent = await createEvent(formattedData, shelterId);
            emit("event-added", savedEvent);
          }
          
          emit("close");
        } catch (error) {
          console.error("Error saving event:", error);
          alert("Failed to save event. Please try again.");
        }
      };
  
      return {
        eventData,
        handleSubmit,
        counties,
        filteredCities
      };
    },
  };
  </script>