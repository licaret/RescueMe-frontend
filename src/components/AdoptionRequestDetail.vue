<template>
  <div class="bg-gray-50 min-h-screen pt-20">
    <Navbar />

    <div class="container mx-auto px-4 py-8 min-h-screen">

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 max-w-4xl mx-auto">
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
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-2xl text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
            class="group inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
          >
            <svg class="mr-2 -ml-1 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Requests
          </button>
        </div>
        
        <!-- Header Section -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 mb-6 transition-all duration-300 hover:shadow-md">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">Adoption Request</h1>
                <p class="text-gray-500 mt-1">Request ID: #{{ request.id ? request.id.substring(0, 8) : 'Unknown' }}</p>
              </div>
              
              <div>
                <span 
                  class="inline-flex px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': request.status === 'pending',
                    'bg-green-100 text-green-800': request.status === 'approved',
                    'bg-red-100 text-red-800': request.status === 'rejected',
                    'bg-gray-100 text-gray-800': request.status === 'canceled',
                    'bg-blue-100 text-blue-800': request.status === 'completed'
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
            <div v-if="request.notes" class="mt-4 p-4 bg-gray-50 rounded-2xl text-sm text-gray-700 border-l-4 border-emerald-400">
              <p class="font-medium mb-1 text-emerald-700">Shelter Response:</p>
              <p>{{ request.notes }}</p>
            </div>
            
            <!-- Actions for Pending Requests -->
            <div v-if="request.status === 'pending'" class="mt-6 flex">
              <button
                @click="cancelRequest"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Request
              </button>
            </div>
          </div>
        </div>
        
        <!-- Content Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pet Details -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
            <div class="bg-emerald-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.5a1 1 0 00-1 1v.5a1 1 0 001 1H9v1.5a1 1 0 001 1h.5a1 1 0 001-1V10h1.5a1 1 0 001-1v-.5a1 1 0 00-1-1H12v-.5a1 1 0 00-1-1V5z" clip-rule="evenodd" />
                </svg>
                Pet Information
              </h2>
            </div>
            
            <div class="p-6">
              <div class="flex items-start space-x-4">
                <!-- Pet Image -->
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    v-if="request.pet && request.pet.photos && request.pet.photos.length > 0"
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
                  <h3 class="text-lg font-semibold text-gray-800">{{ request.pet ? request.pet.name : 'Unknown Pet' }}</h3>
                  <p class="text-sm text-gray-500" v-if="request.pet">
                    {{ request.pet.species || 'Unknown' }} • {{ request.pet.breed || 'Mixed Breed' }}
                  </p>
                  
                  <div class="mt-4 grid grid-cols-2 gap-3 text-sm" v-if="request.pet">
                    <div>
                      <span class="text-gray-500">Age:</span>
                      <span class="ml-1 text-gray-800 font-medium">{{ formatAge(request.pet.age) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Sex:</span>
                      <span class="ml-1 text-gray-800 font-medium">{{ request.pet.sex || 'Unknown' }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Size:</span>
                      <span class="ml-1 text-gray-800 font-medium">{{ request.pet.size || 'Unknown' }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Status:</span>
                      <span 
                        class="ml-1 font-medium"
                        :class="{
                          'text-green-600': request.pet.status === 'AVAILABLE',
                          'text-yellow-600': request.pet.status === 'PENDING',
                          'text-emerald-600': request.pet.status === 'ADOPTED'
                        }"
                      >
                        {{ formatPetStatus(request.pet.status) || 'Unknown' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mt-4 text-sm" v-if="shelter">
                    <span class="text-gray-500">From:</span>
                    <span class="ml-1 text-gray-800 font-medium">{{ shelter.username }} - {{ shelter.city }}, {{ shelter.county }}</span>
                  </div>

                  
                  <!-- Buton View Pet Profile -->
                  <div class="mt-4" v-if="request.pet && request.pet.id">
                    <button
                      @click="openPetModal(request.pet)"
                      class="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                    >
                      View Pet Profile
                      <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
          
          <!-- Applicant Details -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
            <div class="bg-emerald-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                Applicant Information
              </h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-4" v-if="request.requestDetails && request.requestDetails.contactInfo">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-gray-800">{{ request.requestDetails.contactInfo.name }}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span class="text-gray-600">{{ request.requestDetails.contactInfo.email }}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span class="text-gray-600">{{ request.requestDetails.contactInfo.phone }}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="text-gray-600">{{ request.requestDetails.contactInfo.city }}, {{ request.requestDetails.contactInfo.county }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 flex items-center justify-center h-32">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No applicant information available
              </div>
            </div>
          </div>
        </div>
        
        <!-- Application Details -->
        <div class="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md" 
             v-if="request.requestDetails && (request.requestDetails.housing || request.requestDetails.household || request.requestDetails.experience)">
          <div class="bg-emerald-50 px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
              Application Details
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Housing Section -->
              <div class="space-y-4" v-if="request.requestDetails.housing">
                <h3 class="text-sm font-medium text-emerald-600 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Housing Situation
                </h3>
                
                <div class="bg-gray-50 p-3 rounded-2xl">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-xs text-gray-500">Housing Type</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium capitalize">{{ request.requestDetails.housing.type }}</div>
                    </div>
                    
                    <div>
                      <div class="text-xs text-gray-500">Home Ownership</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium capitalize">{{ request.requestDetails.housing.ownership }}</div>
                    </div>
                    
                    <div v-if="request.requestDetails.housing.ownership === 'rent'">
                      <div class="text-xs text-gray-500">Landlord Permission</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium capitalize">
                        {{ request.requestDetails.housing.landlordPermission === 'yes' ? 'Yes' : 
                           request.requestDetails.housing.landlordPermission === 'no' ? 'No' : 'Not sure' }}
                      </div>
                    </div>
                    
                    <div>
                      <div class="text-xs text-gray-500">Has Yard</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium capitalize">
                        {{ request.requestDetails.housing.hasYard === 'yes' ? 'Yes' : 'No' }}
                      </div>
                    </div>
                    
                    <div v-if="request.requestDetails.housing.hasYard === 'yes'">
                      <div class="text-xs text-gray-500">Fenced Yard</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium capitalize">
                        {{ request.requestDetails.housing.fencedYard === 'yes' ? 'Yes, completely' : 
                           request.requestDetails.housing.fencedYard === 'partial' ? 'Yes, partially' : 'No' }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Household Section -->
                <h3 class="text-sm font-medium text-emerald-600 mt-6 mb-2 flex items-center" v-if="request.requestDetails.household">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Household Information
                </h3>
                
                <div class="bg-gray-50 p-3 rounded-2xl" v-if="request.requestDetails.household">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-xs text-gray-500">Household Members</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium">{{ request.requestDetails.household.members }} person(s)</div>
                    </div>
                    
                    <div v-if="request.requestDetails.household.children">
                      <div class="text-xs text-gray-500">Children in Home</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium">
                        {{ request.requestDetails.household.children.has === 'yes' ? 'Yes' : 'No' }}
                      </div>
                    </div>
                    
                    <div v-if="request.requestDetails.household.children && request.requestDetails.household.children.has === 'yes'">
                      <div class="text-xs text-gray-500">Children's Ages</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium">{{ request.requestDetails.household.children.ages }}</div>
                    </div>
                    
                    <div v-if="request.requestDetails.household.otherPets">
                      <div class="text-xs text-gray-500">Other Pets</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium">
                        {{ request.requestDetails.household.otherPets.has === 'yes' ? 'Yes' : 'No' }}
                      </div>
                    </div>
                    
                    <div v-if="request.requestDetails.household.otherPets && request.requestDetails.household.otherPets.has === 'yes'" class="col-span-2">
                      <div class="text-xs text-gray-500">Current Pets</div>
                      <div class="mt-1 text-sm text-gray-800">{{ request.requestDetails.household.otherPets.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Experience Section -->
              <div class="space-y-4" v-if="request.requestDetails.experience">
                <h3 class="text-sm font-medium text-emerald-600 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                  </svg>
                  Pet Experience & Expectations
                </h3>
                
                <div class="bg-gray-50 p-3 rounded-2xl">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-xs text-gray-500">Pet Experience</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium">
                        {{ request.requestDetails.experience.level === 'first' ? 'First-time pet owner' : 
                           request.requestDetails.experience.level === 'some' ? 'Some experience with pets' :
                           request.requestDetails.experience.level === 'experienced' ? 'Experienced pet owner' :
                           'Professional experience' }}
                      </div>
                    </div>
                    
                    <div>
                      <div class="text-xs text-gray-500">Activity Level</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium capitalize">{{ request.requestDetails.experience.activityLevel }}</div>
                    </div>
                    
                    <div>
                      <div class="text-xs text-gray-500">Time Pet Will Be Alone</div>
                      <div class="mt-1 text-sm text-gray-800 font-medium">{{ request.requestDetails.experience.timeAlone }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 p-4 border border-emerald-100 rounded-2xl bg-emerald-50">
                  <h3 class="text-sm font-medium text-emerald-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    Reason for Adoption
                  </h3>
                  
                  <div class="text-sm text-gray-800 leading-relaxed">{{ request.requestDetails.experience.reason }}</div>
                </div>
                
                <div class="mt-4 p-4 border border-gray-200 rounded-2xl bg-gray-50" v-if="request.requestDetails.additionalInfo">
                  <h3 class="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    Additional Information
                  </h3>
                  
                  <div class="text-sm text-gray-700 leading-relaxed">{{ request.requestDetails.additionalInfo }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <PetDetailsModal
        v-if="isExpanded"
        :pet="pet"
        :isFavorite="false"
        :hasExistingRequest="true"
        @close="isExpanded = false"
      />
    </Teleport>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAdoptionRequestById, cancelAdoptionRequest } from '../services/adoption_service';
import { getShelterByPetId } from '@/services/user_service';
import { getPetPhotosFromIds } from '@/services/pet_service';
import Navbar from '@/components/Navbar.vue';
import PetDetailsModal from '@/components/PetDetailsModal.vue';

export default {
  name: 'AdoptionRequestDetail',

  components: {
    Navbar,
    PetDetailsModal
  },
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const requestId = route.params.id;
    
    const request = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const isExpanded = ref(false);
    const pet = ref({});
    const currentIndex = ref(0);

    const shelter = ref(null);


    const fetchShelterByPetId = async (petId) => {
      try {
        shelter.value = await getShelterByPetId(petId);
        console.log('Fetched shelter:', shelter.value);
      } catch (err) {
        console.error('Error fetching shelter:', err);
      }
    };


    const openPetModal = async () => {
      pet.value = { ...request.value.pet };
      isExpanded.value = true;
    };


    const formatShelterTime = (time) => {
      if (!time) return 'New arrival';
      
      const shelterTimeInMonths = parseInt(time);
      if (shelterTimeInMonths >= 12) {
        const years = Math.floor(shelterTimeInMonths / 12);
        return `${years} ${years === 1 ? 'year' : 'years'} in shelter`;
      } else {
        return `${shelterTimeInMonths} ${shelterTimeInMonths === 1 ? 'month' : 'months'} in shelter`;
      }
    };

    
    const fetchRequestDetails = async () => {
      if (!requestId) {
        error.value = 'Invalid request ID';
        loading.value = false;
        return;
      }
      
      loading.value = true;
      error.value = null;
      
      try {
        console.log('Fetching adoption request with ID:', requestId);
        const data = await getAdoptionRequestById(requestId);
        console.log('Received adoption request data:', data);
        request.value = data;

        if (request.value.pet?.photoIds?.length) {
          request.value.pet.photos = await getPetPhotosFromIds(request.value.pet.photoIds);
        }

        if (data && data.pet && data.pet.id) {
          shelter.value = await getShelterByPetId(data.pet.id);
        }

        if (!data) {
          error.value = 'Unable to load request data. The request may not exist or you may not have permission to view it.';
        }
      } catch (err) {
        console.error('Error fetching adoption request:', err);
        error.value = 'Failed to load adoption request details. Please try again.';
      } finally {
        loading.value = false;
      }
    };


    const formatStatus = (status) => {
      if (!status) return 'Unknown';
      
      switch (status.toLowerCase()) {
        case 'pending':
          return 'Pending Review';
        case 'approved':
          return 'Approved';
        case 'rejected':
          return 'Declined';
        case 'canceled':
          return 'Canceled';
        case 'completed':
          return 'Completed';
        default:
          return status.charAt(0).toUpperCase() + status.slice(1);
      }
    };



    const formatPetStatus = (status) => {
      if (!status) return 'Unknown';
      
      switch (status.toUpperCase()) {
        case 'AVAILABLE':
          return 'Available';
        case 'ADOPTED':
          return 'Adopted';
        case 'PENDING':
          return 'Pending Adoption';
        default:
          return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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

    
    const cancelRequest = async () => {
      if (!confirm('Are you sure you want to cancel this adoption request? This action cannot be undone.')) {
        return;
      }
      
      try {
        await cancelAdoptionRequest(requestId);
        request.value.status = 'canceled';
      } catch (err) {
        console.error('Error canceling adoption request:', err);
      }
    };

    const goBack = () => {
      router.push('/my-adoption-requests');
    };


    onMounted(fetchRequestDetails);
    

    return {
      request,
      loading,
      error,
      shelter,
      isExpanded,
      currentIndex,
      pet,
      
      formatStatus,
      formatPetStatus,
      formatDate,
      formatAge,
      goBack,
      cancelRequest,
      fetchRequestDetails,
      openPetModal,
      formatShelterTime,
      fetchShelterByPetId
    };
  }
}
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}
</style>