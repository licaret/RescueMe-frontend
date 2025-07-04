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
    <div class="bg-white p-4 rounded-lg border border-gray-200">
      <div class="flex gap-4 flex-wrap">
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <img src="../assets/search.png" alt="Search icon" class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pets..."
              v-model="searchQuery"
              class="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <button class="border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
          <img src="../assets/filter.png" alt="Filter icon" class="w-4 h-4" />
          Filters
        </button>
      </div>
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
  import { ref, computed,onMounted } from 'vue';
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

      const handlePetAdded = async (newPet) => {   
        // console.log("New pet added:", newPet);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await loadPets(); 
      };


      
      const loadPets = async () => {
        if (!shelterId) {
          console.error("No shelter ID found");
          return;
        }
        try {
          console.log("Loading pets...");
          const petsData = await fetchShelterPets(shelterId);
          console.log("Pets received in ManagePets:", petsData);

          pets.value = petsData.map(pet => ({
            ...pet,
            photos: pet.photos ? pet.photos : []
          }));



          console.log("Pets stored in state:", pets.value);
        } catch (error) {
          console.error("Error loading pets:", error);
        }
      };



      onMounted(loadPets);



      const removePetFromList = (petId) => {
        pets.value = pets.value.filter((pet) => pet.id !== petId);
        console.log(`Pet with ID ${petId} removed from local list`);
      };



      const updatePetInList = (updatedPet) => {
    const index = pets.value.findIndex((p) => p.id === updatedPet.id);
    if (index !== -1) {
        Object.assign(pets.value[index], updatedPet);

        // 🔹 Verifică dacă există poze noi și actualizează-le
        if (updatedPet.photos) {
            pets.value[index].photos = updatedPet.photos.map(photo => ({
                id: photo.id,
                url: photo.url.startsWith("data:image") ? photo.url : `data:image/jpeg;base64,${photo.url}`
            }));
        }
    }
};






      const filteredPets = computed(() =>
        pets.value.filter((pet) =>
          pet.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );


      
      return { searchQuery, pets: filteredPets, showAddPetForm, handlePetAdded, removePetFromList, updatePetInList, formKey, };
    },
  
};
</script>