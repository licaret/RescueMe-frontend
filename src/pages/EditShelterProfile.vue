<template>
    <div class="bg-white min-h-screen p-20">
      <div class="max-w-6xl mx-auto">

        <!-- Account Settings -->
        <div class="bg-white rounded-lg shadow mb-10 p-6">
          <h2 class="text-xl font-bold mb-6">Settings</h2>
          
          <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Account</h3>
          
          <div class="flex items-start mb-8">
            <div class="mr-6">
              <img 
                src="https://via.placeholder.com/60" 
                alt="Profile picture" 
                class="w-20 h-20 rounded-full object-cover border"
              />
            </div>
            <div class="flex flex-row space-x-5 mt-6">
              <button 
                class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </button>
              <button class="text-gray-600 text-sm border border-gray-300 px-4 py-1.5 rounded hover:text-gray-800">
                Remove
              </button>
            </div>
          </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium mb-1">
                  Username<span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex. ShelterHappy" 
                  class="w-full border rounded p-2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">
                  Your email<span class="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  class="w-full border rounded p-2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">
                  Phone number<span class="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  placeholder="0743 060 122" 
                  class="w-full border rounded p-2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 flex items-center">
                  Shelter Type<span class="text-red-500">*</span>
                  <span class="ml-1 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </label>
                <select class="w-full border rounded p-2 pr-8 bg-white">
                  <option>Choose your shelter type</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded font-medium">
              Save changes
            </button>
          </div>
        </div>
        
        <!-- General Information -->
        <div class="bg-white rounded-lg shadow mb-6 p-6">
          <h2 class="text-xl font-bold mb-6">General information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium mb-1">
                Full address
              </label>
              <input 
                type="text" 
                placeholder="Ex. B-dul 21 Decembrie 1989, Nr. 110" 
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                ZIP/Postal code
              </label>
              <input 
                type="text" 
                placeholder="Ex. 307220" 
                class="w-full border rounded p-2"
              />
            </div>
            <!-- <div>
              <label class="block text-sm font-medium mb-1">
                Your organization
              </label>
              <input 
                type="text" 
                placeholder="Ex. Flowbite LLC" 
                class="w-full border rounded p-2"
              />
            </div> -->
            <div>
              <label class="block text-sm font-medium mb-1">
                County<span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Ex. Cluj-Napoca" 
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                Town/City<span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Ex. Cluj" 
                class="w-full border rounded p-2"
              />
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium mb-1">
              Biography
            </label>
            <textarea 
              placeholder="Hello, ShelterHappy here..." 
              rows="5"
              class="w-full border rounded p-2"
            ></textarea>
          </div>
          
          <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded font-medium">
              Save changes
            </button>
          </div>
        </div>
        
        <!-- Password Settings -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-6">Password</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column: Password Fields -->
            <div>
              <div class="mb-6">
                <label class="block text-sm font-medium mb-1">
                  Current password
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your current password" 
                  class="w-full border rounded p-2"
                />
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-medium mb-1">
                  Your new password
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your new password" 
                  class="w-full border rounded p-2"
                />
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-medium mb-1">
                  Confirm new password
                </label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  class="w-full border rounded p-2"
                />
              </div>
              
              <div>
                <button class="bg-blue-600 text-white px-4 py-2 rounded font-medium">
                  Save changes
                </button>
              </div>
            </div>
            
            <!-- Right Column: Password Requirements -->
            <div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="text-sm font-medium mb-2">Password requirements:</h3>
                <p class="text-sm text-gray-600 mb-2">Ensure that these requirements are met:</p>
                <ul class="text-sm">
                  <li class="flex items-center mb-1 text-green-600">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    At least 10 characters (and up to 100 characters)
                  </li>
                  <li class="flex items-center mb-1 text-green-600">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    At least one lowercase character
                  </li>
                  <li class="flex items-center mb-1 text-gray-500">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    Inclusion of at least one special character, e.g., ! @ # ?
                  </li>
                  <li class="flex items-center mb-1 text-green-600">
                    <svg class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Significantly different from your previous passwords
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditProfilePage',
    data() {
      return {
      }
    },
    methods: {
    }
  }
  </script>
  
  <style>
  .dot {
    transition: all 0.3s ease;
  }
  input:checked ~ .dot {
    transform: translateX(100%);
  }
  </style>