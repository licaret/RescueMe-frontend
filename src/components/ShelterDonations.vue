<template>
    <div class="p-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Donations</h1>
        <p class="text-gray-600">Track all donations received for your shelter</p>
      </div>
  
      <!-- Donation Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Total Donations</h3>
          <div class="flex items-center">
            <div class="text-2xl font-bold text-gray-800">{{ stats.totalDonations }}</div>
          </div>
        </div>
  
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Total Amount Raised</h3>
          <div class="flex items-center">
            <div class="text-2xl font-bold text-green-600">{{ formatCurrency(stats.totalAmountRaised) }}</div>
          </div>
        </div>
  
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Average Donation</h3>
          <div class="flex items-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ stats.totalDonations > 0 ? formatCurrency(stats.totalAmountRaised / stats.totalDonations) : formatCurrency(0) }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- Donations Table -->
      <div class="bg-white shadow-md rounded-xl overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">Recent Donations</h2>
          
          <div class="flex space-x-2">
            <select v-model="filters.period" class="border rounded-lg p-2 text-sm">
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
              <option value="day">Today</option>
            </select>
            
            <button 
              @click="refreshDonations" 
              class="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          <span class="ml-2 text-gray-500">Loading donations...</span>
        </div>
        
        <div v-else-if="donations.length === 0" class="text-center p-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg font-medium">No donations yet</p>
          <p class="mt-1">Donations will appear here once received</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message from donator
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="donation in filteredDonations" :key="donation.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div v-if="!donation.anonymous" class="text-sm font-medium text-gray-900">
                      {{ donation.donorName }}
                    </div>
                    <div v-else class="text-sm font-medium text-gray-500">
                      Anonymous
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-green-600">{{ formatCurrency(donation.amount) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(donation.donationDate) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(donation.donationDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': donation.paymentStatus === 'COMPLETED',
                      'bg-yellow-100 text-yellow-800': donation.paymentStatus === 'PENDING',
                      'bg-red-100 text-red-800': donation.paymentStatus === 'FAILED',
                      'bg-gray-100 text-gray-800': donation.paymentStatus === 'REFUNDED'
                    }"
                  >
                    {{ donation.paymentStatus }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 truncate max-w-xs">
                    {{ donation.message || 'No message' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button 
                    v-if="!donation.anonymous && donation.donorName"
                    @click="messageUser(donation.id, donation.donorName)" 
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                    </svg>
                    Message
                  </button>
                  <span v-else class="text-gray-400 text-sm">Anonymous</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="changePage(-1)" 
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Previous
            </button>
            <button 
              @click="changePage(1)" 
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart }}</span> to 
                <span class="font-medium">{{ paginationEnd }}</span> of 
                <span class="font-medium">{{ filteredDonations.length }}</span> donations
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="changePage(-1)" 
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button 
                  v-for="page in paginationArray" 
                  :key="page" 
                  @click="currentPage = page"
                  :class="[
                    page === currentPage ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button 
                  @click="changePage(1)" 
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { getDonationStatistics, getDonationsForShelter } from '@/services/donation_service';

  
  export default {
    name: 'ShelterDonations',
    
    setup() {
      const donations = ref([]);
      const loading = ref(true);
      const currentPage = ref(1);
      const itemsPerPage = 10;
      
      const stats = ref({
        totalDonations: 0,
        totalAmountRaised: 0,
        recentDonations: []
      });
      
      const filters = ref({
        period: 'all',
      });
      

      const filteredDonations = computed(() => {
        if (filters.value.period === 'all') {
          return donations.value;
        }
        
        const now = new Date();
        let compareDate = new Date();
        
        if (filters.value.period === 'month') {
          compareDate.setMonth(now.getMonth() - 1);
        } else if (filters.value.period === 'week') {
          compareDate.setDate(now.getDate() - 7);
        } else if (filters.value.period === 'day') {
          compareDate.setDate(now.getDate() - 1);
        }
        
        return donations.value.filter(donation => {
          const donationDate = new Date(donation.donationDate);
          return donationDate >= compareDate;
        });
      });
      

      const totalPages = computed(() => {
        return Math.ceil(filteredDonations.value.length / itemsPerPage);
      });
      

      const paginatedDonations = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredDonations.value.slice(start, end);
      });
      

      const paginationStart = computed(() => {
        return filteredDonations.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
      });
      
      
      const paginationEnd = computed(() => {
        return Math.min(currentPage.value * itemsPerPage, filteredDonations.value.length);
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
      
      
      watch(filters, () => {
        currentPage.value = 1;
      });
      

      const changePage = (direction) => {
        const newPage = currentPage.value + direction;
        if (newPage >= 1 && newPage <= totalPages.value) {
          currentPage.value = newPage;
        }
      };
      

      const loadDonations = async () => {
        loading.value = true;
        try {
          const shelterId = localStorage.getItem('Id');

          if (!shelterId) {
            console.error('Shelter ID not found in localStorage');
            return;
          }

          stats.value = await getDonationStatistics(shelterId);

          const data = await getDonationsForShelter(shelterId);
          donations.value = data.sort((a, b) => 
            new Date(b.donationDate) - new Date(a.donationDate)
          );
        } catch (error) {
          console.error('Error loading donations:', error);
        } finally {
          loading.value = false;
        }
      };

      

      const refreshDonations = () => {
        loadDonations();
      };
      

      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ro-RO', {
          style: 'currency',
          currency: 'RON',
          minimumFractionDigits: 2
        }).format(amount || 0);
      };
      

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      };
      

      const formatTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      };
      
      onMounted(() => {
        loadDonations();
      });


      const messageUser = (donationId, donorName) => {
        if (!donationId) {
          console.error('No donation ID provided');
          return;
        }
        
        window.location.href = `/messages?shelterId=${donationId}&shelterName=${encodeURIComponent(donorName || 'Donor')}`;
      };
      
      return {
        donations,
        filteredDonations,
        paginatedDonations,
        loading,
        stats,
        filters,
        currentPage,
        totalPages,
        paginationArray,
        paginationStart,
        paginationEnd,

        changePage,
        refreshDonations,
        formatCurrency,
        formatDate,
        formatTime,
        messageUser
      };
    }
  }
  </script>