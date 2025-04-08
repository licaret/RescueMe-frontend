<template>
    <Navbar />
    <div class="pt-40 pb-20">
        <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-md mt-8 overflow-hidden">
        <!-- Toast notification -->
        <div 
          v-if="showSuccessToast" 
          class="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center transition-all duration-300 ease-in-out z-50"
        >
          <div class="flex-shrink-0 mr-2">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            {{ successMessage }}
          </div>
          <button @click="showSuccessToast = false" class="ml-4 text-gray-500 hover:text-gray-800">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <!-- Error toast notification -->
        <div 
          v-if="showErrorToast" 
          class="fixed top-20 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center transition-all duration-300 ease-in-out z-50"
        >
          <div class="flex-shrink-0 mr-2">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            {{ errorMessage }}
          </div>
          <button @click="showErrorToast = false" class="ml-4 text-gray-500 hover:text-gray-800">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div class="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div class="h-32 bg-gradient-to-r from-red-700 to-red-200"></div>
          
          <div class="p-6 relative">
            <div class="absolute -top-16 left-6 md:left-8">
              <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                <img 
                  :src="adopter.profilePictureUrl || blankProfilePicture" 
                  alt="Profile picture" 
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- Profile information-->
            <div class="mt-16 md:mt-12 md:ml-36">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div class="flex items-center">
                    <h2 class="text-2xl font-bold text-gray-800">{{ adopter.username }}</h2>
                  </div>
                  <div class="mt-1 text-lg font-medium text-gray-600">Adopter</div>
                </div>
              </div>
              
              <!-- Contact information -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                <div class="flex items-center text-gray-600">
                  <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ adopter.email }}</span>
                </div>
                <div v-if="adopter.phoneNumber" class="flex items-center text-gray-600">
                  <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{{ adopter.phoneNumber }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Adoption Statistics -->
        <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-2xl shadow p-6 flex items-center">
            <div class="rounded-full bg-green-100 p-3 mr-4">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Completed Adoptions</p>
              <p class="text-2xl font-bold text-gray-800">{{ adoptionStats.completed }}</p>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow p-6 flex items-center">
            <div class="rounded-full bg-yellow-100 p-3 mr-4">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Pending Adoptions</p>
              <p class="text-2xl font-bold text-gray-800">{{ adoptionStats.pending }}</p>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow p-6 flex items-center">
            <div class="rounded-full bg-blue-100 p-3 mr-4">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Favorite Pets</p>
              <p class="text-2xl font-bold text-gray-800">{{ adoptionStats.favorites }}</p>
            </div>
          </div>
        </div>
  
        <!-- Tab navigation -->
        <div class="mb-8 border-b">
          <div class="flex overflow-x-auto">
            <button 
              @click="activeTab = 'account'" 
              class="px-4 py-2 text-sm font-medium whitespace-nowrap"
              :class="activeTab === 'account' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'"
            >
              Account Information
            </button>
            <button 
              @click="activeTab = 'password'" 
              class="px-4 py-2 text-sm font-medium whitespace-nowrap"
              :class="activeTab === 'password' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'"
            >
              Password
            </button>
            <button 
              @click="activeTab = 'adoptions'" 
              class="px-4 py-2 text-sm font-medium whitespace-nowrap"
              :class="activeTab === 'adoptions' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'"
            >
              My Adoptions
            </button>
          </div>
        </div>
  
        <!-- Account Information Tab -->
        <div v-if="activeTab === 'account'" class="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">Account Information</h2>
          
          <div class="flex items-start mb-8">
            <div class="mr-6">
              <img 
                :src="adopter.profilePictureUrl || blankProfilePicture" 
                alt="Profile picture" 
                class="w-20 h-20 rounded-full object-cover border"
              />
                <input type="file" @change="handleProfilePictureUpload" class="hidden" ref="fileInput" accept="image/*">
            </div>
            <div class="flex flex-row space-x-5 mt-6">
              <button 
                @click="$refs.fileInput.click()"
                class="bg-red-600 text-white px-4 py-1.5 rounded text-sm flex items-center"
                :disabled="isUploadingProfilePicture"
              >
                <span v-if="isUploadingProfilePicture" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
                <span v-else class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </span>
              </button>
              <button 
                @click="removeProfilePicture"
                class="text-gray-600 text-sm border border-gray-300 px-4 py-1.5 rounded hover:text-gray-800"
                :disabled="!adopter.profilePictureUrl || isDeletingProfilePicture"
              >
                <span v-if="isDeletingProfilePicture">Removing...</span>
                <span v-else>Remove</span>
              </button>
            </div>
          </div>
            
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">
                Username
              </label>
              <div class="w-full border rounded p-2 bg-gray-100 text-gray-700">
                {{ adopter.username }}
              </div>
              <p class="text-gray-500 text-xs mt-1">Username cannot be changed</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                Email address
              </label>
              <div class="w-full border rounded p-2 bg-gray-100 text-gray-700">
                {{ adopter.email }}
              </div>
              <p class="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                Phone number<span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                
                <div class="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                  <span class="text-gray-500 pl-2">+40</span>
                </div>
                
                <input 
                  v-model="phoneInput"
                  @input="validatePhoneOnInput"
                  type="tel"
                  class="w-full border rounded p-2 pl-20"
                  :class="{
                    'border-red-500': phoneError, 
                  }"
                  placeholder="712 345 678"
                />
              </div>
              <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
              <p v-else class="text-gray-500 text-xs mt-1">Enter a valid Romanian phone number</p>
            </div>
          </div>
          
          <div>
            <!-- Only show save button when there are changes -->
            <button 
              v-if="accountHasChanges"
              @click="saveChanges('account')"
              class="bg-red-600 text-white px-4 py-2 rounded font-medium min-w-[120px]"
              :disabled="isSaving"
            >
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save changes</span>
            </button>
            <button
              v-if="accountHasChanges"
              @click="discardAccountChanges"
              class="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded font-medium ml-3 min-w-[120px]"
            >
              Discard Changes
            </button>
            <!-- Message shown when no changes -->
            <p v-if="!accountHasChanges" class="text-sm text-gray-500 italic">
              Make changes to update your account information
            </p>
          </div>
        </div>
        
        <!-- Password Tab-->
        <div v-if="activeTab === 'password'" class="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">Password</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column: Password Fields -->
            <div>
              <div class="mb-6 relative">
                <label class="block text-sm font-medium mb-1">
                  Current password<span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    v-model="passwordData.currentPassword"
                    @focus="() => { errors.currentPassword = ''; }"
                    :type="passwordVisibility.current ? 'text' : 'password'"
                    placeholder="Enter your current password" 
                    class="w-full border rounded p-2 pr-10"
                    :class="{'border-red-500': errors.currentPassword}"
                  />
                  <button 
                    type="button"
                    @click="() => passwordVisibility.current = !passwordVisibility.current"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                  >
                    <svg v-if="passwordVisibility.current" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.currentPassword" class="text-red-500 text-sm mt-1">
                  {{ errors.currentPassword }}
                </p>
              </div>
              
              <div class="mb-6 relative">
                <label class="block text-sm font-medium mb-1">
                  Your new password<span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    v-model="passwordData.newPassword"
                    @input="checkPasswordRequirements"
                    @focus="() => { errors.newPassword = ''; }"
                    :type="passwordVisibility.new ? 'text' : 'password'"
                    placeholder="Enter your new password" 
                    class="w-full border rounded p-2 pr-10"
                    :class="{'border-red-500': errors.newPassword}"
                  />
                  <button 
                    type="button"
                    @click="() => passwordVisibility.new = !passwordVisibility.new"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                  >
                    <svg v-if="passwordVisibility.new" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.newPassword" class="text-red-500 text-sm mt-1">{{ errors.newPassword }}</p>
              </div>
              
              <div class="mb-6 relative">
                <label class="block text-sm font-medium mb-1">
                  Confirm new password<span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    v-model="passwordData.confirmPassword"
                    @input="checkPasswordMatch"
                    @focus="() => { errors.confirmPassword = ''; }"
                    :type="passwordVisibility.confirm ? 'text' : 'password'"
                    placeholder="Confirm new password" 
                    class="w-full border rounded p-2 pr-10"
                    :class="{'border-red-500': errors.confirmPassword}"
                  />
                  <button 
                    type="button"
                    @click="() => passwordVisibility.confirm = !passwordVisibility.confirm"
                    class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                  >
                    <svg v-if="passwordVisibility.confirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
              </div>
              
              <div>
                <button 
                  v-if="passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword"
                  @click="savePassword"
                  class="bg-red-600 text-white px-4 py-2 rounded font-medium"
                  :disabled="isChangingPassword"
                >
                  <span v-if="isChangingPassword">Changing password...</span>
                  <span v-else>Save new password</span>
                </button>
                <p v-else class="text-sm text-gray-500 italic">
                  Enter your password details to make changes
                </p>
                
                <!--Validation error message if needed -->
                <p v-if="validationAttempted && Object.keys(errors).some(key => errors[key])" class="text-red-500 text-sm mt-3">
                  Please correct the errors before saving.
                </p>
              </div>
            </div>
            
            <!-- Right Column: Password Requirements -->
            <div>
              <div class="p-4 bg-gray-50 rounded-2xl">
                <h3 class="text-sm font-medium mb-2">Password requirements:</h3>
                <p class="text-sm text-gray-600 mb-2">Ensure that these requirements are met:</p>
                <ul class="text-sm">
                  <li class="flex items-center mb-1" :class="passwordRequirements.length ? 'text-green-600' : 'text-gray-500'">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="passwordRequirements.length" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    At least 10 characters (and up to 100 characters)
                  </li>
                  <li class="flex items-center mb-1" :class="passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="passwordRequirements.lowercase" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    At least one lowercase character
                  </li>
                  <li class="flex items-center mb-1" :class="passwordRequirements.special ? 'text-green-600' : 'text-gray-500'">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="passwordRequirements.special" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    Inclusion of at least one special character, e.g., ! @ # ?
                  </li>
                  <li class="flex items-center mb-1" :class="passwordRequirements.different ? 'text-green-600' : 'text-gray-500'">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="passwordRequirements.different" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    Significantly different from your previous passwords
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Adoptions Tab -->
        <div v-if="activeTab === 'adoptions'" class="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 class="text-xl font-bold mb-6">My Adoptions</h2>
          
          <!-- Tabs for adoption status -->
          <div class="mb-6 border-b">
            <div class="flex flex-wrap -mb-px">
              <button 
                @click="adoptionView = 'pending'"
                class="mr-2 inline-block p-2 transition-all duration-200 ease-in-out"
                :class="adoptionView === 'pending' 
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'"
              >
                Pending ({{ adoptionStats.pending }})
              </button>
              <button 
                @click="adoptionView = 'completed'"
                class="mr-2 inline-block p-2 transition-all duration-200 ease-in-out"
                :class="adoptionView === 'completed' 
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'"
              >
                Completed ({{ adoptionStats.completed }})
              </button>
              <button 
                @click="adoptionView = 'favorites'"
                class="inline-block p-2 transition-all duration-200 ease-in-out"
                :class="adoptionView === 'favorites' 
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300'"
              >
                Favorites ({{ adoptionStats.favorites }})
              </button>
            </div>
          </div>
  
          <!-- No adoptions message -->
          <div v-if="adoptionView === 'pending' && !pendingAdoptions.length" class="text-center py-8">
            <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No pending adoptions</h3>
            <p class="text-gray-500">You don't have any adoption applications in progress.</p>
            <button class="mt-4 bg-red-600 text-white px-4 py-2 rounded font-medium" @click="goToFindPets">
              Find pets to adopt
            </button>
          </div>
  
          <div v-if="adoptionView === 'completed' && !completedAdoptions.length" class="text-center py-8">
            <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No completed adoptions</h3>
            <p class="text-gray-500">You haven't completed any pet adoptions yet.</p>
            <button class="mt-4 bg-red-600 text-white px-4 py-2 rounded font-medium" @click="goToFindPets">
              Find pets to adopt
            </button>
          </div>
  
          <div v-if="adoptionView === 'favorites' && !favoriteAdoptions.length" class="text-center py-8">
            <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No favorite pets</h3>
            <p class="text-gray-500">You haven't added any pets to your favorites list yet.</p>
            <button class="mt-4 bg-red-600 text-white px-4 py-2 rounded font-medium" @click="goToFindPets">
              Browse available pets
            </button>
          </div>
  
          <!-- Pending adoptions list -->
          <div v-if="adoptionView === 'pending' && pendingAdoptions.length" class="space-y-4">
            <div v-for="adoption in pendingAdoptions" :key="adoption.id" class="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-1/4">
                  <img :src="adoption.petImageUrl" :alt="adoption.petName" class="w-full h-48 md:h-full object-cover">
                </div>
                <div class="p-4 md:p-6 flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">{{ adoption.petName }}</h3>
                      <p class="text-gray-600 text-sm">{{ adoption.petBreed }} · {{ adoption.petAge }} years old</p>
                    </div>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                  </div>
                  <p class="text-gray-500 mb-3">Application submitted: {{ formatDate(adoption.applicationDate) }}</p>
                  <div class="flex items-center mb-4">
                    <img :src="adoption.shelterImage" alt="Shelter logo" class="w-8 h-8 rounded-full mr-2">
                    <div>
                      <p class="text-sm font-medium">{{ adoption.shelterName }}</p>
                      <p class="text-xs text-gray-500">{{ adoption.shelterLocation }}</p>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button class="text-red-600 border border-red-600 bg-white px-3 py-1 rounded-2xl text-sm hover:bg-red-50">
                      View application
                    </button>
                    <button class="text-red-600 border border-red-600 bg-white px-3 py-1 rounded-2xl text-sm hover:bg-red-50">
                      Cancel application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Completed adoptions list -->
          <div v-if="adoptionView === 'completed' && completedAdoptions.length" class="space-y-4">
            <div v-for="adoption in completedAdoptions" :key="adoption.id" class="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-1/4">
                  <img :src="adoption.petImageUrl" :alt="adoption.petName" class="w-full h-48 md:h-full object-cover">
                </div>
                <div class="p-4 md:p-6 flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">{{ adoption.petName }}</h3>
                      <p class="text-gray-600 text-sm">{{ adoption.petBreed }} · Adopted on {{ formatDate(adoption.adoptionDate) }}</p>
                    </div>
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Adopted</span>
                  </div>
                  <p class="text-gray-700 mb-4">{{ adoption.petName }} has been part of your family for {{ daysSinceAdoption(adoption.adoptionDate) }} days!</p>
                  <div class="flex items-center mb-4">
                    <img :src="adoption.shelterImage" alt="Shelter logo" class="w-8 h-8 rounded-full mr-2">
                    <div>
                      <p class="text-sm font-medium">{{ adoption.shelterName }}</p>
                      <p class="text-xs text-gray-500">{{ adoption.shelterLocation }}</p>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button class="text-red-600 border border-red-600 bg-white px-3 py-1 rounded-2xl text-sm hover:bg-red-50">
                      View adoption details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Favorites list -->
          <div v-if="adoptionView === 'favorites' && favoriteAdoptions.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="pet in favoriteAdoptions" :key="pet.id" class="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="relative">
                <img :src="pet.imageUrl" :alt="pet.name" class="w-full h-48 object-cover">
                <button class="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow-md hover:bg-red-50">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900">{{ pet.name }}</h3>
                <p class="text-gray-600 text-sm">{{ pet.breed }} · {{ pet.age }} years old</p>
                <div class="flex items-center mt-2 mb-3">
                  <img :src="pet.shelterImage" alt="Shelter logo" class="w-6 h-6 rounded-full mr-2">
                  <p class="text-xs text-gray-500">{{ pet.shelterName }}</p>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-800">
                    {{ pet.status === 'AVAILABLE' ? 'Available for adoption' : 'Not available' }}
                  </span>
                  <button v-if="pet.status === 'AVAILABLE'" class="text-red-600 text-sm font-medium hover:text-red-800">
                    Apply now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { getUserById, updateUser, changePassword } from '@/services/user_service';
  import { fetchProfilePicture, uploadProfilePicture, deleteProfilePicture } from '@/services/user_service';
  import blankPicture from '@/assets/blank_profile_picture.jpg';
  import Navbar from '@/components/Navbar.vue';

  
  export default {
    name: 'AdopterProfile',
    components: {
        Navbar,
    },
    setup() {
      // Basic state
      const activeTab = ref('account');
      const adoptionView = ref('pending');
      const isSaving = ref(false);
      const isChangingPassword = ref(false);
      const showSuccessToast = ref(false);
      const showErrorToast = ref(false);
      const successMessage = ref('');
      const errorMessage = ref('');
      const toastTimeout = ref(null);
      const blankProfilePicture = ref(blankPicture);
      const validationAttempted = ref(false);
      const phoneInput = ref("");  
      const phoneError = ref("");  
      const isValidPhone = ref(false); 
      
      // Adopter data
      const adopter = reactive({
        id: localStorage.getItem('Id') || null,
        username: '',
        email: '',
        phoneNumber: '',
        profilePictureUrl: null
      });
      
      // Store initial data for comparison
      const initialAdopterData = reactive({});
      
      // Password data
      const passwordData = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      const passwordVisibility = reactive({
        current: false,
        new: false,
        confirm: false
      });
      
      const passwordRequirements = reactive({
        length: false,
        lowercase: false,
        special: false,
        different: true 
      });
  
      const errors = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Adoption statistics
      const adoptionStats = reactive({
        completed: 0,
        pending: 0,
        favorites: 0
      });
      
      // Profile picture states
      const isUploadingProfilePicture = ref(false);
      const isDeletingProfilePicture = ref(false);
      
      // Mock adoption data
      const pendingAdoptions = ref([]);
      const completedAdoptions = ref([]);
      const favoriteAdoptions = ref([]);
  
      // Computed properties
      const accountHasChanges = computed(() => {
        const accountFields = ['phoneNumber'];
        return accountFields.some(field => 
          adopter[field] !== initialAdopterData[field]
        );
      });
      
      const validatePhoneOnInput = () => {
        phoneInput.value = phoneInput.value.replace(/[^\d]/g, "");
        
        if (phoneInput.value.length === 0) {
          phoneError.value = "";
          isValidPhone.value = false;
        } else if (phoneInput.value.length < 9) {
          phoneError.value = "Phone number is too short. Please enter 9 digits.";
          isValidPhone.value = false;
        } else if (phoneInput.value.length > 9) {
          phoneError.value = "Phone number is too long. Please enter 9 digits.";
          isValidPhone.value = false;
        } else if (!validateRomanianPhone(phoneInput.value)) {
          phoneError.value = "Invalid Romanian phone number format.";
          isValidPhone.value = false;
        } else {
          phoneError.value = "";
          isValidPhone.value = true;
          adopter.phoneNumber = "+40" + phoneInput.value;
        }
      };
  
      const validateRomanianPhone = (phoneDigits) => {
        const firstDigit = phoneDigits.charAt(0);
        return firstDigit === '7' || firstDigit === '2' || firstDigit === '3';
      };
  
      const initPhoneInput = () => {
        if (adopter.phoneNumber) {
          if (adopter.phoneNumber.startsWith('+40')) {
            phoneInput.value = adopter.phoneNumber.substring(3);
          } else if (adopter.phoneNumber.startsWith('0')) {
            phoneInput.value = adopter.phoneNumber.substring(1);
          } else {
            phoneInput.value = adopter.phoneNumber;
          }
          
          phoneInput.value = phoneInput.value.replace(/[^\d]/g, "");
          
          validatePhoneOnInput();
        }
      };
      
      const loadAdopterData = async () => {
        try {
          if (!adopter.id) {
            displayErrorToast('User ID not found. Please login again.');
            return;
          }
          
          const response = await getUserById(adopter.id);
          console.log('Adopter profile response:', response);
          
          Object.keys(response).forEach(key => {
            if (key in adopter) {
              adopter[key] = response[key];
            }
          });
          
          adopter.profilePictureUrl = await fetchProfilePicture(adopter.id);
          
          Object.keys(adopter).forEach(key => {
            initialAdopterData[key] = adopter[key];
          });
          
          initPhoneInput();
          
          // Load adoption statistics - this would be from an API in a real app
          loadAdoptionStats();
          
          // Load mock adoption data
          loadMockAdoptions();
        } catch (error) {
          console.error('Error loading adopter data:', error);
          displayErrorToast('Failed to load profile data.');
        }
      };
      
      const loadAdoptionStats = async () => {
        // In a real app, this would come from an API call
        adoptionStats.completed = 2;
        adoptionStats.pending = 1;
        adoptionStats.favorites = 3;
      };
      
      const formatDate = (date) => {
        if (!date) return '';
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
      };
      
      const daysSinceAdoption = (adoptionDate) => {
        if (!adoptionDate) return 0;
        
        const today = new Date();
        const adoption = new Date(adoptionDate);
        const diffTime = Math.abs(today - adoption);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };
      
      const validateAccount = () => {
        const newErrors = {};
        
        if (!adopter.username) {
          newErrors.username = 'Username is required';
        } else if (adopter.username.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        }
        
        if (!adopter.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(adopter.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        
        if (!adopter.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (phoneError.value) {
          newErrors.phoneNumber = phoneError.value;
        }
        
        errors.value = newErrors;
        return Object.keys(newErrors).length === 0;
      };
      
      const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
      
      const validatePassword = () => {
        let isValid = true;
        
        if (!passwordData.currentPassword) {
          errors.currentPassword = 'Current password is required';
          isValid = false;
        }
        
        if (!passwordData.newPassword) {
          errors.newPassword = 'New password is required';
          isValid = false;
        } else if (passwordData.newPassword.length < 10) {
          errors.newPassword = 'Password must be at least 10 characters';
          isValid = false;
        } else if (passwordData.newPassword.length > 100) {
          errors.newPassword = 'Password cannot exceed 100 characters';
          isValid = false;
        } else if (!/[a-z]/.test(passwordData.newPassword)) {
          errors.newPassword = 'Password must include at least one lowercase letter';
          isValid = false;
        } else if (!/[!@#?]/.test(passwordData.newPassword)) {
          errors.newPassword = 'Password must include at least one special character (!, @, #, ?)';
          isValid = false;
        }
        
        if (!passwordData.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password';
          isValid = false;
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
          isValid = false;
        }
        
        return isValid;
      };
      
      const checkPasswordRequirements = () => {
        const password = passwordData.newPassword;
        
        passwordRequirements.length = password.length >= 10 && password.length <= 100;
        
        passwordRequirements.lowercase = /[a-z]/.test(password);
        
        passwordRequirements.special = /[!@#?]/.test(password);
      };
      
      const checkPasswordMatch = () => {
        if (passwordData.newPassword && passwordData.confirmPassword) {
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
          } else {
            errors.confirmPassword = '';
          }
        }
      };
      
      const saveChanges = async (section) => {
        try {
          if (!adopter.id) {
            displayErrorToast('User ID not found. Please login again.');
            return;
          }
          
          let isValid = false;
          
          if (section === 'account') {
            isValid = validateAccount();
            if (!isValid) {
              displayErrorToast('Please correct the errors before saving.');
              return;
            }
            
            isSaving.value = true;
            
            const accountData = {
              phoneNumber: adopter.phoneNumber
            };
            
            await updateUser(adopter.id, accountData);
            
            Object.keys(accountData).forEach(key => {
              initialAdopterData[key] = adopter[key];
            });
            
            displaySuccessToast('Account information updated successfully!');
          }
        } catch (error) {
          console.error(`Error saving ${section} changes:`, error);
          
          if (error.response && error.response.data && error.response.data.message) {
            displayErrorToast(error.response.data.message);
          } else if (error.message) {
            displayErrorToast(error.message);
          } else {
            displayErrorToast(`Failed to save ${section} changes.`);
          }
        } finally {
          isSaving.value = false;
        }
      };
      
      const savePassword = async () => {
        validationAttempted.value = true;
        
        errors.currentPassword = '';
        errors.newPassword = '';
        errors.confirmPassword = '';
        
        if (!validatePassword()) {
          return; 
        }
        
        isChangingPassword.value = true;
        
        try {
          await changePassword(
            adopter.id, 
            passwordData.currentPassword, 
            passwordData.newPassword
          );
          
          passwordData.currentPassword = '';
          passwordData.newPassword = '';
          passwordData.confirmPassword = '';
          
          passwordRequirements.length = false;
          passwordRequirements.lowercase = false;
          passwordRequirements.special = false;
          
          validationAttempted.value = false;
  
          displaySuccessToast('Password changed successfully!');
        } catch (error) {
          console.error("Password change error:", error);
          
          const errorMessage = error.message || "An unexpected error occurred";
          
          if (errorMessage.includes("Current password is incorrect")) {
            errors.currentPassword = "Current password is incorrect";
          }
          else if (errorMessage.includes("must be different") || 
                  errorMessage.includes("New password must be different")) {
            errors.newPassword = "New password must be different from the current password";
            passwordRequirements.different = false;
          }
          else {
            errors.newPassword = errorMessage;
          }
        } finally {
          isChangingPassword.value = false;
        }
      };
      
      const discardAccountChanges = () => {
        const accountFields = ['phoneNumber'];
        accountFields.forEach(field => {
          adopter[field] = initialAdopterData[field];
        });
        
        initPhoneInput();
        
        errors.value = {};
      };
      
      const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !adopter.id) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          displayErrorToast('Please upload a JPEG or PNG image.');
          return;
        }
        
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          displayErrorToast('Image size must be less than 5MB.');
          return;
        }
        
        try {
          isUploadingProfilePicture.value = true;
          
          await uploadProfilePicture(adopter.id, file);
          
          setTimeout(async () => {
            adopter.profilePictureUrl = await fetchProfilePicture(adopter.id);
            displaySuccessToast('Profile picture updated successfully!');
          }, 500);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          displayErrorToast('Failed to upload profile picture.');
        } finally {
          isUploadingProfilePicture.value = false;
        }
      };
      
      const removeProfilePicture = async () => {
        if (!adopter.id || !adopter.profilePictureUrl) return;
        
        try {
          isDeletingProfilePicture.value = true;
          
          await deleteProfilePicture(adopter.id);
          
          adopter.profilePictureUrl = null;
          displaySuccessToast('Profile picture removed successfully!');
        } catch (error) {
          console.error('Error removing profile picture:', error);
          displayErrorToast('Failed to remove profile picture.');
        } finally {
          isDeletingProfilePicture.value = false;
        }
      };
      
      const displaySuccessToast = (message) => {
        if (toastTimeout.value) {
          clearTimeout(toastTimeout.value);
        }
        
        successMessage.value = message;
        errorMessage.value = '';
        showSuccessToast.value = true;
        showErrorToast.value = false;
        
        toastTimeout.value = setTimeout(() => {
          showSuccessToast.value = false;
        }, 3000);
      };
      
      const displayErrorToast = (message) => {
        if (toastTimeout.value) {
          clearTimeout(toastTimeout.value);
        }
        
        errorMessage.value = message;
        successMessage.value = '';
        showErrorToast.value = true;
        showSuccessToast.value = false;
        
        toastTimeout.value = setTimeout(() => {
          showErrorToast.value = false;
        }, 3000);
      };
      
      const goToFindPets = () => {
        // Navigate to find pets page
        window.location.href = '/pets';
      };
      
      onMounted(async () => {
        await loadAdopterData();
      });
      const loadMockAdoptions = () => {
        // These would come from API calls in a real app
        
        // Pending adoptions
        pendingAdoptions.value = [
          {
            id: 1,
            petName: 'Bella',
            petBreed: 'Golden Retriever',
            petAge: 2,
            petImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            applicationDate: new Date(2023, 2, 15),
            shelterName: 'Happy Paws Shelter',
            shelterLocation: 'Bucharest',
            shelterImage: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ];
        
        // Completed adoptions
        completedAdoptions.value = [
          {
            id: 2,
            petName: 'Max',
            petBreed: 'Labrador Retriever',
            petAge: 3,
            petImageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            adoptionDate: new Date(2022, 9, 10),
            shelterName: 'Rescue Haven',
            shelterLocation: 'Cluj-Napoca',
            shelterImage: 'https://images.unsplash.com/photo-1590068257126-02f29168ae17?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: 3,
            petName: 'Luna',
            petBreed: 'Maine Coon',
            petAge: 1.5,
            petImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            adoptionDate: new Date(2023, 0, 5),
            shelterName: 'Feline Friends Sanctuary',
            shelterLocation: 'Iași',
            shelterImage: 'https://images.unsplash.com/photo-1518288774672-b94e808873ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ];
        
        // Favorite pets
        favoriteAdoptions.value = [
          {
            id: 4,
            name: 'Charlie',
            breed: 'Beagle',
            age: 1,
            imageUrl: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            status: 'AVAILABLE',
            shelterName: 'Paws & Claws Rescue',
            shelterImage: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: 5,
            name: 'Milo',
            breed: 'Siamese',
            age: 2,
            imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            status: 'AVAILABLE',
            shelterName: 'Cat Haven',
            shelterImage: 'https://images.unsplash.com/photo-1583511655826-05700442982d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          },
          {
            id: 6,
            name: 'Rocky',
            breed: 'German Shepherd',
            age: 3,
            imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            status: 'PENDING',
            shelterName: 'Second Chance Rescue',
            shelterImage: 'https://images.unsplash.com/photo-1550645612-83f5d594b671?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
          }
        ];
      };
    
    onMounted(async () => {
      await loadAdopterData();
    });
    
    return {
      // State
      activeTab,
      adoptionView,
      adopter,
      passwordData,
      passwordVisibility,
      passwordRequirements,
      isSaving,
      isChangingPassword,
      showSuccessToast,
      showErrorToast,
      successMessage,
      errorMessage,
      isUploadingProfilePicture,
      isDeletingProfilePicture,
      blankProfilePicture,
      errors,
      validationAttempted,
      adoptionStats,
      pendingAdoptions,
      completedAdoptions,
      favoriteAdoptions,
      
      // Computed
      accountHasChanges,
      
      phoneInput, 
      phoneError,
      isValidPhone,
      validatePhoneOnInput,
      
      // Methods
      savePassword,
      saveChanges,
      discardAccountChanges,
      handleProfilePictureUpload,
      removeProfilePicture,
      checkPasswordRequirements,
      checkPasswordMatch,
      formatDate,
      daysSinceAdoption,
      goToFindPets
    };
  }
}
</script>
