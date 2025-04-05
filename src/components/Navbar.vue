<template>
  <div>
    <nav class="absolute top-0 left-0 w-full z-20 bg-transparent">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
        <a href="#" class="flex items-center">
          <span class="self-center text-2xl font-medium whitespace-nowrap">
            <span class="text-gray-700">RESCUE</span>
            <span class="text-red-600 font-bold">ME</span>
          </span>
        </a>
        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul class="flex flex-col p-6 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-12 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a @click="navigateToHome" style="cursor: pointer;" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">HOME</a>
            </li>
            <li>
              <a @click="navigateToAvailablePets" style="cursor: pointer;" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">AVAILABLE PETS</a>
            </li>
            <li>
              <a href="#" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">EVENTS</a>
            </li>
            <li>
              <a @click="navigateToFavorites" style="cursor: pointer;" class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
                <span 
                  v-if="favoritesCount > 0" 
                  class="absolute -top-2.5 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ favoritesCount }}
                </span>
              </a>
            </li>
            <li>
              <a @click="navigateToInbox" style="cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                  <path d="M22 12h-6l-2 3h-4l-2-3H2"/>
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
              </a>
            </li>
            <li>
              <a @click="toggleSidebar" style="cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                  <line x1="3" x2="21" y1="6" y2="6"/>
                  <line x1="3" x2="21" y1="12" y2="12"/>
                  <line x1="3" x2="21" y1="18" y2="18"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <SidebarMenu :is-open="isSidebarOpen" @close="closeSidebar" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { getFavoritesCount } from '../services/favorite_service';
import SidebarMenu from './SidebarMenu.vue';

export default {
  components: {
    SidebarMenu
  },
  setup() {
    const favoritesCount = ref(0);
    const isSidebarOpen = ref(false);

    const loadFavoritesCount = async () => {
      const userId = localStorage.getItem('Id');
      if (userId) {
        try {
          const count = await getFavoritesCount(userId);
          favoritesCount.value = count;
        } catch (error) {
          console.error('Error loading favorites count:', error);
        }
      }
    };

    const handleFavoritesUpdated = () => {
      loadFavoritesCount();
    };

    onMounted(() => {
      loadFavoritesCount();
      window.addEventListener('favorites-updated', handleFavoritesUpdated);
    });

    onUnmounted(() => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated);
    });

    return {
      favoritesCount,
      isSidebarOpen
    };
  },
  methods: {
    navigateToHome() {
      this.$router.push("/home");
    },
    navigateToAvailablePets() {
      this.$router.push("/available-pets");
    },
    navigateToFavorites() {
      this.$router.push("/favorites");
    },
    navigateToInbox() {
      this.$router.push("/inbox");
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    }
  }
};
</script>

<style>
nav, nav * {
  user-select: none;
}
</style>