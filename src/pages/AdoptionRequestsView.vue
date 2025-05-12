<template>
  <Navbar />
  <div class="container mx-auto px-4 sm:px-6 lg:px-20 py-20 min-h-screen p-3 md:p-5 lg:p-6 mt-28 space-y-12">
    
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-medium text-gray-800 relative inline-block">
        <span class="relative z-10">My Adoption Requests</span>
      </h1>
      <p class="text-gray-600 mt-6 max-w-2xl mx-auto">
        Track and manage your pet adoption journey
      </p>
    </div>

    <div class="rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 text-sm p-4 mb-6 text-center">
      If you encounter any issues with your requests, please contact the shelter directly or email us at <span class="underline">rescueme.care@gmail.com</span>.
    </div>

    <!-- Filters and Sorting -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div class="flex space-x-4 w-full sm:w-auto">
        <select 
          v-model="statusFilter" 
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELED">Canceled</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select 
          v-model="sortBy" 
          class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div class="text-sm text-gray-600 self-end sm:self-auto">
        Total Requests: {{ filteredRequests.length }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600 text-lg">Loading your adoption requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-md">
      <div class="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-red-800 mb-2">Connection Error</h3>
      <p class="text-red-600 mb-6">{{ error }}</p>
      <button 
        @click="fetchRequests" 
        class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center mx-auto space-x-2 shadow-md hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Try Again</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredRequests.length === 0" class="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center shadow-md">
      <div class="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-gray-800 mb-3">No Adoption Requests</h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">You haven't submitted any adoption requests yet. Start your journey to find a furry friend!</p>
      <router-link 
        to="/available-pets" 
        class="px-6 py-3 bg-pink-200 text-red-600 font-medium rounded-3xl hover:bg-pink-300 transition-colors inline-flex items-center space-x-2 shadow-md hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>Find a Pet to Adopt</span>
      </router-link>
    </div>

    <!-- Requests List -->
    <div v-else class="space-y-6">
      <div 
        v-for="request in paginatedRequests" 
        :key="request.id" 
        class="request-card bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden relative"
      >
        <!-- Status indicator -->
        <span 
          class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium uppercase z-10"
          :class="{
            'bg-yellow-100 text-yellow-800': request.status === 'PENDING',
            'bg-green-100 text-green-800': request.status === 'APPROVED',
            'bg-red-100 text-red-800': request.status === 'REJECTED',
            'bg-gray-100 text-gray-800': request.status === 'CANCELED',
            'bg-blue-100 text-blue-800': request.status === 'COMPLETED'
          }"
        >
          {{ formatStatus(request.status) }}
        </span>
        
        <div class="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Pet Image -->
          <div class="md:col-span-3 flex items-center justify-center">
            <div class="w-full h-48 md:h-48 relative overflow-hidden rounded-2xl">
              <img 
                :src="request.petPhotoUrl || '/default-pet-placeholder.png'" 
                alt="Pet Photo" 
                class="w-full h-full object-cover absolute inset-0"
              />
            </div>
          </div>

          <!-- Request Details -->
          <div class="md:col-span-5 space-y-3 flex flex-col justify-between">
            <div>
              <div class="mb-2">
                <h3 class="text-xl font-bold text-gray-800">
                  Request for {{ request.petName }}
                </h3>
              </div>
              
              <p class="text-gray-600 text-sm">
                <span class="font-medium">Submitted on:</span> {{ formatDate(request.requestDate) }}
              </p>
              
              <div class="mt-3 text-sm text-gray-600">
                <p v-if="request.pet && request.pet.species">
                  <span class="font-medium">Pet type:</span> {{ request.pet.species }} ({{ request.pet.breed }})
                </p>
                <p v-if="request.pet && request.pet.age">
                  <span class="font-medium">Age:</span> {{ request.pet.age }} years
                </p>
              </div>
            </div>

            <!-- Shelter Response (if any) -->
            <div v-if="request.notes" class="bg-gray-50 rounded-xl p-3 border border-gray-200 text-sm">
              <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Shelter Response
              </h4>
              <p class="text-gray-600">{{ request.notes }}</p>
            </div>
          </div>

          <!-- Shelter Information -->
          <div class="md:col-span-4 flex flex-col">
            <div class="flex-grow mb-4"></div>
            
            <!-- Shelter Information Card -->
            <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                SHELTER INFORMATION
              </h4>
              <div class="text-sm text-gray-600 space-y-2">
                <div class="flex items-start">
                  <span class="font-medium w-20 flex-shrink-0">Name:</span>
                  <span class="text-indigo-700">{{ request.shelter?.username || request.shelterName }}</span>
                </div>
                <div class="flex items-start">
                  <span class="font-medium w-20 flex-shrink-0">Location:</span>
                  <span>{{ request.shelter?.city || 'City' }}, {{ request.shelter?.county || 'County' }}</span>
                </div>
                <div class="flex items-start">
                  <span class="font-medium w-20 flex-shrink-0">Phone:</span>
                  <a 
                    :href="`tel:${request.shelter?.phoneNumber || request.shelterPhone}`" 
                    class="text-indigo-600 hover:text-indigo-800 transition duration-300"
                  >
                    {{ request.shelter?.phoneNumber || request.shelterPhone }}
                  </a>
                </div>
                <div class="flex items-start">
                  <span class="font-medium w-20 flex-shrink-0">Email:</span>
                  <a 
                    :href="`mailto:${request.shelter?.email || ''}`" 
                    class="text-indigo-600 hover:text-indigo-800 transition duration-300 break-all"
                  >
                    {{ request.shelter?.email || 'Contact shelter' }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="px-6 pb-6 grid grid-cols-3 gap-4">
          <router-link 
            :to="`/my-adoption-requests/${request.id}`" 
            class="text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-2xl py-2.5 transition duration-200 border border-gray-300"
          >
            View Details
          </router-link>
          
          <button 
            v-if="request.status === 'PENDING'"
            @click="cancelRequest(request.id)"
            class="text-center bg-white hover:bg-red-50 text-red-600 font-medium rounded-2xl py-2.5 transition duration-200 border border-red-400"
          >
            Cancel Request
          </button>
          <button 
            v-else
            disabled
            class="text-center bg-gray-100 text-gray-400 font-medium rounded-2xl py-2.5 cursor-not-allowed border border-gray-200"
          >
            Cancel Request
          </button>
          
          <button 
            @click="messageShelter(request.shelter?.id || request.shelterId)"
            class="text-center bg-white hover:bg-green-50 text-green-600 font-medium rounded-2xl py-2.5 transition duration-200 border border-green-400"
          >
            Message Shelter
          </button>
        </div>

        
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <nav class="inline-flex rounded-xl shadow-md" aria-label="Pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-l-xl disabled:opacity-50 transition duration-300"
        >
          Previous
        </button>
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-r-xl disabled:opacity-50 transition duration-300"
        >
          Next
        </button>
      </nav>
    </div>
  </div>

  <!-- Cancel Request Confirmation Popup -->
  <div v-if="showCancelPopup" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <!-- Header -->
        <div class="bg-red-50 px-6 py-4 border-b border-red-100">
          <div class="flex items-center justify-center">
            <div class="bg-red-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 class="mt-3 text-center text-xl font-medium text-red-800">Cancel Adoption Request</h3>
        </div>
        
        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-gray-700 mb-4 text-center">
            Are you sure you want to cancel this adoption request? This action cannot be undone.
          </p>
          
          <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-200 mb-4">
            If you're having second thoughts about adopting, consider discussing your concerns with the shelter first. They may be able to address your questions or concerns.
          </p>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-center space-x-4">
          <button
            @click="closeCancelPopup"
            class="py-2 px-4 bg-white text-gray-600 rounded-3xl border border-gray-300 hover:bg-gray-100 transition duration-200 font-medium"
          >
            No, Keep Request
          </button>
          <button
            @click="confirmCancelRequest"
            class="py-2 px-4 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-200 font-medium"
          >
            Yes, Cancel Request
          </button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getUserAdoptionRequests, cancelAdoptionRequest } from '../services/adoption_service';
import { getShelterByPetId } from '../services/user_service';
import { getPetPhotoById } from '../services/pet_service';
import Navbar from '@/components/Navbar.vue';

export default {

  name: 'AdoptionRequestsView',

  components: {
    Navbar,
  },

  setup() {
    const router = useRouter();
    const requests = ref([]);
    const loading = ref(true);
    const error = ref(null);
    
    const statusFilter = ref('');
    const sortBy = ref('newest');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const showCancelPopup = ref(false);
    const requestToCancel = ref(null);


    const cancelRequest = (requestId) => {
      requestToCancel.value = requestId;
      showCancelPopup.value = true;
    };


    const confirmCancelRequest = async () => {
      try {
        await cancelAdoptionRequest(requestToCancel.value);
        const requestIndex = requests.value.findIndex(req => req.id === requestToCancel.value);
        if (requestIndex !== -1) {
          requests.value[requestIndex].status = 'CANCELED';
        }
        showCancelPopup.value = false;
        requestToCancel.value = null;
      } catch (err) {
        console.error('Error canceling adoption request:', err);
        window.alert('Failed to cancel the request. Please try again later.');
      }
    };


    const closeCancelPopup = () => {
      showCancelPopup.value = false;
      requestToCancel.value = null;
    };

    
    const fetchRequests = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const userId = localStorage.getItem('Id');
        if (!userId) {
          router.push('/login');
          return;
        }
        
        const data = await getUserAdoptionRequests(userId);
        
        const requestsWithDetails = await Promise.all(data.map(async (request) => {
          const petPhotoUrl = await getPetPhotoUrl(request);
          
          let shelterDetails = null;
          if (request.pet && request.pet.id) {
            try {
              shelterDetails = await getShelterByPetId(request.pet.id);
            } catch (err) {
              console.warn('Could not fetch shelter details:', err);
            }
          }
          
          return {
            ...request,
            petPhotoUrl,
            shelter: shelterDetails 
          };
        }));
        
        requests.value = requestsWithDetails;
      } catch (err) {
        console.error('Error fetching adoption requests:', err);
        error.value = 'Failed to load your adoption requests. Please check your connection and try again.';
      } finally {
        loading.value = false;
      }
    };
    

    const filteredRequests = computed(() => {
      let filtered = requests.value;
      
      if (statusFilter.value) {
        filtered = filtered.filter(req => req.status === statusFilter.value);
      }
      
      if (sortBy.value === 'newest') {
        filtered = filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
      } else {
        filtered = filtered.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
      }
      
      return filtered;
    });


    const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage.value));
    

    watch([statusFilter, sortBy], () => {
      currentPage.value = 1;
    });


    const paginatedRequests = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredRequests.value.slice(start, end);
    });
    

    const formatStatus = (status) => {
      if (!status) return 'Unknown';
      
      const statusMap = {
        'PENDING': 'Pending Review',
        'APPROVED': 'Approved',
        'REJECTED': 'Declined',
        'CANCELED': 'Canceled',
        'COMPLETED': 'Completed'
      };
      
      return statusMap[status] || status;
    };
    

    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown date';
      
      try {
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
      }
    };
    

    onMounted(() => {
      fetchRequests();
    });
    

    const getPetPhotoUrl = async (request) => {
      if (request.pet && request.pet.photoIds && request.pet.photoIds.length > 0) {
        try {
          const photoId = request.pet.photoIds[0];
          const photoData = await getPetPhotoById(photoId);
          
          return photoData.url;
        } catch (error) {
          console.error('Error fetching pet photo:', error);
        }
      }
      
      return '/default-pet-placeholder.png';
    };


    const messageShelter = (shelterId) => {
      const relevantRequest = requests.value.find(req => 
        (req.shelter && req.shelter.id === shelterId) || req.shelterId === shelterId
      );
      
      if (!relevantRequest || (!relevantRequest.shelter?.id && !relevantRequest.shelterId)) {
        console.error('No valid shelter ID found for messaging');
        return;
      }
      
      const actualShelterId = relevantRequest.shelter?.id || relevantRequest.shelterId;
      
      router.push({
        path: '/messages',
        query: { 
          shelterId: actualShelterId,
          shelterName: relevantRequest.shelter?.username || 'Shelter'
        }
      });
    };



    return {
      requests,
      loading,
      error,
      statusFilter,
      sortBy,
      currentPage,
      filteredRequests,
      totalPages,
      paginatedRequests,
      showCancelPopup,
      requestToCancel,
      
      fetchRequests,
      cancelRequest,
      formatStatus,
      formatDate,
      getPetPhotoUrl,
      messageShelter,
      confirmCancelRequest,
      closeCancelPopup, 
    };
  }
};
</script>



<style scoped>
.request-card {
  transition: all 0.3s ease;
}

.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>