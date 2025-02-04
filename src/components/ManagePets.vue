<template>
  <div class="p-4 mt-20 space-y-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manage Pets</h1>
        <p class="text-gray-600">Add, edit and manage your pets</p>
      </div>
      <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32">
      <PetCard v-for="pet in pets" :key="pet.id" :pet="pet" />
    </div>

  </div>
</template>

<script>
  import { ref, computed,onMounted } from 'vue';
  import PetCard from '@/components/PetCard.vue';
  import { fetchShelterPets } from "@/services/pet_service.js";

  export default {
    name: 'ManagePets',
    components: {
      PetCard
    },
    setup() {
      const pets = ref([]);
      const searchQuery = ref("");
      const shelterId = localStorage.getItem("shelterId");

      const loadPets = async () => {
        if (!shelterId) {
          console.error("No shelter ID found");
          return;
        }
        pets.value = await fetchShelterPets(shelterId);
    };

      onMounted(loadPets);

      const filteredPets = computed(() =>
        pets.value.filter((pet) =>
          pet.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );

      return { searchQuery, pets: filteredPets };
    },
  
};
</script>