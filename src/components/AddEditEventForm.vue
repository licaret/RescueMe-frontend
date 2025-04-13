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
              <div class="flex flex-col space-y-2">
                <!-- Date picker -->
                <div class="relative">
                  <div 
                    class="flex items-center w-full rounded-2xl border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="toggleStartDatePicker"
                  >
                    <span class="flex-grow">{{ formatDateForDisplay(startDate) }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <!-- Calendar dropdown -->
                  <div v-if="showStartDatePicker" class="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-2 border">
                    <div class="flex justify-between items-center mb-2">
                      <button 
                        type="button"
                        @click="prevMonth('start')" 
                        class="p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <span class="font-medium">{{ startMonthName }} {{ startYear }}</span>
                      
                      <button 
                        type="button"
                        @click="nextMonth('start')" 
                        class="p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Days of week -->
                    <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                      <span v-for="day in daysOfWeek" :key="day">{{ day }}</span>
                    </div>
                    
                    <!-- Calendar days -->
                    <div class="grid grid-cols-7 gap-1">
                      <button
                        v-for="(day, index) in startCalendarDays"
                        :key="index"
                        type="button"
                        :disabled="day.disabled"
                        @click="selectStartDate(day)"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        :class="{
                          'text-gray-400': day.isOtherMonth,
                          'bg-red-100 text-red-600 font-medium': day.isSelected,
                          'hover:bg-gray-100': !day.isSelected && !day.disabled,
                          'opacity-50 cursor-not-allowed': day.disabled
                        }"
                      >
                        {{ day.number }}
                      </button>
                    </div>
                    
                    <!-- Today button -->
                    <div class="mt-2 text-center">
                      <button 
                        type="button"
                        @click="setToday('start')" 
                        class="text-sm text-red-600 hover:text-red-800"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Time picker -->
                <div class="flex items-center space-x-2">
                  <div class="flex-1">
                    <select 
                      v-model="startHour" 
                      @change="updateStartDateTime"
                      class="w-full rounded-2xl border border-gray-300 px-3 py-2"
                    >
                      <option v-for="hour in 24" :key="`hour-${hour}`" :value="hour-1">
                        {{ formatHour(hour-1) }}
                      </option>
                    </select>
                  </div>
                  <span class="text-lg">:</span>
                  <div class="flex-1">
                    <select 
                      v-model="startMinute" 
                      @change="updateStartDateTime"
                      class="w-full rounded-2xl border border-gray-300 px-3 py-2"
                    >
                      <option v-for="minute in [0, 15, 30, 45]" :key="`minute-${minute}`" :value="minute">
                        {{ minute.toString().padStart(2, '0') }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          
            <!-- End Date & Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <div class="flex flex-col space-y-2">
                <!-- Date picker -->
                <div class="relative">
                  <div 
                    class="flex items-center w-full rounded-2xl border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="toggleEndDatePicker"
                  >
                    <span class="flex-grow">{{ formatDateForDisplay(endDate) }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <!-- Calendar dropdown -->
                  <div v-if="showEndDatePicker" class="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-2 border">
                    <div class="flex justify-between items-center mb-2">
                      <button 
                        type="button"
                        @click="prevMonth('end')" 
                        class="p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <span class="font-medium">{{ endMonthName }} {{ endYear }}</span>
                      
                      <button 
                        type="button"
                        @click="nextMonth('end')" 
                        class="p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Days of week -->
                    <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                      <span v-for="day in daysOfWeek" :key="day">{{ day }}</span>
                    </div>
                    
                    <!-- Calendar days -->
                    <div class="grid grid-cols-7 gap-1">
                      <button
                        v-for="(day, index) in endCalendarDays"
                        :key="index"
                        type="button"
                        :disabled="day.disabled"
                        @click="selectEndDate(day)"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        :class="{
                          'text-gray-400': day.isOtherMonth,
                          'bg-red-100 text-red-600 font-medium': day.isSelected,
                          'hover:bg-gray-100': !day.isSelected && !day.disabled,
                          'opacity-50 cursor-not-allowed': day.disabled
                        }"
                      >
                        {{ day.number }}
                      </button>
                    </div>
                    
                    <!-- Today button -->
                    <div class="mt-2 text-center">
                      <button 
                        type="button"
                        @click="setToday('end')" 
                        class="text-sm text-red-600 hover:text-red-800"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Time picker -->
                <div class="flex items-center space-x-2">
                  <div class="flex-1">
                    <select 
                      v-model="endHour" 
                      @change="updateEndDateTime"
                      class="w-full rounded-2xl border border-gray-300 px-3 py-2"
                    >
                      <option v-for="hour in 24" :key="`hour-${hour}`" :value="hour-1">
                        {{ formatHour(hour-1) }}
                      </option>
                    </select>
                  </div>
                  <span class="text-lg">:</span>
                  <div class="flex-1">
                    <select 
                      v-model="endMinute" 
                      @change="updateEndDateTime"
                      class="w-full rounded-2xl border border-gray-300 px-3 py-2"
                    >
                      <option v-for="minute in [0, 15, 30, 45]" :key="`minute-${minute}`" :value="minute">
                        {{ minute.toString().padStart(2, '0') }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
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
import { createEvent, updateEvent, partialUpdateEvent  } from '@/services/event_service.js';
import judete from "@/assets/judete.json";

export default {
  name: 'AddEditEventForm',
  
  props: {
    eventToEdit: Object,
  },

  emits: ['close', 'event-added', 'event-updated'],
  
  setup(props, { emit }) {
    // Main form data
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

    // Date picker variables
    const showStartDatePicker = ref(false);
    const showEndDatePicker = ref(false);
    const startDate = ref(new Date());
    const endDate = ref(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours from now
    const startMonth = ref(startDate.value.getMonth());
    const startYear = ref(startDate.value.getFullYear());
    const endMonth = ref(endDate.value.getMonth());
    const endYear = ref(endDate.value.getFullYear());
    
    // Time picker variables
    const startHour = ref(startDate.value.getHours());
    const startMinute = ref(Math.floor(startDate.value.getMinutes() / 15) * 15);
    const endHour = ref(endDate.value.getHours());
    const endMinute = ref(Math.floor(endDate.value.getMinutes() / 15) * 15);

    // Reference to calendar containers for click outside detection
    const startCalendarRef = ref(null);
    const endCalendarRef = ref(null);

    // Days of week for calendar header
    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    // Counties and cities data
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

    // Month names for display
    const startMonthName = computed(() => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                      'August', 'September', 'October', 'November', 'December'];
      return months[startMonth.value];
    });
    
    const endMonthName = computed(() => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                      'August', 'September', 'October', 'November', 'December'];
      return months[endMonth.value];
    });

    // Generate calendar days for the start date
    const startCalendarDays = computed(() => {
      return generateCalendarDays(startYear.value, startMonth.value, startDate.value);
    });
    
    // Generate calendar days for the end date
    const endCalendarDays = computed(() => {
      return generateCalendarDays(endYear.value, endMonth.value, endDate.value, startDate.value);
    });

    // Function to generate calendar days
    function generateCalendarDays(year, month, selectedDate, minDate = null) {
      const days = [];
      
      // Get first day of the month and total days in month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const totalDays = lastDay.getDate();
      
      // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay();
      
      // Add days from previous month to fill the first row
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = new Date(year, month - 1, day);
        const isDisabled = minDate ? date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : false;
        
        days.push({
          number: day,
          date,
          isOtherMonth: true,
          isSelected: false,
          disabled: isDisabled
        });
      }
      
      // Add days for current month
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i);
        const isDisabled = minDate ? date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : false;
        
        days.push({
          number: i,
          date,
          isOtherMonth: false,
          isSelected: selectedDate && 
                     date.getDate() === selectedDate.getDate() && 
                     date.getMonth() === selectedDate.getMonth() && 
                     date.getFullYear() === selectedDate.getFullYear(),
          disabled: isDisabled
        });
      }
      
      // Add days from next month to complete the calendar grid (6 rows x 7 days = 42 cells)
      const remainingCells = 42 - days.length;
      for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(year, month + 1, i);
        const isDisabled = minDate ? date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : false;
        
        days.push({
          number: i,
          date,
          isOtherMonth: true,
          isSelected: false,
          disabled: isDisabled
        });
      }
      
      return days;
    }

    // Toggle calendar visibility
    function toggleStartDatePicker() {
      showStartDatePicker.value = !showStartDatePicker.value;
      if (showStartDatePicker.value) {
        showEndDatePicker.value = false;
      }
    }
    
    function toggleEndDatePicker() {
      showEndDatePicker.value = !showEndDatePicker.value;
      if (showEndDatePicker.value) {
        showStartDatePicker.value = false;
      }
    }

    // Navigate months
    function prevMonth(type) {
      if (type === 'start') {
        if (startMonth.value === 0) {
          startMonth.value = 11;
          startYear.value--;
        } else {
          startMonth.value--;
        }
      } else {
        if (endMonth.value === 0) {
          endMonth.value = 11;
          endYear.value--;
        } else {
          endMonth.value--;
        }
      }
    }
    
    function nextMonth(type) {
      if (type === 'start') {
        if (startMonth.value === 11) {
          startMonth.value = 0;
          startYear.value++;
        } else {
          startMonth.value++;
        }
      } else {
        if (endMonth.value === 11) {
          endMonth.value = 0;
          endYear.value++;
        } else {
          endMonth.value++;
        }
      }
    }

    // Select a date
    function selectStartDate(day) {
      if (day.disabled) return;
      
      startDate.value = new Date(day.date);
      startDate.value.setHours(startHour.value, startMinute.value);
      updateStartDateTime();
      showStartDatePicker.value = false;
    }
    
    function selectEndDate(day) {
      if (day.disabled) return;
      
      endDate.value = new Date(day.date);
      endDate.value.setHours(endHour.value, endMinute.value);
      updateEndDateTime();
      showEndDatePicker.value = false;
    }

    // Set today
    function setToday(type) {
      const today = new Date();
      
      if (type === 'start') {
        startMonth.value = today.getMonth();
        startYear.value = today.getFullYear();
        startDate.value = new Date(today);
        startDate.value.setHours(startHour.value, startMinute.value);
        updateStartDateTime();
      } else {
        endMonth.value = today.getMonth();
        endYear.value = today.getFullYear();
        endDate.value = new Date(today);
        endDate.value.setHours(endHour.value, endMinute.value);
        updateEndDateTime();
      }
    }

    // Format date for display
    function formatDateForDisplay(date) {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    
    // Format hour for display (24-hour format)
    function formatHour(hour) {
      return hour.toString().padStart(2, '0');
    }

    // Update date time values
    function updateStartDateTime() {
      const newDate = new Date(startDate.value);
      newDate.setHours(startHour.value, startMinute.value);
      startDate.value = newDate;
      eventData.value.startDateTime = formatDateTimeForBackend(newDate);
      
      // If end date is before start date, update it
      if (new Date(eventData.value.endDateTime) <= newDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setHours(newDate.getHours() + 2); // Set end date 2 hours after start date
        endDate.value = newEndDate;
        endHour.value = newEndDate.getHours();
        endMinute.value = newEndDate.getMinutes();
        eventData.value.endDateTime = formatDateTimeForBackend(newEndDate);
      }
    }
    
    function updateEndDateTime() {
      const newDate = new Date(endDate.value);
      newDate.setHours(endHour.value, endMinute.value);
      endDate.value = newDate;
      eventData.value.endDateTime = formatDateTimeForBackend(newDate);
    }

    // Format date time for backend
    function formatDateTimeForBackend(date) {
      // Convertim la ISO fără fus orar (UTC offset)
      const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19); // yyyy-MM-ddTHH:mm:ss
      return localISO;
    }

    
    // Format date time for input
    function formatDateTimeForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Initialize dates
    eventData.value.startDateTime = formatDateTimeForBackend(startDate.value);
    eventData.value.endDateTime = formatDateTimeForBackend(endDate.value);

    // Close date pickers when clicking outside
    function clickOutside(event) {
      if (showStartDatePicker.value && !event.target.closest('.start-datepicker')) {
        showStartDatePicker.value = false;
      }
      if (showEndDatePicker.value && !event.target.closest('.end-datepicker')) {
        showEndDatePicker.value = false;
      }
    }

    // Reset city when county changes
    watch(() => eventData.value.county, () => {
      eventData.value.city = '';
    });

    // If we're editing an existing event, populate the form with its data
    watch(() => props.eventToEdit, (newEvent) => {
      if (newEvent) {
        try {
          // Create a temporary object to properly handle county and city
          const updatedData = { 
            ...newEvent,
          };
          
          // Set event data
          eventData.value = updatedData;
          
          // Update date objects
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
          
          // If we need to force loading cities for county
          if (newEvent.county && newEvent.city) {
            // Use nextTick to ensure proper loading
            nextTick(() => {
              // Check if city is available in the filtered cities list
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

        // Skip validare dacă e doar update pentru isActive
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

        // Formatăm datele pentru backend
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
        } else {
          emit("event-added", savedEvent);
        }

        emit("close");
      } catch (error) {
        console.error("Error saving event:", error);
        alert("Failed to save event. Please try again.");
      }
    };



    // When clicking outside of date picker, close it
    document.addEventListener('click', (event) => {
      const startPicker = document.querySelector('.start-calendar-container');
      const endPicker = document.querySelector('.end-calendar-container');
      
      if (showStartDatePicker.value && startPicker && !startPicker.contains(event.target) &&
          !event.target.closest('.start-date-trigger')) {
        showStartDatePicker.value = false;
      }
      
      if (showEndDatePicker.value && endPicker && !endPicker.contains(event.target) &&
          !event.target.closest('.end-date-trigger')) {
        showEndDatePicker.value = false;
      }
    });

    return {
      eventData,
      counties,
      filteredCities,
      handleSubmit,
      // Date picker
      showStartDatePicker,
      showEndDatePicker,
      startDate,
      endDate,
      startMonth,
      startYear,
      endMonth,
      endYear,
      startMonthName,
      endMonthName,
      daysOfWeek,
      startCalendarDays,
      endCalendarDays,
      toggleStartDatePicker,
      toggleEndDatePicker,
      prevMonth,
      nextMonth,
      selectStartDate,
      selectEndDate,
      setToday,
      formatDateForDisplay,
      // Time picker
      startHour,
      startMinute,
      endHour,
      endMinute,
      formatHour,
      updateStartDateTime,
      updateEndDateTime
    };
  },
};
</script>

<style scoped>
.calendar-container {
  width: 280px;
}
</style>