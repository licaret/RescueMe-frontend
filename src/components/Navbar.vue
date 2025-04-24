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
              <a @click="navigateToEvents" style="cursor: pointer;" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">EVENTS</a>
            </li>
            
            <!-- Notifications -->
            <li class="relative notifications-container">
              <a @click="toggleNotifications" style="cursor: pointer;" class="relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span 
                  v-if="unreadNotifications > 0" 
                  class="absolute -top-2.5 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ unreadNotifications }}
                </span>
              </a>
              
              <!-- Notifications dropdown -->
              <div v-if="showNotifications" class="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <div class="p-3 border-b border-gray-200">
                  <h5 class="text-sm font-semibold text-gray-700">Notifications</h5>
                </div>
                <div class="max-h-60 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                    No notifications yet
                  </div>
                  <div 
                    v-for="(notification, index) in notifications" 
                    :key="index" 
                    @click="handleNotificationClick(notification)"
                    class="flex px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                    :class="{'bg-blue-50': !notification.read}"
                  >
                    <div class="flex-shrink-0">
                      <div :class="isRejectedNotification(notification) ? 'bg-red-600' : getNotificationIconBg(notification)" class="w-10 h-10 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path :d="isRejectedNotification(notification) ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' : getNotificationIconPath(notification)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="w-full pl-3">
                      <div class="text-gray-500 text-sm mb-1.5">
                        {{ notification.message }}
                      </div>
                      <div class="text-xs text-blue-600">
                        {{ notification.time || formatRelativeTime(notification.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
                <a @click="markAllAsRead" class="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  Mark all as read
                </a>
              </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFavoritesCount } from '../services/favorite_service';
import { fetchAdopterNotifications, markNotificationAsRead } from '../services/notification_service';
import { connectToAdopterNotifications, disconnectFromNotifications } from '../services/notification_socket';
import SidebarMenu from './SidebarMenu.vue';

export default {
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter();
    const favoritesCount = ref(0);
    const isSidebarOpen = ref(false);
    const showNotifications = ref(false);
    const notifications = ref([]);
    const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length);

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

    const loadNotifications = async () => {
      const userId = localStorage.getItem('Id');
      const role = localStorage.getItem('Role');
      if (!userId) return;
      
      try {
        // Determine which API to call based on user role
        let notificationsData;
        if (role === 'SHELTER') {
          notificationsData = await fetchAdopterNotifications(userId, 'shelter');
        } else {
          notificationsData = await fetchAdopterNotifications(userId, 'adopter');
        }
        
        // Map notifications to add icon property and proper time format
        notifications.value = notificationsData.map(notification => ({
          ...notification,
          icon: getNotificationIcon(notification.type),
          time: formatRelativeTime(notification.createdAt)
        }));
        
        // Sort by creation time, newest first
        notifications.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error('Failed to load notifications:', error);
        notifications.value = [];
      }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };
    
    // Helper function to check if a notification is about a rejection
    const isRejectedNotification = (notification) => {
      return notification && notification.message && 
             notification.message.toLowerCase().includes('rejected');
    };

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'NEW_ADOPTION_REQUEST':
          return {
            bg: "bg-blue-600",
            fill: "none",
            path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          };
        case 'APPROVED_REQUEST':
          return {
            bg: "bg-green-600",
            fill: "none",
            path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          };
        case 'PET_FAVORITE':
          return {
            bg: "bg-red-600",
            fill: "none",
            path: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          };
        case 'EVENT':
          return {
            bg: "bg-purple-600",
            fill: "none",
            path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          };
        case 'MESSAGE':
          return {
            bg: "bg-green-600",
            fill: "none",
            path: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          };
        default:
          return {
            bg: "bg-gray-500",
            fill: "none",
            path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          };
      }
    };

    const getNotificationIconBg = (notification) => {
      if (notification.icon && notification.icon.bg) {
        return notification.icon.bg;
      }
      
      // Default based on notification type
      switch (notification.type) {
        case 'NEW_ADOPTION_REQUEST':
          return 'bg-blue-600';
        case 'APPROVED_REQUEST':
          return 'bg-green-600';
        case 'PET_FAVORITE':
          return 'bg-red-600';
        case 'EVENT':
          return 'bg-purple-600';
        case 'MESSAGE':
          return 'bg-green-600';
        default:
          return 'bg-gray-500';
      }
    };

    const getNotificationIconPath = (notification) => {
      if (notification.icon && notification.icon.path) {
        return notification.icon.path;
      }
      
      // Default paths based on notification type
      switch (notification.type) {
        case 'NEW_ADOPTION_REQUEST':
          return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
        case 'APPROVED_REQUEST':
          return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
        case 'PET_FAVORITE':
          return 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';
        case 'EVENT':
          return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
        case 'MESSAGE':
          return 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4';
        default:
          return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      }
    };

    const handleNotificationClick = (notification) => {
      // Optionally mark the notification as read
      markNotificationAsRead(notification.id)
        .then(() => {
          // Update the local notification to show as read
          notification.read = true;
          
          // Navigate based on notification type
          navigateBasedOnNotificationType(notification);
        })
        .catch(error => {
          console.error('Failed to mark notification as read:', error);
          // Still navigate even if marking as read fails
          navigateBasedOnNotificationType(notification);
        });
    };

    const navigateBasedOnNotificationType = (notification) => {
      // Close the notifications dropdown
      showNotifications.value = false;
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'NEW_ADOPTION_REQUEST':
          router.push('/adoption-requests');
          break;
        case 'APPROVED_REQUEST':
          router.push('/my-adoption-requests');
          break;
        case 'PET_FAVORITE':
          router.push('/favorites');
          break;
        case 'EVENT':
          router.push('/events');
          break;
        case 'MESSAGE':
          router.push('/inbox');
          break;
        default:
          // For other notifications, just go to home
          router.push('/home');
          break;
      }
    };
    
    const markAllAsRead = async () => {
      const userId = localStorage.getItem('Id');
      if (!userId) return;
      
      try {
        // Mark all notifications as read in the UI
        notifications.value.forEach(notification => {
          notification.read = true;
        });
        
        // Here you would make an API call to mark all as read
        // For example: await markAllNotificationsAsRead(userId);
        
        // For now, we'll just mark each individual notification
        const promises = notifications.value.map(notification => {
          if (!notification.read) {
            return markNotificationAsRead(notification.id);
          }
          return Promise.resolve();
        });
        
        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    };

    const formatRelativeTime = (timestamp) => {
      const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      return `${Math.floor(diff / 86400)} days ago`;
    };

    const handleClickOutside = (event) => {
      if (showNotifications.value && !event.target.closest('.notifications-container')) {
        showNotifications.value = false;
      }
    };

    onMounted(() => {
      loadFavoritesCount();
      loadNotifications();
      
      window.addEventListener('favorites-updated', handleFavoritesUpdated);
      document.addEventListener('click', handleClickOutside);
      
      const userId = localStorage.getItem('Id');
      const role = localStorage.getItem('Role');
      if (userId) {
        connectToAdopterNotifications(userId, (newNotification) => {
          console.log("Received new notification:", newNotification);
          notifications.value.unshift({
            ...newNotification,
            icon: getNotificationIcon(newNotification.type),
            time: formatRelativeTime(newNotification.createdAt),
            read: false
          });
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated);
      document.removeEventListener('click', handleClickOutside);
      disconnectFromNotifications();
    });

    return {
      favoritesCount,
      isSidebarOpen,
      showNotifications,
      notifications,
      unreadNotifications,
      getNotificationIconBg,
      getNotificationIconPath,
      handleNotificationClick,
      toggleNotifications,
      formatRelativeTime,
      markAllAsRead,
      isRejectedNotification
    };
  },
  methods: {
    navigateToHome() {
      this.$router.push("/home");
    },
    navigateToAvailablePets() {
      this.$router.push("/available-pets");
    },
    navigateToEvents() {
      this.$router.push("/events");
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

.max-h-60 {
  max-height: 15rem;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>