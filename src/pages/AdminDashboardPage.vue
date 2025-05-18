<template>
    <div class="min-h-screen bg-gray-100">

      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <h1 class="text-3xl font-bold text-gray-900">RescueMe Admin Dashboard</h1>
            </div>
            <div class="flex items-center">
              <button 
                @click="confirmLogout" 
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-2xl">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.pendingApprovals }}</dd>
              </dl>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-2xl">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Approved Shelters</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ approvedShelters.length }}</dd>
              </dl>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-2xl">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users / Adopters</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalUsers }}</dd>
              </dl>
            </div>
          </div>
          <div class="bg-white overflow-hidden shadow rounded-2xl">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Animals</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.totalAnimals }}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <!-- Navigation Tabs -->
        <div class="mb-6 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="activeTab = 'pending'" 
              :class="[
                activeTab === 'pending' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Pending Approval ({{ pendingShelters.length }})
            </button>
            <button 
              @click="activeTab = 'approved'" 
              :class="[
                activeTab === 'approved' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Approved Shelters
            </button>
            <button 
              @click="activeTab = 'users'" 
              :class="[
                activeTab === 'users' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              User Management
            </button>
          </nav>
        </div>
        
        <!-- Toast Notifications -->
        <div v-if="showToast" class="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 max-w-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm">{{ toastMessage }}</p>
            </div>
            <div class="ml-auto pl-3">
              <div class="-mx-1.5 -my-1.5">
                <button @click="showToast = false" class="inline-flex text-green-500 hover:text-green-600">
                  <span class="sr-only">Dismiss</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pending Shelters Tab -->
        <div v-if="activeTab === 'pending'">
        <div class="bg-white shadow overflow-hidden sm:rounded-2xl">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Shelters Pending Approval
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Review and approve shelter account applications.
              </p>
            </div>
            <div>
              <button 
                @click="sortPendingShelters()" 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50"
              >
                Sort Newest First
              </button>
              <button 
                @click="sortPendingShelters(true)" 
                class="ml-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50"
              >
                Sort Oldest First
              </button>
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-center items-center py-10">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700">Loading applications...</span>
          </div>
          
          <div v-else-if="pendingShelters.length === 0" class="py-10 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No pending applications</h3>
            <p class="mt-1 text-sm text-gray-500">All shelter applications have been processed.</p>
          </div>
          
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="shelter in paginatedPendingShelters" :key="shelter.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img :src="shelter.profilePicture || defaultShelterImage" alt="Shelter profile" class="h-12 w-12 rounded-full object-cover mr-4">
                  <div>
                    <p class="text-sm font-medium text-red-600 truncate">{{ shelter.username }}</p>
                    <p class="text-sm text-gray-500">
                      {{ shelter.email }} · 
                      <span class="text-xs text-gray-400">
                        Submitted {{ formatRelativeTime(shelter.createdAt) }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="viewShelterDetails(shelter.id)" 
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button 
                    @click="approveShelter(shelter.id)" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    @click="rejectShelter(shelter.id)" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div class="mt-2">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ shelter.city }}, {{ shelter.county }}</span>
                </div>
                <div class="mt-1 flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <span>{{ shelter.shelterType }}</span>
                </div>
              </div>
            </li>
          </ul>
          
          <!-- Pagination for Pending Shelters -->
          <div v-if="pendingShelters.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                @click="pendingCurrentPage > 1 && pendingCurrentPage--" 
                :disabled="pendingCurrentPage === 1" 
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button 
                @click="pendingCurrentPage < pendingTotalPages && pendingCurrentPage++" 
                :disabled="pendingCurrentPage === pendingTotalPages" 
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing 
                  <span class="font-medium">{{ (pendingCurrentPage - 1) * pendingItemsPerPage + 1 }}</span> 
                  to 
                  <span class="font-medium">{{ Math.min(pendingCurrentPage * pendingItemsPerPage, pendingShelters.length) }}</span> 
                  of 
                  <span class="font-medium">{{ pendingShelters.length }}</span> 
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    @click="pendingCurrentPage > 1 && pendingCurrentPage--" 
                    :disabled="pendingCurrentPage === 1" 
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    v-for="page in pendingPaginationPages" 
                    :key="page" 
                    @click="pendingCurrentPage = page" 
                    :class="[
                      page === pendingCurrentPage ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button 
                    @click="pendingCurrentPage < pendingTotalPages && pendingCurrentPage++" 
                    :disabled="pendingCurrentPage === pendingTotalPages" 
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
        
        <!-- Approved Shelters Tab -->
        <div v-if="activeTab === 'approved'">
          <div class="bg-white shadow overflow-hidden sm:rounded-2xl">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Approved Shelters
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage your approved shelter accounts.
                </p>
              </div>
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Search shelters..." 
                  class="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div v-if="isLoading" class="flex justify-center items-center py-10">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-700">Loading shelters...</span>
            </div>
            
            <div v-else-if="filteredApprovedShelters.length === 0" class="py-10 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No approved shelters found</h3>
              <p class="mt-1 text-sm text-gray-500">Try adjusting your search or approve new shelters.</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shelter
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Animals
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="shelter in filteredApprovedShelters" :key="shelter.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img :src="shelter.profilePicture || defaultShelterImage" alt="" class="h-10 w-10 rounded-full object-cover">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ shelter.username }}</div>
                          <div class="text-sm text-gray-500">{{ shelter.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ shelter.shelterType }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ shelter.city }}, {{ shelter.county }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ shelter.animalCount || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(shelter.approvedAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="viewShelterDetails(shelter.id)" 
                        class="text-red-600 hover:text-red-900 mr-3"
                      >
                        View
                      </button>
                      <button 
                        @click="suspendShelter(shelter.id)" 
                        class="text-gray-600 hover:text-gray-900"
                      >
                        Suspend
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
                <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, approvedShelters.length) }}</span> of <span class="font-medium">{{ approvedShelters.length }}</span> results
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="sr-only">Previous</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      v-for="page in paginationPages" 
                      :key="page" 
                      @click="currentPage = page" 
                      :class="[
                        page === currentPage ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
        
        <!-- User Management Tab -->
        <div v-if="activeTab === 'users'">
          <div class="bg-white shadow overflow-hidden sm:rounded-2xl">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                User Management
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Manage all users of the RescueMe platform.
              </p>
            </div>
            
            <div class="px-4 py-4 sm:px-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
              <div class="relative w-full md:w-64">
                <input 
                  v-model="userSearchQuery" 
                  type="text" 
                  placeholder="Search users..." 
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="flex space-x-4">
                <select v-model="userRole" class="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                  <option value="">All Roles</option>
                  <option value="USER">Regular Users</option>
                  <option value="SHELTER">Shelters</option>
                  <option value="ADMIN">Admins</option>
                </select>
                <select v-model="userStatus" class="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
            </div>
            
            <div v-if="isLoadingUsers" class="flex justify-center items-center py-10">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-700">Loading users...</span>
          </div>
          
          <div v-else-if="filteredUsers.length === 0" class="py-10 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img :src="user.profilePicture || defaultUserImage" alt="" class="h-10 w-10 rounded-full object-cover">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'SHELTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="viewUserDetails(user.id)" 
                      class="text-red-600 hover:text-red-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      v-if="user.status === 'ACTIVE'"
                      @click="suspendUser(user.id)" 
                      class="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Suspend
                    </button>
                    <button 
                      v-if="user.status === 'SUSPENDED'"
                      @click="activateUser(user.id)" 
                      class="text-green-600 hover:text-green-900 mr-3"
                    >
                      Activate
                    </button>
                    <button 
                      v-if="user.role !== 'ADMIN'"
                      @click="deleteUser(user.id)" 
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- User Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="userPage > 1 && userPage--" :disabled="userPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button @click="userPage < userTotalPages && userPage++" :disabled="userPage === userTotalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">{{ (userPage - 1) * userItemsPerPage + 1 }}</span> to <span class="font-medium">{{ Math.min(userPage * userItemsPerPage, filteredUsers.length) }}</span> of <span class="font-medium">{{ filteredUsers.length }}</span> users
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button @click="userPage > 1 && userPage--" :disabled="userPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    v-for="page in userPaginationPages" 
                    :key="page" 
                    @click="userPage = page" 
                    :class="[
                      page === userPage ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button @click="userPage < userTotalPages && userPage++" :disabled="userPage === userTotalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
      
      
    </main>
    
    <!-- Shelter Details Modal -->
    <ShelterDetailsModal
      :show="showShelterModal"
      :shelter="selectedShelter"
      :isLoading="isLoadingShelterDetails"
      @close="showShelterModal = false"
      @approve="approveShelter($event, true)"
      @reject="rejectShelter($event, true)"
      @suspend="suspendShelter($event, true)"
      @view-document="viewShelterDocument"
    />
    
    <!-- User Details Modal -->
    <div v-if="showUserModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showUserModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  User Details
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    View user information and activity.
                  </p>
                </div>
              </div>
            </div>
            
            <div v-if="isLoadingUserDetails" class="flex justify-center items-center py-10">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-700">Loading user details...</span>
            </div>
            
            <div v-else-if="selectedUser" class="mt-5 divide-y divide-gray-200">
              <!-- Basic Info Section -->
              <div class="py-4">
                <div class="flex items-center mb-4">
                  <img :src="selectedUser.profilePicture || defaultUserImage" alt="User profile" class="h-20 w-20 rounded-full object-cover mr-4">
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">{{ selectedUser.username }}</h4>
                    <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
                    <div class="mt-1">
                      <span :class="[
                        selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                        selectedUser.role === 'SHELTER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                      ]">
                        {{ selectedUser.role }}
                      </span>
                      <span :class="[
                        selectedUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        selectedUser.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800',
                        'px-2 ml-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                      ]">
                        {{ selectedUser.status }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Full Name</p>
                    <p class="mt-1">{{ selectedUser.firstName || 'N/A' }} {{ selectedUser.lastName || '' }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Phone Number</p>
                    <p class="mt-1">{{ selectedUser.phoneNumber || 'Not provided' }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Registration Date</p>
                    <p class="mt-1">{{ formatDate(selectedUser.createdAt) }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Last Login</p>
                    <p class="mt-1">{{ formatDate(selectedUser.lastLogin) || 'Never' }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Activity Section -->
              <div class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">User Activity</h4>
                <div class="space-y-2">
                  <div v-if="selectedUser.activities && selectedUser.activities.length">
                    <ul class="space-y-3">
                      <li v-for="(activity, index) in selectedUser.activities.slice(0, 5)" :key="index" class="bg-gray-50 p-3 rounded-md">
                        <div class="flex items-start">
                          <div class="flex-shrink-0 mt-0.5">
                            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div class="ml-3">
                            <p class="text-sm text-gray-700">{{ activity.description }}</p>
                            <p class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div v-if="selectedUser.activities.length > 5" class="mt-3 text-center">
                      <button class="text-sm text-blue-600 hover:text-blue-800">View All Activity</button>
                    </div>
                  </div>
                  <div v-else class="text-center py-4 text-gray-500">
                    No activity recorded for this user.
                  </div>
                </div>
              </div>
              
              <!-- Notes Section -->
              <div class="py-4">
                <h4 class="text-lg font-medium text-gray-900 mb-2">Admin Notes</h4>
                <textarea 
                  v-model="userNotes" 
                  rows="3" 
                  class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Add notes about this user..."
                ></textarea>
                <div class="mt-2 flex justify-end">
                  <button 
                    @click="saveUserNotes" 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              v-if="selectedUser && selectedUser.status === 'ACTIVE'"
              @click="suspendUser(selectedUser.id, true)" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Suspend
            </button>
            <button 
              v-if="selectedUser && selectedUser.status === 'SUSPENDED'"
              @click="activateUser(selectedUser.id, true)" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Activate
            </button>
            <button 
              v-if="selectedUser && selectedUser.role !== 'ADMIN'"
              @click="deleteUser(selectedUser.id, true)" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button 
              @click="showUserModal = false" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showConfirmationModal = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ confirmationTitle }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ confirmationMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmAction" 
              :class="[
                confirmationActionType === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                confirmationActionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' :
                'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              ]"
              class="w-full inline-flex justify-center rounded-2xl border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ confirmationActionText }}
            </button>
            <button 
              @click="showConfirmationModal = false" 
              class="mt-3 w-full inline-flex justify-center rounded-2xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <div v-if="isSubmitted" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Success!
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ successMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="isSubmitted = false" 
              class="w-full inline-flex justify-center rounded-2xl border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <LogoutConfirmationModal
      :show="showLogoutConfirmation"
      @close="showLogoutConfirmation = false"
      @confirm="performLogout"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted, watch} from 'vue';
import { useRouter } from 'vue-router';
import {
  getTotalShelterCount, 
  getPendingShelterCount, 
  getTotalUserCount, 
  getTotalAnimalCount, 
  getPendingShelters, 
  getApprovedShelters, 
  approveShelter,
  rejectShelter,
  suspendShelter,
  getShelterDetails
} from '@/services/admin_dashboard_service.js';
import { logout } from '@/services/user_service.js';
import { getDocumentViewUrl } from '@/services/shelter_profile_service.js';
import { getPetCountByShelter } from '@/services/pet_service.js';
import blankProfilePicture from '@/assets/blank_profile_picture.jpg';
import ShelterDetailsModal from '@/components/ShelterDetailsModal.vue';
import LogoutConfirmationModal from '@/components/LogoutConfirmationModal.vue';


export default {
  name: 'AdminDashboard',
  components: {
    ShelterDetailsModal,
    LogoutConfirmationModal
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('pending');
    const isLoading = ref(true);
    const isLoadingUsers = ref(false);
    const isLoadingShelterDetails = ref(false);
    const isLoadingUserDetails = ref(false);
    const adminName = ref('Admin User');
    const showToast = ref(false);
    const toastMessage = ref('');
    const isSubmitted = ref(false);
    const successMessage = ref('');
    const defaultShelterImage = ref(blankProfilePicture);
    const defaultUserImage = ref(blankProfilePicture);
    const showLogoutConfirmation = ref(false);
    
    const stats = ref({
      totalShelters: 0,
      pendingApprovals: 0,
      totalUsers: 0,
      totalAnimals: 0
    });
    
    const pendingShelters = ref([]);
    const approvedShelters = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    const users = ref([]);
    const userSearchQuery = ref('');
    const userRole = ref('');
    const userStatus = ref('');
    const userPage = ref(1);
    const userItemsPerPage = 10;
    
    const showShelterModal = ref(false);
    const showUserModal = ref(false);
    const showConfirmationModal = ref(false);
    const selectedShelter = ref(null);
    const selectedUser = ref(null);
    const userNotes = ref('');

    const pendingCurrentPage = ref(1);
    const pendingItemsPerPage = 10; 
    
    const confirmationTitle = ref('');
    const confirmationMessage = ref('');
    const confirmationActionType = ref('');
    const confirmationActionText = ref('');
    const confirmationCallback = ref(null);
    
    const reportStartDate = ref('');
    const reportEndDate = ref('');
    const reportStats = ref({
      newUsers: 0,
      userGrowthRate: 0,
      newShelters: 0,
      shelterGrowthRate: 0,
      newAnimals: 0,
      animalGrowthRate: 0,
      adoptions: 0,
      adoptionGrowthRate: 0,
      visits: 0,
      visitGrowthRate: 0,
      avgSessionDuration: 0,
      sessionDurationChange: 0
    });

    const confirmLogout = () => {
      showLogoutConfirmation.value = true;
    };
    
    const performLogout = async () => {
      try {
        showLogoutConfirmation.value = false;
        await logout();
      } catch (error) {
        console.error("Error during logout:", error);
        localStorage.clear();
        router.push("/");
      }
    };
    
    const sortPendingShelters = (ascending = false) => {
      pendingShelters.value.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return ascending 
          ? dateA - dateB  
          : dateB - dateA; 
      });
    };

    const formatRelativeTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      const units = [
        { name: 'year', seconds: 31536000 },
        { name: 'month', seconds: 2592000 },
        { name: 'week', seconds: 604800 },
        { name: 'day', seconds: 86400 },
        { name: 'hour', seconds: 3600 },
        { name: 'minute', seconds: 60 },
        { name: 'second', seconds: 1 }
      ];

      for (let unit of units) {
        const interval = Math.floor(diffInSeconds / unit.seconds);
        if (interval >= 1) {
          return interval === 1 
            ? `1 ${unit.name} ago` 
            : `${interval} ${unit.name}s ago`;
        }
      }

      return 'just now';
    };

    
    const filteredApprovedShelters = computed(() => {
      if (!searchQuery.value) return approvedShelters.value;
      
      const query = searchQuery.value.toLowerCase();
      return approvedShelters.value.filter(shelter => 
        shelter.username.toLowerCase().includes(query) || 
        shelter.email.toLowerCase().includes(query) ||
        shelter.city.toLowerCase().includes(query) ||
        shelter.county.toLowerCase().includes(query) ||
        shelter.shelterType.toLowerCase().includes(query)
      );
    });

    
    const paginatedShelters = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredApprovedShelters.value.slice(start, end);
    });


    const paginatedPendingShelters = computed(() => {
      const start = (pendingCurrentPage.value - 1) * pendingItemsPerPage;
      const end = start + pendingItemsPerPage;
      return pendingShelters.value.slice(start, end);
    });


    const pendingTotalPages = computed(() => {
      return Math.ceil(pendingShelters.value.length / pendingItemsPerPage);
    });


    const pendingPaginationPages = computed(() => {
      const pages = [];
      const maxPages = 5;
      const halfMax = Math.floor(maxPages / 2);
      
      let startPage = Math.max(1, pendingCurrentPage.value - halfMax);
      let endPage = Math.min(pendingTotalPages.value, startPage + maxPages - 1);
      
      if (endPage - startPage + 1 < maxPages && startPage > 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    });

    
    const totalPages = computed(() => {
      return Math.ceil(filteredApprovedShelters.value.length / itemsPerPage);
    });


    const paginationPages = computed(() => {
      const pages = [];
      const maxPages = 5;
      const halfMax = Math.floor(maxPages / 2);
      
      let startPage = Math.max(1, currentPage.value - halfMax);
      let endPage = Math.min(totalPages.value, startPage + maxPages - 1);
      
      if (endPage - startPage + 1 < maxPages && startPage > 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    });

  
    const filteredUsers = computed(() => {
      let result = users.value;
      
      if (userSearchQuery.value) {
        const query = userSearchQuery.value.toLowerCase();
        result = result.filter(user => 
          user.username.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query) ||
          (user.firstName && user.firstName.toLowerCase().includes(query)) ||
          (user.lastName && user.lastName.toLowerCase().includes(query))
        );
      }
      
      if (userRole.value) {
        result = result.filter(user => user.role === userRole.value);
      }
      
      if (userStatus.value) {
        result = result.filter(user => user.status === userStatus.value);
      }
      
      return result;
    });


    const paginatedUsers = computed(() => {
      const start = (userPage.value - 1) * userItemsPerPage;
      const end = start + userItemsPerPage;
      return filteredUsers.value.slice(start, end);
    });


    const userTotalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / userItemsPerPage);
    });


    const userPaginationPages = computed(() => {
      const pages = [];
      const maxPages = 5;
      const halfMax = Math.floor(maxPages / 2);
      
      let startPage = Math.max(1, userPage.value - halfMax);
      let endPage = Math.min(userTotalPages.value, startPage + maxPages - 1);
      
      if (endPage - startPage + 1 < maxPages && startPage > 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    });


    const viewShelterDocument = (Id, documentType) => {
      const documentUrl = getDocumentViewUrl(Id, documentType);
      window.open(documentUrl, '_blank');
    };


    const fetchDashboardData = async () => {
        try {
            isLoading.value = true;
            
            const totalShelters = await getTotalShelterCount();
            const pendingApprovals = await getPendingShelterCount();
            const totalUsers = await getTotalUserCount();
            const totalAnimals = await getTotalAnimalCount();
            
            stats.value.totalShelters = totalShelters;
            stats.value.pendingApprovals = pendingApprovals;
            stats.value.totalUsers = totalUsers;
            stats.value.totalAnimals = totalAnimals;
            
            const pendingSheltersData = await getPendingShelters();
              pendingShelters.value = pendingSheltersData.map(shelter => ({
              id: shelter.id,
              username: shelter.username,
              email: shelter.email,
              phoneNumber: shelter.phoneNumber,
              shelterType: shelter.shelterType,
              county: shelter.county,
              city: shelter.city,
              fullAddress: shelter.fullAddress,
              createdAt: shelter.submittedAt || new Date().toISOString(),
              profilePicture: shelter.profilePicture ? `data:image/jpeg;base64,${shelter.profilePicture}` : null
            }));
            
            const approvedSheltersData = await getApprovedShelters();
            approvedShelters.value = await Promise.all(
                approvedSheltersData.map(async (shelter) => {
                    let animalCount = 0;
                    try {
                      animalCount = await getPetCountByShelter(shelter.id);
                    } catch (error) {
                      console.error(`Failed to fetch animal count for shelter ${shelter.id}:`, error);
                    }

                    return {
                        id: shelter.id,
                        username: shelter.username,
                        email: shelter.email,
                        phoneNumber: shelter.phoneNumber,
                        shelterType: shelter.shelterType,
                        county: shelter.county,
                        city: shelter.city,
                        fullAddress: shelter.fullAddress,
                        status: shelter.status,
                        approvedAt: shelter.approvedAt || new Date().toISOString(),
                        animalCount: animalCount,
                        profilePicture: shelter.profilePicture 
                            ? `data:image/jpeg;base64,${shelter.profilePicture}` 
                            : null
                    };
                })
            );
          isLoading.value = false;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            isLoading.value = false;
            showToastMessage('Failed to load dashboard data. Please try again later.');
        }
    };
    


    const fetchUsers = async () => {
      try {
        isLoadingUsers.value = true;
      
        const usersResponse = await mockFetchUsers();
        users.value = usersResponse;
        
        isLoadingUsers.value = false;
      } catch (error) {
        console.error('Error fetching users:', error);
        isLoadingUsers.value = false;
        showToastMessage('Failed to load users. Please try again later.');
      }
    };

    
    const viewShelterDetails = (Id) => {
        fetchShelterDetails(Id);
    };


    const viewUserDetails = async (userId) => {
      try {
        showUserModal.value = true;
        isLoadingUserDetails.value = true;
        
        const user = await mockFetchUserDetails(userId);
        selectedUser.value = user;
        userNotes.value = user.adminNotes || '';
        
        isLoadingUserDetails.value = false;
      } catch (error) {
        console.error('Error fetching user details:', error);
        isLoadingUserDetails.value = false;
        showToastMessage('Failed to load user details. Please try again later.');
      }
    };


    
    const approveShelter = (Id, fromModal = false) => {
      if (fromModal) {
        performShelterAction(Id, 'approve');
        return;
      }
      
      confirmationTitle.value = 'Approve Shelter';
      confirmationMessage.value = 'Are you sure you want to approve this shelter? This will grant them access to the platform.';
      confirmationActionType.value = 'approve';
      confirmationActionText.value = 'Approve';
      confirmationCallback.value = () => performShelterAction(Id, 'approve');
      showConfirmationModal.value = true;
    };


    
    const rejectShelter = (Id, fromModal = false) => {
      if (fromModal) {
        performShelterAction(Id, 'reject');
        return;
      }
      
      confirmationTitle.value = 'Reject Shelter';
      confirmationMessage.value = 'Are you sure you want to reject this shelter application? This action cannot be undone.';
      confirmationActionType.value = 'reject';
      confirmationActionText.value = 'Reject';
      confirmationCallback.value = () => performShelterAction(Id, 'reject');
      showConfirmationModal.value = true;
    };


    
    const suspendShelter = (Id, fromModal = false) => {
      if (fromModal) {
        performShelterAction(Id, 'suspend');
        return;
      }
      
      confirmationTitle.value = 'Suspend Shelter';
      confirmationMessage.value = 'Are you sure you want to suspend this shelter? This will temporarily restrict their access to the platform.';
      confirmationActionType.value = 'suspend';
      confirmationActionText.value = 'Suspend';
      confirmationCallback.value = () => performShelterAction(Id, 'suspend');
      showConfirmationModal.value = true;
    };


    const performShelterAction = async (Id, action) => {
      try {
        let responseData;
        
        if (action === 'approve') {
          responseData = await approveShelter(Id);
        } else if (action === 'reject') {
          responseData = await rejectShelter(Id);
        } else if (action === 'suspend') {
          responseData = await suspendShelter(Id);
        } else {
          throw new Error(`Unknown action: ${action}`);
        }
        
        if (showShelterModal.value) {
          showShelterModal.value = false;
        }
        
        if (showConfirmationModal.value) {
          showConfirmationModal.value = false;
        }
        
        if (action === 'approve' || action === 'reject') {
          pendingShelters.value = pendingShelters.value.filter(s => s.id !== Id);
          stats.value.pendingApprovals = pendingShelters.value.length;
          
          if (action === 'approve') {
            successMessage.value = 'Shelter has been approved successfully.';
            fetchDashboardData();
          } else {
            successMessage.value = 'Shelter application has been rejected.';
          }
        } else if (action === 'suspend') {
          successMessage.value = 'Shelter has been suspended successfully.';
        }
        
        isSubmitted.value = true;
      } catch (error) {
        console.error(`Error ${action}ing shelter:`, error);
        showToastMessage(`Failed to ${action} shelter. Please try again.`);
      }
    };

    
    const suspendUser = (userId, fromModal = false) => {
      if (fromModal) {
        performUserAction(userId, 'suspend');
        return;
      }
      
      confirmationTitle.value = 'Suspend User';
      confirmationMessage.value = 'Are you sure you want to suspend this user? They will not be able to log in until reactivated.';
      confirmationActionType.value = 'suspend';
      confirmationActionText.value = 'Suspend';
      confirmationCallback.value = () => performUserAction(userId, 'suspend');
      showConfirmationModal.value = true;
    };


    const activateUser = (userId, fromModal = false) => {
      if (fromModal) {
        performUserAction(userId, 'activate');
        return;
      }
      
      confirmationTitle.value = 'Activate User';
      confirmationMessage.value = 'Are you sure you want to reactivate this user?';
      confirmationActionType.value = 'approve';
      confirmationActionText.value = 'Activate';
      confirmationCallback.value = () => performUserAction(userId, 'activate');
      showConfirmationModal.value = true;
    };

    
    const deleteUser = (userId, fromModal = false) => {
      if (fromModal) {
        performUserAction(userId, 'delete');
        return;
      }
      
      confirmationTitle.value = 'Delete User';
      confirmationMessage.value = 'Are you sure you want to permanently delete this user? This action cannot be undone.';
      confirmationActionType.value = 'reject';
      confirmationActionText.value = 'Delete';
      confirmationCallback.value = () => performUserAction(userId, 'delete');
      showConfirmationModal.value = true;
    };

    
    const performUserAction = async (userId, action) => {
      try {
        await mockPerformUserAction(userId, action);
        
        if (showUserModal.value) {
          showUserModal.value = false;
        }
        
        if (showConfirmationModal.value) {
          showConfirmationModal.value = false;
        }
        
        if (action === 'suspend') {
          const userIndex = users.value.findIndex(user => user.id === userId);
          if (userIndex !== -1) {
            users.value[userIndex].status = 'SUSPENDED';
            successMessage.value = 'User has been suspended successfully.';
          }
        } else if (action === 'activate') {
          const userIndex = users.value.findIndex(user => user.id === userId);
          if (userIndex !== -1) {
            users.value[userIndex].status = 'ACTIVE';
            successMessage.value = 'User has been activated successfully.';
          }
        } else if (action === 'delete') {
          users.value = users.value.filter(user => user.id !== userId);
          stats.value.totalUsers--;
          successMessage.value = 'User has been deleted successfully.';
        }
        
        isSubmitted.value = true;
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        showToastMessage(`Failed to ${action} user. Please try again.`);
      }
    };

    
    const saveUserNotes = async () => {
      try {
        await mockSaveUserNotes(selectedUser.value.id, userNotes.value);
        
        showToastMessage('User notes saved successfully.');
      } catch (error) {
        console.error('Error saving user notes:', error);
        showToastMessage('Failed to save user notes. Please try again.');
      }
    };
    

    const confirmAction = () => {
      if (confirmationCallback.value) {
        confirmationCallback.value();
      }
      showConfirmationModal.value = false;
    };


    const showToastMessage = (message) => {
      toastMessage.value = message;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    const getDocumentTypeName = (documentType) => {
      const names = {
        'taxCertificate': 'Tax Registration Certificate',
        'vetAuthorization': 'Veterinary Sanitary Authorization',
        'vetContract': 'Veterinarian Collaboration Contract',
        'idCard': 'ID Card of Legal Representative'
      };
      
      return names[documentType] || documentType;
    };


    const formatLongText = (text, charsPerLine = 10) => {
        if (!text || text.length <= charsPerLine) {
            return text;
        }
        
        const words = text.split(' ');
        let formattedText = '';
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length > charsPerLine) {
            formattedText += currentLine.trim() + '\n';
            currentLine = word + ' ';
            } else {
            currentLine += word + ' ';
            }
        });
        
        if (currentLine.trim()) {
            formattedText += currentLine.trim();
        }
        
        return formattedText;
    };
    


    const fetchShelterDetails = async (Id) => {
      try {
          showShelterModal.value = true;
          isLoadingShelterDetails.value = true;
        
          const existingPendingShelter = pendingShelters.value.find(s => s.id === Id);
          const existingApprovedShelter = approvedShelters.value.find(s => s.id === Id);
          
          const existingShelter = existingPendingShelter || existingApprovedShelter;
          
          if (existingShelter && existingShelter.profilePicture) {
              console.log("Using image from existing shelters list");
              
              const shelterData = await getShelterDetails(Id);
              
              const formattedMission = formatLongText(
                  shelterData.mission ? shelterData.mission.trim() : '', 
                  80 
              );
              
              selectedShelter.value = {
                  ...shelterData,
                  profilePicture: existingShelter.profilePicture,
                  mission: formattedMission
              };
              
              isLoadingShelterDetails.value = false;
              return;
          }
          
          const shelterData = await getShelterDetails(Id);
          
          let profilePictureUrl = null;
          if (shelterData.profilePicture) {
              if (typeof shelterData.profilePicture === 'string') {
                  profilePictureUrl = `data:image/jpeg;base64,${shelterData.profilePicture}`;
              } else if (Array.isArray(shelterData.profilePicture)) {
                  try {
                      const binary = shelterData.profilePicture
                          .map(byte => String.fromCharCode(byte))
                          .join('');
                      profilePictureUrl = `data:image/jpeg;base64,${btoa(binary)}`;
                  } catch (e) {
                      console.error("Error converting image:", e);
                  }
              }
          }
          
          const formattedMission = formatLongText(
              shelterData.mission ? shelterData.mission.trim() : '', 
              40 
          );
          
          selectedShelter.value = {
              ...shelterData,
              profilePicture: profilePictureUrl,
              mission: formattedMission
          };
          
          isLoadingShelterDetails.value = false;
      } catch (error) {
          console.error('Error fetching shelter details:', error);
          isLoadingShelterDetails.value = false;
          showToastMessage('Failed to load shelter details. Please try again later.');
      }
  };
    

    
    const mockFetchUsers = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUsers = Array.from({ length: 40 }, (_, i) => ({
            id: `u${i+1}`,
            username: `user${i+1}`,
            email: `user${i+1}@example.com`,
            firstName: `First${i+1}`,
            lastName: `Last${i+1}`,
            phoneNumber: i % 3 === 0 ? `+4075${100000 + i}` : null,
            role: i === 0 ? 'ADMIN' : (i < 10 ? 'SHELTER' : 'USER'),
            status: i % 10 === 0 ? 'SUSPENDED' : 'ACTIVE',
            createdAt: new Date(2025, 0, i+1).toISOString(),
            lastLogin: i % 5 === 0 ? null : new Date(2025, 2, 20 - (i % 20)).toISOString(),
            profilePicture: null
          }));
          
          resolve(mockUsers);
        }, 800);
      });
    };


    
    const mockFetchUserDetails = (userId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = users.value.find(u => u.id === userId);
          
          if (user) {
            resolve({
              ...user,
              adminNotes: user.id === 'u1' ? 'System administrator account.' : '',
              activities: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
                description: [
                  'Logged in',
                  'Updated profile information',
                  'Changed password',
                  'Added a favorite animal',
                  'Contacted a shelter',
                  'Submitted adoption application',
                  'Posted a comment'
                ][Math.floor(Math.random() * 7)],
                timestamp: new Date(2025, 2, 20 - i).toISOString()
              }))
            });
          } else {
            resolve(null);
          }
        }, 600);
      });
    };
    

    const mockPerformUserAction = (userId, action) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = users.value.find(u => u.id === userId);
          
          if (user) {
            resolve(user);
          } else {
            throw new Error('User not found');
          }
        }, 600);
      });
    };

    
    const mockSaveUserNotes = (userId, notes) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const userIndex = users.value.findIndex(u => u.id === userId);
          
          if (userIndex !== -1) {
            resolve(true);
          } else {
            throw new Error('User not found');
          }
        }, 500);
      });
    };
    
    watch(searchQuery, () => {
      currentPage.value = 1;
    });


    watch([userSearchQuery, userRole, userStatus], () => {
      userPage.value = 1;
    });
    

    watch(activeTab, (newTab) => {
      if (newTab === 'users' && users.value.length === 0) {
        fetchUsers();
      }
    });
    

    onMounted(() => {
      fetchDashboardData();
      
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      reportEndDate.value = today.toISOString().split('T')[0];
      reportStartDate.value = lastMonth.toISOString().split('T')[0];
    });
    
    return {
      activeTab,
      isLoading,
      isLoadingUsers,
      isLoadingShelterDetails,
      isLoadingUserDetails,
      adminName,
      stats,
      pendingShelters,
      approvedShelters,
      searchQuery,
      currentPage,
      itemsPerPage,
      users,
      userSearchQuery,
      userRole,
      userStatus,
      userPage,
      userItemsPerPage,
      showShelterModal,
      showUserModal,
      showConfirmationModal,
      selectedShelter,
      selectedUser,
      userNotes,
      confirmationTitle,
      confirmationMessage,
      confirmationActionType,
      confirmationActionText,
      reportStartDate,
      reportEndDate,
      reportStats,
      showToast,
      toastMessage,
      isSubmitted,
      successMessage,
      defaultShelterImage,
      defaultUserImage,
      
      filteredApprovedShelters,
      paginatedShelters,
      totalPages,
      paginationPages,
      filteredUsers,
      paginatedUsers,
      userTotalPages,
      userPaginationPages,
      
      showLogoutConfirmation,
      pendingCurrentPage,
      pendingItemsPerPage,
      paginatedPendingShelters,
      pendingPaginationPages,

      sortPendingShelters,
      formatRelativeTime,
      viewShelterDetails,
      viewUserDetails,
      approveShelter,
      rejectShelter,
      suspendShelter,
      suspendUser,
      activateUser,
      deleteUser,
      saveUserNotes,
      confirmAction,
      formatDate,
      getDocumentTypeName,
      viewShelterDocument,
      logout,
      confirmLogout,
      performLogout
    };
  }
};
</script>