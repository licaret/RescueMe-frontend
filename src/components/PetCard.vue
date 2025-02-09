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
            :class="`px-3 py-1 rounded-full text-sm ${
              pet.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`"
          >
            {{ pet.status || '' }}
          </span>
        </div>
      </div>
  
      <!-- Carousel Section -->
      <div class="p-4 pt-0 relative">
        <button
          class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md hover:bg-gray-300"
          @click="prevImage"
        >
          &lt;
        </button>
        <div class="flex items-center justify-center">
          <img
            v-if="pet.photoUrls && pet.photoUrls.length > 0"
            :src="pet.photoUrls[currentIndex]"
            alt="Pet Photo"
            class="w-64 h-64 object-cover rounded-lg"
          />
          <p v-else>No photo available</p>
        </div>
        <button
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
            class="border border-gray-300 rounded-full px-4 py-2 text-sm bg-gray-50"
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
  
      <!-- Edit and Remove Buttons -->
      <div class="p-4 pt-0">
        <div class="flex gap-2">
          <button class="flex-1 border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-2">
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

          <ConfirmationModal
            :isOpen="showModal"
            title="Delete Pet"
            description="Are you sure you want to delete this pet? This action cannot be undone."
            confirmButtonText="Yes, delete it"
            cancelButtonText="Cancel"
            @confirm="deletePet"
            @cancel="showModal = false"
            @update:isOpen="showModal = $event"
          />
        </div>
      </div>
    </div>
  </template>
  
  
  
  <script>
import { ref, defineEmits } from "vue";
import { deletePet } from "../services/pet_service"; 
import ConfirmationModal from "@/components/ConfirmationModal.vue";
  
  export default {
    name: "PetCard",
    components: {
      ConfirmationModal,
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
    },

    emits: ['petDeleted'],

    setup(props, context) {
      // const emit = defineEmits(["petDeleted"]);

      const currentIndex = ref(0);
      const showStory = ref(false);
  
      const prevImage = () => {
        currentIndex.value = (currentIndex.value - 1 + props.pet.photoUrls.length) % props.pet.photoUrls.length;
      };
  
      const nextImage = () => {
        currentIndex.value = (currentIndex.value + 1) % props.pet.photoUrls.length;
      };
  
      const toggleStory = () => {
        showStory.value = !showStory.value;
      };
  
      const formattedSpecifications = {
        Name: props.pet.name || '',
        "Type of Animal": props.pet.species || '',
        Sex: props.pet.sex || '',
        Age: props.pet.age ? `${props.pet.age} years` : '',
        Size: props.pet.size || '',
        "Health Status": props.pet.healthStatus || '',
        Vaccinated: props.pet.vaccinated !== undefined ? (props.pet.vaccinated ? 'Yes' : 'No') : '',
        Neutered: props.pet.neutered !== undefined ? (props.pet.neutered ? 'Yes' : 'No') : '',
        Breed: props.pet.breed || '',
        "Urgent Adoption Needed": props.pet.urgentAdoptionNeeded !== undefined ? (props.pet.urgentAdoptionNeeded ? 'Yes' : 'No') : '',
        "Time Spent in Shelter": props.pet.timeSpentInShelter || '',
      };

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
            context.emit('petDeleted', petId);  // Use context.emit instead of emit
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
    }
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
  

  