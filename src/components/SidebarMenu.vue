<template>
  <div>
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-20 z-30 backdrop-blur-[1px]"
      @click="close"
    ></div>
    
    <!-- Sidebar panel -->
    <div 
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Close button -->
      <button @click="close" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- User info section -->
      <div class="pt-12 pb-6 px-6 border-b border-gray-100 flex items-center">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3">
          <img v-if="userProfilePicture" :src="userProfilePicture" alt="Profile" class="w-full h-full object-cover" />
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base font-medium text-gray-800">{{ username || 'Guest' }}</h3>
          <p class="text-xs text-gray-500">{{ userRole || 'User' }}</p>
        </div>
      </div>
      
      <!-- Menu items -->
      <nav class="px-2 py-4 overflow-y-auto max-h-[calc(100vh-150px)]">
        <ul class="space-y-1">
          <li v-if="userRole === 'ADOPTER'">
            <a @click="navigateTo('/profile')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Profile</span>
            </a>
          </li>
          <li v-if="userRole === 'ADOPTER'">
            <a @click="navigateTo('/favorites')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>My Favorites</span>
            </a>
          </li>
          <li v-if="userRole === 'ADOPTER'">
            <a @click="navigateTo('/my-adoption-requests')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>My Adoption Requests</span>
            </a>
          </li>
          <li>
            <a @click="navigateTo('/messages')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span>Messages</span>
            </a>
          </li>
          <li>
            <a @click="navigateTo('/donate')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Donate</span>
            </a>
          </li>
          <li>
            <a @click="navigateTo('/about-us')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About Us</span>
            </a>
          </li>
          <li>
            <a @click="navigateTo('/contact')" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Us</span>
            </a>
          </li>
        </ul>
        
        <!-- Logout section -->
        <div class="mt-8 pt-4 border-t border-gray-100">
          <a @click="showLogoutConfirmation" class="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- Logout Confirmation Modal -->
    <LogoutConfirmationModal 
      :show="logoutConfirmationVisible" 
      @close="hideLogoutConfirmation" 
      @confirm="confirmLogout" 
    />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout, fetchProfilePicture  } from "@/services/user_service";
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal.vue';

export default {
  name: 'SidebarMenu',
  components: {
    LogoutConfirmationModal 
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter();
    const userProfilePicture = ref(null);
    const username = ref('');
    const userRole = ref('');
    const logoutConfirmationVisible = ref(false);

    onMounted(() => {
      username.value = localStorage.getItem('Username') || 'Guest';
      userRole.value = localStorage.getItem('Role') || 'User';
      
      const userId = localStorage.getItem('Id');
      if (userId) {
        loadProfilePicture(userId);
      }
    });

    const navigateTo = (path) => {
      router.push(path);
      emit('close');
    };

    const close = () => {
      emit('close');
    };

    const showLogoutConfirmation = () => {
      logoutConfirmationVisible.value = true;
    };

    const hideLogoutConfirmation = () => {
      logoutConfirmationVisible.value = false;
    };

    const loadProfilePicture = async (userId) => {
      try {
        const profilePicUrl = await fetchProfilePicture(userId);
        if (profilePicUrl) {
          userProfilePicture.value = profilePicUrl;
        }
      } catch (error) {
        console.error('Error loading profile picture:', error);
      }
    };

    const confirmLogout = async () => {
      try {
        await logout();
        // router.push("/login");
        emit('close');
        hideLogoutConfirmation();
      } catch (e) {
        console.error("Logout error:", e);
      }
    };

    return {
      userProfilePicture,
      username,
      userRole,
      logoutConfirmationVisible,
      navigateTo,
      close,
      showLogoutConfirmation,
      hideLogoutConfirmation,
      confirmLogout
    };
  }
};
</script>