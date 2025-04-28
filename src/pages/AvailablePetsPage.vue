<template>
  <Navbar></Navbar>
  
  <div class="bg-gradient-to-b from-gray-90 to-gray-100 min-h-screen p-3 md:p-5 lg:p-6 mt-28 space-y-12">
    
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-medium text-gray-800 relative inline-block">
        <span class="relative z-10">Find Your Perfect Companion</span>
        <span class="absolute -bottom-3 left-0 w-full h-4 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20 rounded-lg"></span>
      </h1>
      <p class="text-gray-600 mt-6 max-w-2xl mx-auto">Browse through our network of shelters and find the pet that's waiting for you</p>
    </div>

    <!--  Error Message  -->
    <transition
      enter-active-class="transform transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transform transition duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-3xl mx-auto mb-8 flex items-center animate-pulse-subtle">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p class="font-medium">{{ errorMessage }}</p>
          <p class="text-sm mt-1">Please try again or adjust your search parameters.</p>
        </div>
        <button @click="errorMessage = ''" class="ml-auto text-red-500 hover:text-red-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition>

    <!-- Search and Filter Section -->
    <div class="bg-white max-w-[90rem] mx-auto rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
        <h2 class="text-xl font-bold text-gray-800 mb-1">Search Available Pets</h2>
        <p class="text-gray-500 text-sm">Customize your search to find the perfect match</p>
      </div>

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
              {{ countAppliedFilters() }}
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
            
            <div v-for="(value, key) in activeFilters" :key="key" 
                class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1.5 rounded-full">
              <span>{{ formatFilterLabel(key) }}: {{ formatFilterValue(key, value) }}</span>
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

            <!-- County Filter -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">County</label>
              <div class="relative">
                <select v-model="filters.county" class="enhanced-filter-input" @change="handleCountyChange">
                  <option value="">All Counties</option>
                  <option v-for="county in counties" :key="county.code" :value="county.code">
                    {{ county.name }} ({{ county.code }})
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- City Filter -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">City</label>
              <div class="relative group">
                <select 
                  v-model="filters.city" 
                  class="enhanced-filter-input"
                  :class="{'cursor-not-allowed bg-gray-100 text-gray-400': !filters.county}"
                  :disabled="!filters.county"
                >
                  <option value="">All Cities</option>
                  <option v-for="city in availableCities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div 
                  v-if="!filters.county" 
                  class="absolute left-0 -bottom-12 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg w-48"
                >
                  Please select a county first
                  <div class="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
                </div>
              </div>
            </div>

            <!-- Checkboxes -->
            <div class="lg:col-span-3 flex flex-wrap gap-6 mt-4">
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
            </div>

            <!-- Clear Filters Button --> 
            <div class="flex items-center md:justify-end lg:col-span-2 pt-2">
              <button 
                v-if="isAnyFilterApplied"
                @click="resetFilters"
                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block relative">
        <div class="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-red-500"></div>
        <div class="absolute top-0 left-0 h-14 w-14 rounded-full border-4 border-red-300 border-t-transparent animate-pulse opacity-50"></div>
      </div>
      <p class="mt-6 text-gray-600 font-medium animate-pulse">Loading available pets...</p>
    </div>
    
    <!-- Results Count Indicator -->
    <div v-if="!loading && sheltersWithPets.length > 0" class="text-center my-8">
      <div class="inline-block px-6 py-3 bg-red-50 border border-red-100 rounded-full text-red-600 font-medium shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md">
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Found <span class="font-bold mx-1">{{ sheltersWithPets.reduce((total, shelter) => total + shelter.pets.length, 0) }}</span> pets in <span class="font-bold mx-1">{{ sheltersWithPets.length }}</span> shelters
        </span>
      </div>
    </div>

    <div v-if="!loading && sheltersWithPets.length > 0" class="space-y-16">
      <div v-for="shelter in sheltersWithPets" :key="shelter.id" class="max-w-[90rem] mx-auto">
        <!-- Shelter Container -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <!-- Shelter Header -->
          <div class="border-b border-gray-100 p-6 bg-gradient-to-r from-white to-red-50">
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <!-- Shelter Image -->
              <div class="flex justify-center md:justify-start">
                <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white ring-2 ring-gray-100 shadow-lg transition-transform duration-300 hover:scale-105">
                  <img 
                    v-if="shelter.profilePicture"
                    :src="'data:image/jpeg;base64,' + shelter.profilePicture" 
                    :alt="shelter.username"
                    class="w-full h-full object-cover" 
                  />
                  <div v-else class="w-full h-full bg-red-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- Shelter Info -->
              <div class="flex-1 text-center md:text-left">
                <div class="flex flex-col md:flex-row md:items-center mb-2 gap-2">
                  <h2 class="text-2xl font-bold text-gray-800">{{ shelter.username }}</h2>
                  <span class="inline-flex ml-0 md:ml-3 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full self-center shadow-sm">{{ shelter.shelterType }}</span>
                </div>
                
                <div class="flex items-center justify-center md:justify-start text-gray-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ shelter.city }}, {{ countyCodeToName[shelter.county] || shelter.county || "N/A" }} ({{shelter.county}})</span>
                </div>
                
                <div class="flex items-center justify-center md:justify-start gap-6 mb-4">
                  <div class="flex items-center">
                    <span class="font-semibold mr-2 text-gray-800">{{ shelter.pets ? shelter.pets.length : 0 }}</span>
                    <span class="text-gray-600">Total Pets</span>
                  </div>
                  <div class="flex items-center">
                    <span class="font-semibold mr-2 text-red-600">{{ shelter.pets ? shelter.pets.filter(pet => pet.status === 'AVAILABLE').length : 0 }}</span>
                    <span class="text-gray-600">Available</span>
                  </div>
                </div>
                
                <!-- Mission statement display -->
                <div class="border-l-4 border-red-500 pl-4 italic text-gray-700 bg-gray-50 p-3 rounded-r-lg shadow-sm">
                  {{ (shelter.mission && shelter.mission.length > 120) ? shelter.mission.substring(0, 120) + '...' : (shelter.mission || "This Shelter doesn't have a description yet.") }}
                </div>
              </div>
              
              <!-- View Profile Button -->
              <div class="flex justify-center md:block mt-4 md:mt-0">
                <router-link 
                  :to="`/shelter/${shelter.id}`"
                  class="primary-button px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                  View Profile
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          
          <!-- Shelter's Pets Grid with Pagination -->
          <div v-if="shelter.pets.length > 0" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <span class="w-2 h-8 bg-red-500 rounded-lg mr-3 inline-block"></span>
                Available Pets
              </h3>
            </div>
            
            <!-- Pet cards grid-->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PetCard 
                v-for="pet in shelter.pets.slice(
                  (paginationState[shelter.id]?.currentPage - 1 || 0) * 4, 
                  ((paginationState[shelter.id]?.currentPage || 1) * 4)
                )" 
                :key="pet.id" 
                :pet="pet"
                userType="public"
                :favorited="isFavorited(pet.id)"
                @favorite="toggleFavorite"
                @adopt-pet="adoptPet"
                class="w-full transition-transform duration-300 hover:-translate-y-1"
              />
            </div>
            
            <!--  Pagination controls -->
            <div class="flex justify-center mt-10" v-if="shelter.pets.length > 4">
              <div class="inline-flex items-center bg-white rounded-lg shadow-md border border-gray-200 p-1">
                <button 
                  @click="prevPage(shelter.id)"
                  :disabled="(paginationState[shelter.id]?.currentPage || 1) <= 1"
                  :class="[
                    'rounded-l-md px-4 py-2 focus:outline-none transition-colors duration-200 flex items-center gap-1',
                    (paginationState[shelter.id]?.currentPage || 1) <= 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  ]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span class="hidden sm:inline">Previous</span>
                </button>
                
                <div class="px-4 py-2 text-sm font-medium text-gray-700 border-l border-r border-gray-200">
                  Page {{ paginationState[shelter.id]?.currentPage || 1 }} of {{ Math.max(1, Math.ceil(shelter.pets.length / 4)) }}
                </div>
                
                <button 
                  @click="nextPage(shelter.id)"
                  :disabled="(paginationState[shelter.id]?.currentPage || 1) >= Math.ceil(shelter.pets.length / 4)"
                  :class="[
                    'rounded-r-md px-4 py-2 focus:outline-none transition-colors duration-200 flex items-center gap-1',
                    (paginationState[shelter.id]?.currentPage || 1) >= Math.ceil(shelter.pets.length / 4)
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  ]"
                >
                  <span class="hidden sm:inline">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!--No Pets Message -->
          <div v-else class="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <p class="text-lg font-medium text-gray-600">No pets available in this shelter</p>
            <p class="text-gray-400 mt-1">Check back later or adjust your search filters</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Matching Pets (when filters are applied) -->
    <div v-if="!loading && sheltersWithPets.length === 0 && isAnyFilterApplied" class="text-center py-20 max-w-xl mx-auto">
      <div class="rounded-2xl">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-red-600 mb-3">No pets match your search</h2>
        <p class="text-gray-600 mb-8">We couldn't find any pets matching your current filters. Try adjusting your filters to see more pets.</p>
        <button 
          @click="resetFilters" 
          class="primary-button px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>

    <!-- No Pets in System  -->
    <div v-if="!loading && sheltersWithPets.length === 0 && !isAnyFilterApplied" class="text-center py-20 max-w-xl mx-auto">
      <div class="rounded-2xl">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-red-600 mb-3">No pets available yet</h2>
        <p class="text-gray-600">Shelters haven't added any pets to the platform yet. Please check back later!</p>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, reactive, watch} from 'vue';
import { useRoute } from 'vue-router';
import Navbar from "@/components/Navbar.vue";
import PetCard from "@/components/PetCard.vue";
import judete from "@/assets/judete.json";

export default {
  name: 'AvailablePets',
  components: {
    Navbar, 
    PetCard
  },
  setup() {
    const shelters = ref([]);
    const loading = ref(true);
    const errorMessage = ref('');
    const showFilters = ref(false);
    const favorites = ref([]);
    const sortBy = ref("");
    const photoIndices = reactive({});
    const storyVisibility = reactive({});

    const route = useRoute();
    
    // pagination 
    const paginationState = reactive({});
    const PETS_PER_PAGE = 4;

    //counties and cities
    const counties = ref([]);
    const citiesByCounty = ref({});
    const countyCodeToName = {};
    const countyNameToCode = {};

    const filters = ref({
      name: "",
      species: "",
      breed: "",
      sex: "",
      size: "",
      healthStatus: "",
      vaccinated: false,
      neutered: false,
      urgentAdoptionNeeded: false,
      status: "", // default to showing all pets
      county: "", // county filter
      city: ""    // city filter
    });

    
    const activeFilters = computed(() => {
      const result = {};
      for (const [key, value] of Object.entries(filters.value)) {
        if (value && value !== "" && value !== false) {
          result[key] = value;
        }
      }
      return result;
    });



    const formatFilterLabel = (key) => {
      const labels = {
        name: "Name",
        species: "Species",
        breed: "Breed",
        sex: "Gender",
        size: "Size",
        healthStatus: "Health",
        vaccinated: "Vaccinated",
        neutered: "Neutered",
        urgentAdoptionNeeded: "Urgent",
        status: "Status",
        county: "County",
        city: "City"
      };
      return labels[key] || key;
    };
  

    const formatFilterValue = (key, value) => {
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      if (key === 'status') {
        const statusLabels = {
          'AVAILABLE': 'Available',
          'PENDING': 'Pending',
          'ADOPTED': 'Adopted'
        };
        return statusLabels[value] || value;
      }
      return value;
    };

    
    const clearSingleFilter = (key) => {
      if (typeof filters.value[key] === 'boolean') {
        filters.value[key] = false;
      } else {
        filters.value[key] = "";
      }
    };

    
    const countAppliedFilters = () => {
      return Object.values(filters.value).filter(value => value !== "" && value !== false).length;
    };


    const resetFilters = () => {
      filters.value = {
        name: "",
        species: "",
        breed: "",
        sex: "",
        size: "",
        healthStatus: "",
        vaccinated: false,
        neutered: false,
        urgentAdoptionNeeded: false,
        status: "",
        county: "",
        city: ""
      };
    };


    watch(() => filters.value.county, (newCounty) => {
      filters.value.city = "";
      console.log("County changed:", newCounty);
    });


    watch(() => filters.value.species, (newSpecies) => {
      filters.value.breed = "";
      console.log("Species changed:", newSpecies);
    });


    const isAnyFilterApplied = computed(() => {
      return Object.values(filters.value).some(value => {
        return value !== "" && value !== false;
      });
    });


    const processLocationData = () => {
      try {
        counties.value = judete.judete.map(county => {
          countyCodeToName[county.auto] = county.nume;
          countyNameToCode[county.nume] = county.auto;
          
          return {
            code: county.auto,
            name: county.nume
          };
        });
        
        const cityMap = {};
        judete.judete.forEach(county => {
          cityMap[county.auto] = county.localitati.map(city => 
            city.nume || city.simplu
          );
        });
        
        citiesByCounty.value = cityMap;
        
      } catch (error) {
        console.error("Error processing location data:", error);
        errorMessage.value = "Could not process location data: " + error.message;
      }
    };


    const handleCountyChange = () => {
      filters.value.city = ""; 
      
      const cities = availableCities.value;
      
      const matchingShelters = shelters.value.filter(shelter => 
        shelter.county && shelter.county.toLowerCase() === filters.value.county.toLowerCase()
      );
      matchingShelters.forEach(s => console.log(" -", s.username, s.county));
    };


    const availableCounties = computed(() => {
      const counties = shelters.value
        .map(shelter => shelter.county)
        .filter(county => county !== null && county !== undefined && county !== "");
      return [...new Set(counties)].sort();
    });


    const availableCities = computed(() => {
      if (!filters.value.county) return [];
      
      const county = filters.value.county.toUpperCase();
      
      if (citiesByCounty.value[county]) {
        return citiesByCounty.value[county];
      }
      
      const countyName = countyCodeToName[county];
      if (countyName) {
        const countyCode = countyNameToCode[countyName];
        if (countyCode && citiesByCounty.value[countyCode]) {
          return citiesByCounty.value[countyCode];
        }
      }
      
      return [];
    });



    const nextPage = (shelterId) => {
      if (!paginationState[shelterId]) {
        paginationState[shelterId] = { currentPage: 1 };
      }
      
      const shelter = sheltersWithPets.value.find(s => s.id === shelterId);
      if (!shelter) return;
      
      const totalPages = Math.ceil(shelter.pets.length / PETS_PER_PAGE);
      
      if (paginationState[shelterId].currentPage < totalPages) {
        paginationState[shelterId].currentPage++;
      }
    };
    

    const prevPage = (shelterId) => {
      if (!paginationState[shelterId] || paginationState[shelterId].currentPage <= 1) {
        return;
      }
      
      paginationState[shelterId].currentPage--;
    };


    
    const getPaginatedPets = (pets) => {
      const shelterId = pets[0]?.shelterId || (pets[0] ? pets[0].shelter?.id : null);
      
      if (!shelterId) {
        console.error('Could not determine shelter ID for pagination');
        return { pets: [], totalPages: 0 };
      }
      
      if (!paginationState[shelterId]) {
        paginationState[shelterId] = { currentPage: 1 };
      }
      
      const currentPage = paginationState[shelterId].currentPage;
      const totalPages = Math.max(1, Math.ceil(pets.length / PETS_PER_PAGE));
      
      if (currentPage > totalPages) {
        paginationState[shelterId].currentPage = totalPages;
      }
      
      const startIndex = (paginationState[shelterId].currentPage - 1) * PETS_PER_PAGE;
      const endIndex = startIndex + PETS_PER_PAGE;
      
      return {
        pets: pets.slice(startIndex, endIndex),
        totalPages: totalPages
      };
    };



    const formatAge = (age) => {
      if (!age && age !== 0) return 'Unknown';
      
      const ageInMonths = Math.round(age * 12);
      if (ageInMonths >= 12) {
        return `${Math.floor(age)} ${Math.floor(age) === 1 ? 'year' : 'years'}`;
      } else {
        return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
      }
    };


    const filterPet = (pet) => {
      if (!pet) return false;
      
      if (filters.value.name && pet.name) {
        if (!pet.name.toLowerCase().includes(filters.value.name.toLowerCase())) {
          return false;
        }
      }
      
      if (filters.value.species && pet.species) {
        if (pet.species.toLowerCase() !== filters.value.species.toLowerCase()) {
          return false;
        }
      }
      
      if (filters.value.breed && pet.breed) {
        if (pet.breed.toLowerCase() !== filters.value.breed.toLowerCase()) {
          return false;
        }
      }
      
      if (filters.value.sex && pet.sex) {
        if (pet.sex.toLowerCase() !== filters.value.sex.toLowerCase()) {
          return false;
        }
      }
      
      if (filters.value.size && pet.size) {
        if (pet.size.toLowerCase() !== filters.value.size.toLowerCase()) {
          return false;
        }
      }
      
      if (filters.value.healthStatus && pet.healthStatus) {
        if (pet.healthStatus.toLowerCase() !== filters.value.healthStatus.toLowerCase()) {
          return false;
        }
      }
      
      if (filters.value.status && pet.status) {
        if (pet.status !== filters.value.status) {
          return false;
        }
      }
      
      if (filters.value.vaccinated && !pet.vaccinated) {
        return false;
      }
      
      if (filters.value.neutered && !pet.neutered) {
        return false;
      }
      
      if (filters.value.urgentAdoptionNeeded && !pet.urgentAdoptionNeeded) {
        return false;
      }
      
      return true;
    };
    


    const sortPets = (pets) => {
      if (!sortBy.value) return pets;
      
      return [...pets].sort((a, b) => {
        if (sortBy.value === 'name') {
          return (a.name || "").localeCompare(b.name || "");
        } else if (sortBy.value === 'age') {
          return (a.age || 0) - (b.age || 0);
        } else if (sortBy.value === 'timeSpentInShelter') {
          const getTimeValue = (pet) => {
            if (!pet.timeSpentInShelter) return 0;
            return parseInt(pet.timeSpentInShelter) || 0;
          };
          return getTimeValue(a) - getTimeValue(b);
        }
        return 0;
      });
    };


    watch(filters, () => {
      Object.keys(paginationState).forEach(key => {
        if (paginationState[key]) {
          paginationState[key].currentPage = 1;
        }
      });
    }, { deep: true });


    
    const sheltersWithPets = computed(() => {
      console.log("Computing sheltersWithPets with filters:", JSON.stringify(filters.value));
      
      const filteredShelters = shelters.value.filter(shelter => {
        if (!shelter) return false;

        if (filters.value.county && shelter.county) {
          if (shelter.county.toLowerCase() !== filters.value.county.toLowerCase()) {
            return false;
          }
        }

        if (filters.value.city && shelter.city) {
          if (shelter.city.toLowerCase() !== filters.value.city.toLowerCase()) {
            return false;
          }
        }

        return true;
      });

      const sheltersWithFilteredPets = filteredShelters.map(shelter => {
        const shelterPets = shelter.pets || [];
        const filteredPets = shelterPets.filter(pet => filterPet(pet));
        
        return {
          ...shelter,
          pets: filteredPets
        };
      });

      const finalShelters = sheltersWithFilteredPets.filter(shelter => 
        shelter.pets.length > 0
      );
      
      if (sortBy.value) {
        finalShelters.forEach(shelter => {
          shelter.pets = sortPets(shelter.pets);
        });
      }

      return finalShelters;
    });


    
    const breedOptions = computed(() => {
      if (!filters.value.species) return [];
      
      const allBreeds = shelters.value
        .flatMap(shelter => (shelter.pets || []))
        .filter(pet => pet && pet.species && 
                pet.species.toLowerCase() === filters.value.species.toLowerCase())
        .map(pet => pet.breed)
        .filter(breed => breed); 
      
      return [...new Set(allBreeds)].sort();
    });



    const getPetPhotoIndex = (petId) => {
      return photoIndices[petId] || 0;
    };



    const prevImage = (pet) => {
      if (!pet.photos || pet.photos.length <= 1) return;
      const currentIndex = photoIndices[pet.id] || 0;
      photoIndices[pet.id] = (currentIndex - 1 + pet.photos.length) % pet.photos.length;
    };



    const nextImage = (pet) => {
      if (!pet.photos || pet.photos.length <= 1) return;
      const currentIndex = photoIndices[pet.id] || 0;
      photoIndices[pet.id] = (currentIndex + 1) % pet.photos.length;
    };


    const showStory = (petId) => {
      storyVisibility[petId] = true;
    };


    const hideStory = (petId) => {
      storyVisibility[petId] = false;
    };
    

    const toggleFavorite = (petId) => {
      const index = favorites.value.indexOf(petId);
      
      if (index === -1) {
        favorites.value.push(petId);
        localStorage.setItem('favoritePets', JSON.stringify(favorites.value));
      } else {
        favorites.value.splice(index, 1);
        localStorage.setItem('favoritePets', JSON.stringify(favorites.value));
      }
    };


    const isFavorited = (petId) => {
      return favorites.value.includes(petId);
    };


    const adoptPet = (petId) => {
      let petName = "this pet";
      let foundPet = null;
      
      shelters.value.forEach(shelter => {
        if (!shelter.pets) return;
        const pet = shelter.pets.find(pet => pet && pet.id === petId);
        if (pet) {
          foundPet = pet;
          petName = pet.name || pet.breed || "this pet";
        }
      });
      
      alert(`Starting adoption process for ${petName}!`);
    };


    const loadData = async () => {
      try {
        loading.value = true;
        errorMessage.value = '';
        
        const response = await fetch("http://localhost:8080/users/shelters");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch shelters: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        shelters.value = data;

        shelters.value.forEach(shelter => {
          paginationState[shelter.id] = { currentPage: 1 };
          
          if (shelter.pets) {
            shelter.pets.forEach(pet => {
              if (!pet) return;
              
              photoIndices[pet.id] = 0;
              storyVisibility[pet.id] = false;
              
              pet.photos = pet.photos || [];
              pet.story = pet.story || "";
              pet.status = pet.status || "AVAILABLE";
            });
          }
        });

        const savedFavorites = localStorage.getItem('favoritePets');
        if (savedFavorites) {
          favorites.value = JSON.parse(savedFavorites);
        }

      } catch (error) {
        console.error("Error loading data:", error);
        errorMessage.value = "Could not load shelter data. Please try again later.";
      } finally {
        loading.value = false;
      }
    };


    
    onMounted(() => {
      loadData();
      processLocationData();
      // Handle urgent filter from query params
      if (route.query.urgent === 'true') {
        filters.value.urgentAdoptionNeeded = true;
        showFilters.value = true;
      }
      
      const savedFavorites = localStorage.getItem('favoritePets');
      if (savedFavorites) {
        try {
          favorites.value = JSON.parse(savedFavorites);
        } catch (error) {
          console.error('Error loading favorites from localStorage:', error);
          favorites.value = [];
        }
      }
    });

    
    return {
      shelters,
      sheltersWithPets,
      loading,
      errorMessage,
      filters,
      showFilters,
      availableCounties,
      availableCities,
      counties,
      citiesByCounty,
      countyCodeToName,
      countyNameToCode,
      resetFilters,
      isAnyFilterApplied,
      formatAge,
      breedOptions,
      prevImage,
      nextImage,
      getPetPhotoIndex,
      showStory,
      hideStory,
      storyVisibility,
      toggleFavorite,
      isFavorited,
      adoptPet,
      sortBy,
      handleCountyChange,
      processLocationData,
      sortPets,
      activeFilters,
      formatFilterLabel,
      formatFilterValue,
      clearSingleFilter,
      countAppliedFilters,
      paginationState,
      nextPage,
      prevPage,
      getPaginatedPets
    };
  }
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

.shelter-card {
  @apply transform transition duration-300 ease-in-out;
  @apply hover:-translate-y-1 hover:shadow-lg;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>