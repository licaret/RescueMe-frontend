<template>
  <div 
    class="overflow-hidden bg-white rounded-2xl border border-gray-200 shadow hover:shadow-md transition-all duration-300 flex flex-col relative"
    v-if="pet"
  >
    <!-- Image Gallery -->
    <div class="relative h-64 overflow-hidden bg-gray-100">
      <!-- Pet Image -->
      <img
        v-if="pet.photos && pet.photos.length > 0"
        :src="pet.photos[currentIndex]?.url"
        alt="Pet Photo"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Status Indicator -->
      <div class="absolute top-0 left-0 right-0 z-10 p-3 flex justify-between items-center">
        <div 
          class="px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm"
          :class="{
            'bg-green-100/80 text-green-800 border border-green-200/60': pet.status === 'AVAILABLE',
            'bg-yellow-100/80 text-yellow-800 border border-yellow-200/60': pet.status === 'PENDING',
            'bg-gray-100/80 text-gray-800 border border-gray-200/60': pet.status === 'ADOPTED'
          }"
        >
          {{ pet.status || '' }}
        </div>
        
        <!-- Urgent Indicator -->
        <div
          v-if="pet.urgentAdoptionNeeded"
          class="bg-red-100/80 border border-red-200/60 text-red-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Urgent
        </div>
      </div>

      <!-- Navigation Controls -->
      <div v-if="pet.photos && pet.photos.length > 1" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent">
        <div class="flex justify-between items-center p-3">
          <div class="flex items-center gap-1.5">
            <div 
              v-for="(_, index) in pet.photos" 
              :key="index"
              @click="goToImage(index)"
              class="h-1.5 rounded-full cursor-pointer transition-all duration-300"
              :class="index === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60'"
            ></div>
          </div>
          
          <div class="flex gap-2">
            <button
              class="w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 transition-all"
              @click="prevImage"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              class="w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 transition-all"
              @click="nextImage"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pet Information -->
    <div class="p-5">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">{{ pet.name || '' }}</h3>
          <div class="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span v-if="pet.species" class="font-medium">{{ pet.species }}</span>
            <span v-if="pet.species && pet.breed" class="text-gray-400">•</span>
            <span class="text-gray-500">{{ pet.breed || 'Mixed Breed' }}</span>
          </div>
        </div>
        
        <!-- Story Button with Dropdown -->
        <div class="relative group z-20">
          <button
            class="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1.5 bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors border border-indigo-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Read Story</span>
          </button>
          
          <!-- Story Popup -->
          <div class="absolute right-0 w-72 bg-white p-5 rounded-xl border border-gray-200 shadow-lg z-30 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top-right">
            <div class="absolute right-3 -top-2 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
            <div class="flex items-center mb-3 text-indigo-600">
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

      <!-- Pet Attributes -->
      <div class="space-y-4">
        <!-- Primary Attributes -->
        <div class="grid grid-cols-3 gap-2">
          <!-- Age -->
          <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <div class="text-amber-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs text-gray-500">Age</span>
            <span class="text-sm font-medium text-gray-800">{{ formatAge(pet.age) }}</span>
          </div>
          
          <!-- Sex -->
          <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
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
            <span class="text-xs text-gray-500">Sex</span>
            <span class="text-sm font-medium text-gray-800">{{ pet.sex || 'Unknown' }}</span>
          </div>
          
          <!-- Size -->
          <div class="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <div class="text-blue-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <span class="text-xs text-gray-500">Size</span>
            <span class="text-sm font-medium text-gray-800">{{ pet.size || 'Unknown' }}</span>
          </div>
        </div>
        
        <!-- Health Status -->
        <div class="flex items-center px-3 py-2 rounded-lg" 
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
        <div class="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
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
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-auto pt-4">
      <!-- Shelter Actions -->
      <div v-if="isShelter" class="grid grid-cols-2 border-t border-gray-100 mt-2">
        <button 
          @click="openEditForm"
          class="py-3.5 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
        <button
          @click="showModal = true"
          class="py-3.5 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors text-sm border-l border-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
      
      <!-- Adopter Actions -->
      <div v-else class="grid grid-cols-2 border-t border-gray-100 mt-2 overflow-hidden rounded-b-2xl">
        <!-- Save Button -->
        <button 
          @click="toggleFavorite"
          class="py-3.5 flex items-center justify-center gap-1.5 transition-all duration-200 text-sm"
          :class="isFavorite ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'"
        >
          <svg 
            class="w-4 h-4" 
            :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'" 
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
        
        <!-- Adopt Button -->
        <button
          v-if="pet.status === 'AVAILABLE'"
          @click="adoptPet"
          class="py-3.5 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Adopt Now
        </button>
        <button
          v-else
          disabled
          class="py-3.5 text-gray-400 cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Not Available
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showModal"
      :isOpen="showModal"
      title="Delete Pet"
      description="Are you sure you want to delete this pet? This action cannot be undone."
      confirmButtonText="Yes, delete it"
      cancelButtonText="Cancel"
      @confirm="deletePet"
      @cancel="showModal = false"
      @update:isOpen="showModal = $event"
    />

    <!-- Edit Form Modal -->
    <AddPetForm 
      v-if="showEditForm" 
      :petToEdit="pet" 
      @close="showEditForm = false" 
      @pet-updated="updatePet" 
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { deletePet } from "../services/pet_service"; 
import { addToFavorites, removeFromFavorites, checkIfFavorite } from "../services/favorite_service";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import AddPetForm from "@/components/AddPetForm.vue";

export default {
  name: "PetCard",
  components: {
    ConfirmationModal,
    AddPetForm,
  },
  
  props: {
    pet: {
      type: Object,
      required: true,
    }
  },

  emits: ["pet-updated", "pet-deleted", "adopt-pet"],

  setup(props, { emit }) {
    const currentIndex = ref(0);
    const showModal = ref(false);
    const showEditForm = ref(false);
    const isFavorite = ref(false);

    const isShelter = computed(() => {
      const userRole = localStorage.getItem('Role');
      return userRole === 'SHELTER';
    });

    // Check if pet is in user's favorites when component is mounted
    onMounted(async () => {
      if (!isShelter.value) {
        const userId = localStorage.getItem('Id');
        if (userId && props.pet.id) {
          try {
            const favoriteStatus = await checkIfFavorite(userId, props.pet.id);
            isFavorite.value = favoriteStatus;
          } catch (error) {
            console.error("Error checking favorite status:", error);
          }
        }
      }
    });

    const toggleFavorite = async () => {
      const userId = localStorage.getItem('Id');
      if (!userId) {
        // Redirect to login or show login modal
        console.error("User not logged in");
        return;
      }

      try {
        if (isFavorite.value) {
          await removeFromFavorites(userId, props.pet.id);
        } else {
          await addToFavorites(userId, props.pet.id);
        }
        
        // Toggle the local state
        isFavorite.value = !isFavorite.value;
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    };

    const adoptPet = () => {
      emit("adopt-pet", props.pet.id);
    };

    const openEditForm = () => {
      showEditForm.value = true;
    };

    const updatePet = (updatedPet) => {
      emit("pet-updated", updatedPet);
      showEditForm.value = false;
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
      prevImage,
      nextImage,
      goToImage,
      showModal,
      showEditForm,
      openEditForm,
      updatePet,
      toggleFavorite,
      adoptPet,
      isShelter,
      isFavorite,
      formatAge,
      formatShelterTime
    };
  },

  methods: {
    async deletePet() {
      const Id = localStorage.getItem("Id");
      const petId = this.pet.id;

      try {
        await deletePet(Id, petId);
        this.$emit("pet-deleted", petId); 
        this.showModal = false; 
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
    }
  },
};
</script>

<style scoped>
/* Optional custom animations and transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>