<template>
  <div
    class="border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden bg-white"
    v-if="pet"
  >
    <!-- Image with Status Badge and Navigation -->
    <div class="relative h-56">
      <!-- Pet Image -->
      <img
        v-if="pet.photos && pet.photos.length > 0"
        :src="pet.photos[currentIndex]?.url"
        alt="Pet Photo"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <p class="text-gray-400">No photo available</p>
      </div>

      <!-- Status Badge -->
      <div 
        class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
        :class="{
          'bg-green-500 text-white': pet.status === 'AVAILABLE',
          'bg-yellow-500 text-white': pet.status === 'PENDING',
          'bg-red-500 text-white': pet.status === 'ADOPTED'
        }"
      >
        {{ pet.status || '' }}
      </div>

      <!-- Urgent Badge -->
      <div
        v-if="pet.urgentAdoptionNeeded"
        class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        URGENT ADOPTION
      </div>

      <!-- Navigation Buttons -->
      <div v-if="pet.photos && pet.photos.length > 1" class="absolute inset-x-0 bottom-3 flex justify-center space-x-1">
        <button
          class="w-8 h-8 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
          @click="prevImage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          class="w-8 h-8 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
          @click="nextImage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Pet Info -->
    <div class="p-4">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="text-lg font-bold text-gray-800">{{ pet.name || '' }}</h3>
          <div class="flex items-center gap-1.5 text-sm text-gray-500">
            <span v-if="pet.species">Species: {{ pet.species }}</span>
            <span v-if="pet.species && pet.breed">•</span>
            <span>Breed: {{ pet.breed || 'Unknown' }}</span>
          </div>
        </div>
        <!-- Story Button with Hover/Popup -->
        <div class="relative group">
          <button
            class="text-red-600 hover:text-red-700 text-sm font-medium flex items-center bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors"
          >
            <span>Story</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <!-- Story Pop-up on Hover -->
          <div class="absolute right-0 w-64 bg-white p-3 rounded-xl border border-gray-200 shadow-lg z-10 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top-right">
            <div class="absolute right-3 -top-2 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
            <p class="text-gray-700 text-sm">{{ pet.story || "This pet doesn't have a story yet." }}</p>
          </div>
        </div>
      </div>

      <!-- Tags with rounded design -->
      <div class="flex flex-wrap gap-2 mb-3">        
        <!-- Sex -->
        <span class="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200">
          <svg v-if="pet.sex === 'Male'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="10.5" cy="10.5" r="7.5" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
            <line x1="21" y1="10.5" x2="16.5" y2="10.5" />
            <line x1="18.75" y1="7.75" x2="18.75" y2="13.25" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="9.5" r="7.5" />
            <line x1="12" y1="17" x2="12" y2="22" />
            <line x1="9" y1="19.5" x2="15" y2="19.5" />
          </svg>
          Sex: {{ pet.sex === 'Male' ? 'Male' : 'Female' }}
        </span>

        <!-- Age -->
        <span class="inline-flex items-center px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-xs border border-yellow-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
          </svg>
          Age: {{ formatAge(pet.age) }}
        </span>

        <!-- Size -->
        <span class="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          Size: {{ pet.size || 'Unknown' }}
        </span>

        <!-- Health Status -->
        <span 
          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs"
          :class="pet.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700 border border-green-200' : pet.healthStatus === 'Minor Issues' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m-6-8h12M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
          Health: {{ pet.healthStatus || 'Unknown' }}
        </span>
        
        <!-- Time in Shelter -->
        <span class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs border border-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formatShelterTime(pet.timeSpentInShelter) }}
        </span>
      </div>

      <!-- Boolean Tags with green/red color coding -->
      <div class="flex flex-wrap gap-2">
        <!-- Vaccinated -->
        <span 
          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs"
          :class="pet.vaccinated ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'"
        >
          <svg v-if="pet.vaccinated" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ pet.vaccinated ? 'Vaccinated' : 'Not Vaccinated' }}
        </span>

        <!-- Neutered -->
        <span 
          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs"
          :class="pet.neutered ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'"
        >
          <svg v-if="pet.neutered" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ pet.neutered ? 'Neutered' : 'Not Neutered' }}
        </span>
      </div>
    </div>

    <!-- Action Buttons with rounded corners -->
    <div class="border-t border-gray-100 mt-auto">
      <div v-if="isShelter" class="grid grid-cols-2 divide-x divide-gray-100">
        <button 
          @click="openEditForm"
          class="py-3 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          @click="showModal = true"
          class="py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
      
      <div v-else class="grid grid-cols-2 divide-x divide-gray-100">
        <button 
          @click="toggleFavorite"
          class="py-3 flex items-center justify-center gap-2 transition-colors rounded-bl-2xl"
          :class="isFavorited ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'"
        >
          <svg 
            class="w-5 h-5" 
            :class="isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            fill="none" 
            stroke-width="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {{ isFavorited ? 'Favorited' : 'Favorite' }}
        </button>
        
        <button
          v-if="pet.status === 'AVAILABLE'"
          @click="adoptPet"
          class="py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors flex items-center justify-center gap-1 rounded-br-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          ADOPT NOW
        </button>
        <button
          v-else
          disabled
          class="py-3 bg-gray-300 text-gray-600 font-bold cursor-not-allowed flex items-center justify-center gap-1 rounded-br-2xl"
        >
          ADOPT NOW
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
import { ref, computed } from "vue";
import { deletePet } from "../services/pet_service"; 
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import AddPetForm from "@/components/AddPetForm.vue";

export default {
  name: "PetCard",
  components: {
    ConfirmationModal,
    AddPetForm,
  },
  
  data() {
    return {
      showModal: false,
    };
  },
  props: {
    pet: {
      type: Object,
      required: true,
    },
    favorited: {
      type: Boolean,
      default: false
    },
  },

  emits: ["pet-updated", "petDeleted", "toggleFavorite", "adoptPet"],

  setup(props, {emit}) {
    const currentIndex = ref(0);
    const showModal = ref(false);
    const showEditForm = ref(false);
    const isFavorited = ref(props.favorited);

    const isShelter = computed(() => {
      const userRole = localStorage.getItem('Role');
      return userRole === 'SHELTER';
    });

    const toggleFavorite = () => {
      isFavorited.value = !isFavorited.value;
      emit("toggleFavorite", props.pet.id);
    };

    const adoptPet = () => {
      emit("adoptPet", props.pet.id);
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
      
      const shelterTimeInMonths = Math.round(time * 12);
      if (shelterTimeInMonths >= 12) {
        return `${Math.floor(time)} ${Math.floor(time) === 1 ? 'year' : 'years'} in shelter`;
      } else {
        return `${shelterTimeInMonths} ${shelterTimeInMonths === 1 ? 'month' : 'months'} in shelter`;
      }
    };

    return {
      currentIndex,
      prevImage,
      nextImage,
      showModal,
      showEditForm,
      openEditForm,
      updatePet,
      toggleFavorite,
      adoptPet,
      isShelter,
      isFavorited,
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
        this.$emit("petDeleted", petId); 
        this.showModal = false; 
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
    },
  },
};
</script>

<style scoped>
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