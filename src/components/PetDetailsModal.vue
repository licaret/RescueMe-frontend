<template>
  <div 
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 overflow-y-auto backdrop-blur-sm"
    @click="handleBackdropClick"
  >
    <div 
      class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transform transition-all duration-300 modal-content"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">{{ pet.name }}'s Profile</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="overflow-y-auto flex-1 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Image Gallery -->
          <div class="relative">
            <div class="h-80 overflow-hidden bg-gray-100 rounded-2xl">
              <img
                v-if="pet.photos && pet.photos.length > 0"
                :src="pet.photos[currentIndex]?.url"
                alt="Pet Photo"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <!-- Navigation Controls -->
            <div v-if="pet.photos && pet.photos.length > 1" class="flex justify-center mt-4 gap-2">
              <button
                class="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-all"
                @click.stop="prevImage"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <!-- Thumbnails -->
              <div class="flex items-center gap-2 overflow-x-auto px-2 max-w-xs">
                <div 
                  v-for="(photo, index) in pet.photos" 
                  :key="index"
                  @click.stop="goToImage(index)"
                  class="h-8 w-8 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  :class="index === currentIndex ? 'ring-2 ring-indigo-500' : ''"
                >
                  <img :src="photo.url" alt="Thumbnail" class="w-full h-full object-cover" />
                </div>
              </div>
              
              <button
                class="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-all"
                @click.stop="nextImage"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Pet Details -->
          <div class="space-y-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {{ pet.name }}
                <span 
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': pet.status === 'AVAILABLE',
                    'bg-yellow-100 text-yellow-800': pet.status === 'PENDING',
                    'bg-gray-100 text-gray-800': pet.status === 'ADOPTED'
                  }"
                >
                  {{ pet.status }}
                </span>
                <span v-if="pet.urgentAdoptionNeeded" class="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Urgent
                </span>
              </h3>
              <div class="flex items-center gap-2 text-gray-600 mt-1">
                <span class="font-medium">{{ pet.species }}</span>
                <span>•</span>
                <span>{{ pet.breed || 'Mixed Breed' }}</span>
              </div>
            </div>
            
            <!-- Primary Attributes -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <!-- Age -->
              <div class="bg-gray-50 p-3 rounded-2xl">
                <div class="text-amber-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500 block">Age</span>
                <span class="text-sm font-medium text-gray-800">{{ formatAge(pet.age) }}</span>
              </div>
              
              <!-- Sex -->
              <div class="bg-gray-50 p-3 rounded-2xl">
                <div class="text-purple-500 mb-1">
                  <svg v-if="pet.sex === 'Male'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="10.5" cy="10.5" r="7.5" />
                    <line x1="21" y1="21" x2="16.5" y2="16.5" />
                    <line x1="21" y1="10.5" x2="16.5" y2="10.5" />
                    <line x1="18.75" y1="7.75" x2="18.75" y2="13.25" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="9.5" r="7.5" />
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <line x1="9" y1="19.5" x2="15" y2="19.5" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500 block">Sex</span>
                <span class="text-sm font-medium text-gray-800">{{ pet.sex || 'Unknown' }}</span>
              </div>
              
              <!-- Size -->
              <div class="bg-gray-50 p-3 rounded-2xl">
                <div class="text-blue-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500 block">Size</span>
                <span class="text-sm font-medium text-gray-800">{{ pet.size || 'Unknown' }}</span>
              </div>
            </div>
            
            <!-- Health Status -->
            <div class="flex items-center p-4 rounded-2xl" 
                 :class="pet.healthStatus === 'Healthy' ? 'bg-green-50' : pet.healthStatus === 'Minor Issues' ? 'bg-yellow-50' : 'bg-red-50'">
              <div :class="pet.healthStatus === 'Healthy' ? 'text-green-500' : pet.healthStatus === 'Minor Issues' ? 'text-yellow-500' : 'text-red-500'" class="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <div class="text-xs text-gray-500">Health Status</div>
                <div class="text-sm font-medium"
                     :class="pet.healthStatus === 'Healthy' ? 'text-green-700' : pet.healthStatus === 'Minor Issues' ? 'text-yellow-700' : 'text-red-700'">
                  {{ pet.healthStatus || 'Unknown' }}
                </div>
              </div>
              <div class="ml-auto flex gap-4">
                <!-- Vaccinated -->
                <div class="flex flex-col items-center">
                  <div class="text-xs text-gray-500">Vaccinated</div>
                  <div class="flex items-center justify-center">
                    <svg v-if="pet.vaccinated" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                
                <!-- Neutered -->
                <div class="flex flex-col items-center">
                  <div class="text-xs text-gray-500">Neutered</div>
                  <div class="flex items-center justify-center">
                    <svg v-if="pet.neutered" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shelter Time -->
            <div class="flex items-center p-4 bg-blue-50 rounded-2xl">
              <div class="text-blue-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div class="text-xs text-gray-500">Time in Shelter</div>
                <div class="text-sm font-medium text-blue-700">{{ formatShelterTime(pet.timeSpentInShelter) }}</div>
              </div>
            </div>
            
            <!-- Story -->
            <div class="bg-gray-50 p-4 rounded-2xl">
              <div class="flex items-center mb-2 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h4 class="font-medium text-gray-800">{{ pet.name }}'s Story</h4>
              </div>
              <p class="text-gray-700 text-sm leading-relaxed">
                {{ pet.story || `${pet.name} doesn't have a story yet, but is excited to find a loving home!` }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-100 flex justify-between">
        <!-- Shelter buttons -->
        <template v-if="isShelter">
          <div>
            <button
              @click.stop="$emit('delete')"
              class="flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
          <div class="flex gap-3">
            <button 
              @click.stop="$emit('edit')"
              class="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Pet
            </button>
          </div>
        </template>

        <!-- Public/Adopter buttons -->
        <template v-else>
          <div></div>
          <div class="flex gap-3">
            <!-- Save -->
            <button 
              @click.stop="$emit('toggleFavorite')"
              class="flex items-center gap-1.5 bg-gray-100 px-4 py-2 rounded-2xl text-sm font-medium"
              :class="isFavorite ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-200'"
            >
              <svg 
                class="w-4 h-4" 
                :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                fill="none" 
                stroke-width="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {{ isFavorite ? 'Saved' : 'Save' }}
            </button>

            <!-- Adopt or Not Available -->
            <button
              v-if="pet.status === 'AVAILABLE' && !hasExistingRequest"
              @click.stop="$emit('adopt')"
              class="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-2xl text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Adopt Now
            </button>
            <button
              v-else
              disabled
              class="bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Not Available
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export default {
  name: 'PetDetailsModal',
  props: {
    pet: {
      type: Object,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    hasExistingRequest: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'edit', 'delete', 'toggleFavorite', 'adopt'],
  setup(props, { emit }) {
    const currentIndex = ref(0);
    
    const isShelter = computed(() => {
      const userRole = localStorage.getItem('Role');
      return userRole === 'SHELTER';
    });
    
    // Reset image index when pet changes
    watch(() => props.pet, () => {
      currentIndex.value = 0;
    });
    
    // Disable body scrolling when modal is open
    onMounted(() => {
      document.body.style.overflow = 'hidden';
    });
    
    // Re-enable body scrolling when modal is closed
    onUnmounted(() => {
      document.body.style.overflow = '';
    });
    
    const close = () => {
      emit('close');
    };
    
    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        close();
      }
    };
    
    const prevImage = () => {
      if (!props.pet.photos || props.pet.photos.length <= 1) return;
      currentIndex.value = (currentIndex.value - 1 + props.pet.photos.length) % props.pet.photos.length;
    };
    
    const nextImage = () => {
      if (!props.pet.photos || props.pet.photos.length <= 1) return;
      currentIndex.value = (currentIndex.value + 1) % props.pet.photos.length;
    };
    
    const goToImage = (index) => {
      currentIndex.value = index;
    };
    
    const formatAge = (age) => {
      if (!age && age !== 0) return 'Unknown';
      
      const ageInMonths = Math.round(age * 12);
      if (ageInMonths >= 12) {
        return `${Math.floor(age)} ${Math.floor(age) === 1 ? 'year' : 'years'}`;
      } else {
        return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
      }
    };
    
    const formatShelterTime = (time) => {
      if (!time) return 'New arrival';
      
      const shelterTimeInMonths = parseInt(time);
      if (shelterTimeInMonths >= 12) {
        const years = Math.floor(shelterTimeInMonths / 12);
        return `${years} ${years === 1 ? 'year' : 'years'} in shelter`;
      } else {
        return `${shelterTimeInMonths} ${shelterTimeInMonths === 1 ? 'month' : 'months'} in shelter`;
      }
    };
    
    return {
      currentIndex,
      isShelter,
      close,
      handleBackdropClick,
      prevImage,
      nextImage,
      goToImage,
      formatAge,
      formatShelterTime
    };
  }
};
</script>

<style scoped>
@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  animation: modal-appear 0.2s ease-out forwards;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
  border: 2px solid transparent;
}
</style>