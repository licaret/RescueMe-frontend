<template>
  <div class="bg-gradient-to-b from-gray-90 to-gray-100 min-h-screen p-4 pl-2 mt-4 space-y-4">

    <!-- Header Section -->
    <div class="max-w-full">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Manage Pets</h1>
          <p class="text-gray-600 mt-1">Add, edit and manage your pets</p>
        </div>
        <button 
          @click="showAddEditPetForm = true" 
          class="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all duration-200 hover:translate-y-[-2px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Pet
        </button>
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-white max-w-full mx-auto rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <!-- <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
          <h2 class="text-xl font-bold text-gray-800 mb-1">Search Your Pets</h2>
          <p class="text-gray-500 text-sm">Customize your search to find specific pets</p>
        </div> -->

        <!-- Top Row: Search & Toggle Filters -->
        <div class="px-6 py-8 flex flex-col md:flex-row gap-6 md:items-center">
          <!-- Search Bar -->
          <div class="flex-1 min-w-[250px]">
            <div class="relative">
              <div class="absolute left-4 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                v-model="filters.name"
                placeholder="Search by pet name..."
                class="pl-12 pr-4 py-3.5 w-full border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 md:justify-end">
            <!-- Sort Button/Dropdown -->
            <div class="relative">
              <select 
                v-model="sortBy" 
                class="appearance-none pl-4 pr-10 py-3.5 font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm"
              >
                <option value="">Sort Pets</option>
                <option value="name">By Name</option>
                <option value="age">By Age</option>
                <option value="timeSpentInShelter">By Time in Shelter</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Filters Toggle Button -->
            <button 
              @click="showFilters = !showFilters"
              class="flex items-center gap-2 px-5 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm relative"
              :class="{'ring-2 ring-red-500 bg-red-50': showFilters || isAnyFilterApplied}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="isAnyFilterApplied ? 'text-red-500' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span class="font-medium" :class="isAnyFilterApplied ? 'text-red-600' : ''">{{ showFilters ? "Hide Filters" : "Show Filters" }}</span>
              <span v-if="isAnyFilterApplied" class="flex items-center justify-center min-w-5 h-5 px-1.5 absolute -top-2 -right-2 text-xs font-bold text-white bg-red-500 rounded-full shadow-md animate-pulse-slow">
                {{ activeFilterCount }}
              </span>
            </button>
          </div>
        </div>

        <!--  Filters Section -->
        <transition 
          name="fade"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[1000px]"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-[1000px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="showFilters" class="px-6 py-5 border-t border-gray-100 bg-gray-50">
            <!-- Active Filters Display -->
            <div v-if="isAnyFilterApplied" class="mb-6 flex flex-wrap gap-2">
              <div class="text-sm text-gray-500 flex items-center">
                <span class="mr-2">Active filters:</span>
              </div>
              
              <div v-for="(value, key) in getActiveFilters()" :key="key" 
                  class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1.5 rounded-full">
                <span>{{ formatFilterName(key) }}: {{ formatFilterValue(value) }}</span>
                <button @click="clearSingleFilter(key)" class="ml-1.5 text-red-600 hover:text-red-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <button 
                @click="resetFilters" 
                class="text-xs font-medium text-red-700 hover:text-red-800 hover:underline flex items-center ml-auto"
              >
                Clear All
              </button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              
              <!-- Filter Fields  -->
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Species</label>
                <div class="relative">
                  <select v-model="filters.species" class="enhanced-filter-input">
                    <option value="">All Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Breed Dropdown  -->
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Breed</label>
                <div class="relative group">
                  <select 
                    v-model="filters.breed" 
                    class="enhanced-filter-input"
                    :class="{'cursor-not-allowed bg-gray-100 text-gray-400': !filters.species}"
                    :disabled="!filters.species"
                  >
                    <option value="">All Breeds</option>
                    <option v-for="breed in breedOptions" :key="breed" :value="breed">
                      {{ breed }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div 
                    v-if="!filters.species" 
                    class="absolute left-0 -bottom-12 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg w-48"
                  >
                    Please select a species first
                    <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Gender</label>
                <div class="relative">
                  <select v-model="filters.sex" class="enhanced-filter-input">
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Size</label>
                <div class="relative">
                  <select v-model="filters.size" class="enhanced-filter-input">
                    <option value="">All Sizes</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Health Status</label>
                <div class="relative">
                  <select v-model="filters.healthStatus" class="enhanced-filter-input">
                    <option value="">All Health Statuses</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Minor Issues">Minor Issues</option>
                    <option value="Needs Medical Attention">Needs Medical Attention</option>
                    <option value="Recovered">Recovered</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Critical Condition">Critical Condition</option>
                    <option value="Needs Surgery">Needs Surgery</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Senior Care">Senior Care</option>
                    <option value="Special Needs">Special Needs</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Availability</label>
                <div class="relative">
                  <select v-model="filters.status" class="enhanced-filter-input">
                    <option value="">All Availabilities</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="PENDING">Pending</option>
                    <option value="ADOPTED">Adopted</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Age Range (from original ManagePets) -->
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Age (Years)</label>
                <div class="relative">
                  <select v-model="filters.ageRange" class="enhanced-filter-input">
                    <option value="">Any Age</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-7">3-7 years</option>
                    <option value="7+">7+ years</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Checkboxes and Clear Filters Button on same line -->
              <div class="lg:col-span-5 flex flex-wrap items-center gap-6 mt-4">
                <!-- Vaccinated -->
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="vaccinated" 
                    v-model="filters.vaccinated" 
                    class="w-5 h-5 rounded text-red-500 border-gray-300 focus:ring-red-500"
                  >
                  <label for="vaccinated" class="ml-2 text-gray-700 font-medium">Only Vaccinated</label>
                </div>

                <!-- Neutered -->
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="neutered" 
                    v-model="filters.neutered" 
                    class="w-5 h-5 rounded text-red-500 border-gray-300 focus:ring-red-500"
                  >
                  <label for="neutered" class="ml-2 text-gray-700 font-medium">Only Neutered</label>
                </div>

                <!-- Urgent Adoption Needed -->
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="urgentAdoptionNeeded" 
                    v-model="filters.urgentAdoptionNeeded" 
                    class="w-5 h-5 rounded text-red-600 border-red-300 focus:ring-red-500"
                  >
                  <label for="urgentAdoptionNeeded" class="ml-2 text-red-600 font-medium">Urgent Adoption Needed</label>
                </div>
                
                <!-- Clear Filters Button on same line with checkboxes --> 
                <button 
                  v-if="isAnyFilterApplied"
                  @click="resetFilters"
                  class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ml-auto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Pets Grid Section -->
      <div v-if="filteredPets.length > 0" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8 ml-0 pr-2 mt-8">
          <PetCard 
            v-for="pet in paginatedPets" 
            :key="pet.id" 
            :pet="pet" 
            @petDeleted="removePetFromList" 
            @pet-updated="updatePetInList"
          />
        </div>
        
        <!-- Pagination Component -->
        <div v-if="totalPages > 1" class="flex justify-center py-5">
          <nav class="inline-flex -space-x-px" aria-label="Pagination">
            <!-- First page -->
            <button
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              :class="{'cursor-not-allowed bg-gray-100': currentPage === 1, 'hover:text-gray-700': currentPage !== 1}"
            >
              <span class="sr-only">First</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M13.28 3.97a.75.75 0 010 1.06L6.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0zm4.28 0a.75.75 0 010 1.06L10.53 12l7.03 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Previous page -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              :class="{'cursor-not-allowed bg-gray-100': currentPage === 1, 'hover:text-gray-700': currentPage !== 1}"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Page numbers -->
            <template v-for="page in displayedPages" :key="page">
              <span 
                v-if="page === '...'"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
              >
                ...
              </span>
              <button
                v-else
                @click="goToPage(page)"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0"
                :class="currentPage === page 
                  ? 'z-10 bg-red-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600' 
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </template>

            <!-- Next page -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              :class="{'cursor-not-allowed bg-gray-100': currentPage === totalPages, 'hover:text-gray-700': currentPage !== totalPages}"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Last page -->
            <button
              @click="goToPage(totalPages)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              :class="{'cursor-not-allowed bg-gray-100': currentPage === totalPages, 'hover:text-gray-700': currentPage !== totalPages}"
            >
              <span class="sr-only">Last</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M6.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L13.69 12 6.72 5.03a.75.75 0 010-1.06zm-4.28 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L10.47 12 3.44 5.03a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
      
      <!-- No Results from Filters -->
      <div v-else-if="isAnyFilterApplied && filteredPets.length === 0" class="w-full py-16 text-center">
        <!-- Text content -->
        <h2 class="text-2xl font-bold text-gray-800 mb-3">No matching pets found</h2>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          We couldn't find any pets that match your current filters. Try adjusting or clearing your filters to see more pets.
        </p>
        
        <!-- Applied filters summary -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-md mx-auto">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Applied filters:</h3>
          <div class="flex flex-wrap gap-2 justify-center">
            <div v-for="(value, key) in getActiveFilters()" :key="key" 
                class="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 flex items-center">
              <span>{{ formatFilterName(key) }}: {{ formatFilterValue(value) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Call to action button -->
        <button 
          @click="resetFilters" 
          class="group bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      </div>
      
      <!-- No Pets at All -->
      <div v-if="pets.length === 0 && !isAnyFilterApplied" class="w-full py-16 text-center">
        <!-- Text content -->
        <h2 class="text-2xl font-bold text-gray-800 mb-3">Add your first pet</h2>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          You haven't added any pets yet. Start building your adoption catalog and help animals find their forever homes.
        </p>
        
        <!-- Call to action button -->
        <button 
          @click="showAddEditPetForm = true" 
          class="group bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-2 mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Pet
        </button>
      </div>

    </div>

    <Teleport to="body" v-if="showAddEditPetForm">
      <div class="fixed inset-0 z-[10001] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4">
        <AddEditPetForm 
          @close="showAddEditPetForm = false"
          @pet-added="handlePetAdded"
          :key="formKey"
        />
      </div>
    </Teleport>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { fetchShelterPets } from "@/services/pet_service.js";
import AddEditPetForm from '@/components/AddEditPetForm.vue';
import PetCard from '@/components/PetCard.vue';

export default {
  name: 'ManagePets',
  components: {
    PetCard,
    AddEditPetForm
  },


  setup() {
    const pets = ref([]);
    const searchQuery = ref("");
    const Id = localStorage.getItem("Id");
    const showAddEditPetForm = ref(false);
    const formKey = ref(0);
    const showBreedMessage = ref(false);

    // pagination
    const itemsPerPage = 16;
    const currentPage = ref(1);

    const filters = ref({
      name: "",
      species: "",
      breed: "",
      sex: "",
      size: "",
      healthStatus: "",
      vaccinated: "",
      neutered: "",
      urgentAdoptionNeeded: "",
      timeSpentInShelter: "",
      status: "", // AVAILABLE, PENDING, ADOPTED
      ageRange: "" // Added new filter for age ranges
    });

    const resetFilters = () => {
      filters.value = {
        name: "",
        species: "",
        breed: "",
        sex: "",
        age: "",
        size: "",
        healthStatus: "",
        vaccinated: "",
        neutered: "",
        urgentAdoptionNeeded: "",
        timeSpentInShelter: "",
        status: "",
        ageRange: ""
      };
      currentPage.value = 1; // reset to first page when filters change
    };

    const sortBy = ref(""); 
    const sortOrder = ref("asc"); 
    const showSortDropdown = ref(false);
    const showFilters = ref(false);
    const breedOptions = ref([]);
    const filteredBreeds = ref([]);
    const showDropdown = ref(false);
    const sortOptions = [
      { label: 'Name (A-Z)', value: 'name', order: 'asc' },
      { label: 'Name (Z-A)', value: 'name', order: 'desc' },
      { label: 'Newest First', value: 'createdAt', order: 'desc' },
      { label: 'Oldest First', value: 'createdAt', order: 'asc' },
      { label: 'Age (Youngest)', value: 'age', order: 'asc' },
      { label: 'Age (Oldest)', value: 'age', order: 'desc' },
      { label: 'Time in Shelter (Shortest)', value: 'timeSpentInShelter', order: 'asc' },
      { label: 'Time in Shelter (Longest)', value: 'timeSpentInShelter', order: 'desc' }
    ];

    // Toggle sort dropdown visibility
    const toggleSortDropdown = () => {
      showSortDropdown.value = !showSortDropdown.value;
    };

    // Select a sort option
    const selectSortOption = (value, order) => {
      sortBy.value = value;
      sortOrder.value = order;
      showSortDropdown.value = false;
    };

    // Get the label for the currently selected sort option
    const getSortLabel = () => {
      const selectedOption = sortOptions.find(
        option => option.value === sortBy.value && option.order === sortOrder.value
      );
      return selectedOption ? selectedOption.label : 'Sort Pets';
    };

    // Toggle filters panel visibility
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
      // Close the sort dropdown when toggling filters
      showSortDropdown.value = false;
    };

    // Clear a single filter
    const clearSingleFilter = (key) => {
      if (typeof filters.value[key] === 'boolean') {
        filters.value[key] = false;
      } else {
        filters.value[key] = '';
      }
    };

    // Get active filters as an object
    const getActiveFilters = () => {
      const active = {};
      for (const [key, value] of Object.entries(filters.value)) {
        if (value !== "" && value !== false && value !== null && value !== undefined) {
          active[key] = value;
        }
      }
      return active;
    };

    // Format filter names for display
    const formatFilterName = (key) => {
      // Convert camelCase to Title Case with spaces
      const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
      // Special cases
      switch (key) {
        case 'urgentAdoptionNeeded': return 'Urgent Adoption';
        case 'ageRange': return 'Age Range';
        default: return formatted;
      }
    };

    // Format filter values for display
    const formatFilterValue = (value) => {
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      
      // For status values
      if (value === 'AVAILABLE') return 'Available';
      if (value === 'PENDING') return 'Pending';
      if (value === 'ADOPTED') return 'Adopted';
      
      // For age range values
      if (value === '0-1') return 'Less than 1 year';
      if (value === '1-3') return '1-3 years';
      if (value === '3-7') return '3-7 years';
      if (value === '7+') return '7+ years';
      
      return value;
    };

    // Apply age range filter to a pet
    const applyAgeRangeFilter = (pet) => {
      if (!filters.value.ageRange) return true;
      
      const petAge = pet.age;
      
      switch(filters.value.ageRange) {
        case '0-1':
          return petAge < 1;
        case '1-3':
          return petAge >= 1 && petAge < 3;
        case '3-7':
          return petAge >= 3 && petAge < 7;
        case '7+':
          return petAge >= 7;
        default:
          return true;
      }
    };

    const activeFilterCount = computed(() => {
      return Object.values(filters.value).filter(value => 
        value !== "" && value !== false && value !== null && value !== undefined
      ).length;
    });

    // Computed value for checking if any filter is applied
    const isAnyFilterApplied = computed(() => {
      return activeFilterCount.value > 0;
    });
    

    // function getActiveFilters() {
    //   const active = {};
    //   for (const [key, value] of Object.entries(this.filters)) {
    //     if (value !== "" && value !== false && value !== null && value !== undefined) {
    //       active[key] = value;
    //     }
    //   }
    //   return active;
    // }


    // function formatFilterName(key) {
    //   // Convert camelCase to Title Case with spaces
    //   const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      
    //   // Special cases
    //   switch (key) {
    //     case 'urgentAdoptionNeeded': return 'Urgent Adoption';
    //     default: return formatted;
    //   }
    // }

    // function formatFilterValue(value) {
    //   if (typeof value === 'boolean') {
    //     return value ? 'Yes' : 'No';
    //   }
      
    //   // For status values
    //   if (value === 'AVAILABLE') return 'Available';
    //   if (value === 'PENDING') return 'Pending';
    //   if (value === 'ADOPTED') return 'Adopted';
      
    //   return value;
    // }


    const loadPets = async () => {
      if (!Id) {
        console.error("No shelter ID found");
        return;
      }
      try {
        console.log("Loading pets...");
        const petsData = await fetchShelterPets(Id);

        if (!petsData) {
          console.error("fetchShelterPets returned null!");
          return;
        }

        pets.value = petsData.map(pet => ({
          ...pet,
          photos: pet.photos ? pet.photos : []
        }));

        console.log("Pets stored in state:", pets.value);
      } catch (error) {
        console.error("Error loading pets:", error);
      }
    };



    const handlePetAdded = async (newPet) => {   
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      await loadPets(); 
    };


    
    const removePetFromList = (petId) => {
      pets.value = pets.value.filter((pet) => pet.id !== petId);
      console.log(`Pet with ID ${petId} removed from local list`);
    };



    const updatePetInList = (updatedPet) => {
      const index = pets.value.findIndex((p) => p.id === updatedPet.id);
      if (index !== -1) {
        pets.value = [
          ...pets.value.slice(0, index),
          {
            ...updatedPet,
            photos: updatedPet.photos?.map(photo => ({
              id: photo.id,
              url: photo.url.startsWith("data:image") ? 
                photo.url : 
                `data:image/jpeg;base64,${photo.url}`
            })) || []
          },
          ...pets.value.slice(index + 1)
        ];
      }
    };



    const filteredPets = computed(() => {
      if (!pets.value || pets.value.length === 0) {
        return [];
      }

      return pets.value
        .filter(pet => {
          // Apply all standard filters
          const standardFiltersPass = Object.keys(filters.value).every(key => {
            // Skip ageRange as we'll handle it separately
            if (key === 'ageRange') return true;
            
            if (!filters.value[key]) return true; 

            if (key === "age") {
              return Math.round(pet.age * 12) >= Math.round(filters.value.age * 12);
            }

            if (key === "timeSpentInShelter") {
              return (
                Math.round(pet.timeSpentInShelter * 12) >=
                Math.round(filters.value.timeSpentInShelter * 12)
              );
            }
            
            if (key === "vaccinated" && filters.value.vaccinated) {
              return pet.vaccinated === true;
            }

            if (key === "neutered" && filters.value.neutered) {
              return pet.neutered === true;
            }

            if (key === "urgentAdoptionNeeded" && filters.value.urgentAdoptionNeeded) {
              return pet.urgentAdoptionNeeded === true;
            }

            if (typeof pet[key] === "boolean") {
              return filters.value[key] === "Yes" ? pet[key] : !pet[key];
            }

            if (key === "sex") {
              return pet.sex?.toLowerCase() === filters.value.sex.toLowerCase();
            }

            if (typeof pet[key] === "number") {
              return parseInt(filters.value[key]) === pet[key];
            }

            // Name search should be case-insensitive and partial match
            if (key === "name" && pet[key]) {
              return pet[key].toLowerCase().includes(filters.value[key].toLowerCase());
            }

            return pet[key]?.toString().toLowerCase().includes(filters.value[key].toString().toLowerCase());
          });
          
          // Now apply the age range filter separately
          const ageRangeFilterPasses = applyAgeRangeFilter(pet);
          
          return standardFiltersPass && ageRangeFilterPasses;
        })
        .sort((a, b) => {
          if (!sortBy.value) return 0;

          let modifier = sortOrder.value === "asc" ? 1 : -1;

          if (sortBy.value === "createdAt") {
            // Convert date strings to Date objects for comparison
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return (dateA - dateB) * modifier;
          }

          if (typeof a[sortBy.value] === "string") {
            return a[sortBy.value].localeCompare(b[sortBy.value]) * modifier;
          }

          if (typeof a[sortBy.value] === "number") {
            return (a[sortBy.value] - b[sortBy.value]) * modifier;
          }

          if (sortBy.value === "age" || sortBy.value === "timeSpentInShelter") {
            return (a[sortBy.value] - b[sortBy.value]) * modifier;
          }

          return 0;
        });
    });





    // pagination calculations
    const totalPages = computed(() => {
      if (!filteredPets.value || filteredPets.value.length === 0) {
        return 0;
      }
      return Math.ceil(filteredPets.value.length / itemsPerPage);
    });



    const paginatedPets = computed(() => {
      if (!filteredPets.value || filteredPets.value.length === 0) {
        return [];
      }
      
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, filteredPets.value.length);
      return filteredPets.value.slice(startIndex, endIndex);
    });



    // pagination display
    const displayedPages = computed(() => {
      if (!totalPages.value || totalPages.value <= 0) {
        return [];
      }

      if (totalPages.value <= 7) {
        return Array.from({ length: totalPages.value }, (_, i) => i + 1);
      }

      const pages = [1];
      
      let startPage = Math.max(2, currentPage.value - 1);
      let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
      
      if (startPage > 2) {
        pages.push('...');
      } else if (startPage === 2) {
        pages.push(2);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages.value) {
          pages.push(i);
        }
      }
      
      if (endPage < totalPages.value - 1) {
        pages.push('...');
      } else if (endPage === totalPages.value - 1) {
        pages.push(totalPages.value - 1);
      }
      
      if (totalPages.value > 1) {
        pages.push(totalPages.value);
      }
      
      return pages;
    });



    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };



    const fetchBreeds = async () => {
      if (!filters.value.species) {
        console.log("No species selected, clearing breed options.");
        breedOptions.value = [];
        return;
      }

      try {
        console.log("Fetching breeds for species:", filters.value.species);
        const response = await fetch(`http://localhost:8080/pets/breedsBySpecies?species=${filters.value.species}`);

        const textResponse = await response.text();
        console.log("Raw API Response:", textResponse);

        if (!response.ok) {
          throw new Error(`Failed to fetch breeds: ${response.status}`);
        }

        const data = JSON.parse(textResponse);
        console.log("Parsed Breed Data:", data);

        breedOptions.value = Array.isArray(data) ? data.map(b => b.trim()) : [];

        console.log("Updated breed options:", breedOptions.value);
      } catch (error) {
        console.error("Error fetching breeds:", error);
        breedOptions.value = [];
      }
    };



    // reset to first page when filters change
    watch(() => [filters.value, sortBy.value], () => {
      currentPage.value = 1;
    }, { deep: true });



    watch(() => filters.value.species, async (newSpecies) => {
      console.log("Species changed to:", newSpecies);
      filters.value.breed = ""; 
      if (newSpecies) {
        await fetchBreeds();
      } else {
        breedOptions.value = [];
      }
    });



    onMounted(loadPets);
    
    return { 
      pets, 
      filteredPets,
      showAddEditPetForm, 
      handlePetAdded, 
      removePetFromList, 
      updatePetInList, 
      formKey, 
      filters,  
      sortBy, 
      sortOrder, 
      showFilters, 
      resetFilters, 
      isAnyFilterApplied,
      breedOptions, 
      currentPage,
      totalPages,
      paginatedPets,
      goToPage,
      displayedPages,
      activeFilterCount,
      getActiveFilters,
      formatFilterName,
      formatFilterValue,
      clearSingleFilter,
      showSortDropdown,
      sortOptions,
      toggleSortDropdown,
      selectSortOption,
      getSortLabel,
      toggleFilters,
      applyAgeRangeFilter
    };
    },
  };
</script>

<style scoped>
.enhanced-filter-input {
  @apply appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl w-full shadow-sm transition duration-200 ease-in-out;
  @apply hover:border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent focus:outline-none;
}

.enhanced-filter-input:disabled {
  @apply cursor-not-allowed bg-gray-100 text-gray-400;
}

[type="checkbox"] {
  @apply rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200;
}

[type="checkbox"]:checked {
  @apply bg-red-500 border-transparent;
}

.primary-button {
  @apply shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out;
  @apply hover:-translate-y-0.5;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.custom-filter-input {
  @apply appearance-none px-3 py-2 bg-white border border-gray-200 rounded-xl w-full shadow-sm transition-all duration-200 ease-in-out;
}

.custom-filter-input:focus {
  @apply outline-none ring-2 ring-red-500 border-transparent;
}

.custom-filter-input:hover:not(:disabled) {
  @apply border-gray-300 bg-gray-50;
}

.custom-filter-input:disabled {
  @apply cursor-not-allowed;
}

[type="checkbox"] {
  @apply rounded border-gray-300;
}

[type="checkbox"]:checked {
  @apply bg-red-500 border-transparent;
}

[type="checkbox"]:focus {
  @apply ring-offset-white ring-red-500 ring-opacity-50;
}
</style>