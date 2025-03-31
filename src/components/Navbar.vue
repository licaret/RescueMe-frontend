<template>
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
              <img src="../assets/love.png" alt="Favorites" class="w-6 h-6">
              <span 
                v-if="favoritesCount > 0" 
                class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ favoritesCount }}
              </span>
            </a>
          </li>
          <li>
            <a @click="navigateToInbox" style="cursor: pointer;">
              <img src="../assets/inbox.png" alt="Inbox" class="w-6 h-6">
            </a>
          </li>
          <li>
            <a @click="navigateToMenu" style="cursor: pointer;">
              <img src="../assets/menu.png" alt="Menu" class="w-6 h-6">
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { getFavoritesCount } from '../services/favorite_service';

export default {
  setup() {
    const favoritesCount = ref(0);

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
      // Listen for updates to favorites count
      window.addEventListener('favorites-updated', handleFavoritesUpdated);
    });

    onUnmounted(() => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated);
    });

    return {
      favoritesCount
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
    navigateToMenu() {
      this.$router.push("/menu");
    }
  }
};
</script>

<style>
nav, nav * {
  user-select: none;
}
</style>