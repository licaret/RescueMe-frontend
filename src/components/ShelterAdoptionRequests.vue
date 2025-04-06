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
                    <div class="flex-grow md:flex-grow-0 w-full md:w-auto">
                        <select 
                        v-model="statusFilter" 
                        class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        <option value="" class="text-gray-800">All Statuses</option>
                        <option value="PENDING" class="text-gray-800">Pending</option>
                        <option value="APPROVED" class="text-gray-800">Approved</option>
                        <option value="REJECTED" class="text-gray-800">Rejected</option>
                        </select>
                    </div>
                    
                    <div class="flex-grow md:flex-grow-0 w-full md:w-auto">
                        <select 
                        v-model="dateSort"
                        class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                        <option value="newest" class="text-gray-800">Newest First</option>
                        <option value="oldest" class="text-gray-800">Oldest First</option>
                        </select>
                    </div>
                    
                    <!-- Buton de resetare -->
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
  
        <div v-else-if="groupedPetRequests.length === 0" class="text-center py-12 bg-gray-50">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 class="mt-2 text-xl font-semibold text-gray-600">No Adoption Requests</h3>
          <p class="mt-1 text-gray-500">You currently have no adoption requests.</p>
        </div>
  
        <div v-else class="grid grid-cols-1 gap-6 p-6">
          <div 
            v-for="petGroup in groupedPetRequests" 
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
                    'bg-yellow-100 text-yellow-800': petGroup.requests.some(r => r.status === 'PENDING'),
                    'bg-green-100 text-green-800': petGroup.requests.some(r => r.status === 'APPROVED'),
                    'bg-red-100 text-red-800': petGroup.requests.some(r => r.status === 'REJECTED')
                  }"
                >
                  {{ petGroup.requests.length }} Request(s)
                </span>
              </div>
            </div>
  
            <!-- Requests List -->
            <div class="divide-y divide-gray-200">
              <div 
                v-for="request in petGroup.requests" 
                :key="request.id" 
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
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
                        'bg-red-100 text-red-800': request.status === 'REJECTED'
                      }"
                    >
                      {{ request.status }}
                    </span>
                    <div class="text-sm text-gray-500">{{ formatDate(request.requestDate) }}</div>
                    <button 
                      @click="viewRequestDetails(request)" 
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <Teleport to="body">
        <div 
            v-if="selectedRequest" 
            class="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            @click.self="selectedRequest = null"
        >
            <div 
            class="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all"
            @click.stop
            >
            <div class="p-6">
                <!-- Modal Header -->
                <div class="flex justify-between items-center border-b pb-4 mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Adoption Request Details</h2>
                <button 
                    @click="selectedRequest = null" 
                    class="text-gray-500 hover:text-gray-700 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>

                <!-- Request Overview -->
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                <!-- Pet Information -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Pet Information</h3>
                    <div class="flex items-center space-x-4">
                    <img 
                        v-if="selectedRequest.pet?.photoUrl" 
                        :src="selectedRequest.pet.photoUrl" 
                        :alt="selectedRequest.pet.name" 
                        class="w-24 h-24 object-cover rounded-2xl border"
                    />
                    <div>
                        <div class="text-xl font-bold text-gray-800">{{ selectedRequest.pet?.name }}</div>
                        <div class="text-sm text-gray-600">
                        {{ selectedRequest.pet?.species }} • {{ selectedRequest.pet?.breed }}
                        </div>
                        <div class="text-sm text-gray-600">{{ formatAge(selectedRequest.pet?.age) }}</div>
                    </div>
                    </div>
                </div>

                <!-- Applicant Information -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Applicant Information</h3>
                    <div class="space-y-2">
                    <div>
                        <span class="text-sm text-gray-500">Name</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.contactInfo?.name || 'Not provided' }}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Email</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.contactInfo?.email || 'Not provided' }}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Phone</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.contactInfo?.phone || 'Not provided' }}</div>
                    </div>
                    </div>
                </div>
                </div>

                <!-- Adoption Questionnaire -->
                <div class="space-y-6">
                <!-- Housing Information -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Housing Information</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-500">Housing Type</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.housing?.type || 'Not provided' }}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Ownership</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.housing?.ownership || 'Not provided' }}</div>
                    </div>
                    <div v-if="selectedRequest.requestDetails?.housing?.ownership === 'rent'">
                        <span class="text-sm text-gray-500">Landlord Permission</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.housing?.landlordPermission || 'Not provided' }}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Has Yard</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.housing?.hasYard || 'Not provided' }}</div>
                    </div>
                    <div v-if="selectedRequest.requestDetails?.housing?.hasYard === 'yes'">
                        <span class="text-sm text-gray-500">Fenced Yard</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.housing?.fencedYard || 'Not provided' }}</div>
                    </div>
                    </div>
                </div>

                <!-- Household Information -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Household Information</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-500">Household Members</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.household?.members || 'Not provided' }} person(s)</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Children in Home</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.household?.children?.has || 'Not provided' }}</div>
                    </div>
                    <div v-if="selectedRequest.requestDetails?.household?.children?.has === 'yes'">
                        <span class="text-sm text-gray-500">Children's Ages</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.household?.children?.ages || 'Not provided' }}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Other Pets</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.household?.otherPets?.has || 'Not provided' }}</div>
                    </div>
                    <div v-if="selectedRequest.requestDetails?.household?.otherPets?.has === 'yes'" class="md:col-span-2">
                        <span class="text-sm text-gray-500">Current Pets</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.household?.otherPets?.description || 'Not provided' }}</div>
                    </div>
                    </div>
                </div>

                <!-- Experience & Expectations -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Experience & Expectations</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-gray-500">Pet Experience</span>
                        <div class="text-gray-800">
                        {{ 
                            selectedRequest.requestDetails?.experience?.level === 'first' ? 'First-time pet owner' : 
                            selectedRequest.requestDetails?.experience?.level === 'some' ? 'Some experience' :
                            selectedRequest.requestDetails?.experience?.level === 'experienced' ? 'Experienced owner' :
                            'Not provided'
                        }}
                        </div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Activity Level</span>
                        <div class="text-gray-800 capitalize">{{ selectedRequest.requestDetails?.experience?.activityLevel || 'Not provided' }}</div>
                    </div>
                    <div>
                        <span class="text-sm text-gray-500">Time Alone</span>
                        <div class="text-gray-800">{{ selectedRequest.requestDetails?.experience?.timeAlone || 'Not provided' }}</div>
                    </div>
                    </div>
                    <div v-if="selectedRequest.requestDetails?.experience?.reason" class="mt-4">
                    <span class="text-sm text-gray-500">Reason for Adoption</span>
                    <div class="text-gray-800 bg-gray-50 p-3 rounded-lg mt-2">{{ selectedRequest.requestDetails.experience.reason }}</div>
                    </div>
                </div>

                <!-- Additional Information -->
                <div v-if="selectedRequest.requestDetails?.additionalInfo">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Additional Information</h3>
                    <div class="bg-gray-50 p-3 rounded-lg text-gray-800">{{ selectedRequest.requestDetails.additionalInfo }}</div>
                </div>
                </div>

                <!-- Response Section -->
                <div v-if="selectedRequest.status === 'PENDING'" class="mt-6">
                <label for="response-note" class="block text-sm font-medium text-gray-700 mb-1">Response Note (optional)</label>
                <textarea
                    id="response-note"
                    v-model="responseNote"
                    rows="3"
                    class="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Write a message for the applicant..."
                ></textarea>
                </div>

                <div v-else-if="selectedRequest.notes" class="mt-6">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Your Response</h3>
                <div class="bg-gray-50 p-3 rounded-md text-gray-800">{{ selectedRequest.notes }}</div>
                </div>

                <!-- Modal Actions -->
                <div class="mt-6 flex justify-end space-x-3">
                    <!-- For pending requests - option to approve -->
                    <button 
                        v-if="selectedRequest.status === 'PENDING'"
                        @click="processApproval"
                        class="px-4 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition"
                        title="This will mark the pet status as PENDING"
                    >
                        Approve Request
                    </button>
                    
                    <!-- For approved requests with pet in PENDING status - option to complete -->
                    <button 
                        v-if="selectedRequest.status === 'APPROVED' && selectedRequest.pet?.status === 'PENDING'"
                        @click="completeAdoptionProcess"
                        class="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
                        title="This will mark the pet as ADOPTED"
                    >
                        Complete Adoption
                    </button>
                    
                    <!-- For pending requests - option to reject -->
                    <button 
                        v-if="selectedRequest.status === 'PENDING'"
                        @click="processRejection"
                        class="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition"
                    >
                        Reject
                    </button>
                    
                    <!-- Close button -->
                    <button 
                        @click="selectedRequest = null"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                </div>
             </div>
          </div>
        </div>
       </Teleport>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { getShelterAdoptionRequests, updateAdoptionRequestStatus } from '@/services/adoption_service';
import { completeAdoption } from '@/services/adoption_service';

export default {
  name: 'ShelterAdoptionRequests',
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


    watch(dateSort, () => {
        sortRequests();
    });


    const sortRequests = () => {
    if (dateSort.value === 'newest') {
        requests.value.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    } else {
        requests.value.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
    }
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
            
            window.dispatchEvent(new Event('adoption-completed'));
            
            const index = requests.value.findIndex(r => r.id === selectedRequest.value.id);
            if (index !== -1) {
            requests.value[index].pet.status = 'ADOPTED';
            
            if (selectedRequest.value) {
                selectedRequest.value.pet.status = 'ADOPTED';
            }
            }
            
            alert('Adoption process completed successfully! The pet has been marked as adopted.');
            
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
              const response = await fetch(`http://localhost:8080/pet-photos/${request.pet.photoIds[0]}`);
              const photoData = await response.json();
              photoUrl = photoData.url;
            } catch (err) {
              console.warn('Could not fetch pet photo:', err);
            }
          }
          
          return {
            ...request,
            pet: request.pet ? {
              ...request.pet,
              photoUrl
            } : null
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
        const aPendingCount = a.requests.filter(r => r.status === 'PENDING').length;
        const bPendingCount = b.requests.filter(r => r.status === 'PENDING').length;
        return bPendingCount - aPendingCount;
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

        window.dispatchEvent(new Event('adoption-status-updated'));
        
        const index = requests.value.findIndex(r => r.id === selectedRequest.value.id);
        if (index !== -1) {
          requests.value[index].status = 'APPROVED';
          requests.value[index].notes = responseNote.value;
        }
        
        selectedRequest.value = null;
        
        alert('Adoption request approved successfully!');
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
        
        alert('Adoption request rejected.');
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
        return new Date(dateString).toLocaleDateString(undefined, options);
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



    return {
      requests,
      isLoading,
      selectedRequest,
      statusFilter,
      responseNote,
      error,
      groupedPetRequests,
      sortedGroupedPetRequests,
      completeAdoptionProcess,
      fetchRequests,
      viewRequestDetails,
      processApproval,
      processRejection,
      formatDate,
      formatAge
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


