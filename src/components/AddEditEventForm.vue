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
            <!-- Start Date & Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <DateTimePicker 
                v-model="startDate"
                @update:modelValue="handleStartDateChange"
              />
            </div>
          
            <!-- End Date & Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <DateTimePicker 
                v-model="endDate"
                :minDateTime="startDate"
                @update:modelValue="handleEndDateChange"
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
import { createEvent, updateEvent, partialUpdateEvent } from '@/services/event_service.js';
import judete from "@/assets/judete.json";
import DateTimePicker from '@/components/DateTimePicker.vue';

export default {
  name: 'AddEditEventForm',
  
  components: {
    DateTimePicker
  },
  
  props: {
    eventToEdit: Object,
  },

  emits: ['close', 'event-added', 'event-updated'],
  
  setup(props, { emit }) {
    const eventData = ref({
      title: '',
      description: '',
      eventType: 'adoption',
      startDateTime: '',
      endDateTime: '',
      location: '',
      address: '',
      county: '',
      city: '',
      maxAttendees: '',
      isActive: true
    });

    const showStartDatePicker = ref(false);
    const showEndDatePicker = ref(false);
    const startDate = ref(new Date());
    const endDate = ref(new Date(Date.now() + 2 * 60 * 60 * 1000)); 
    const startMonth = ref(startDate.value.getMonth());
    const startYear = ref(startDate.value.getFullYear());
    const endMonth = ref(endDate.value.getMonth());
    const endYear = ref(endDate.value.getFullYear());
    
    const startHour = ref(startDate.value.getHours());
    const startMinute = ref(Math.floor(startDate.value.getMinutes() / 15) * 15);
    const endHour = ref(endDate.value.getHours());
    const endMinute = ref(Math.floor(endDate.value.getMinutes() / 15) * 15);

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    

    const counties = computed(() => 
      judete.judete.map(judet => judet.nume).sort()
    );
    

    const filteredCities = computed(() => {
      if (!eventData.value.county) return [];
      
      const selectedCounty = judete.judete.find(judet => 
        judet.nume === eventData.value.county
      );
      
      return selectedCounty 
        ? selectedCounty.localitati.map(loc => loc.nume).sort() 
        : [];
    });


    function handleStartDateChange(newDate) {
      startDate.value = newDate;
      eventData.value.startDateTime = formatDateTimeForBackend(newDate);
      
      if (endDate.value <= newDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setHours(newDate.getHours() + 2);
        endDate.value = newEndDate;
        eventData.value.endDateTime = formatDateTimeForBackend(newEndDate);
      }
    }

    
    function handleEndDateChange(newDate) {
      endDate.value = newDate;
      eventData.value.endDateTime = formatDateTimeForBackend(newDate);
    }

    
    function formatDateTimeForBackend(date) {
      const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19); 
      return localISO;
    }
    
    eventData.value.startDateTime = formatDateTimeForBackend(startDate.value);
    eventData.value.endDateTime = formatDateTimeForBackend(endDate.value);

    
    watch(() => eventData.value.county, () => {
      eventData.value.city = '';
    });


    watch(() => props.eventToEdit, (newEvent) => {
      if (newEvent) {
        try {
          const updatedData = { 
            ...newEvent,
          };
          
          eventData.value = updatedData;
          
          if (newEvent.startDateTime) {
            const start = new Date(newEvent.startDateTime);
            startDate.value = start;
            startMonth.value = start.getMonth();
            startYear.value = start.getFullYear();
            startHour.value = start.getHours();
            startMinute.value = Math.floor(start.getMinutes() / 15) * 15;
          }
          
          if (newEvent.endDateTime) {
            const end = new Date(newEvent.endDateTime);
            endDate.value = end;
            endMonth.value = end.getMonth();
            endYear.value = end.getFullYear();
            endHour.value = end.getHours();
            endMinute.value = Math.floor(end.getMinutes() / 15) * 15;
          }
          
          if (newEvent.county && newEvent.city) {
            nextTick(() => {
              if (filteredCities.value.includes(newEvent.city)) {
                eventData.value.city = newEvent.city;
              }
            });
          }
        } catch (error) {
          console.error("Error formatting dates:", error);
        }
      } else {
        eventData.value = {
          title: '',
          description: '',
          eventType: 'adoption',
          startDateTime: formatDateTimeForBackend(startDate.value),
          endDateTime: formatDateTimeForBackend(endDate.value),
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

        const isOnlyUpdatingIsActive = isUpdate &&
          Object.keys(eventData.value).length === 1 &&
          eventData.value.hasOwnProperty("isActive");

        if (!isOnlyUpdatingIsActive) {
          if (endDate.value <= startDate.value) {
            alert("End date must be after start date");
            return;
          }

          if (eventData.value.maxAttendees && eventData.value.maxAttendees <= 0) {
            alert("Maximum attendees must be a positive number");
            return;
          }
        }

        const formattedData = {
          ...eventData.value,
          startDateTime: formatDateTimeForBackend(startDate.value),
          endDateTime: formatDateTimeForBackend(endDate.value)
        };

        if (isUpdate) {
          delete formattedData.shelterName;
          delete formattedData.shelterId;
          delete formattedData.interestedCount;
          delete formattedData.goingCount;
        }

        let savedEvent;

        if (isOnlyUpdatingIsActive) {
          savedEvent = await partialUpdateEvent(props.eventToEdit.id, { isActive: formattedData.isActive }, shelterId);
        } else if (isUpdate) {
          savedEvent = await updateEvent(props.eventToEdit.id, formattedData, shelterId);
        } else {
          savedEvent = await createEvent(formattedData, shelterId);
        }

        if (isUpdate) {
          emit("event-updated", savedEvent);
          window.dispatchEvent(new Event("event-updated"));
        } else {
          emit("event-added", savedEvent);
          window.dispatchEvent(new Event("event-added"));
        }

        emit("close");
      } catch (error) {
        console.error("Error saving event:", error);
        alert("Failed to save event. Please try again.");
      }
    };

    return {
      eventData,
      counties,
      filteredCities,
      showStartDatePicker,
      showEndDatePicker,
      startDate,
      endDate,
      startMonth,
      startYear,
      endMonth,
      endYear,
      daysOfWeek,
      startHour,
      startMinute,
      endHour,
      endMinute,

      handleStartDateChange,
      handleEndDateChange,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.calendar-container {
  width: 280px;
}
</style>