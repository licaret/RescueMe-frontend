<template>
  <Navbar></Navbar>
  <div class="p-6 md:p-8 lg:p-10 mt-20 max-w-7xl mx-auto">
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center h-48 my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-500"></div>
      <p class="ml-4 text-gray-600 font-medium">
        Loading shelter profile...
      </p>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl mb-8 shadow-md">
      <p class="font-medium text-lg">{{ error }}</p>
      <p class="mt-2">Please try again or go back to browse available shelters.</p>
    </div>

    <div v-else class="space-y-8">
      <!-- Shelter Header Section -->
      <div class="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
        <div class="flex flex-col md:flex-row">
          <!-- Profile image-->
          <div class="w-full md:w-1/3 h-72 md:h-auto relative">
            <img 
              v-if="shelter.profilePicture && !imageError"
              :src="'data:image/jpeg;base64,' + shelter.profilePicture" 
              :alt="shelter.username"
              class="w-full h-full object-cover" 
              @error="imageError = true"
            />
            <div 
              v-else
              class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" 
            >
              <div class="text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-300 mb-2 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-gray-500 text-sm font-medium">No profile image available</p>
              </div>
            </div>
          </div>

          <!-- Shelter information -->
          <div class="w-full md:w-2/3 p-8 flex flex-col justify-between">
            <div>
              <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 class="text-3xl font-bold text-gray-800 mb-1">{{ shelter.username }}</h1>
                  <div class="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>{{ formatLocation }}</p>
                  </div>
                </div>
                <div class="mt-4 md:mt-0">
                  <span class="inline-flex px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md">
                    {{ shelter.shelterType }}
                  </span>
                </div>
              </div>

              <!-- Quick stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                  <p class="text-2xl font-bold text-gray-800">{{ shelter.pets?.length || 0 }}</p>
                  <p class="text-xs text-gray-600 font-medium">Total Pets</p>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                  <p class="text-2xl font-bold text-green-600">{{ availablePetsCount }}</p>
                  <p class="text-xs text-green-600 font-medium">Available</p>
                </div>
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                  <p class="text-2xl font-bold text-blue-600">{{ shelter.pets?.filter(p => p.species === 'Dog').length || 0 }}</p>
                  <p class="text-xs text-blue-600 font-medium">Dogs</p>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                  <p class="text-2xl font-bold text-purple-600">{{ shelter.pets?.filter(p => p.species === 'Cat').length || 0 }}</p>
                  <p class="text-xs text-purple-600 font-medium">Cats</p>
                </div>
              </div>
            </div>

            <!-- Contact actions -->
            <div class="flex flex-wrap gap-3">
              <a :href="`tel:${shelter.phoneNumber}`" class="text-sm px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:shadow-md transition-all transform hover:-translate-y-1 flex items-center" v-if="shelter.phoneNumber">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a :href="`mailto:${shelter.email}`" class="text-sm px-5 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:shadow-md transition-all transform hover:-translate-y-1 flex items-center" v-if="shelter.email">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Shelter Information Sections -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column: About and Mission -->
        <div class="md:col-span-2 space-y-6">
          <!-- About Section -->
          <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About {{ shelter.username }}
            </h2>
            
            <div class="space-y-5">
              <div class="flex items-start">
                <div class="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-full mr-4 shadow-sm">
                  <svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 text-lg">Founded</h3>
                  <p class="text-gray-600">{{ shelter.yearFounded || 'Not specified' }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-full mr-4 shadow-sm">
                  <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 text-lg">Location</h3>
                  <p class="text-gray-600">{{ formatFullAddress }}</p>
                  <p v-if="shelter.zipCode" class="text-gray-600 text-sm">Zip Code: {{ shelter.zipCode }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-full mr-4 shadow-sm">
                  <svg class="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 text-lg">Contact</h3>
                  <p class="text-gray-600">{{ shelter.phoneNumber || 'Phone not available' }}</p>
                  <p class="text-gray-600">{{ shelter.email || 'Email not available' }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-full mr-4 shadow-sm">
                  <svg class="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-800 text-lg">Hours of Operation</h3>
                  <p class="text-gray-600">{{ shelter.hoursOfOperation || 'Not specified' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mission Section -->
          <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Our Mission
            </h2>
            
            <div class="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border-l-4 border-red-500 shadow-sm">
              <div class="text-gray-700 leading-relaxed">
                {{ shelter.mission || 'Our mission is to find loving forever homes for all animals in our care. We believe every pet deserves a chance at a happy life with a family that will cherish them. Through compassionate care, education, and community outreach, we strive to end animal homelessness and promote responsible pet ownership.' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Stats and Actions -->
        <div class="space-y-6">
          <!-- Shelter Stats -->
          <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Shelter Stats
            </h2>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-xl transition-colors">
                <span class="text-gray-600 font-medium">Pets Currently Housed:</span>
                <span class="font-bold text-gray-800 bg-gray-100 px-4 py-1.5 rounded-full">{{ shelter.pets?.length || 0 }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors">
                <span class="text-gray-600 font-medium">Available Pets:</span>
                <span class="font-bold text-green-600 bg-green-100 px-4 py-1.5 rounded-full">{{ availablePetsCount }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors">
                <span class="text-gray-600 font-medium">Dogs:</span>
                <span class="font-bold text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full">{{ shelter.pets?.filter(p => p.species === 'Dog').length || 0 }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors">
                <span class="text-gray-600 font-medium">Cats:</span>
                <span class="font-bold text-purple-600 bg-purple-100 px-4 py-1.5 rounded-full">{{ shelter.pets?.filter(p => p.species === 'Cat').length || 0 }}</span>
              </div>
              
              <div class="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span class="text-gray-600 font-medium">Urgent Adoptions:</span>
                <span class="font-bold text-red-600 bg-red-100 px-4 py-1.5 rounded-full">{{ shelter.pets?.filter(p => p.urgentAdoptionNeeded).length || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Get Involved -->
          <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              Get Involved
            </h2>
            
            <div class="space-y-4">
              <button class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-2xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1 flex justify-center items-center">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Donate Now
              </button>
              
              <button class="w-full bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 font-medium py-3 px-4 rounded-2xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1 flex justify-center items-center">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Volunteer
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Pet Showcase Section with Pagination -->
      <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 mt-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Available Pets
        </h2>

        <div v-if="shelter.pets && shelter.pets.length > 0" class="relative">
          <!-- Pagination container with pets and arrows -->
          <div class="flex items-center">
            <!-- Left navigation button -->
            <button 
              @click="prevPage" 
              class="flex-shrink-0 mr-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 rounded-full p-4 shadow-md transition-all transform hover:-translate-y-1"
              :disabled="currentPage === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 0 }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Pets container with pagination -->
            <div class="flex-grow overflow-hidden">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PetCard 
                  v-for="pet in paginatedPets" 
                  :key="pet.id" 
                  :pet="pet"
                  userType="public"
                  :favorited="false"
                  @adopt="adoptPet"
                  class="transform transition-all hover:-translate-y-2 hover:shadow-xl"
                />
              </div>
            </div>

            <!-- Right navigation button -->
            <button 
              @click="nextPage" 
              class="flex-shrink-0 ml-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 rounded-full p-4 shadow-md transition-all transform hover:-translate-y-1"
              :disabled="currentPage >= maxPage"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage >= maxPage }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Page indicators -->
          <div class="flex justify-center mt-8 space-x-3">
            <div 
              v-for="index in maxPage + 1" 
              :key="index"
              @click="currentPage = index - 1"
              class="w-3 h-3 rounded-full cursor-pointer transition-all"
              :class="currentPage === index - 1 ? 'bg-red-600 scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'"
            ></div>
          </div>
        </div>
        
        <!-- No pets message -->
        <div v-else class="bg-gradient-to-r from-gray-50 to-gray-100 text-center py-16 rounded-3xl shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No Available Pets</h3>
          <p class="text-gray-500 max-w-md mx-auto">This shelter currently doesn't have any pets listed. Please check back soon or contact them directly.</p>
          <button class="mt-6 inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Get Notified When Pets Arrive
          </button>
        </div>
      </div>

      <!-- Event Showcase Section with Pagination -->
      <div class="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 mt-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upcoming Events
        </h2>

        <div v-if="displayedEvents.length > 0" class="relative">
          <!-- Pagination container with events and arrows -->
          <div class="flex items-center">
            <!-- Left navigation button -->
            <button 
              @click="prevEventPage" 
              class="flex-shrink-0 mr-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 rounded-full p-4 shadow-md transition-all transform hover:-translate-y-1"
              :disabled="eventCurrentPage === 0"
              :class="{ 'opacity-50 cursor-not-allowed': eventCurrentPage === 0 }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Events container -->
            <div class="flex-grow overflow-hidden">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <EventCard
                  v-for="event in displayedEvents"
                  :key="event.id"
                  :event="event"
                  @status-updated="updateEventStatus"
                  @event-updated="onEventUpdated"
                />
              </div>
            </div>

            <!-- Right navigation button -->
            <button 
              @click="nextEventPage" 
              class="flex-shrink-0 ml-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 rounded-full p-4 shadow-md transition-all transform hover:-translate-y-1"
              :disabled="eventCurrentPage >= eventMaxPage"
              :class="{ 'opacity-50 cursor-not-allowed': eventCurrentPage >= eventMaxPage }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Page indicators -->
          <div class="flex justify-center mt-8 space-x-3">
            <div 
              v-for="index in eventMaxPage + 1" 
              :key="index"
              @click="eventCurrentPage = index - 1"
              class="w-3 h-3 rounded-full cursor-pointer transition-all"
              :class="eventCurrentPage === index - 1 ? 'bg-red-600 scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'"
            ></div>
          </div>
        </div>
        
        <!-- No events message -->
        <div v-else class="bg-gradient-to-r from-gray-50 to-gray-100 text-center py-16 rounded-3xl shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-700 mb-2">No Upcoming Events</h3>
          <p class="text-gray-500 max-w-md mx-auto">This shelter currently doesn't have any events listed. Please check back soon or contact them directly.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from "@/components/Navbar.vue";
import PetCard from "@/components/PetCard.vue";
import EventCard from "@/components/EventCard.vue";

export default {
  name: 'ShelterProfile',
  components: {
    Navbar,
    PetCard, 
    EventCard
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const shelterId = route.params.id;
    const shelter = ref({});
    const loading = ref(true);
    const error = ref('');
    const imageError = ref(false);

    // Pets pagination
    const currentPage = ref(0);
    const petsPerPage = 3;

    const availablePetsCount = computed(() => {
      if (!shelter.value.pets) return 0;
      return shelter.value.pets.filter(pet => pet.status === 'AVAILABLE').length;
    });

    const paginatedPets = computed(() => {
      if (!shelter.value.pets) return [];
      const start = currentPage.value * petsPerPage;
      return shelter.value.pets.slice(start, start + petsPerPage);
    });

    const maxPage = computed(() => {
      if (!shelter.value.pets) return 0;
      return Math.ceil(shelter.value.pets.length / petsPerPage) - 1;
    });

    const nextPage = () => {
      if (currentPage.value < maxPage.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
      }
    };

    // Events pagination
    const eventCurrentPage = ref(0);
    const eventsPerPage = 3;

    const eventMaxPage = computed(() => {
      if (!shelter.value.events || shelter.value.events.length === 0) return 0;
      return Math.ceil(shelter.value.events.length / eventsPerPage) - 1;
    });

    const displayedEvents = computed(() => {
      if (!shelter.value.events || shelter.value.events.length === 0) return [];
      const start = eventCurrentPage.value * eventsPerPage;
      return shelter.value.events.slice(start, start + eventsPerPage);
    });

    const nextEventPage = () => {
      if (eventCurrentPage.value < eventMaxPage.value) {
        eventCurrentPage.value++;
      }
    };

    const prevEventPage = () => {
      if (eventCurrentPage.value > 0) {
        eventCurrentPage.value--;
      }
    };

    const formatLocation = computed(() => {
      if (!shelter.value) return 'Location unavailable';
      const city = shelter.value.city || '';
      const county = shelter.value.county || '';
      if (city && county) return `${city}, ${county}`;
      if (city) return city;
      if (county) return county;
      return 'Location unavailable';
    });

    const formatFullAddress = computed(() => {
      if (!shelter.value) return 'Address unavailable';
      const fullAddress = shelter.value.fullAddress;
      const city = shelter.value.city;
      const county = shelter.value.county;
      if (fullAddress) {
        if (city && !fullAddress.includes(city)) {
          return `${fullAddress}, ${city}${county ? `, ${county}` : ''}`;
        } else if (county && !fullAddress.includes(county)) {
          return `${fullAddress}${county ? `, ${county}` : ''}`;
        }
        return fullAddress;
      } else {
        const components = [];
        if (city) components.push(city);
        if (county) components.push(county);
        return components.length > 0 ? components.join(', ') : 'Address unavailable';
      }
    });

    const adoptPet = (petId) => {
      alert(`Starting adoption process for pet ID: ${petId}`);
    };

    // Event handlers for attendance status updates
    const updateEventStatus = ({ id, newStatus }) => {
      console.log(`Updating event ${id} status to ${newStatus}`);
      
      // Find and update the event in shelter's events array
      if (shelter.value.events) {
        const eventIndex = shelter.value.events.findIndex(event => event.id === id);
        if (eventIndex !== -1) {
          // Create a new event object with the updated status to maintain reactivity
          const updatedEvent = { 
            ...shelter.value.events[eventIndex],
            userAttendanceStatus: newStatus  // This matches the property we set during fetch
          };
          
          // Replace the old event with the updated one
          shelter.value.events.splice(eventIndex, 1, updatedEvent);
        }
      }
    };

    const onEventUpdated = (updatedEvent) => {
      console.log('Event updated:', updatedEvent);
      
      // Find and update the event in shelter's events array
      if (shelter.value.events) {
        const eventIndex = shelter.value.events.findIndex(event => event.id === updatedEvent.id);
        if (eventIndex !== -1) {
          // Replace the old event with the updated one
          shelter.value.events.splice(eventIndex, 1, updatedEvent);
        }
      }
    };

    const loadShelterData = async () => {
      try {
        loading.value = true;
        error.value = '';
        imageError.value = false;

        // Fetch shelter basic data
        const response = await fetch(`http://localhost:8080/users/shelter/${shelterId}`);
        if (!response.ok) throw new Error(`Failed to fetch shelter: ${response.status} ${response.statusText}`);
        shelter.value = await response.json();

        // Fetch pets
        const petsResponse = await fetch(`http://localhost:8080/pets/${shelterId}`);
        if (petsResponse.ok) {
          const petsData = await petsResponse.json();
          shelter.value.pets = petsData.map(pet => {
            if (pet.photos && pet.photos.length > 0) {
              pet.photos.forEach(photo => {
                if (!photo.url && photo.id) {
                  photo.url = `data:image/jpeg;base64,${photo}`;
                }
              });
            }
            return pet;
          });
        } else {
          console.error("Failed to fetch pets for this shelter");
          shelter.value.pets = [];
        }

        // Fetch events with user participation status
        const eventsResponse = await fetch(`http://localhost:8080/api/v1/events/shelter/${shelterId}`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          
          // Filter for upcoming and active events
          const now = new Date();
          const upcomingEvents = eventsData.filter(event => 
            event.isActive && new Date(event.endDateTime) > now
          );
          
          // Get current user ID for checking participation
          const userId = localStorage.getItem('Id');
          
          // If user is logged in, fetch participation status for all events at once
          if (userId) {
            try {
              const userEventsResponse = await fetch(
                `http://localhost:8080/api/v1/events/user/${userId}`
              );
              
              if (userEventsResponse.ok) {
                const userEvents = await userEventsResponse.json();
                console.log('User events:', userEvents);
                
                // Apply the participation status to each event
                upcomingEvents.forEach(event => {
                  const userEvent = userEvents.find(ue => ue.eventId === event.id);
                  if (userEvent) {
                    // Make sure we're using the right property name that the EventCard component expects
                    event.userAttendanceStatus = userEvent.status; 
                    console.log(`Event ${event.id} has status: ${event.userAttendanceStatus}`);
                  }
                });
              }
            } catch (err) {
              console.error("Failed to fetch user's participation status:", err);
            }
          }
          
          shelter.value.events = upcomingEvents;
          
        } else {
          console.error("Failed to fetch events for this shelter");
          shelter.value.events = [];
        }

      } catch (err) {
        console.error("Error loading shelter data:", err);
        error.value = "Could not load shelter information. Please try again later.";
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadShelterData();
    });

    return {
      shelter,
      loading,
      error,
      imageError,
      availablePetsCount,
      formatLocation,
      formatFullAddress,
      adoptPet,
      currentPage,
      paginatedPets,
      maxPage,
      nextPage,
      prevPage,
      // Events
      eventCurrentPage,
      eventMaxPage,
      displayedEvents,
      nextEventPage,
      prevEventPage,
      updateEventStatus,
      onEventUpdated
    };
  }
};
</script>

<style scoped>
.shadow-lg {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.rounded-3xl {
  border-radius: 1.5rem; 
}

.rounded-4xl {
  border-radius: 2rem; 
}

button, a.button {
  border-radius: 9999px !important; 
}

.card {
  border-radius: 1.5rem !important;
  overflow: hidden;
}

input, select, textarea {
  border-radius: 1rem !important;
}

.badge {
  border-radius: 9999px !important;
  padding: 0.5rem 1rem !important;
}

.shadow-enhanced {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.transition-all {
  transition: all 0.3s ease;
}

.transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.hover\:-translate-y-2:hover {
  transform: translateY(-0.5rem);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.space-y-6 > * {
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);
  opacity: 0;
}

.space-y-6 > *:nth-child(1) { --animation-order: 1; }
.space-y-6 > *:nth-child(2) { --animation-order: 2; }
.space-y-6 > *:nth-child(3) { --animation-order: 3; }
.space-y-6 > *:nth-child(4) { --animation-order: 4; }
.space-y-6 > *:nth-child(5) { --animation-order: 5; }
</style>