<template>
  <div class="p-4 mt-20 space-y-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manage Pets</h1>
        <p class="text-gray-600">Add, edit and manage your pets</p>
      </div>
      <button @click="showAddPetForm = true" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <img src="../assets/plus.png" alt="Plus icon" class="w-4 h-4" />
        Add New Pet
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white p-6 rounded-xl border border-gray-300 shadow-lg">
      <!-- Top Row: Search & Toggle Filters -->
      <div class="flex justify-between items-center mb-6">
        <!-- Search Bar -->
        <div class="flex-1 min-w-[250px]">
          <div class="relative">
            <img src="../assets/search.png" alt="Search icon" class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              v-model="filters.name"
              placeholder="Search by name..."
              class="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <!-- Filters Toggle Button -->
        <button 
          @click="showFilters = !showFilters"
          class="flex items-center gap-2 px-5 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
        >
          <img src="../assets/filter.png" alt="Filter icon" class="w-5 h-5" />
          <span class="font-medium">{{ showFilters ? "Hide Filters" : "Show Filters" }}</span>
        </button>
      </div>

      <!-- Filters Section -->
      <transition name="fade">
        <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 border-t pt-6">
          
          <!-- Filter Fields -->
          <select v-model="filters.species" class="filter-input">
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>

          <!-- Breed Dropdown with Tooltip on Hover -->
          <div class="relative group">
            <select 
              v-model="filters.breed" 
              class="filter-input w-full"
              :class="{'cursor-not-allowed bg-gray-200 text-gray-500': !filters.species}"
              :disabled="!filters.species"
            >
              <option value="" disabled>Breed</option>
              <option v-for="breed in breedOptions" :key="breed" :value="breed">
                {{ breed }}
              </option>
            </select>

            <!-- Tooltip message on hover -->
            <div 
              v-if="!filters.species" 
              class="absolute left-0 -bottom-10 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Please select a species first
              <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
            </div>
          </div>


          <select v-model="filters.sex" class="filter-input">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <!-- <input type="number" v-model="filters.age" placeholder="Filter by age..." class="filter-input"/> -->

          <select v-model="filters.size" class="filter-input">
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>

          <select v-model="filters.healthStatus" class="filter-input">
            <option value="">All Health Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Minor Issues">Minor Issues</option>
            <option value="Needs Medical Attention">Needs Medical Attention</option>
            <option value="Recovered">Recovered</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Critical Condition">Critical Condition</option>
            <option value="Needs Surgery">Needs Surgery</option>
            <option value="Disabled">Disabled</option>
            <option value="Senior Care">Senior Care</option>
            <option value="Special Needs">Special Needs</option>
          </select>


          <select v-model="filters.vaccinated" class="filter-input">
            <option value="">All</option>
            <option value="Yes">Vaccinated</option>
            <option value="No">Not Vaccinated</option>
          </select>

          <select v-model="filters.neutered" class="filter-input">
            <option value="">All</option>
            <option value="Yes">Neutered</option>
            <option value="No">Not Neutered</option>
          </select>

          <select v-model="filters.urgentAdoptionNeeded" class="filter-input">
            <option value="">All</option>
            <option value="Yes">Urgent</option>
            <option value="No">Not Urgent</option>
          </select>

          <input type="number" v-model="filters.timeSpentInShelter" placeholder="Days in shelter..." class="filter-input"/>

          <select v-model="filters.status" class="filter-input">
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="PENDING">Pending</option>
            <option value="ADOPTED">Adopted</option>
          </select>

          <select v-model="sortBy" class="filter-input">
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="size">Size</option>
            <option value="timeSpentInShelter">Time in Shelter</option>
          </select>

          <!-- <select v-model="sortOrder" class="filter-input">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select> -->

          <!-- Container care ocupă toată lățimea -->
          <!-- Container pentru buton -->
          <div class="w-full flex justify-end mt-4">
            <button 
              v-if="isAnyFilterApplied"
              @click="resetFilters"
              class="font-bold text-red-500 text-sm hover:text-red-700 pr-2"
            >
              Clear Filters
            </button>
          </div>

        </div>
      </transition>
    </div>



    <!-- Pets Grid -->
    <div v-if="pets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32">
      <PetCard 
        v-for="pet in pets" 
        :key="pet.id" 
        :pet="pet" 
        @petDeleted="removePetFromList" 
        @pet-updated="updatePetInList"
        />
    </div>
    <div v-else class="text-center py-20">
      <img src="../assets/empty-state.png" alt="No Pets" class="mx-auto w-50 h-48 mb-6" />
      <h2 class="text-2xl font-bold text-gray-800">No pets available</h2>
      <p class="text-gray-600">You haven't added any pets yet. Start by clicking the button below.</p>
      <button @click="showAddPetForm = true" class="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">
        Add Your First Pet
      </button>
    </div>

    <AddPetForm 
      v-if="showAddPetForm" 
      @close="showAddPetForm = false"
      @pet-added="handlePetAdded"
      :key="formKey"
    />
  </div>
</template>



<script>
  import { ref, computed, onMounted , watch} from 'vue';
  import { fetchShelterPets } from "@/services/pet_service.js";
  import AddPetForm from '@/components/AddPetForm.vue';
  import PetCard from '@/components/PetCard.vue';

  export default {
    name: 'ManagePets',
    components: {
      PetCard,
      AddPetForm
    },

    setup() {
      const pets = ref([]);
      const searchQuery = ref("");
      const shelterId = localStorage.getItem("shelterId");
      const showAddPetForm = ref(false);
      const formKey = ref(0);
      const showBreedMessage = ref(false);

      const filters = ref({
        name: "",
        species: "",
        breed: "",
        sex: "",
        age: "",
        size: "",
        healthStatus: "",
        vaccinated: "",
        neutered: "",
        urgentAdoptionNeeded: "",
        timeSpentInShelter: "",
        status: "", // AVAILABLE, PENDING, ADOPTED
      });

      const resetFilters = () => {
        filters.value = {
          name: "",
          species: "",
          breed: "",
          sex: "",
          age: "",
          size: "",
          healthStatus: "",
          vaccinated: "",
          neutered: "",
          urgentAdoptionNeeded: "",
          timeSpentInShelter: "",
          status: "",
        };
      };

      const sortBy = ref(""); // Criteriul de sortare
      const sortOrder = ref("asc"); // Ordinea de sortare (ascendentă sau descendentă)
      const showFilters = ref(false);
      const breedOptions = ref([]);
      const filteredBreeds = ref([]);
      const showDropdown = ref(false);

      const isAnyFilterApplied = computed(() => {
        return Object.values(filters.value).some(value => value !== "");
      });
      
      const loadPets = async () => {
        if (!shelterId) {
          console.error("No shelter ID found");
          return;
        }
        try {
          console.log("Loading pets...");
          const petsData = await fetchShelterPets(shelterId);

          if (!petsData) {
            console.error("fetchShelterPets returned null!");
            return;
          }

          pets.value = petsData.map(pet => ({
            ...pet,
            photos: pet.photos ? pet.photos : []
          }));

          console.log("Pets stored in state:", pets.value);
        } catch (error) {
          console.error("Error loading pets:", error);
        }
      };



      const handlePetAdded = async (newPet) => {   
        // console.log("New pet added:", newPet);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await loadPets(); 
      };
      


      const removePetFromList = (petId) => {
        pets.value = pets.value.filter((pet) => pet.id !== petId);
        console.log(`Pet with ID ${petId} removed from local list`);
      };



      const updatePetInList = (updatedPet) => {
        const index = pets.value.findIndex((p) => p.id === updatedPet.id);
        if (index !== -1) {
          pets.value = [
            ...pets.value.slice(0, index),
            {
              ...updatedPet,
              photos: updatedPet.photos?.map(photo => ({
                id: photo.id,
                url: photo.url.startsWith("data:image") ? 
                  photo.url : 
                  `data:image/jpeg;base64,${photo.url}`
              })) || []
            },
            ...pets.value.slice(index + 1)
          ];
        }
      };


      const filteredPets = computed(() => {
        return pets.value
          .filter(pet => {
            return Object.keys(filters.value).every(key => {
              if (!filters.value[key]) return true; 

              if (typeof pet[key] === "boolean") {
                return filters.value[key] === "Yes" ? pet[key] : !pet[key];
              }

              if (key === "sex") {
                return pet.sex?.toLowerCase() === filters.value.sex.toLowerCase();
              }

              if (typeof pet[key] === "number") {
                return parseInt(filters.value[key]) === pet[key];
              }

              return pet[key]?.toString().toLowerCase().includes(filters.value[key].toString().toLowerCase());
            });
          })
          .sort((a, b) => {
            if (!sortBy.value) return 0;

            let modifier = sortOrder.value === "asc" ? 1 : -1;

            if (typeof a[sortBy.value] === "string") {
              return a[sortBy.value].localeCompare(b[sortBy.value]) * modifier;
            }

            if (typeof a[sortBy.value] === "number") {
              return (a[sortBy.value] - b[sortBy.value]) * modifier;
            }

            return 0;
          });
      });


      const fetchBreeds = async () => {
        if (!filters.value.species) {
          console.log("No species selected, clearing breed options.");
          breedOptions.value = [];
          return;
        }

        try {
          console.log("Fetching breeds for species:", filters.value.species);
          const response = await fetch(`http://localhost:8080/pets/breedsBySpecies?species=${filters.value.species}`);

          // Debugging: Log the full response before parsing
          const textResponse = await response.text();
          console.log("Raw API Response:", textResponse);

          // Check if the response is valid JSON
          if (!response.ok) {
            throw new Error(`Failed to fetch breeds: ${response.status}`);
          }

          const data = JSON.parse(textResponse);
          console.log("Parsed Breed Data:", data);

          breedOptions.value = Array.isArray(data) ? data.map(b => b.trim()) : [];

          console.log("Updated breed options:", breedOptions.value);
        } catch (error) {
          console.error("Error fetching breeds:", error);
          breedOptions.value = [];
        }
      };







      // // Filter breeds based on user input
      // const filterBreeds = () => {
      //   console.log("Filtering breeds for input:", filters.value.breed);
      //   if (!filters.value.breed) {
      //     filteredBreeds.value = breedOptions.value;
      //   } else {
      //     filteredBreeds.value = breedOptions.value.filter(breed =>
      //       breed.toLowerCase().includes(filters.value.breed.toLowerCase())
      //     );
      //   }
      //   showDropdown.value = true; // Ensure dropdown is visible
      //   console.log("Filtered breeds:", filteredBreeds.value);
      // };

      // // Select a breed and close dropdown
      // const selectBreed = (breed) => {
      //   console.log("Breed selected:", breed);
      //   filters.value.breed = breed;
      //   showDropdown.value = false;
      // };

      watch(() => filters.value.species, async (newSpecies) => {
        console.log("Species changed to:", newSpecies);
        filters.value.breed = ""; // Reset breed when species changes
        if (newSpecies) {
          await fetchBreeds();
        } else {
          breedOptions.value = [];
        }
      });




      onMounted(loadPets);

      
      return { 
        searchQuery, 
        pets: filteredPets, 
        showAddPetForm, 
        handlePetAdded, 
        removePetFromList, 
        updatePetInList, 
        formKey, 
        filters,  
        sortBy, 
        sortOrder, 
        showFilters, 
        resetFilters, 
        isAnyFilterApplied,
        breedOptions, 
        filteredBreeds, 
        showDropdown, 
        showBreedMessage,
        // filterBreeds, 
        // selectBreed 
      };
    },
  
};
</script>

<style scoped>
/* General filter input styling */
.filter-input {
  @apply border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition;
}

.filter-input:focus {
  border-color: #5973A8; /* Setează o culoare la focus */
  box-shadow: 0 0 5px rgba(89, 115, 168, 0.5); /* Efect subtil */
}

/* Smooth fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>