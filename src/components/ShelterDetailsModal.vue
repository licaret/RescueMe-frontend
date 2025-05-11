<template>
    <div v-if="show" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Shelter Details
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Review details for {{ shelter?.username || 'this shelter' }} before making a decision.
                  </p>
                </div>
              </div>
            </div>
            
            <div v-if="isLoading" class="flex justify-center items-center py-10">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-700">Loading shelter details...</span>
            </div>
            
            <div v-else-if="shelter" class="mt-5 divide-y divide-gray-200">
              <!-- Basic Info Section -->
              <div class="py-4">
                <div class="flex items-center mb-4">
                  <img :src="shelter.profilePicture || defaultShelterImage" alt="Shelter profile" class="h-20 w-20 rounded-full object-cover mr-4">
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">{{ shelter.username }}</h4>
                    <p class="text-sm text-gray-500">{{ shelter.email }}</p>
                    <p class="text-sm text-gray-500">{{ shelter.phoneNumber }}</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Shelter Type</p>
                    <p class="mt-1">{{ shelter.shelterType }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Location</p>
                    <p class="mt-1">{{ shelter.fullAddress }}, {{ shelter.city }}, {{ shelter.county }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Year Founded</p>
                    <p class="mt-1">{{ shelter.yearFounded }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Hours of Operation</p>
                    <p class="mt-1">{{ shelter.hoursOfOperation }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Mission Section -->
              <div class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Mission Statement</h4>
                <p class="text-gray-700 whitespace-normal overflow-auto max-h-60 p-4 bg-gray-50 rounded-md">
                  {{ shelter.mission }}
                </p>
              </div>
              
              <!-- Documents Section -->
              <div class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Verification Documents</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(value, key) in shelter.documents" :key="key" class="bg-gray-50 p-3 rounded-md">
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="font-medium text-gray-700">{{ getDocumentTypeName(key) }}</p>
                        <p class="text-sm text-gray-500">
                          {{ value ? 'Document uploaded' : 'No document' }}
                        </p>
                      </div>
                      <div v-if="value">
                        <button 
                          @click="viewDocument(shelter.id, key)" 
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              v-if="shelter && shelter.status === 'PENDING_APPROVAL'"
              @click="onApprove(shelter.id)" 
              class="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Approve
            </button>
            <button 
              v-if="shelter && shelter.status === 'PENDING_APPROVAL'"
              @click="onReject(shelter.id)" 
              class="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Reject
            </button>
            <button 
              v-if="shelter && shelter.status === 'APPROVED'"
              @click="onSuspend(shelter.id)" 
              class="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Suspend
            </button>
            <button 
              @click="closeModal" 
              class="mt-3 w-full inline-flex justify-center rounded-3xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import blankProfilePicture from '@/assets/blank_profile_picture.jpg';
  
  export default {
    name: 'ShelterDetailsModal',
    
    props: {
      show: {
        type: Boolean,
        default: false
      },
      shelterId: {
        type: [Number, String],
        default: null
      },
      shelter: {
        type: Object,
        default: null
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    
    data() {
      return {
        defaultShelterImage: blankProfilePicture
      };
    },
    
    methods: {
      closeModal() {
        this.$emit('close');
      },
      
      onApprove(shelterId) {
        this.$emit('approve', shelterId);
      },
      
      onReject(shelterId) {
        this.$emit('reject', shelterId);
      },
      
      onSuspend(shelterId) {
        this.$emit('suspend', shelterId);
      },
      
      viewDocument(shelterId, documentType) {
        this.$emit('view-document', shelterId, documentType);
      },
      
      getDocumentTypeName(documentType) {
        const names = {
          'taxCertificate': 'Tax Registration Certificate',
          'vetAuthorization': 'Veterinary Sanitary Authorization',
          'vetContract': 'Veterinarian Collaboration Contract',
          'idCard': 'ID Card of Legal Representative'
        };
        
        return names[documentType] || documentType;
      }
    }
  };
  </script>