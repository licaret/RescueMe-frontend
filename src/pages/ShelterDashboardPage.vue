<template>
    <div class="dashboard-container">
      <!-- Top Navigation Bar -->
      <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button @click="toggleSidebar" data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Toggle sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <a class="flex items-center ml-2">
                <span class="self-center text-2xl font-medium whitespace-nowrap">
                  <span class="text-gray-700">RESCUE</span>
                  <span class="text-red-600 font-bold">ME</span>
                </span>
              </a>
            </div>
            <div class="flex items-center">
              <!-- Notifications -->
              <div class="flex items-center mr-4 relative notifications-container">
                <button @click="toggleNotifications" type="button" class="relative p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                  <span class="sr-only">View notifications</span>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  <div v-if="unreadNotifications > 0" class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                    {{ unreadNotifications }}
                  </div>
                </button>
                <!-- Notifications dropdown -->
                <div v-if="showNotifications" class="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
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
                    >
                      <div class="flex-shrink-0">
                        <div :class="getNotificationIconBg(notification)" class="w-10 h-10 rounded-full flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path :d="getNotificationIconPath(notification)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                </div>
              </div>
              <!-- Shelter Profile -->
              <div class="flex items-center ms-3 user-menu-container">
                <div>
                  <router-link to="/shelter-dashboard/edit-profile">
                    <button type="button" class="flex items-center px-4 py-2 text-sm font-medium bg-red-700 text-white rounded-full">
                      {{ shelterUsername }}
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Sidebar -->
      <ShelterSidebarMenu 
        :sidebarOpen="sidebarOpen"
        :pendingAdoptionCount="pendingAdoptionCount"
        :unreadMessagesCount="unreadMessagesCount"
        @logout="showLogoutConfirmation"
      />
  
      <!-- Main Content -->
      <div class="p-4 sm:ml-64 pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div v-if="route.path === '/shelter-dashboard/'">
          <!-- Dashboard Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-blue-100">
                  <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Total Pets</p>
                  <h3 class="text-2xl font-bold">{{ stats.total }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-red-100">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v8m0 4h.01"></path>
                    </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Urgent Adoption Needed</p>
                  <h3 class="text-2xl font-bold">{{ stats.urgent }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-green-100">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Available</p>
                  <h3 class="text-2xl font-bold">{{ stats.available }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-yellow-100">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Pending</p>
                  <h3 class="text-2xl font-bold">{{ stats.pending }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-gray-200">
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12m0-12L6 18"></path>
                    </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Adopted</p>
                  <h3 class="text-2xl font-bold">{{ stats.adopted }}</h3>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Main Dashboard Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Activity Section -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow h-full flex flex-col">
              <div class="p-4 border-b flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <router-link to="/shelter-dashboard/reports" class="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all activity
                </router-link>
              </div>
              <div class="p-4">
                <ul class="divide-y" v-if="recentNotifications.length > 0">
                  <li 
                    v-for="(notification, index) in recentNotifications" 
                    :key="index" 
                    class="py-3"
                  >
                    <div class="flex items-start">
                      <div :class="`${getNotificationIconBg(notification)} p-2 rounded-full`">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path :d="getNotificationIconPath(notification)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium">
                          {{ notification.message }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ notification.time }}
                        </p>
                      </div>
                      <div class="ml-auto">
                        <span 
                          class="text-xs font-medium text-white px-2 py-1 rounded-full"
                          :class="{
                            'bg-blue-500': notification.type === 'ADOPTION_REQUEST',
                            'bg-green-500': notification.type === 'APPROVAL' || notification.type === 'DONATION',
                            'bg-purple-500': notification.type === 'EVENT',
                            'bg-red-500': notification.type === 'PET_FAVORITE',
                            'bg-gray-500': !notification.type
                          }"
                        >
                          {{ formatNotificationLabel(notification.type) }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 text-center">No recent activity</p>
              </div>
            </div>

            <!-- Upcoming Events -->
            <div class="bg-white rounded-2xl shadow  h-full flex flex-col">
              <div class="p-4 border-b flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-800">Upcoming Events</h2>
                <router-link to="/shelter-dashboard/manage-events" class="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all
                </router-link>
              </div>
              <div class="p-4">
                <ul class="divide-y" v-if="upcomingEvents.length > 0">
                  <li
                    v-for="event in upcomingEvents.slice(0, 2)"
                    :key="event.id"
                    class="py-3"
                  >
                    <div class="flex items-center">
                      <div class="bg-indigo-100 p-2 rounded text-center w-12">
                        <div class="text-xs text-indigo-600 font-medium">
                          {{ new Date(event.startDateTime).toLocaleString('en-US', { month: 'short' }).toUpperCase() }}
                        </div>
                        <div class="text-indigo-800 font-bold">
                          {{ new Date(event.startDateTime).getDate() }}
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-semibold text-gray-800">
                          {{ event.title }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} - 
                          {{ new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 text-center py-6">
                  No upcoming events scheduled.
                </p>
              </div>
            </div>
          </div>

          <div>
              <PetAdoptionPieChart :stats="stats" />
          </div>

        <!-- Additional Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <!-- Urgent Adoptions Needed -->
          <div class="bg-white rounded-2xl shadow flex flex-col">
            <div class="p-4 border-b flex items-center justify-between">
              <h2 class="text-lg font-semibold text-red-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Urgent Adoptions Needed
              </h2>
              <router-link 
                :to="{ path: '/shelter-dashboard/manage-pets', query: { urgent: 'true' } }" 
                class="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all
              </router-link>
            </div>
            <div class="p-4">
              <div v-if="urgentPets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PetCard
                  v-for="pet in urgentPets.slice(0, 2)"
                  :key="pet.id"
                  :pet="pet"
                />
              </div>
              <p v-else class="text-sm text-gray-500 text-center py-4">
                No urgent pets at the moment.
              </p>
            </div>
          </div>

          <!-- Recent Donations -->
          <div class="bg-white rounded-2xl shadow overflow-hidden">
            <!-- Header -->
            <div class="p-5 border-b flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800">Recent Donations</h2>
              <router-link to="/shelter-dashboard/donations" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                View all
              </router-link>
            </div>
            
            <!-- Donations List -->
            <div class="p-5">
              <ul class="divide-y divide-gray-100">
                <li v-for="(donation, index) in donationStats.recentDonations?.slice(0, 3)" :key="index" 
                    class="py-3 flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ donation.isAnonymous ? 'Anonymous' : (donation.donorName || 'Unknown') }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatRelativeTime(donation.donationDate) }}</p>
                  </div>
                  <span class="font-semibold text-green-600 text-sm">{{ formatCurrency(donation.amount) }}</span>
                </li>
                
                <!-- Empty State -->
                <li v-if="!donationStats.recentDonations || donationStats.recentDonations.length === 0" 
                    class="py-6 text-center text-gray-500 flex flex-col items-center">
                  <p>No donations received yet</p>
                </li>
              </ul>
              
              <!-- Monthly Summary -->
              <div class="mt-5 p-4 bg-gray-50 rounded-xl">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-medium text-gray-700">Month Total</p>
                  <p class="text-lg font-bold text-green-600">{{ formatCurrency(donationStats.totalAmountRaised || 0) }}</p>
                </div>
                
                <!-- View All Donations Button -->
                <router-link to="/shelter-dashboard/donations" 
                            class="mt-4 text-sm font-medium block w-full py-2.5 bg-red-600 text-white rounded-2xl hover:bg-red-700 active:bg-red-800 transition-colors duration-200 text-center shadow-sm">
                  View All Donations
                </router-link>
              </div>
            </div>
          </div>

        </div>

        <!-- Quick Actions -->
        <div class="mt-6 bg-white rounded-2xl shadow p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <router-link :to="{ path: '/shelter-dashboard/manage-pets', query: { openForm: 'true' } }" class="flex flex-col items-center justify-center p-4 border rounded-2xl hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-sm font-medium">Add New Pet</span>
            </router-link>
            <router-link :to="{ path: '/shelter-dashboard/manage-events', query: { openForm: 'true' } }" class="flex flex-col items-center justify-center p-4 border rounded-2xl hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm font-medium">Create Event</span>
            </router-link>
            <router-link to="/shelter-dashboard/donations" class="flex flex-col items-center justify-center p-4 border rounded-2xl hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">Donations</span>
            </router-link>
            <router-link to="/shelter-dashboard/messages" class="flex flex-col items-center justify-center p-4 border rounded-2xl hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="text-sm font-medium">Chat Messages</span>
            </router-link>
          </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>

      <!-- Logout Confirmation Modal -->
      <LogoutConfirmationModal 
        :show="logoutModalVisible" 
        @close="hideLogoutConfirmation" 
        @confirm="confirmLogout" 
      />

    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { fetchShelterPetStats, fetchShelterPets} from '@/services/pet_service.js';
import { getShelterAdoptionRequests } from '@/services/adoption_service';
import { fetchUpcomingEventsForShelter } from '@/services/event_service';
import { connectToShelterNotifications, disconnectFromNotifications } from '@/services/notification_socket';
import { fetchShelterNotifications, markNotificationAsRead } from '@/services/notification_service';
import { logout } from "@/services/user_service";
import { getDonationStatistics } from '@/services/donation_service.js';
import { getUnreadMessagesCount } from '@/services/message_service';
import { connectToMessageSocket, disconnectFromMessageSocket } from '@/services/message_socket';
import PetCard from '@/components/PetCard.vue';
import PetAdoptionPieChart from '@/components/PetAdoptionPieChart.vue';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal.vue';
import ShelterSidebarMenu from '@/components/ShelterSidebarMenu.vue';


export default {
  name: 'ShelterDashboardLayout',

  components: {
    PetAdoptionPieChart,
    PetCard,
    LogoutConfirmationModal,
    ShelterSidebarMenu
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const shelterUsername = ref("Shelter");
    const sidebarOpen = ref(window.innerWidth >= 768); 
    
    const pendingAdoptionCount = ref(0);
    const logoutModalVisible = ref(false);
    const upcomingEvents = ref([]);
    const urgentPets = ref([]);

    const showNotifications = ref(false);
    const notifications = ref([]);
    const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length);
    const recentNotifications = computed(() => {
      return notifications.value
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    });

    const unreadMessagesCount = ref(0);

    const donationStats = ref({
      totalDonations: 0,
      totalAmountRaised: 0,
      recentDonations: []
    });

    const stats = ref({
      total: 0,
      urgent: 0,
      adopted: 0,
      available: 0,
      pending: 0
    });

    const loadDonationStats = async () => {
      try {
        const shelterId = localStorage.getItem('Id');
        donationStats.value = await getDonationStatistics(shelterId);
      } catch (error) {
        console.error('Error loading donation statistics:', error);
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON',
        minimumFractionDigits: 2
      }).format(amount || 0);
    };


    const fetchUnreadMessagesCount = async () => {
      try {
        const userId = localStorage.getItem('Id');
        if (userId) {
          const count = await getUnreadMessagesCount(parseInt(userId));
          unreadMessagesCount.value = count;
        }
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };


    const loadUrgentPets = async () => {
      const shelterId = localStorage.getItem("Id");
      try {
        const pets = await fetchShelterPets(shelterId);
        urgentPets.value = pets.filter(pet => pet.urgentAdoptionNeeded === true);
      } catch (err) {
        console.error("Failed to fetch urgent pets:", err);
        urgentPets.value = [];
      }
    };
    
    const loadUpcomingEvents = async () => {
      const shelterId = localStorage.getItem("Id");
      try {
        const events = await fetchUpcomingEventsForShelter(shelterId);
        upcomingEvents.value = events
          .filter(e => new Date(e.startDateTime) > new Date()) 
          .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
      } catch (error) {
        upcomingEvents.value = [];
      }
    };


    const loadPendingAdoptionCount = async () => {
      const shelterId = localStorage.getItem("Id");
      try {
        const allRequests = await getShelterAdoptionRequests(shelterId);
        pendingAdoptionCount.value = allRequests.filter(r => r.status === 'PENDING').length;
      } catch (err) {
        console.error('Failed to load adoption requests:', err);
      }
    };

    const loadStats = async () => {
      const shelterId = localStorage.getItem("Id");
      const data = await fetchShelterPetStats(shelterId);
      if (data) {
        stats.value.total = data.total;
        stats.value.urgent = data.urgent;
        stats.value.adopted = data.adopted;
        stats.value.available = data.available;
        stats.value.pending = data.pending;
      }
    };
    

    const getNotificationIconBg = (notification) => {
      if (notification.icon && notification.icon.bg) {
        return notification.icon.bg;
      }
      
      switch (notification.type) {
        case 'ADOPTION_REQUEST':
          return 'bg-blue-600';
        default:
          return 'bg-gray-500';
      }
    };

    const getNotificationIconPath = (notification) => {
      if (notification.icon && notification.icon.path) {
        return notification.icon.path;
      }
      
      switch (notification.type) {
        case 'ADOPTION_REQUEST':
          return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
        default:
          return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      }
    };

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'ADOPTION_REQUEST':
          return {
            bg: "bg-blue-600",
            fill: "none",
            path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          };
        default:
          return {
            bg: "bg-gray-500",
            fill: "none",
            path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          };
      }
    };


    const loadNotifications = async () => {
      const shelterId = localStorage.getItem('Id');
      if (!shelterId) return;
      
      try {
        const notificationsData = await fetchShelterNotifications(shelterId);
        
        notifications.value = notificationsData.map(notification => ({
          ...notification,
          icon: getNotificationIcon(notification.type),
          time: formatRelativeTime(notification.createdAt)
        }));
        
        notifications.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error('Failed to load notifications:', error);
        notifications.value = [];
      }
    };
    

    const handleNotificationClick = (notification) => {
      console.log("Clicked notification:", notification);
      markNotificationAsRead(notification.id)
        .then(() => {
          notification.read = true;
          
          navigateBasedOnNotificationType(notification);
        })
        .catch(error => {
          console.error('Failed to mark notification as read:', error);
          navigateBasedOnNotificationType(notification);
        });
    };

    
    const navigateBasedOnNotificationType = (notification) => {
      showNotifications.value = false;
      
      switch (notification.type) {
        case 'NEW_ADOPTION_REQUEST':
          router.push('/shelter-dashboard/adoption-requests');
          break;
        default:
          router.push('/shelter-dashboard/');
          break;
      }
    };


    const formatNotificationLabel = (type) => {
      switch (type) {
        case 'NEW_ADOPTION_REQUEST':
          return 'Pending';
        default:
          return 'Update';
      }
    };


    const isActive = (path) => {
      if (path === '/shelter-dashboard/' && route.path === '/shelter-dashboard/') {
        return true;
      }
      return path !== '/shelter-dashboard/' && route.path.startsWith(path);
    };


    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };


    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };


    const blockBackButton = () => {
      history.pushState(null, "", location.href);
    };


    const showLogoutConfirmation = () => {
      logoutModalVisible.value = true;
    };


    const hideLogoutConfirmation = () => {
      logoutModalVisible.value = false;
    };


    const confirmLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.error("Logout error:", e);
      }
    };


    const handleLogout = () => {
      showLogoutConfirmation();
    };


    const handleClickOutside = (event) => {
      if (showNotifications.value && !event.target.closest('.notifications-container')) {
        showNotifications.value = false;
      }
    };


    const handleResize = () => {
      if (window.innerWidth < 768) {
        sidebarOpen.value = false;
      } else {
        sidebarOpen.value = true;
      }
    };


    const handleNewMessageEvent = async (event) => {
      const message = event.detail;
      const shelterId = localStorage.getItem('Id');
      
      if (message.recipientId === parseInt(shelterId)) {
        try {
          const count = await getUnreadMessagesCount(parseInt(shelterId));
          unreadMessagesCount.value = count;
        } catch (error) {
          console.error('Error updating unread messages count:', error);
        }
      }
    };


    const handleMessageReadEvent = async () => {
      const shelterId = localStorage.getItem('Id');
      try {
        const count = await getUnreadMessagesCount(parseInt(shelterId));
        unreadMessagesCount.value = count;
      } catch (error) {
        console.error('Error updating unread messages count:', error);
      }
    };


    const formatRelativeTime = (timestamp) => {
      const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      return `${Math.floor(diff / 86400)} days ago`;
    };


    watch(() => route.path, (newPath) => {
      if (newPath === '/shelter-dashboard/messages') {
        unreadMessagesCount.value = 0;
      }
    });


    onMounted(() => {
      const username = localStorage.getItem("Username");
      if (username) {
        shelterUsername.value = username;
      } else {
        console.error("Username not found in localStorage.");
      }

      window.addEventListener('adoption-status-updated', loadPendingAdoptionCount);
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", blockBackButton);
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('pet-updated', loadUrgentPets);
      window.addEventListener('pet-added', loadUrgentPets);
      window.addEventListener('event-updated', loadUpcomingEvents);
      window.addEventListener('event-added', loadUpcomingEvents);
      window.addEventListener('new-message', handleNewMessageEvent);
      window.addEventListener('message-read', handleMessageReadEvent);

      handleResize();
    });


    onUnmounted(() => {
      console.log("Disconnecting from notifications");
      disconnectFromNotifications();
      disconnectFromMessageSocket();

      window.removeEventListener("popstate", blockBackButton);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('adoption-status-updated', loadPendingAdoptionCount);
      window.removeEventListener('pet-updated', loadUrgentPets);
      window.removeEventListener('pet-added', loadUrgentPets);
      window.removeEventListener('event-updated', loadUpcomingEvents);
      window.removeEventListener('event-added', loadUpcomingEvents);
      window.removeEventListener('new-message', handleNewMessageEvent);
      window.removeEventListener('message-read', handleMessageReadEvent);
    });


    onMounted(() => {
      const username = localStorage.getItem("Username");
      if (username) shelterUsername.value = username;

      const shelterId = localStorage.getItem("Id");
      if (shelterId) {
        console.log("Connecting to notifications for shelter:", shelterId);
        connectToShelterNotifications(shelterId, (newNotification) => {
          console.log("Received new notification:", newNotification);
          notifications.value.unshift({
            ...newNotification,
            icon: getNotificationIcon(newNotification.type),
            time: formatRelativeTime(newNotification.createdAt),
            read: false
          });
          
        });
        loadNotifications();
        loadDonationStats();
        connectToMessageSocket(shelterId, (newMessage) => {
          console.log("New message received in shelter dashboard:", newMessage);
          unreadMessagesCount.value++;
          
          window.dispatchEvent(new CustomEvent('new-message', { 
            detail: newMessage 
          }));
        });
      }

      loadStats();
      loadPendingAdoptionCount();
      loadUpcomingEvents();
      loadUrgentPets();
      fetchUnreadMessagesCount();
  
      const interval = setInterval(fetchUnreadMessagesCount, 30000);
      
      onBeforeUnmount(() => {
        clearInterval(interval);
      });
    });


    onBeforeRouteUpdate((to, from, next) => {
      if (to.path === "/shelter-dashboard/") {
        loadStats();
      }
      next();
    });


    return {
      shelterUsername,
      sidebarOpen,
      showNotifications,
      unreadNotifications,
      notifications,
      recentNotifications,
      route,
      stats,
      pendingAdoptionCount,
      logoutModalVisible,
      upcomingEvents,
      urgentPets,
      unreadMessagesCount,
      donationStats,

      formatNotificationLabel,
      isActive,
      toggleSidebar,
      toggleNotifications,
      handleLogout,
      loadStats,
      showLogoutConfirmation,
      hideLogoutConfirmation,
      confirmLogout,
      loadUpcomingEvents,
      loadUrgentPets,
      loadNotifications,
      getNotificationIconBg, 
      getNotificationIconPath,
      handleNotificationClick, 
      navigateBasedOnNotificationType,
      handleNewMessageEvent,
      handleMessageReadEvent,
      formatCurrency,
      formatRelativeTime
    };
  }
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dashboard-container {
  min-height: 100vh;
  background-color: #f9fafb;
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