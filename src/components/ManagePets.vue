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
  import { ref, computed } from 'vue';
  import PetCard from '@/components/PetCard.vue';

  export default {
    name: 'ManagePets',
    components: {
      PetCard
    },
    setup() {
      const searchQuery = ref('');
      const pets = ref([
    {
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      sex: 'Male',
      age: 2,
      size: 'Medium',
      status: 'Available',
      healthStatus: 'Healthy',
      vaccinated: true,
      neutered: true,
      urgentAdoptionNeeded: false,
      timeSpentInShelter: '> 1y',
      photos: [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006',
        'https://images.unsplash.com/photo-1558788353-f76d92427f16'
      ],
      story: 'Max is a playful and loving dog who enjoys running in the park and playing fetch. He was brought to the shelter over a year ago after being found abandoned. Max dreams of a family who will give him endless love and playtime.'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      sex: 'Female',
      age: 1,
      size: 'Small',
      status: 'Pending',
      healthStatus: 'Healthy',
      vaccinated: true,
      neutered: false,
      urgentAdoptionNeeded: false,
      timeSpentInShelter: '< 6m',
      photos: [
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU',
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU'
      ],
      story: 'Luna is a gentle and affectionate Persian cat who loves being pampered and basking in sunny spots. She was found wandering the streets and has been living at the shelter ever since. Luna is looking for a warm and peaceful home where she can feel loved and safe.'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      sex: 'Female',
      age: 1,
      size: 'Small',
      status: 'Pending',
      healthStatus: 'Healthy',
      vaccinated: true,
      neutered: false,
      urgentAdoptionNeeded: false,
      timeSpentInShelter: '< 6m',
      photos: [
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU',
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU'
      ],
      story: 'Luna is a gentle and affectionate Persian cat who loves being pampered and basking in sunny spots. She was found wandering the streets and has been living at the shelter ever since. Luna is looking for a warm and peaceful home where she can feel loved and safe.'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      sex: 'Female',
      age: 1,
      size: 'Small',
      status: 'Pending',
      healthStatus: 'Healthy',
      vaccinated: true,
      neutered: false,
      urgentAdoptionNeeded: false,
      timeSpentInShelter: '< 6m',
      photos: [
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU',
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU'
      ],
      story: 'Luna is a gentle and affectionate Persian cat who loves being pampered and basking in sunny spots. She was found wandering the streets and has been living at the shelter ever since. Luna is looking for a warm and peaceful home where she can feel loved and safe.'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      sex: 'Female',
      age: 1,
      size: 'Small',
      status: 'Pending',
      healthStatus: 'Healthy',
      vaccinated: true,
      neutered: false,
      urgentAdoptionNeeded: false,
      timeSpentInShelter: '< 6m',
      photos: [
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU',
        'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCUV4MC34PaobrijfwWOr9MRSOLJuO6-tw9Q-VWc4qQ5Ks8Z7q1PMaUrfzCULrPajMjI&usqp=CAU'
      ],
      story: 'Luna is a gentle and affectionate Persian cat who loves being pampered and basking in sunny spots. She was found wandering the streets and has been living at the shelter ever since. Luna is looking for a warm and peaceful home where she can feel loved and safe.'
    },
  ]);


    const filteredPets = computed(() =>
      pets.value.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    return {
      searchQuery,
      pets: filteredPets
    };
  }
};
</script>