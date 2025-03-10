<template>
  <div
    class="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow flex flex-col justify-between relative"
    v-if="pet"
  >
    <!-- Card Header -->
    <div class="p-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-bold">{{ pet.name || '' }}</h3>
          <p class="text-sm text-gray-500">{{ pet.breed || '' }}</p>
        </div>
        <span
          :class="`px-3 py-1 rounded-full text-sm font-semibold ${
            pet.status === 'AVAILABLE' 
              ? 'bg-green-100 text-green-800'
              : pet.status === 'PENDING' 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800' 
          }`"
        >
          {{ pet.status || '' }}
        </span>
      </div>
    </div>

    <!-- Carousel Section -->
    <div class="p-4 pt-0 relative">
      <button
        v-if="pet.photos.length > 1"
        class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md hover:bg-gray-300"
        @click="prevImage"
      >
        &lt;
      </button>
      <div class="flex items-center justify-center">
        <img
          v-if="pet.photos && pet.photos.length > 0"
          :src="pet.photos[currentIndex]?.url"
          alt="Pet Photo"
          class="w-64 h-64 object-cover rounded-lg"
        />
        <p v-else>No photo available</p>
      </div>
      <button
        v-if="pet.photos.length > 1"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md hover:bg-gray-300"
        @click="nextImage"
      >
        &gt;
      </button>
    </div>


    <!-- Specifications Section -->
    <div class="p-4 pt-0">
      <div class="flex flex-wrap gap-2 pl-3 pr-2">
        <div
          v-for="(value, key) in formattedSpecifications"
          :key="key"
          :class="[
            'border border-gray-300 rounded-full px-4 py-2 text-sm bg-gray-50',
            key === 'Urgent Adoption Needed' && pet.urgentAdoptionNeeded
              ? 'border-red-600 font-bold text-red-600'
              : ''
          ]"
        >
          <span class="font-semibold">{{ key }}:</span> {{ value }}
        </div>
      </div>
    </div>


    <!-- Read My Story Section -->
    <div class="p-4 text-center relative">
      <button
        class="text-red-600 font-semibold hover:text-red-800"
        @mouseover="showStory = true"
        @mouseleave="showStory = false"
      >
        Read My Story
      </button>
      <transition name="fade">
        <div
          v-show="showStory"
          class="absolute top-[90%] left-0 w-full bg-white border-t border-gray-300 mt-2 p-4 rounded-b-lg shadow-lg z-10"
        >
          <p class="text-gray-700">
            {{ pet.story || "This pet doesn't have a story yet." }}
          </p>
        </div>
      </transition>
    </div>

      <!-- Action Buttons based on mode prop -->
    <div class="p-4 pt-0">
      <!-- If in shelter mode, show Edit & Remove buttons -->
      <div v-if="isShelter" class="flex gap-2">
        <button 
          @click="openEditForm"
          class="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-2">
          <img src="../assets/edit.png" alt="Edit icon" class="w-4 h-4" />
          Edit
        </button>
        <button
          @click="showModal = true"
          class="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
        >
          <img src="../assets/trash.png" alt="Delete icon" class="w-4 h-4" />
          Remove
        </button>
      </div>
      
      <!-- If in adopter mode, show Favorite & Adopt buttons -->
      <div v-else class="flex gap-2">
        <button 
          @click="toggleFavorite"
          class="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-2"
          :class="isFavorited ? 'bg-pink-50 border-pink-200' : ''"
        >
          <!-- Heart Icon (filled if favorited) -->
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
          <span :class="isFavorited ? 'text-red-500' : ''">{{ isFavorited ? 'Favorited' : 'Favorite' }}</span>
        </button>
        
        <button
          v-if="pet.status === 'AVAILABLE'"
          @click="adoptPet"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ADOPT NOW
        </button>
        <button
          v-else
          disabled
          class="flex-1 bg-gray-300 text-gray-600 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
        >
          {{ pet.status === 'PENDING' ? 'PENDING' : 'ADOPTED' }}
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
    <AddPetForm v-if="showEditForm" :petToEdit="pet" @close="showEditForm = false" @pet-updated="updatePet" />

  </div>
</template>



<script>
import { ref, computed, onMounted } from "vue";
import { deletePet } from "../services/pet_service"; 
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import AddPetForm from "@/components/AddPetForm.vue";
import { defineEmits } from "vue";


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
    //console.log("PetCard mounted with pet:", props.pet);
    const currentIndex = ref(0);
    const showStory = ref(false);
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
      currentIndex.value = (currentIndex.value - 1 + props.pet.photos.length) % props.pet.photos.length;
    };

    const nextImage = () => {
      currentIndex.value = (currentIndex.value + 1) % props.pet.photos.length;
    };


    const toggleStory = () => {
      showStory.value = !showStory.value;
    };

    const formattedSpecifications = computed(() => {
      const age = props.pet.age ?? 0; 
      const ageInMonths = Math.round(age * 12);

      const timeSpent = props.pet.timeSpentInShelter;
    const shelterTimeInMonths = timeSpent ? Math.round(timeSpent * 12) : null;

      return {
        Name: props.pet.name || '',
        "Type of Animal": props.pet.species || '',
        Sex: props.pet.sex || '',
        Age:
          ageInMonths >= 12
            ? `${Math.floor(age)} years`
            : `${ageInMonths} months`,
        Size: props.pet.size || '',
        "Health Status": props.pet.healthStatus || '',
        Vaccinated: props.pet.vaccinated !== undefined ? (props.pet.vaccinated ? 'Yes' : 'No') : '',
        Neutered: props.pet.neutered !== undefined ? (props.pet.neutered ? 'Yes' : 'No') : '',
        Breed: props.pet.breed || '',
        "Urgent Adoption Needed": props.pet.urgentAdoptionNeeded !== undefined ? (props.pet.urgentAdoptionNeeded ? 'Yes' : 'No') : '',
        "Time Spent in Shelter": shelterTimeInMonths !== null ? 
          (shelterTimeInMonths >= 12 ? `${Math.floor(timeSpent)} years` : `${shelterTimeInMonths} months`) 
          : 'Not specified',
      };
    });

    
    const handleRemovePet = async () => {
      try {
        const shelterId = localStorage.getItem("shelterId");
        const petId = props.pet.id;

        if (!shelterId || !petId) {
          console.error("Shelter ID or Pet ID is missing");
          return;
        }

        const success = await deletePet(shelterId, petId);
        
        if (success) {
          console.log(`Pet with ID ${petId} deleted successfully`);
          context.emit('petDeleted', petId);
        } else {
          console.error("Failed to delete pet");
        }
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
    };


    return {
      currentIndex,
      prevImage,
      nextImage,
      showStory,
      toggleStory,
      formattedSpecifications,
      handleRemovePet,
      showEditForm,
      openEditForm,
      updatePet,
      toggleFavorite,
      adoptPet,
      isShelter
    };
  },

  methods: {
    async deletePet() {
      const shelterId = localStorage.getItem("shelterId");
      const petId = this.pet.id;

      try {
        await deletePet(shelterId, petId);
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
    transition: opacity 0.5s;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  button {
    transition: color 0.3s ease;
  }
</style>