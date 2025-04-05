<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Adoption Request</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
            <div class="mt-4">
              <button
                type="button"
                @click="fetchRequestDetails"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Adoption Request Detail -->
      <div v-else-if="request" class="max-w-4xl mx-auto">
        <!-- Back button -->
        <div class="mb-6">
          <button
            @click="goBack"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="mr-2 -ml-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Requests
          </button>
        </div>
        
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">Adoption Request</h1>
                <p class="text-gray-500 mt-1">Request ID: #{{ request.id.substring(0, 8) }}</p>
              </div>
              
              <div>
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': request.status === 'pending',
                    'bg-green-100 text-green-800': request.status === 'approved',
                    'bg-red-100 text-red-800': request.status === 'rejected',
                    'bg-gray-100 text-gray-800': request.status === 'canceled'
                  }"
                >
                  {{ formatStatus(request.status) }}
                </span>
              </div>
            </div>
            
            <div class="mt-4 flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Submitted on {{ formatDate(request.requestDate) }}
            </div>
            
            <!-- Shelter Notes (if any) -->
            <div v-if="request.notes" class="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
              <p class="font-medium mb-1">Shelter Response:</p>
              <p>{{ request.notes }}</p>
            </div>
            
            <!-- Actions for Pending Requests -->
            <div v-if="request.status === 'pending'" class="mt-4 flex">
              <button
                @click="cancelRequest"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
        
        <!-- Content Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pet Details -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-800">Pet Information</h2>
            </div>
            
            <div class="p-6">
              <div class="flex items-start space-x-4">
                <!-- Pet Image -->
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    v-if="request.pet.photos && request.pet.photos.length > 0"
                    :src="request.pet.photos[0]?.url"
                    alt="Pet Photo"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Pet Details -->
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-800">{{ request.pet.name }}</h3>
                  <p class="text-sm text-gray-500">{{ request.pet.species }} • {{ request.pet.breed || 'Mixed Breed' }}</p>
                  
                  <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-500">Age:</span>
                      <span class="ml-1 text-gray-800">{{ formatAge(request.pet.age) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Sex:</span>
                      <span class="ml-1 text-gray-800">{{ request.pet.sex }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Size:</span>
                      <span class="ml-1 text-gray-800">{{ request.pet.size }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Status:</span>
                      <span class="ml-1 text-gray-800">{{ request.pet.status }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm">
                    <span class="text-gray-500">From:</span>
                    <span class="ml-1 text-gray-800">{{ request.pet.shelterUsername || 'Animal Shelter' }}</span>
                  </div>
                  
                  <div class="mt-4">
                    <router-link
                      :to="`/pets/${request.pet.id}`"
                      class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View Pet Profile
                      <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Applicant Details -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-800">Applicant Information</h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div class="mt-2 text-sm">
                    <p class="text-gray-800">{{ request.requestDetails.contactInfo.name }}</p>
                    <p class="text-gray-600">{{ request.requestDetails.contactInfo.email }}</p>
                    <p class="text-gray-600">{{ request.requestDetails.contactInfo.phone }}</p>
                    <p class="text-gray-600">{{ request.requestDetails.contactInfo.city }}, {{ request.requestDetails.contactInfo.county }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Application Details -->
        <div class="mt-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-800">Application Details</h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Housing Section -->
              <div class="space-y-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Housing Situation</h3>
                
                <div>
                  <div class="text-sm text-gray-500">Housing Type</div>
                  <div class="mt-1 text-sm text-gray-800 capitalize">{{ request.requestDetails.housing.type }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500">Home Ownership</div>
                  <div class="mt-1 text-sm text-gray-800 capitalize">{{ request.requestDetails.housing.ownership }}</div>
                </div>
                
                <div v-if="request.requestDetails.housing.ownership === 'rent'">
                  <div class="text-sm text-gray-500">Landlord Permission</div>
                  <div class="mt-1 text-sm text-gray-800 capitalize">{{ request.requestDetails.housing.landlordPermission === 'yes' ? 'Yes' : request.requestDetails.housing.landlordPermission === 'no' ? 'No' : 'Not sure' }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500">Has Yard</div>
                  <div class="mt-1 text-sm text-gray-800 capitalize">{{ request.requestDetails.housing.hasYard === 'yes' ? 'Yes' : 'No' }}</div>
                </div>
                
                <div v-if="request.requestDetails.housing.hasYard === 'yes'">
                  <div class="text-sm text-gray-500">Fenced Yard</div>
                  <div class="mt-1 text-sm text-gray-800 capitalize">
                    {{ request.requestDetails.housing.fencedYard === 'yes' ? 'Yes, completely' : 
                       request.requestDetails.housing.fencedYard === 'partial' ? 'Yes, partially' : 'No' }}
                  </div>
                </div>
                
                <!-- Household Section -->
                <h3 class="text-sm font-medium text-gray-500 mt-6 mb-2">Household Information</h3>
                
                <div>
                  <div class="text-sm text-gray-500">Household Members</div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.household.members }} person(s)</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500">Children in Home</div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.household.children.has === 'yes' ? 'Yes' : 'No' }}</div>
                </div>
                
                <div v-if="request.requestDetails.household.children.has === 'yes'">
                  <div class="text-sm text-gray-500">Children's Ages</div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.household.children.ages }}</div>
                </div>
              </div>
              
              <!-- Experience Section -->
              <div class="space-y-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Pet Experience & Expectations</h3>
                
                <div>
                  <div class="text-sm text-gray-500">Pet Experience</div>
                  <div class="mt-1 text-sm text-gray-800">
                    {{ request.requestDetails.experience.level === 'first' ? 'First-time pet owner' : 
                       request.requestDetails.experience.level === 'some' ? 'Some experience with pets' :
                       request.requestDetails.experience.level === 'experienced' ? 'Experienced pet owner' :
                       'Professional experience' }}
                  </div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500">Activity Level</div>
                  <div class="mt-1 text-sm text-gray-800 capitalize">{{ request.requestDetails.experience.activityLevel }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500">Time Pet Will Be Alone</div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.experience.timeAlone }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500">Other Pets</div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.household.otherPets.has === 'yes' ? 'Yes' : 'No' }}</div>
                </div>
                
                <div v-if="request.requestDetails.household.otherPets.has === 'yes'">
                  <div class="text-sm text-gray-500">Current Pets</div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.household.otherPets.description }}</div>
                </div>
                
                <h3 class="text-sm font-medium text-gray-500 mt-6 mb-2">Reason for Adoption</h3>
                
                <div>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.experience.reason }}</div>
                </div>
                
                <div v-if="request.requestDetails.additionalInfo">
                  <h3 class="text-sm font-medium text-gray-500 mt-6 mb-2">Additional Information</h3>
                  <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.additionalInfo }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getAdoptionRequestById, cancelAdoptionRequest } from '../services/adoption_service';
  
  export default {
    name: 'AdoptionRequestDetail',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const requestId = route.params.id;
      
      const request = ref(null);
      const loading = ref(true);
      const error = ref(null);
      
      // Fetch the adoption request details
      const fetchRequestDetails = async () => {
        if (!requestId) {
          error.value = 'Invalid request ID';
          loading.value = false;
          return;
        }
        
        loading.value = true;
        error.value = null;
        
        try {
          const data = await getAdoptionRequestById(requestId);
          request.value = data;
        } catch (err) {
          console.error('Error fetching adoption request:', err);
          error.value = 'Failed to load adoption request details. Please try again.';
        } finally {
          loading.value = false;
        }
      };
      
      // Format request status for display
      const formatStatus = (status) => {
        switch (status) {
          case 'pending':
            return 'Pending Review';
          case 'approved':
            return 'Approved';
          case 'rejected':
            return 'Declined';
          case 'canceled':
            return 'Canceled';
          default:
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
      };
      
      // Format date for display
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      
      // Format pet age for display
      const formatAge = (age) => {
        if (!age && age !== 0) return 'Unknown';
        
        const ageInMonths = Math.round(age * 12);
        if (ageInMonths >= 12) {
          return `${Math.floor(age)} ${Math.floor(age) === 1 ? 'year' : 'years'}`;
        } else {
          return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
        }
      };
      
      // Navigate back
      const goBack = () => {
        router.push('/adoption-requests');
      };
      
      // Cancel the adoption request
      const cancelRequest = async () => {
        if (!confirm('Are you sure you want to cancel this adoption request? This action cannot be undone.')) {
          return;
        }
        
        try {
          await cancelAdoptionRequest(requestId);
          // Update the request status locally
          request.value.status = 'canceled';
        } catch (err) {
          console.error('Error canceling adoption request:', err);
          alert('Failed to cancel the adoption request. Please try again.');
        }
      };
      
      onMounted(fetchRequestDetails);
      
      return {
        request,
        loading,
        error,
        formatStatus,
        formatDate,
        formatAge,
        goBack,
        cancelRequest,
        fetchRequestDetails
      };
    }
  };
  </script>