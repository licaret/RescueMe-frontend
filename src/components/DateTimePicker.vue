<template>
    <div class="flex flex-col space-y-2">
      <!-- Date picker -->
      <div class="relative">
        <div 
          class="flex items-center w-full rounded-2xl border border-gray-300 px-3 py-2 cursor-pointer"
          @click="toggleDatePicker"
        >
          <span class="flex-grow">{{ formatDateForDisplay(selectedDate) }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <!-- Calendar dropdown -->
        <div v-if="showDatePicker" class="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-2 border">
          <div class="flex justify-between items-center mb-2">
            <button 
              type="button"
              @click="prevMonth" 
              class="p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span class="font-medium">{{ monthName }} {{ year }}</span>
            
            <button 
              type="button"
              @click="nextMonth" 
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
              v-for="(day, index) in calendarDays"
              :key="index"
              type="button"
              :disabled="day.disabled"
              @click="selectDate(day)"
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
              @click="setToday" 
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
            v-model="hour" 
            @change="updateDateTime"
            class="w-full rounded-2xl border border-gray-300 px-3 py-2"
          >
            <option 
              v-for="h in 24" 
              :key="`hour-${h}`" 
              :value="h-1"
              :disabled="isHourDisabled(h-1)"
            >
              {{ formatHour(h-1) }}
            </option>
          </select>
        </div>
        <span class="text-lg">:</span>
        <div class="flex-1">
          <select 
            v-model="minute" 
            @change="updateDateTime"
            class="w-full rounded-2xl border border-gray-300 px-3 py-2"
          >
            <option 
              v-for="m in [0, 15, 30, 45]" 
              :key="`minute-${m}`" 
              :value="m"
              :disabled="isMinuteDisabled(m)"
            >
              {{ m.toString().padStart(2, '0') }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  
  export default {
    name: 'DateTimePicker',
    
    props: {
      modelValue: {
        type: Date,
        required: true
      },
      minDateTime: {
        type: Date,
        default: null
      },
      label: {
        type: String,
        default: ''
      }
    },
    
    emits: ['update:modelValue'],
    
    setup(props, { emit }) {
      const showDatePicker = ref(false);
      const selectedDate = ref(new Date(props.modelValue));
      const month = ref(selectedDate.value.getMonth());
      const year = ref(selectedDate.value.getFullYear());
      
      const hour = ref(selectedDate.value.getHours());
      const minute = ref(Math.floor(selectedDate.value.getMinutes() / 15) * 15);
  
      const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      
      const monthName = computed(() => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 
                       'August', 'September', 'October', 'November', 'December'];
        return months[month.value];
      });
  
      const calendarDays = computed(() => {
        return generateCalendarDays(year.value, month.value, selectedDate.value, props.minDateTime);
      });
  
      watch(() => props.modelValue, (newValue) => {
        if (newValue && newValue instanceof Date) {
          selectedDate.value = new Date(newValue);
          month.value = selectedDate.value.getMonth();
          year.value = selectedDate.value.getFullYear();
          hour.value = selectedDate.value.getHours();
          minute.value = Math.floor(selectedDate.value.getMinutes() / 15) * 15;
        }
      });
  
      function generateCalendarDays(year, month, selectedDate, minDate = null) {
        const days = [];
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        
        const firstDayOfWeek = firstDay.getDay();
        
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
  

      function toggleDatePicker() {
        showDatePicker.value = !showDatePicker.value;
      }
  

      function prevMonth() {
        if (month.value === 0) {
          month.value = 11;
          year.value--;
        } else {
          month.value--;
        }
      }

      
      function nextMonth() {
        if (month.value === 11) {
          month.value = 0;
          year.value++;
        } else {
          month.value++;
        }
      }
  

      function selectDate(day) {
        if (day.disabled) return;
        
        selectedDate.value = new Date(day.date);
        selectedDate.value.setHours(hour.value, minute.value);
        updateDateTime();
        showDatePicker.value = false;
      }
  

      function setToday() {
        const today = new Date();
        
        month.value = today.getMonth();
        year.value = today.getFullYear();
        selectedDate.value = new Date(today);
        selectedDate.value.setHours(hour.value, minute.value);
        updateDateTime();
      }
  

      function formatDateForDisplay(date) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
      

      function formatHour(hour) {
        return hour.toString().padStart(2, '0');
      }
  

      function isHourDisabled(h) {
        if (!props.minDateTime) return false;
        
        const selectedDay = new Date(selectedDate.value);
        selectedDay.setHours(0, 0, 0, 0);
        
        const minDay = new Date(props.minDateTime);
        minDay.setHours(0, 0, 0, 0);
        
        if (selectedDay.getTime() === minDay.getTime()) {
          return h < props.minDateTime.getHours();
        }
        
        return false;
      }
      

      function isMinuteDisabled(m) {
        if (!props.minDateTime) return false;
        
        const selectedDay = new Date(selectedDate.value);
        selectedDay.setHours(0, 0, 0, 0);
        
        const minDay = new Date(props.minDateTime);
        minDay.setHours(0, 0, 0, 0);
        
        if (selectedDay.getTime() === minDay.getTime() && 
            hour.value === props.minDateTime.getHours()) {
          return m < props.minDateTime.getMinutes();
        }
        
        return false;
      }
  

      function updateDateTime() {
        const newDate = new Date(selectedDate.value);
        newDate.setHours(hour.value, minute.value);
        selectedDate.value = newDate;
        emit('update:modelValue', newDate);
      }

  
      return {
        selectedDate,
        month,
        year,
        hour,
        minute,
        showDatePicker,
        monthName,
        daysOfWeek,
        calendarDays,
        
        toggleDatePicker,
        prevMonth,
        nextMonth,
        selectDate,
        setToday,
        formatDateForDisplay,
        formatHour,
        updateDateTime,
        isHourDisabled,
        isMinuteDisabled
      };
    }
  };
  </script>