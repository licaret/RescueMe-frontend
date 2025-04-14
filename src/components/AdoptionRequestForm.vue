<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 overflow-y-auto backdrop-blur-sm"
       @click="handleBackdropClick">
    <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transform transition-all duration-300"
         @click.stop>
      <!-- Form Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 v-if="pet" class="text-xl font-bold text-gray-800">
          Adoption Request for {{ pet.name }}
        </h2>
        <p v-else class="text-gray-500 italic">Loading pet information...</p>
        <button @click="goBack" class="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Success Message -->
      <div v-if="successMessage" class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Success!</h3>
          <p class="text-gray-600 mb-6">{{ successMessage }}</p>
          <div class="flex justify-center gap-4">
            <button 
              @click="navigateToAdoptionRequests" 
              class="px-4 py-2 bg-pink-600 text-white rounded-2xl font-medium hover:bg-pink-700 transition-colors"
            >
              View My Adoption Requests
            </button>
            <button 
              @click="goToHomePage" 
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-2xl font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-else-if="!pet" class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading pet information...</p>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center p-6">
        <div class="text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
          <button 
            @click="errorMessage = ''" 
            class="px-4 py-2 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Form Content (Only show when pet data is loaded) -->
      <div v-else class="overflow-y-auto flex-1 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Pet Overview -->
          <div class="bg-gray-50 rounded-2xl p-4">
            <h3 class="font-medium text-gray-800 mb-4 flex items-center">
              <span class="bg-pink-100 text-pink-700 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">1</span>
              Pet Overview
            </h3>
            
            <div class="flex items-start gap-4">
              <!-- Pet Image -->
              <div class="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  v-if="pet && pet.photos && pet.photos.length > 0"
                  :src="pet.photos[0]?.url"
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
                <h4 class="text-lg font-bold text-gray-800">{{ pet.name }}</h4>
                <div class="text-sm text-gray-500 mb-2">{{ pet.species }} • {{ pet.breed || 'Mixed Breed' }}</div>
                
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-500">Age:</span>
                    <span class="text-gray-700 font-medium">{{ formatAge(pet.age) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Sex:</span>
                    <span class="text-gray-700 font-medium">{{ pet.sex }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Size:</span>
                    <span class="text-gray-700 font-medium">{{ pet.size }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Status:</span>
                    <span class="text-gray-700 font-medium">{{ pet.status }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shelter Information -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span class="text-sm font-medium text-gray-700">From: {{ pet.shelterUsername || 'Animal Shelter' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Adopter Information -->
          <div>
            <h3 class="font-medium text-gray-800 mb-4 flex items-center">
              <span class="bg-pink-100 text-pink-700 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">2</span>
              Your Information
            </h3>
            
            <div v-if="userProfile" class="mb-4 p-4 bg-gray-50 rounded-2xl">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-800">{{ userProfile.username }}</div>
                  <div class="text-sm text-gray-500">{{ userProfile.email }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-500 border-t border-gray-200 pt-2 mt-2">
                This information will be shared with the shelter.
              </div>
            </div>
            
            <div v-else class="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-sm font-medium text-yellow-700">Please login to submit adoption requests</span>
              </div>
            </div>
            
            <!-- Contact Form (Additional Information) -->
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Your phone number"
                  required
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    v-model="form.city"
                    class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Your city"
                    required
                  />
                </div>
                
                <div>
                  <label for="county" class="block text-sm font-medium text-gray-700 mb-1">County</label>
                  <input
                    type="text"
                    id="county"
                    v-model="form.county"
                    class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Your county"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Questionnaire Section -->
        <div class="mt-8">
          <h3 class="font-medium text-gray-800 mb-4 flex items-center">
            <span class="bg-pink-100 text-pink-700 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2">3</span>
            Adoption Questionnaire
          </h3>
          
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div class="divide-y divide-gray-200">
              <!-- Housing -->
              <div class="p-4">
                <h4 class="font-medium text-gray-800 mb-2">Housing Situation</h4>
                <div class="space-y-3">
                  <div>
                    <label for="housingType" class="block text-sm font-medium text-gray-700 mb-1">What type of home do you live in?</label>
                    <select
                      id="housingType"
                      v-model="form.housingType"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condominium</option>
                      <option value="mobile">Mobile Home</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="ownRent" class="block text-sm font-medium text-gray-700 mb-1">Do you own or rent your home?</label>
                    <select
                      id="ownRent"
                      v-model="form.ownRent"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="own">Own</option>
                      <option value="rent">Rent</option>
                      <option value="family">Live with family</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div v-if="form.ownRent === 'rent'">
                    <label for="landlordPermission" class="block text-sm font-medium text-gray-700 mb-1">Do you have your landlord's permission to have pets?</label>
                    <div class="flex items-center gap-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.landlordPermission" value="yes" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.landlordPermission" value="no" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">No</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.landlordPermission" value="notSure" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Not sure</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label for="yard" class="block text-sm font-medium text-gray-700 mb-1">Do you have a yard?</label>
                    <div class="flex items-center gap-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.hasYard" value="yes" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.hasYard" value="no" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="form.hasYard === 'yes'">
                    <label for="fencedYard" class="block text-sm font-medium text-gray-700 mb-1">Is your yard fully fenced?</label>
                    <div class="flex items-center gap-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.fencedYard" value="yes" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.fencedYard" value="partial" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Partially</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.fencedYard" value="no" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Household -->
              <div class="p-4">
                <h4 class="font-medium text-gray-800 mb-2">Household Information</h4>
                <div class="space-y-3">
                  <div>
                    <label for="householdMembers" class="block text-sm font-medium text-gray-700 mb-1">How many people live in your household?</label>
                    <input
                      type="number"
                      id="householdMembers"
                      v-model="form.householdMembers"
                      min="1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label for="children" class="block text-sm font-medium text-gray-700 mb-1">Do you have children under 18 in your home?</label>
                    <div class="flex items-center gap-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.hasChildren" value="yes" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.hasChildren" value="no" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="form.hasChildren === 'yes'">
                    <label for="childrenAges" class="block text-sm font-medium text-gray-700 mb-1">What are the ages of the children in your home?</label>
                    <input
                      type="text"
                      id="childrenAges"
                      v-model="form.childrenAges"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      placeholder="e.g. 3, 7, 12"
                    />
                  </div>
                  
                  <div>
                    <label for="otherPets" class="block text-sm font-medium text-gray-700 mb-1">Do you have other pets?</label>
                    <div class="flex items-center gap-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.hasOtherPets" value="yes" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="form.hasOtherPets" value="no" class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl" />
                        <span class="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="form.hasOtherPets === 'yes'">
                    <label for="otherPetsDescription" class="block text-sm font-medium text-gray-700 mb-1">Please describe your current pets (type, age, temperament)</label>
                    <textarea
                      id="otherPetsDescription"
                      v-model="form.otherPetsDescription"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      placeholder="Tell us about your current pets"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Experience & Expectations -->
              <div class="p-4">
                <h4 class="font-medium text-gray-800 mb-2">Experience & Expectations</h4>
                <div class="space-y-3">
                  <div>
                    <label for="petExperience" class="block text-sm font-medium text-gray-700 mb-1">Describe your experience with pets</label>
                    <select
                      id="petExperience"
                      v-model="form.petExperience"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="first">This will be my first pet</option>
                      <option value="some">Some experience with pets</option>
                      <option value="experienced">Experienced pet owner</option>
                      <option value="professional">Professional experience (vet, trainer, etc.)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="activity" class="block text-sm font-medium text-gray-700 mb-1">How active is your lifestyle?</label>
                    <select
                      id="activity"
                      v-model="form.activityLevel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="sedentary">Mostly sedentary</option>
                      <option value="moderate">Moderately active</option>
                      <option value="active">Very active</option>
                      <option value="varies">Varies day to day</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="timeAlone" class="block text-sm font-medium text-gray-700 mb-1">How many hours will the pet be alone during a typical day?</label>
                    <select
                      id="timeAlone"
                      v-model="form.timeAlone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="0-2">0-2 hours</option>
                      <option value="3-5">3-5 hours</option>
                      <option value="6-8">6-8 hours</option>
                      <option value="8+">More than 8 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="adoptReason" class="block text-sm font-medium text-gray-700 mb-1">Why do you want to adopt this pet?</label>
                    <textarea
                      id="adoptReason"
                      v-model="form.adoptReason"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      placeholder="Tell us why you want to adopt this pet"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Additional Information -->
              <div class="p-4">
                <h4 class="font-medium text-gray-800 mb-2">Additional Information</h4>
                <div>
                  <label for="additionalInfo" class="block text-sm font-medium text-gray-700 mb-1">Is there anything else you'd like to share with the shelter?</label>
                  <textarea
                    id="additionalInfo"
                    v-model="form.additionalInfo"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Share any other relevant information"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Terms and Conditions -->
          <div class="mt-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.agreeToTerms"
                  type="checkbox"
                  class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded-2xl"
                  required
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">I agree to the terms and conditions</label>
                <p class="text-gray-500">I confirm that all information provided is accurate and complete. I understand that providing false information may result in my application being rejected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Form Footer -->
      <div v-if="!successMessage && !errorMessage && pet" class="px-6 py-4 border-t border-gray-100 flex justify-between bg-gray-50">
        <button 
          @click="goBack"
          class="px-4 py-2 border border-gray-300 rounded-2xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Cancel
        </button>
        <button 
          @click="submitForm"
          :disabled="isSubmitting || !isFormValid || !userProfile || !pet"
          class="px-6 py-2 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <span v-if="isSubmitting" class="mr-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          Submit Adoption Request
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getUserById } from '../services/user_service';
import { getPetById } from '../services/pet_service';
import { submitAdoptionRequest } from '../services/adoption_service';
import { getCurrentAdoptionPet, clearCurrentAdoptionPet } from '../services/adoption_state_service';

export default {
  name: 'AdoptionRequestForm',
  props: {
    petId: {
      type: [String, Number],
      required: true
    }
  },
  
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const userProfile = ref(null);
    const isSubmitting = ref(false);
    const pet = ref(null);
    const errorMessage = ref('');
    const successMessage = ref('');
    
    // Form data
    const form = ref({
      // Contact information
      phone: '',
      city: '',
      county: '',
      
      // Housing
      housingType: '',
      ownRent: '',
      landlordPermission: '',
      hasYard: '',
      fencedYard: '',
      
      // Household
      householdMembers: 1,
      hasChildren: '',
      childrenAges: '',
      hasOtherPets: '',
      otherPetsDescription: '',
      
      // Experience & Expectations
      petExperience: '',
      activityLevel: '',
      timeAlone: '',
      adoptReason: '',
      
      // Additional
      additionalInfo: '',
      agreeToTerms: false
    });
    
    // Form validation
    const isFormValid = computed(() => {
      return form.value.phone && 
             form.value.city && 
             form.value.county &&
             form.value.housingType &&
             form.value.ownRent &&
             (form.value.ownRent !== 'rent' || form.value.landlordPermission) &&
             form.value.hasYard &&
             (form.value.hasYard !== 'yes' || form.value.fencedYard) &&
             form.value.householdMembers &&
             form.value.hasChildren &&
             (form.value.hasChildren !== 'yes' || form.value.childrenAges) &&
             form.value.hasOtherPets &&
             (form.value.hasOtherPets !== 'yes' || form.value.otherPetsDescription) &&
             form.value.petExperience &&
             form.value.activityLevel &&
             form.value.timeAlone &&
             form.value.adoptReason &&
             form.value.agreeToTerms;
    });
    

    
    const loadPet = async () => {
      console.log("Loading pet data for ID:", props.petId);
      
      const storedPet = getCurrentAdoptionPet();
      
      if (storedPet && storedPet.id == props.petId) {
        console.log("Found pet in state service:", storedPet);
        pet.value = storedPet;
        return;
      }
      
      console.log("Fetching pet from API");
      try {
        const petData = await getPetById(props.petId);
        console.log("Fetched pet data from API:", petData);
        pet.value = petData;
      } catch (error) {
        console.error("Error fetching pet data:", error);
        errorMessage.value = "Failed to load pet information. Please try again.";
      }
    };
    


    onMounted(async () => {
      console.log("AdoptionRequestForm component mounted");
      
      const userId = localStorage.getItem('Id');
      if (!userId) {
        router.push('/login');
        return;
      }
      
      try {
        const userData = await getUserById(userId);
        userProfile.value = userData;
        
        if (userData.phoneNumber) {
          form.value.phone = userData.phoneNumber;
        }
        if (userData.city) {
          form.value.city = userData.city;
        }
        if (userData.county) {
          form.value.county = userData.county;
        }
        
        await loadPet();
      } catch (error) {
        console.error('Error in component setup:', error);
        errorMessage.value = "Failed to load user information. Please try again.";
      }
    });
    

    
    onBeforeUnmount(() => {
      if (!successMessage.value) {
        clearCurrentAdoptionPet();
      }
    });
    


    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        goBack();
      }
    };
    

    const goBack = () => {
      router.go(-1);
    };
    

    const goToHomePage = () => {
      router.push('/home');
    };
    
    
    const navigateToAdoptionRequests = () => {
      router.push('/my-adoption-requests');
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
    
    

    const submitForm = async () => {
      if (!isFormValid.value || !userProfile.value || !pet.value) {
        if (!pet.value) {
          errorMessage.value = 'Pet information is missing. Please try again.';
        } else {
          errorMessage.value = 'Please fill out all required fields.';
        }
        return;
      }
      
      isSubmitting.value = true;
      errorMessage.value = '';
      
      try {
        const adoptionData = {
          userId: userProfile.value.id,
          petId: parseInt(pet.value.id), 
          requestDetails: {
            contactInfo: {
              name: userProfile.value.username,
              email: userProfile.value.email,
              phone: form.value.phone,
              city: form.value.city,
              county: form.value.county
            },
            housing: {
              type: form.value.housingType,
              ownership: form.value.ownRent,
              landlordPermission: form.value.landlordPermission,
              hasYard: form.value.hasYard,
              fencedYard: form.value.fencedYard
            },
            household: {
              members: parseInt(form.value.householdMembers),
              children: {
                has: form.value.hasChildren,
                ages: form.value.childrenAges
              },
              otherPets: {
                has: form.value.hasOtherPets,
                description: form.value.otherPetsDescription
              }
            },
            experience: {
              level: form.value.petExperience,
              activityLevel: form.value.activityLevel,
              timeAlone: form.value.timeAlone,
              reason: form.value.adoptReason
            },
            additionalInfo: form.value.additionalInfo
          },
          status: 'PENDING',
          requestDate: new Date().toISOString()
        };
        
        console.log('Submitting adoption request with data:', JSON.stringify(adoptionData));
        
        await submitAdoptionRequest(adoptionData);
        
        successMessage.value = `Your adoption request for ${pet.value.name} has been submitted successfully! The shelter will review your application and contact you soon.`;
        
        clearCurrentAdoptionPet();
      } catch (error) {
        console.error('Error submitting adoption request:', error);
        errorMessage.value = error.message || 'Failed to submit adoption request. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    
    return {
      pet,
      userProfile,
      form,
      isFormValid,
      isSubmitting,
      errorMessage,
      successMessage,
      handleBackdropClick,
      goBack,
      goToHomePage,
      navigateToAdoptionRequests,
      formatAge,
      submitForm
    };
  }
};
</script>