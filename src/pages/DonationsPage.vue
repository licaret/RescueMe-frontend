<template>
    <Navbar></Navbar>
    
    <div class="bg-gradient-to-b from-gray-90 to-gray-100 min-h-screen p-3 md:p-5 lg:p-6 mt-28 space-y-12">
      
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-medium text-gray-800 relative inline-block">
          <span class="relative z-10">Support Animal Shelters</span>
          <span class="absolute -bottom-3 left-0 w-full h-4 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20 rounded-2xl"></span>
        </h1>
        <p class="text-gray-600 mt-6 max-w-2xl mx-auto">
          Your donations help provide essential care for animals in need
        </p>
      </div>
  
      <!-- Container for content -->
      <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px px-6 pt-4">
            <button 
              @click="activeTab = 'history'"
              :class="[
                activeTab === 'history' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8'
              ]"
            >
              My Donation History
            </button>
            <button 
              @click="activeTab = 'browse'"
              :class="[
                activeTab === 'browse' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Browse Shelters
            </button>
          </nav>
        </div>
  
        <!-- Tab Content -->
        <div class="p-6">
          <!-- My Donation History Tab -->
          <div v-if="activeTab === 'history'">
            <div v-if="loading" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
  
            <div v-else-if="donations.length === 0" class="text-center py-12 bg-gray-50 rounded-2xl">
              <div class="mx-auto h-20 w-20 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-medium text-gray-800 mb-2">No donations yet</h3>
              <p class="text-gray-600 mb-6">You haven't made any donations yet. Browse shelters to get started.</p>
              <button 
                @click="activeTab = 'browse'" 
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Browse Shelters
              </button>
            </div>
  
            <div v-else>
              <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 class="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Your Donation History</h2>
                <div class="md:text-right">
                  <div class="bg-red-50 text-red-600 px-4 py-2 rounded-2xl inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span class="block text-xs">Total donated:</span>
                      <span class="font-bold">{{ formatCurrency(totalDonated) }}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div class="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <ul class="divide-y divide-gray-200">
                  <li v-for="donation in paginatedDonations" :key="donation.id" class="p-6 hover:bg-gray-50 transition duration-150">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div class="mb-4 md:mb-0">
                        <div class="flex items-center">
                          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                            {{ formatDate(donation.donationDate, true) }}
                          </span>
                          <span 
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="{
                              'bg-green-100 text-green-800': donation.paymentStatus === 'COMPLETED',
                              'bg-yellow-100 text-yellow-800': donation.paymentStatus === 'PENDING',
                              'bg-red-100 text-red-800': donation.paymentStatus === 'FAILED'
                            }"
                          >
                            {{ donation.paymentStatus }}
                          </span>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mt-2">{{ donation.shelterName }}</h3>
                        <p class="text-sm text-gray-500">{{ formatDate(donation.donationDate) }}</p>
                        <p v-if="donation.message" class="mt-2 text-gray-700 italic text-sm">
                          "{{ donation.message }}"
                        </p>
                      </div>
                      <div class="flex flex-col items-start md:items-end">
                        <span class="text-xl font-semibold text-green-600">{{ formatCurrency(donation.amount) }}</span>
                        <button 
                          v-if="donation.paymentStatus === 'COMPLETED'"
                          @click="openDonationModal(donation.shelterId, donation.shelterName)" 
                          class="mt-3 inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Donate Again
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
  
              <!-- Pagination -->
              <div class="mt-6 flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  Showing {{ paginationStart }} to {{ paginationEnd }} of {{ donations.length }} donations
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    :class="[
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
                      'px-3 py-1 rounded border border-gray-300 text-gray-700'
                    ]"
                  >
                    Previous
                  </button>
                  
                  <button 
                    v-for="page in paginationArray" 
                    :key="page" 
                    @click="currentPage = page"
                    :class="[
                      page === currentPage 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100',
                      'px-3 py-1 rounded border'
                    ]"
                  >
                    {{ page }}
                  </button>
                  
                  <button 
                    @click="currentPage++" 
                    :disabled="currentPage === totalPages"
                    :class="[
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
                      'px-3 py-1 rounded border border-gray-300 text-gray-700'
                    ]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Browse Shelters Tab -->
          <div v-if="activeTab === 'browse'">
            <div v-if="loadingShelters" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
  
            <div v-else>
              <div class="mb-6">
                <label for="search" class="sr-only">Search shelters</label>
                <div class="relative rounded-2xl">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    name="search"
                    id="search"
                    class="focus:ring-red-500 focus:border-red-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-full"
                    placeholder="Search for shelter names..."
                  />
                </div>
              </div>
  
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  v-for="shelter in paginatedShelters" 
                  :key="shelter.id"
                  class="bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="h-40 bg-gray-100 relative overflow-hidden">
                    <img 
                      v-if="shelter.profilePicture" 
                      :src="'data:image/jpeg;base64,' + shelter.profilePicture" 
                      alt="Shelter" 
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="p-6 flex-1 flex flex-col">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ shelter.username }}</h3>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ shelter.city }}, {{ shelter.county }}
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-4 flex-1">
                      {{ shelter.mission ? truncate(shelter.mission, 100) : 'No mission statement available.' }}
                    </p>
                    
                    <div class="mt-auto flex gap-2">
                      <button 
                        @click="openDonationModal(shelter.id, shelter.username)" 
                        class="flex-1 inline-flex justify-center items-center px-3 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Donate
                      </button>
                      <router-link 
                        :to="'/shelter/' + shelter.id" 
                        class="flex-1 inline-flex justify-center items-center px-3 py-2.5 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
  
              <div v-if="filteredShelters.length === 0" class="text-center py-12 bg-gray-50 rounded-2xl mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-800 mb-1">No shelters found</h3>
                <p class="text-gray-600">
                  {{ searchQuery ? 'Try a different shelter name.' : 'There are no shelters available at the moment.' }}
                </p>
              </div>
              
              <!-- Pagination for Shelters -->
              <div v-if="filteredShelters.length > 0" class="mt-6 flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  Showing {{ shelterPaginationStart }} to {{ shelterPaginationEnd }} of {{ filteredShelters.length }} shelters
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="shelterCurrentPage--" 
                    :disabled="shelterCurrentPage === 1"
                    :class="[
                      shelterCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
                      'px-3 py-1 rounded border border-gray-300 text-gray-700'
                    ]"
                  >
                    Previous
                  </button>
                  
                  <button 
                    v-for="page in shelterPaginationArray" 
                    :key="page" 
                    @click="shelterCurrentPage = page"
                    :class="[
                      page === shelterCurrentPage 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100',
                      'px-3 py-1 rounded border'
                    ]"
                  >
                    {{ page }}
                  </button>
                  
                  <button 
                    @click="shelterCurrentPage++" 
                    :disabled="shelterCurrentPage === shelterTotalPages"
                    :class="[
                      shelterCurrentPage === shelterTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
                      'px-3 py-1 rounded border border-gray-300 text-gray-700'
                    ]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Donation Modal -->
    <DonationModal
      v-if="showDonationModal"
      :is-open="showDonationModal"
      :shelter-id="selectedShelterId"
      :shelter-name="selectedShelterName"
      @close="closeDonationModal"
    />
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Navbar from '@/components/Navbar.vue';
  import DonationModal from '@/components/DonationModal.vue';
  
  export default {
    name: 'DonationsPage',
    components: {
      Navbar,
      DonationModal
    },
    setup() {
      const router = useRouter();
      const activeTab = ref('history');
      const loading = ref(true);
      const loadingShelters = ref(true);
      const donations = ref([]);
      const shelters = ref([]);
      const searchQuery = ref('');
      const showDonationModal = ref(false);
      const selectedShelterId = ref(null);
      const selectedShelterName = ref('');
      
      // Pagination for donations
      const currentPage = ref(1);
      const itemsPerPage = 5;
      
      // Pagination for shelters
      const shelterCurrentPage = ref(1);
      const shelterItemsPerPage = 6;
  
      const totalDonated = computed(() => {
        return donations.value
          .filter(d => d.paymentStatus === 'COMPLETED')
          .reduce((sum, donation) => sum + donation.amount, 0);
      });
  
      // Changed to filter only by username (shelter name)
      const filteredShelters = computed(() => {
        if (!searchQuery.value) return shelters.value;
        
        const query = searchQuery.value.toLowerCase();
        return shelters.value.filter(shelter => 
          shelter.username.toLowerCase().includes(query)
        );
      });
      
      // Paginated donations
      const paginatedDonations = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return donations.value.slice(start, end);
      });
      
      const totalPages = computed(() => {
        return Math.ceil(donations.value.length / itemsPerPage);
      });
      
      const paginationStart = computed(() => {
        return donations.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
      });
      
      const paginationEnd = computed(() => {
        return Math.min(currentPage.value * itemsPerPage, donations.value.length);
      });
      
      const paginationArray = computed(() => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages.value <= maxVisiblePages) {
          for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i);
          }
        } else {
          let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
          let endPage = startPage + maxVisiblePages - 1;
          
          if (endPage > totalPages.value) {
            endPage = totalPages.value;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
        }
        
        return pages;
      });
      
      // Paginated shelters
      const paginatedShelters = computed(() => {
        const start = (shelterCurrentPage.value - 1) * shelterItemsPerPage;
        const end = start + shelterItemsPerPage;
        return filteredShelters.value.slice(start, end);
      });
      
      const shelterTotalPages = computed(() => {
        return Math.ceil(filteredShelters.value.length / shelterItemsPerPage);
      });
      
      const shelterPaginationStart = computed(() => {
        return filteredShelters.value.length === 0 ? 0 : (shelterCurrentPage.value - 1) * shelterItemsPerPage + 1;
      });
      
      const shelterPaginationEnd = computed(() => {
        return Math.min(shelterCurrentPage.value * shelterItemsPerPage, filteredShelters.value.length);
      });
      
      const shelterPaginationArray = computed(() => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (shelterTotalPages.value <= maxVisiblePages) {
          for (let i = 1; i <= shelterTotalPages.value; i++) {
            pages.push(i);
          }
        } else {
          let startPage = Math.max(1, shelterCurrentPage.value - Math.floor(maxVisiblePages / 2));
          let endPage = startPage + maxVisiblePages - 1;
          
          if (endPage > shelterTotalPages.value) {
            endPage = shelterTotalPages.value;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
        }
        
        return pages;
      });
  
      // Reset pagination when filters change
      watch(searchQuery, () => {
        shelterCurrentPage.value = 1;
      });
      
      watch(activeTab, () => {
        // Reset current page when switching tabs
        currentPage.value = 1;
        shelterCurrentPage.value = 1;
      });
  
      onMounted(async () => {
        await loadDonations();
        await loadShelters();
      });
  
      const loadDonations = async () => {
        loading.value = true;
        try {
          const userId = localStorage.getItem('Id');
          if (!userId) return;
          
          const response = await fetch(`http://localhost:8080/api/v1/donations/user/${userId}`);
          if (response.ok) {
            const data = await response.json();
            donations.value = data.sort((a, b) => 
              new Date(b.donationDate) - new Date(a.donationDate)
            );
          }
        } catch (error) {
          console.error('Error loading donations:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const loadShelters = async () => {
        loadingShelters.value = true;
        try {
          const response = await fetch('http://localhost:8080/users/shelters');
          if (response.ok) {
            shelters.value = await response.json();
          }
        } catch (error) {
          console.error('Error loading shelters:', error);
        } finally {
          loadingShelters.value = false;
        }
      };
  
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ro-RO', {
          style: 'currency',
          currency: 'RON',
          minimumFractionDigits: 2
        }).format(amount || 0);
      };
  
      const formatDate = (dateString, shortFormat = false) => {
        const date = new Date(dateString);
        
        if (shortFormat) {
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
          }).format(date);
        }
        
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      };
  
      const truncate = (text, length) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
      };
  
      const openDonationModal = (shelterId, shelterName) => {
        selectedShelterId.value = shelterId;
        selectedShelterName.value = shelterName;
        showDonationModal.value = true;
      };
  
      const closeDonationModal = () => {
        showDonationModal.value = false;
        // Reload donations after a successful donation
        loadDonations();
      };
  
      return {
        activeTab,
        loading,
        loadingShelters,
        donations,
        shelters,
        totalDonated,
        searchQuery,
        filteredShelters,
        showDonationModal,
        selectedShelterId,
        selectedShelterName,
        currentPage,
        paginatedDonations,
        totalPages,
        paginationStart,
        paginationEnd,
        paginationArray,
        shelterCurrentPage,
        paginatedShelters,
        shelterTotalPages,
        shelterPaginationStart,
        shelterPaginationEnd,
        shelterPaginationArray,
        
        formatCurrency,
        formatDate,
        truncate,
        openDonationModal,
        closeDonationModal
      };
    }
  };
  </script>