<template>
    <div>
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black bg-opacity-20 z-30 backdrop-blur-[1px]"
        @click="close"
      ></div>
      
      <!-- Sidebar panel -->
      <div 
        class="fixed top-0 right-0 h-full w-52 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out"
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
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3">
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
        <nav class="px-2 py-4">
          <ul class="space-y-2">
            <li v-if="userRole === 'ADOPTER'">
              <a @click="navigateTo('/profile')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile</span>
              </a>
            </li>
            <li v-if="userRole === 'SHELTER'">
              <a @click="navigateTo('/shelter-dashboard')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li v-if="userRole === 'SHELTER'">
              <a @click="navigateTo('/manage-pets')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Manage Pets</span>
              </a>
            </li>
            <li v-if="userRole === 'ADOPTER'">
              <a @click="navigateTo('/favorites')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>My Favorites</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('/inbox')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span>Messages</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('/settings')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('/help')" class="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 rounded cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Help & Support</span>
              </a>
            </li>
          </ul>
          
          <div class="mt-8 pt-4 border-t border-gray-100">
            <a @click="logout" class="flex items-center px-4 py-2 text-red-600 hover:text-red-800 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'SidebarMenu',
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
  
      onMounted(() => {
        username.value = localStorage.getItem('Username') || 'Guest';
        userRole.value = localStorage.getItem('Role') || 'User';
        
        console.log('Username from localStorage:', username.value);
        console.log('Role from localStorage:', userRole.value);
        
        const userId = localStorage.getItem('Id');
        if (userId) {
          fetchProfilePicture(userId);
        }
      });
  
      const fetchProfilePicture = async (userId) => {
        try {
          const response = await fetch(`/users/${userId}/profilePicture`);
          if (response.ok) {
            const blob = await response.blob();
            userProfilePicture.value = URL.createObjectURL(blob);
          }
        } catch (error) {
          console.error('Error loading profile picture:', error);
        }
      };
  
      const navigateTo = (path) => {
        router.push(path);
        emit('close');
      };
  
      const close = () => {
        emit('close');
      };
  
      const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        localStorage.removeItem('Username');
        localStorage.removeItem('Id');
        
        router.push('/login');
        emit('close');
      };
  
      return {
        userProfilePicture,
        username,
        userRole,
        navigateTo,
        close,
        logout
      };
    }
  };
  </script>