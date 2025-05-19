<template>
  <div class="container max-w-full px-4 py-8">
    <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h2 class="text-2xl font-semibold text-gray-800">Adoption Requests</h2>
            <p class="text-sm text-gray-500 mt-1">Manage and track adoption requests</p>
          </div>
          
          <div class="flex items-center space-x-4 w-full md:w-auto">
            <!-- Search bar -->
            <div class="relative w-full md:w-64">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by pet name..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"/>
                </svg>
              </div>
            </div>

            <div class="flex-grow md:flex-grow-0 w-full md:w-auto">
              <select 
                v-model="statusFilter" 
                class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" class="text-gray-800">All Statuses</option>
                <option value="PENDING" class="text-gray-800">Pending</option>
                <option value="APPROVED" class="text-gray-800">Approved</option>
                <option value="REJECTED" class="text-gray-800">Rejected</option>
                <option value="COMPLETED" class="text-gray-800">Completed</option>
              </select>
            </div>
            
            <div class="flex-grow md:flex-grow-0 w-full md:w-auto">
              <select 
                v-model="dateSort"
                class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest" class="text-gray-800">Newest First</option>
                <option value="oldest" class="text-gray-800">Oldest First</option>
              </select>
            </div>
            
            <!-- Reset Filters Button -->
            <button 
              @click="resetFilters"
              class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              title="Reset Filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Grouped Pets Section -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Empty State: No Requests At All -->
      <div v-else-if="requests.length === 0" class="text-center py-12 bg-gray-50">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <h3 class="mt-2 text-xl font-semibold text-gray-600">No Adoption Requests</h3>
        <p class="mt-1 text-gray-500">You currently have no adoption requests.</p>
      </div>

      <!-- Empty State: No Search Results -->
      <div v-else-if="searchQuery && groupedPetRequests.length === 0" class="text-center py-12 bg-gray-50">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-xl font-semibold text-gray-600">No Matching Pets</h3>
        <p class="mt-1 text-gray-500">
          No pets found matching "<span class="font-medium">{{ searchQuery }}</span>".
          <button @click="searchQuery = ''" class="text-blue-500 hover:underline">Clear search</button>
        </p>
      </div>

      <!-- Empty State: No Status Filter Results -->
      <div v-else-if="statusFilter && groupedPetRequests.length === 0" class="text-center py-12 bg-gray-50">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 class="mt-2 text-xl font-semibold text-gray-600">No {{ statusFilter.toLowerCase() }} requests</h3>
        <p class="mt-1 text-gray-500">
          There are no adoption requests with status "{{ statusFilter }}".
          <button @click="statusFilter = ''" class="text-blue-500 hover:underline">Show all statuses</button>
        </p>
      </div>

      <!-- Results List -->
      <div v-else class="grid grid-cols-1 gap-6 p-6">
        <div 
          v-for="petGroup in paginatedPetGroups" 
          :key="petGroup.pet.id" 
          class="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden"
        >
          <!-- Pet Header -->
          <div class="bg-gray-50 px-6 py-4 flex items-center border-b">
            <img 
              v-if="petGroup.pet.photoUrl" 
              :src="petGroup.pet.photoUrl" 
              :alt="petGroup.pet.name" 
              class="h-16 w-16 rounded-2xl object-cover mr-4"
            />
            <div v-else class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ petGroup.pet.name }}</h3>
              <p class="text-sm text-gray-600">
                {{ petGroup.pet.species }} • {{ petGroup.pet.breed }} 
                • {{ formatAge(petGroup.pet.age) }}
              </p>
            </div>
            <div class="ml-auto">
              <span 
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-blue-100 text-blue-800': petGroup.requests.some(r => r.status === 'COMPLETED'),
                  'bg-green-100 text-green-800': petGroup.requests.some(r => r.status === 'APPROVED'),
                  'bg-yellow-100 text-yellow-800': !petGroup.requests.some(r => r.status === 'APPROVED') && petGroup.requests.some(r => r.status === 'PENDING'),
                  'bg-red-100 text-red-800': petGroup.requests.every(r => r.status === 'REJECTED')
                }"
              >
                {{ petGroup.requests.length }} Request(s)
              </span>
            </div>
          </div>

          <!-- Requests List -->
          <div class="divide-y divide-gray-200">
            <div 
              v-for="request in paginatedRequests(petGroup.requests, petGroup.pet.id)" 
              :key="request.id" 
              class="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                    <img 
                      v-if="request.adopterPhotoUrl" 
                      :src="request.adopterPhotoUrl" 
                      alt="Adopter profile" 
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ request.requestDetails?.contactInfo?.name || 'Anonymous' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ request.requestDetails?.contactInfo?.email || 'No email' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': request.status === 'PENDING',
                      'bg-green-100 text-green-800': request.status === 'APPROVED',
                      'bg-red-100 text-red-800': request.status === 'REJECTED',
                      'bg-blue-100 text-blue-800': request.status === 'COMPLETED'
                    }"
                  >
                    {{ request.status }}
                  </span>
                  <div class="text-sm text-gray-500">{{ formatDate(request.requestDate) }}</div>
                  <button 
                    @click="messageUser(request.userId)" 
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                    </svg>
                    Message
                  </button>
                  <button 
                    @click="viewRequestDetails(request)" 
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Pagination controls -->
            <div v-if="petGroup.requests.length > itemsPerPage" class="flex justify-center items-center py-4 px-6">
              <div class="flex space-x-1">
                <button 
                  @click="changePage(petGroup.pet.id, currentPages[petGroup.pet.id] - 1)" 
                  :disabled="currentPages[petGroup.pet.id] === 1"
                  class="px-3 py-1 rounded-md text-sm font-medium"
                  :class="currentPages[petGroup.pet.id] === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'"
                >
                  Previous
                </button>
                
                <button 
                  v-for="pageNum in getPageCount(petGroup.requests.length)" 
                  :key="pageNum" 
                  @click="changePage(petGroup.pet.id, pageNum)"
                  class="px-3 py-1 rounded-md text-sm font-medium"
                  :class="currentPages[petGroup.pet.id] === pageNum ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  {{ pageNum }}
                </button>
                
                <button 
                  @click="changePage(petGroup.pet.id, currentPages[petGroup.pet.id] + 1)" 
                  :disabled="currentPages[petGroup.pet.id] === getPageCount(petGroup.requests.length)"
                  class="px-3 py-1 rounded-md text-sm font-medium"
                  :class="currentPages[petGroup.pet.id] === getPageCount(petGroup.requests.length) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdoptionRequestDetailsForShelter
        :request="selectedRequest"
        :responseNote="responseNote"
        @update:responseNote="responseNote = $event"
        @close="selectedRequest = null"
        @approve="showApproveConfirmation = true"
        @reject="showRejectConfirmation = true"
        @complete="showCompleteConfirmation = true"
      />
    </div>

    <!-- Approval Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showApproveConfirmation" class="fixed inset-0 z-[10000] overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6" @click.stop>
          <h3 class="text-xl font-bold text-gray-800 mb-4">Approve Adoption Request</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to approve this adoption request? This will mark the pet's status as "PENDING" and reject the other applicants' requests.</p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showApproveConfirmation = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button 
              @click="() => { showApproveConfirmation = false; processApproval(); }"
              class="px-4 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition"
            >
              Yes, Approve
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Rejection Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showRejectConfirmation" class="fixed inset-0 z-[10000] overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6" @click.stop>
          <h3 class="text-xl font-bold text-gray-800 mb-4">Reject Adoption Request</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to reject this adoption request?</p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showRejectConfirmation = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button 
              @click="() => { showRejectConfirmation = false; processRejection(); }"
              class="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition"
            >
              Yes, Reject
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Complete Adoption Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showCompleteConfirmation" class="fixed inset-0 z-[10000] overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6" @click.stop>
          <h3 class="text-xl font-bold text-gray-800 mb-4">Complete Adoption Process</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to complete this adoption process? This confirms that the adopter has picked up the pet and will mark the pet's status as "ADOPTED".</p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showCompleteConfirmation = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button 
              @click="() => { showCompleteConfirmation = false; completeAdoptionProcess(); }"
              class="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
            >
              Yes, Complete
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="totalPetGroupPages > 1" class="flex justify-center mt-6">
        <button 
          @click="currentPetGroupPage--"
          :disabled="currentPetGroupPage === 1"
          class="px-3 py-1 rounded-md mx-1"
          :class="currentPetGroupPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'"
        >
          Previous
        </button>

        <button 
          v-for="n in totalPetGroupPages" 
          :key="n"
          @click="currentPetGroupPage = n"
          class="px-3 py-1 rounded-md mx-1"
          :class="n === currentPetGroupPage ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ n }}
        </button>

        <button 
          @click="currentPetGroupPage++"
          :disabled="currentPetGroupPage === totalPetGroupPages"
          class="px-3 py-1 rounded-md mx-1"
          :class="currentPetGroupPage === totalPetGroupPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'"
        >
          Next
        </button>
      </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { getShelterAdoptionRequests, updateAdoptionRequestStatus } from '@/services/adoption_service';
import { completeAdoption } from '@/services/adoption_service';
import { getPetPhotoById } from '@/services/pet_service';
import { fetchProfilePicture } from '@/services/user_service';
import AdoptionRequestDetailsForShelter from '@/components/AdoptionRequestDetailsForShelter.vue';

export default {

  name: 'ShelterAdoptionRequests',

  components: {
    AdoptionRequestDetailsForShelter
  },

  props: {
    shelterId: {
      type: [String, Number],
      required: true
    }
  },

  setup(props) {
    const requests = ref([]);
    const isLoading = ref(true);
    const selectedRequest = ref(null);
    const statusFilter = ref('');
    const responseNote = ref('');
    const error = ref(null);
    const dateSort = ref('newest');
    
    const itemsPerPage = 5;
    const currentPages = reactive({});
    const petGroupsPerPage = 5;
    const currentPetGroupPage = ref(1);

    const searchQuery = ref('');

    const showApproveConfirmation = ref(false);
    const showRejectConfirmation = ref(false);
    const showCompleteConfirmation = ref(false);


    watch(dateSort, () => {
      sortRequests();
    });


    const paginatedPetGroups = computed(() => {
      const start = (currentPetGroupPage.value - 1) * petGroupsPerPage;
      const end = start + petGroupsPerPage;
      return groupedPetRequests.value.slice(start, end);
    });


    const totalPetGroupPages = computed(() => {
      return Math.ceil(groupedPetRequests.value.length / petGroupsPerPage);
    });


    watch(statusFilter, () => {
      currentPetGroupPage.value = 1;
    });


    const resetFilters = () => {
      statusFilter.value = '';
      dateSort.value = 'newest';
    };


    const sortRequests = () => {
      if (dateSort.value === 'newest') {
        requests.value.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
      } else {
        requests.value.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
      }
    };


    const getPageCount = (totalItems) => {
      return Math.ceil(totalItems / itemsPerPage);
    };


    const changePage = (petId, pageNumber) => {
      currentPages[petId] = pageNumber;
    };


    const paginatedRequests = (requestsList, petId) => {
      if (!currentPages[petId]) {
        currentPages[petId] = 1;
      }
      
      const startIndex = (currentPages[petId] - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      return requestsList.slice(startIndex, endIndex);
    };


    const sortedGroupedPetRequests = computed(() => {
      let filteredRequests = statusFilter.value 
        ? requests.value.filter(r => r.status === statusFilter.value)
        : requests.value;

      const grouped = filteredRequests.reduce((acc, request) => {
        if (!request.pet) return acc;

        const existingPetGroup = acc.find(group => group.pet.id === request.pet.id);
        
        if (existingPetGroup) {
          existingPetGroup.requests.push(request);
        } else {
          acc.push({
            pet: request.pet,
            requests: [request]
          });
        }

        return acc;
      }, []);

      return grouped.sort((a, b) => {
        const aDate = a.requests[0]?.requestDate;
        const bDate = b.requests[0]?.requestDate;
        
        return dateSort.value === 'newest' 
          ? new Date(bDate) - new Date(aDate)
          : new Date(aDate) - new Date(bDate);
      });
    });


    const completeAdoptionProcess = async () => {
      if (!selectedRequest.value) return;

      try {
        isLoading.value = true;

        await completeAdoption(selectedRequest.value.id);

        const index = requests.value.findIndex(r => r.id === selectedRequest.value.id);
        if (index !== -1) {
          requests.value[index].status = 'COMPLETED';
          requests.value[index].pet.status = 'ADOPTED';

          if (selectedRequest.value) {
            selectedRequest.value.status = 'COMPLETED'; 
            selectedRequest.value.pet.status = 'ADOPTED';
          }
        }

        window.dispatchEvent(new Event('adoption-completed'));

      } catch (error) {
        console.error('Error completing adoption process:', error);
        alert('Failed to complete the adoption process. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };


    const fetchRequests = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        const data = await getShelterAdoptionRequests(props.shelterId);
        
        const requestsWithDetails = await Promise.all(data.map(async (request) => {
          let photoUrl = null;
          if (request.pet && request.pet.photoIds && request.pet.photoIds.length > 0) {
            try {
              const photoData = await getPetPhotoById(request.pet.photoIds[0]);
              photoUrl = photoData.url;
            } catch (err) {
              console.warn('Could not fetch pet photo:', err);
            }
          }

          let adopterPhotoUrl = null;
          if (request.userId) { 
            adopterPhotoUrl = await fetchProfilePicture(request.userId);
          }
          
          return {
            ...request,
            pet: request.pet ? {
              ...request.pet,
              photoUrl
            } : null,
            adopterPhotoUrl
          };
        }));
        
        requests.value = requestsWithDetails;
      } catch (err) {
        console.error('Error fetching adoption requests:', err);
        error.value = 'Failed to load adoption requests. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };


    const groupedPetRequests = computed(() => {
      const filteredRequests = statusFilter.value 
        ? requests.value.filter(r => r.status === statusFilter.value)
        : requests.value;

      const grouped = filteredRequests.reduce((acc, request) => {
        if (!request.pet) return acc;

        const nameMatch = request.pet.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        if (!nameMatch) return acc;

        const existing = acc.find(group => group.pet.id === request.pet.id);
        if (existing) {
          existing.requests.push(request);
        } else {
          acc.push({ pet: request.pet, requests: [request] });
        }

        return acc;
      }, []);

      return grouped.sort((a, b) => {
        const aPending = a.requests.filter(r => r.status === 'PENDING').length;
        const bPending = b.requests.filter(r => r.status === 'PENDING').length;
        return bPending - aPending;
      });
    });


    
    const viewRequestDetails = (request) => {
      selectedRequest.value = { ...request };
      responseNote.value = request.notes || '';
    };

   

    const processApproval = async () => {
      if (!selectedRequest.value) return;

      try {
        isLoading.value = true;
        await updateAdoptionRequestStatus(
          selectedRequest.value.id,
          'APPROVED',
          responseNote.value
        );

        await fetchRequests();
        
        selectedRequest.value = null;

      } catch (error) {
        console.error('Error approving adoption request:', error);
        alert('Failed to approve adoption request. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };

    

    const processRejection = async () => {
      if (!selectedRequest.value) return;
      
      try {
        isLoading.value = true;
        await updateAdoptionRequestStatus(
          selectedRequest.value.id,
          'REJECTED',
          responseNote.value
        );

        window.dispatchEvent(new Event('adoption-status-updated'));
        
        const index = requests.value.findIndex(r => r.id === selectedRequest.value.id);
        if (index !== -1) {
          requests.value[index].status = 'REJECTED';
          requests.value[index].notes = responseNote.value;
        }
        
        selectedRequest.value = null;
        
      } catch (error) {
        console.error('Error rejecting adoption request:', error);
        alert('Failed to reject adoption request. Please try again.');
      } finally {
        isLoading.value = false;
      }
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



    const formatAge = (age) => {
      if (age === undefined || age === null) return 'Unknown';
      
      try {
        const ageInMonths = Math.round(age * 12);
        if (ageInMonths >= 12) {
          return `${Math.floor(age)} ${Math.floor(age) === 1 ? 'year' : 'years'}`;
        } else {
          return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
        }
      } catch (e) {
        console.error('Error formatting age:', e);
        return 'Unknown';
      }
    };


    onMounted(() => {
      fetchRequests();
    });


    const messageUser = (adopterId) => {
      if (!adopterId) {
        console.error('No adopter ID provided');
        return;
      }
      
      const relevantRequest = requests.value.find(req => req.userId === adopterId || req.adopterId === adopterId);
      
      const adopterName = relevantRequest?.requestDetails?.contactInfo?.name || 
                          relevantRequest?.userName ||
                          'Adopter';
      
      const currentUrl = window.location.href;
      
      if (currentUrl.includes('/shelter-dashboard/')) {
        window.location.href = `/shelter-dashboard/messages?adopterId=${adopterId}&adopterName=${encodeURIComponent(adopterName)}`;
      } else {
        window.location.href = `/messages?adopterId=${adopterId}&adopterName=${encodeURIComponent(adopterName)}`;
      }
    };


    return {
      requests,
      isLoading,
      selectedRequest,
      statusFilter,
      responseNote,
      error,
      dateSort,
      itemsPerPage,
      currentPages,
      groupedPetRequests,
      sortedGroupedPetRequests,
      showApproveConfirmation,
      showRejectConfirmation, 
      showCompleteConfirmation,
      petGroupsPerPage,
      currentPetGroupPage,
      paginatedPetGroups,
      totalPetGroupPages,
      searchQuery,

      getPageCount,
      changePage,
      paginatedRequests,
      resetFilters,
      completeAdoptionProcess,
      fetchRequests,
      viewRequestDetails,
      processApproval,
      processRejection,
      formatDate,
      formatAge,
      messageUser
    };
  }
};
</script>

<style scoped>
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em 1.5em;
}
</style>