<template>
  <div class="pet-card-container">
    <!-- Compact Card View -->
    <div 
      class="overflow-hidden bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg transition-all duration-300 flex flex-col relative"
      v-if="pet"
    >
      <!-- Image Gallery with Status Indicators -->
      <div class="relative h-56 overflow-hidden bg-gray-100 rounded-t-2xl">
        <!-- Pet Image -->
        <img
          v-if="pet.photos && pet.photos.length > 0"
          :src="pet.photos[currentIndex]?.url"
          alt="Pet Photo"
          class="w-full h-full object-cover transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Status Indicators -->
        <div class="absolute top-3 left-0 right-0 z-10 px-3 flex justify-between items-center">
          <div 
            class="px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm"
            :class="{
              'bg-green-100/90 text-green-800 border border-green-200/60': pet.status === 'AVAILABLE',
              'bg-yellow-100/90 text-yellow-800 border border-yellow-200/60': pet.status === 'PENDING',
              'bg-gray-100/90 text-gray-800 border border-gray-200/60': pet.status === 'ADOPTED'
            }"
          >
            {{ pet.status || '' }}
          </div>
          
          <div
            v-if="pet.urgentAdoptionNeeded"
            class="bg-red-100/90 border border-red-200/60 text-red-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Urgent
          </div>
        </div>

        <!-- View Details Button-->
        <button 
          @click.stop="toggleExpandedView"
          class="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-md hover:bg-white hover:shadow-lg transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Details
        </button>
      </div>

      <!-- Essential Pet Information -->
      <div class="p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ pet.name || '' }}</h3>
            <div class="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
              <span v-if="pet.species" class="font-medium">{{ pet.species }}</span>
              <span v-if="pet.species && pet.breed" class="text-gray-400">•</span>
              <span class="text-gray-500">{{ pet.breed || 'Mixed Breed' }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Age -->
            <div class="flex flex-col items-center">
              <span class="text-xs text-gray-500">Age</span>
              <span class="text-sm font-medium text-gray-800">{{ formatAge(pet.age) }}</span>
            </div>
            
            <!-- Sex -->
            <div class="flex flex-col items-center">
              <span class="text-xs text-gray-500">Sex</span>
              <span class="text-sm font-medium text-gray-800">{{ pet.sex || 'Unknown' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-auto border-t border-gray-100">
        <div class="grid grid-cols-2 overflow-hidden">
          <!-- Shelter: Edit & Remove -->
          <template v-if="isShelter">
            <button 
              @click.stop="openEditForm"
              class="py-3 flex items-center justify-center gap-1.5 text-gray-600 hover:bg-gray-50 transition-colors text-sm border-r border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button 
              @click.stop="showDeleteModal"
              class="py-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </template>

          <!-- Public: Save & Adopt -->
          <template v-else>
            <button 
              @click.stop="toggleFavorite"
              class="py-3 flex items-center justify-center gap-1.5 transition-all duration-200 text-sm"
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

            <button
              v-if="pet.status === 'AVAILABLE' && !hasExistingRequest"
              @click.stop="adoptPet"
              class="py-3 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm flex items-center justify-center gap-1.5 border-l border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Adopt
            </button>
            <button
              v-else
              disabled
              class="py-3 text-gray-400 cursor-not-allowed flex items-center justify-center gap-1.5 text-sm border-l border-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ hasExistingRequest ? 'Already Requested' : 'Not Available' }}
            </button>
          </template>
        </div>

      </div>
    </div>
  </div>

  <!-- Use PetDetailsModal component -->
  <Teleport to="body">
    <PetDetailsModal 
      v-if="isExpanded" 
      :pet="pet"
      :isFavorite="isFavorite"
      :hasExistingRequest="hasExistingRequest"
      @close="toggleExpandedView"
      @edit="openEditForm"
      @delete="showDeleteModal"
      @toggleFavorite="toggleFavorite"
      @adopt="adoptPet"
    />
  </Teleport>

  <!-- Delete Pet Confirmation Modal -->
  <Teleport to="body" v-if="showModal">
    <div class="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Pet</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Are you sure you want to delete this pet? This action cannot be undone.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click.stop="deletePet"
            class="w-full inline-flex justify-center rounded-2xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
            Yes, delete it
          </button>
          <button 
            type="button" 
            @click.stop="showModal = false"
            class="mt-3 w-full inline-flex justify-center rounded-2xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Edit Form Modal -->
  <Teleport to="body" v-if="showEditForm">
    <div class="fixed inset-0 z-[10001] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
      <AddEditPetForm 
        :pet-to-edit="pet" 
        @close="showEditForm = false" 
        @pet-updated="updatePet" 
      />
    </div>
  </Teleport>

</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import { deletePet as deletePetService } from "../services/pet_service"; 
import { addToFavorites, removeFromFavorites, checkIfFavorite } from "../services/favorite_service";
import { setCurrentAdoptionPet } from '../services/adoption_state_service';
import { checkExistingRequest } from '../services/adoption_service';
import AddEditPetForm from './AddEditPetForm.vue';
import PetDetailsModal from './PetDetailsModal.vue';

export default {
  name: "PetCard",

  components: {
    AddEditPetForm,
    PetDetailsModal
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
    userType: {
      type: String,
      default: "public"
    }
  },

  emits: ["pet-updated", "pet-deleted", "adopt-pet", "toggleFavorite"],

  setup(props, { emit }) {
    const router = useRouter();

    const currentIndex = ref(0);
    const showModal = ref(false);
    const showEditForm = ref(false);
    const isFavorite = ref(props.favorited);
    const isExpanded = ref(false);
    const modalMounted = ref(false);
    const hasExistingRequest = ref(false);

    const isShelter = computed(() => {
      const userRole = localStorage.getItem('Role');
      return userRole === 'SHELTER';
    });


    watch(() => props.pet, () => {
      currentIndex.value = 0;
    });


    watch(() => props.favorited, (newValue) => {
      isFavorite.value = newValue;
    });


    onMounted(async () => {
      if (!isShelter.value && !props.favorited) {
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


    const toggleExpandedView = () => {
      isExpanded.value = !isExpanded.value;
      if (isExpanded.value) {
        currentIndex.value = 0;
        
        if (isExpanded.value) {
          document.body.style.overflow = 'hidden';
        }
      } else {
        document.body.style.overflow = '';
      }
    };


    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        toggleExpandedView();
      }
    };


    const toggleFavorite = async (event) => {
      if (event) event.stopPropagation();
      
      const userId = localStorage.getItem('Id');
      if (!userId) {
        console.error("User not logged in");
        return;
      }

      try {
        if (isFavorite.value) {
          await removeFromFavorites(userId, props.pet.id);
        } else {
          await addToFavorites(userId, props.pet.id);
        }
        
        isFavorite.value = !isFavorite.value;
        
        emit("toggleFavorite", props.pet.id);
        
        window.dispatchEvent(new CustomEvent('favorites-updated'));
        
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    };


    const adoptPet = (event) => {
      if (event) event.stopPropagation();
      
      const userId = localStorage.getItem('Id');
      const userRole = localStorage.getItem('Role');
      
      if (!userId) {
        router.push('/login?redirect=adoption&petId=' + props.pet.id);
        return;
      }
      
      if (userRole !== 'ADOPTER') {
        alert('Only adopters can submit adoption requests.');
        return;
      }

      setCurrentAdoptionPet(props.pet);
      
      router.push(`/adopt/${props.pet.id}`);
    };



    const openEditForm = (event) => {
      if (event) event.stopPropagation();
      showEditForm.value = true;
    };



    const updatePet = (updatedPet) => {
      emit("pet-updated", updatedPet);
      showEditForm.value = false;
    };



    const showDeleteModal = () => {
      showModal.value = true;
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
      
      const timeInYears = parseFloat(time);
      const shelterTimeInMonths = Math.round(timeInYears * 12);
      
      if (shelterTimeInMonths >= 12) {
        const years = Math.floor(shelterTimeInMonths / 12);
        return `${years} ${years === 1 ? 'year' : 'years'} in shelter`;
      } else {
        return `${shelterTimeInMonths} ${shelterTimeInMonths === 1 ? 'month' : 'months'} in shelter`;
      }
    };


    onMounted(() => {
      return () => {
        if (isExpanded.value) {
          document.body.style.overflow = '';
        }
      };
    });
  

    onMounted(async () => {
      if (!isShelter.value) {
        const userId = localStorage.getItem('Id');
        if (userId && props.pet.id) {
          try {
            hasExistingRequest.value = await checkExistingRequest(userId, props.pet.id);
          } catch (error) {
            console.error("Error checking existing requests:", error);
          }
        }
      }
    });

    return {
      currentIndex,
      showModal,
      showEditForm,
      isShelter,
      isFavorite,
      isExpanded,
      modalMounted,
      hasExistingRequest,

      prevImage,
      nextImage,
      goToImage,
      openEditForm,
      updatePet,
      toggleFavorite,
      adoptPet,
      formatAge,
      formatShelterTime,
      toggleExpandedView,
      handleBackdropClick,
      showDeleteModal
    };
  },

  methods: {
    async deletePet() {
      const Id = localStorage.getItem("Id");
      const petId = this.pet.id;

      try {
        await deletePetService(Id, petId);
        this.$emit("pet-deleted", petId); 
        this.showModal = false;
        this.isExpanded = false;
        document.body.style.overflow = '';
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
    }
  },
};
</script>

<style scoped>
.pet-card-container {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

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

.pet-card-container:hover img {
  transform: scale(1.03);
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