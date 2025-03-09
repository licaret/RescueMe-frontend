<template>
  <div class="bg-white min-h-screen p-20">
    <div class="max-w-6xl mx-auto">
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

      <!-- Account Settings -->
      <div class="bg-white rounded-lg shadow mb-10 p-6">
        <h2 class="text-xl font-bold mb-6">Settings</h2>
        
        <div class="mb-6">
        <h3 class="text-lg font-medium mb-4">Account</h3>
        
        <div class="flex items-start mb-8">
          <div class="mr-6">
            <img 
              :src="shelter.profilePictureUrl || blankProfilePicture" 
              alt="Profile picture" 
              class="w-20 h-20 rounded-full object-cover border"
            />
              <input type="file" @change="handleProfilePictureUpload" class="hidden" ref="fileInput">
          </div>
          <div class="flex flex-row space-x-5 mt-6">
            <button 
              @click="$refs.fileInput.click()"
              class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </button>
            <button 
              @click="removeProfilePicture"
              class="text-gray-600 text-sm border border-gray-300 px-4 py-1.5 rounded hover:text-gray-800"
            >
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
                v-model="shelter.username"
                type="text"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                Your email<span class="text-red-500">*</span>
              </label>
              <input 
                v-model="shelter.email"
                type="email"
                class="w-full border rounded p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                Phone number<span class="text-red-500">*</span>
              </label>
              <input 
                v-model="shelter.phoneNumber"
                type="tel"
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
              <select v-model="shelter.shelterType" class="w-full border rounded p-2 pr-8 bg-white">
                <option v-for="type in shelterTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <button 
            @click="saveChanges('account')"
            class="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-[120px]"
          >
            Save changes
          </button>
          <button
            v-if="accountHasChanges"
            @click="discardAccountChanges"
            class="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded font-medium ml-3 min-w-[120px]"
          >
            Discard Changes
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
              v-model="shelter.fullAddress"
              type="text"
              class="w-full border rounded p-2"
              placeholder="Ex. B-dul 21 Decembrie 1989, Nr. 110"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">
              ZIP/Postal code
            </label>
            <input 
              v-model="shelter.zipCode"
              type="text"
              class="w-full border rounded p-2"
              placeholder="Ex. 307220"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">
              County<span class="text-red-500">*</span>
            </label>
            <select 
              v-model="shelter.county"
              @change="fetchCities"
              class="w-full border rounded p-2 bg-white"
            >
              <option value="">Select County</option>
              <option v-for="county in counties" :key="county.nume" :value="county.nume">
                {{ county.nume }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              City<span class="text-red-500">*</span>
            </label>
            <select 
              v-model="shelter.city"
              class="w-full border rounded p-2 bg-white"
            >
              <option value="">Select City</option>
              <option v-for="city in cities" :key="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">
            Biography
          </label>
          <textarea 
            v-model="shelter.biography"
            placeholder="Hello, ShelterHappy here..." 
            rows="5"
            class="w-full border rounded p-2"
          ></textarea>
        </div>
        
        <div>
          <button 
            @click="saveChanges('general')"
            class="bg-blue-600 text-white px-4 py-2 rounded font-medium min-w-[120px]"
          >
            Save changes
          </button>
          <button
            v-if="generalInfoHasChanges"
            @click="discardGeneralInfoChanges"
            class="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded font-medium ml-3 min-w-[120px]"
          >
            Discard Changes
          </button>
        </div>
      </div>
      
      <!-- Password Settings -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold mb-6">Password</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column: Password Fields -->
        <div>
          <div class="mb-6 relative">
            <label class="block text-sm font-medium mb-1">
              Current password
            </label>
            <div class="relative">
              <input 
                v-model="passwordData.currentPassword"
                :type="passwordVisibility.current ? 'text' : 'password'"
                placeholder="Enter your current password" 
                class="w-full border rounded p-2 pr-10"
              />
              <button 
                type="button"
                @click="passwordVisibility.current = !passwordVisibility.current"
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
            <p v-if="errors.password.currentPassword" class="text-red-500 text-sm mt-1">{{ errors.password.currentPassword }}</p>
          </div>
          
          <div class="mb-6 relative">
            <label class="block text-sm font-medium mb-1">
              Your new password
            </label>
            <div class="relative">
              <input 
                v-model="passwordData.newPassword"
                @input="checkPasswordRequirements"
                :type="passwordVisibility.new ? 'text' : 'password'"
                placeholder="Enter your new password" 
                class="w-full border rounded p-2 pr-10"
              />
              <button 
                type="button"
                @click="passwordVisibility.new = !passwordVisibility.new"
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
            <p v-if="errors.password.newPassword" class="text-red-500 text-sm mt-1">{{ errors.password.newPassword }}</p>
          </div>
          
          <div class="mb-6 relative">
            <label class="block text-sm font-medium mb-1">
              Confirm new password
            </label>
            <div class="relative">
              <input 
                v-model="passwordData.confirmPassword"
                @input="checkPasswordMatch"
                :type="passwordVisibility.confirm ? 'text' : 'password'"
                placeholder="Confirm new password" 
                class="w-full border rounded p-2 pr-10"
              />
              <button 
                type="button"
                @click="passwordVisibility.confirm = !passwordVisibility.confirm"
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
            <p v-if="errors.password.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.password.confirmPassword }}</p>
          </div>
          
          <div>
            <button 
              @click="saveChanges('password')"
              class="bg-blue-600 text-white px-4 py-2 rounded font-medium"
            >
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
    </div>
  </div>
</template>

<script>
import { getUserById, updateUser } from "../services/user_service.js";
import { fetchProfilePicture, uploadProfilePicture, deleteProfilePicture } from "@/services/user_service.js";
import { changePassword } from "@/services/user_service.js";
import judete from "@/assets/judete.json";

export default {
  name: 'EditProfilePage',
  data() {
    return {
      shelter: {
        username: "",
        email: "",
        phoneNumber: "",
        county: "",
        city: "",
        shelterType: "",
        fullAddress: "",   
        zipCode: "",      
        biography: "",
        id: localStorage.getItem("shelterId") || null,
        profilePictureUrl: "",
      },
      passwordData: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      passwordRequirements: {
        length: false,
        lowercase: false,
        special: false,
        different: true 
      },
      passwordVisibility: {
        current: false,
        new: false,
        confirm: false
      },
      errors: {
        account: {
          username: "",
          email: "",
          phoneNumber: "",
          shelterType: ""
        },
        general: {
          county: "",
          city: ""
        },
        password: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }
      },
      shelterTypes: [
        'Municipal Shelter',
        'Private Shelter',
        'Rescue Organization',
        'Foster-based Rescue',
        'Sanctuary',
        'Veterinary Clinic with Shelter',
        'Specialized Shelter (specific breeds/species)',
        'Emergency/Temporary Shelter'
      ],
      counties: [], 
      cities: [],
      initialShelterData: {}, 
      showSuccessToast: false,
      successMessage: "",
      toastTimeout: null,
      blankProfilePicture: null,
    }
  },
  async mounted() {
    if (this.shelter.id) {
      this.shelter.profilePictureUrl = await fetchProfilePicture(this.shelter.id);

      setTimeout(async () => {
        this.shelter.profilePictureUrl = await fetchProfilePicture(this.shelter.id);
      }, 10);
    }
  },
  async created() {
    import('@/assets/blank_profile_picture.jpg').then(module => {
      this.blankProfilePicture = module.default;
    });
    this.fetchCounties();
    await this.fetchShelterData();
  },

  methods: {
    async fetchShelterData() {
      try {
        const userId = localStorage.getItem("shelterId");
        console.log("User ID from localStorage:", userId);

        if (!userId) throw new Error("User ID not found in local storage");

        const shelterData = await getUserById(userId);
        console.log("Shelter data loaded:", shelterData);

        this.shelter = { ...shelterData }; 
        this.initialShelterData = { ...shelterData }; 

        if (this.shelter.county) {
          this.fetchCities(() => {
            setTimeout(() => {
              if (this.cities.includes(this.shelter.city)) {
                console.log("City found in list:", this.shelter.city);
              } else {
                console.warn("City not found in list, resetting.");
                this.shelter.city = "";
              }
            }, 100); 
          });
        }
      } catch (error) {
        console.error("Error fetching shelter data:", error);
      }
    },

    fetchCounties() {
      this.counties = judete.judete; 
    },

    fetchCities(callback) {
      if (!this.shelter.county) {
        this.cities = [];
        return;
      }

      const selectedCountyObj = this.counties.find(county => county.nume === this.shelter.county);
      this.cities = selectedCountyObj ? selectedCountyObj.localitati.map(loc => loc.nume) : [];

      console.log("Loaded cities:", this.cities);

      if (callback) callback();
    },

    showToast(message, isError = false) {
      // Clear any existing timeout
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      
      this.successMessage = message;
      this.showSuccessToast = true;
      
      // Change toast color based on type
      if (isError) {
        const toastEl = document.querySelector('.fixed.top-20.right-4');
        if (toastEl) {
          toastEl.classList.remove('bg-green-100', 'border-green-500', 'text-green-700');
          toastEl.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
        }
      } else {
        const toastEl = document.querySelector('.fixed.top-20.right-4');
        if (toastEl) {
          toastEl.classList.remove('bg-red-100', 'border-red-500', 'text-red-700');
          toastEl.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
        }
      }
      
      // Auto-hide after 3 seconds
      this.toastTimeout = setTimeout(() => {
        this.showSuccessToast = false;
      }, 3000);
    },

    discardAccountChanges() {
      const accountFields = ['username', 'email', 'phoneNumber', 'shelterType'];
      accountFields.forEach(field => {
        this.shelter[field] = this.initialShelterData[field];
      });
      // Clear errors
      this.clearSectionErrors('account');
    },
    
    discardGeneralInfoChanges() {
      const generalInfoFields = ['county', 'city', 'fullAddress', 'zipCode', 'biography']; 
      generalInfoFields.forEach(field => {
        this.shelter[field] = this.initialShelterData[field];
      });
      
      // Clear errors
      this.clearSectionErrors('general');
      
      this.$nextTick(() => {
        this.fetchCities();
      });
    },

    clearSectionErrors(section) {
      Object.keys(this.errors[section]).forEach(field => {
        this.errors[section][field] = "";
      });
    },

    validateAccount() {
      let isValid = true;
      this.clearSectionErrors('account');

      // Required fields validation
      if (!this.shelter.username || this.shelter.username.trim() === '') {
        this.errors.account.username = "Username is required";
        isValid = false;
      } else if (this.shelter.username.length < 3) {
        this.errors.account.username = "Username must be at least 3 characters";
        isValid = false;
      }

      if (!this.shelter.email || this.shelter.email.trim() === '') {
        this.errors.account.email = "Email is required";
        isValid = false;
      } else if (!this.validateEmail(this.shelter.email)) {
        this.errors.account.email = "Please enter a valid email address";
        isValid = false;
      }

      if (!this.shelter.phoneNumber || this.shelter.phoneNumber.trim() === '') {
        this.errors.account.phoneNumber = "Phone number is required";
        isValid = false;
      } else if (!this.validatePhoneNumber(this.shelter.phoneNumber)) {
        this.errors.account.phoneNumber = "Please enter a valid phone number";
        isValid = false;
      }

      if (!this.shelter.shelterType) {
        this.errors.account.shelterType = "Shelter type is required";
        isValid = false;
      }

      return isValid;
    },

    validateGeneral() {
      let isValid = true;
      this.clearSectionErrors('general');

      // Required fields validation
      if (!this.shelter.county) {
        this.errors.general.county = "County is required";
        isValid = false;
      }

      if (!this.shelter.city) {
        this.errors.general.city = "City is required";
        isValid = false;
      }

      // Optional field validations (if they have content)
      if (this.shelter.zipCode && !this.validateZipCode(this.shelter.zipCode)) {
        this.errors.general.zipCode = "Please enter a valid postal code";
        isValid = false;
      }

      return isValid;
    },

    checkPasswordRequirements() {
      const password = this.passwordData.newPassword;
      
      // Check length requirement
      this.passwordRequirements.length = password.length >= 10 && password.length <= 100;
      
      // Check lowercase requirement
      this.passwordRequirements.lowercase = /[a-z]/.test(password);
      
      // Check special character requirement
      this.passwordRequirements.special = /[!@#?]/.test(password);
      
      // Clear previous error message
      this.errors.password.newPassword = "";
    },

    checkPasswordMatch() {
      if (this.passwordData.newPassword && this.passwordData.confirmPassword) {
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
          this.errors.password.confirmPassword = "Passwords do not match";
        } else {
          this.errors.password.confirmPassword = "";
        }
      }
    },

    validatePassword() {
      this.clearSectionErrors("password");

      if (!this.passwordData.currentPassword) {
        this.errors.password.currentPassword = "Current password is required";
        return false;
      }

      if (!this.passwordData.newPassword) {
        this.errors.password.newPassword = "New password is required";
        return false;
      }

      if (this.passwordData.newPassword.length < 10 || this.passwordData.newPassword.length > 100) {
        this.errors.password.newPassword = "Password must be between 10 and 100 characters";
        return false;
      }

      if (!/[a-z]/.test(this.passwordData.newPassword)) {
        this.errors.password.newPassword = "Password must contain at least one lowercase letter";
        return false;
      }

      if (!/[!@#?]/.test(this.passwordData.newPassword)) {
        this.errors.password.newPassword = "Password must contain at least one special character (! @ # ?)";
        return false;
      }

      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.errors.password.confirmPassword = "Passwords do not match";
        return false;
      }

      return true;
    },


    validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },

    validatePhoneNumber(phone) {
      // Romanian phone number format (can be adjusted for international format if needed)
      const re = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/;
      return re.test(phone);
    },

    validateZipCode(zipCode) {
      // Romanian postal code format
      const re = /^[0-9]{6}$/;
      return re.test(zipCode);
    },

    validatePasswordStrength(password) {
      // Check length
      if (password.length < 10 || password.length > 100) return false;
      
      // Check for lowercase
      if (!/[a-z]/.test(password)) return false;
      
      // Special character requirement is commented out as it's shown as grey in UI
      // Uncomment to enforce this requirement
      // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
      
      return true;
    },

    async saveChanges(section) {
      try {
        const userId = localStorage.getItem("shelterId");
        if (!userId) throw new Error("User ID not found in local storage");

        // Validate the section being saved
        let isValid = false;
        
        if (section === 'account') {
          isValid = this.validateAccount();
        } else if (section === 'general') {
          isValid = this.validateGeneral();
        } else if (section === 'password') {
          isValid = this.validatePassword();
          
          if (isValid && this.passwordData.currentPassword) {
            try {
              await changePassword(userId, this.passwordData.currentPassword, this.passwordData.newPassword);
              this.showToast("Password updated successfully!");
              
              // Clear password fields
              this.passwordData = {
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
              };
              return;
            }catch (error) {
              // Extragem mesajul de eroare primit din backend
              const errorMessage = error.message;

              if (errorMessage.includes("Current password is incorrect")) {
                this.errors.password.currentPassword = "Current password is incorrect";
              } else if (errorMessage.includes("New password must be different")) {
                this.errors.password.newPassword = "New password must be different from the current one";
              } else if (errorMessage.includes("Password does not meet")) {
                this.errors.password.newPassword = "Password must be at least 10 characters, contain one lowercase letter, and one special character (!@#?)";
              } else {
                this.showToast("Failed to change password: " + errorMessage, true);
              }
            }
          }
        }

        if (!isValid) {
          this.showToast("Please correct the errors before saving.", true);
          return;
        }

        // Handle profile updates
        const updatedFields = {};
        
        if (section === 'account') {
          const accountFields = ['username', 'email', 'phoneNumber', 'shelterType'];
          accountFields.forEach(field => {
            if (this.shelter[field] !== this.initialShelterData[field]) {
              updatedFields[field] = this.shelter[field];
            }
          });
        } else if (section === 'general') {
          const generalInfoFields = ['county', 'city', 'fullAddress', 'zipCode', 'biography'];
          generalInfoFields.forEach(field => {
            if (this.shelter[field] !== this.initialShelterData[field]) {
              updatedFields[field] = this.shelter[field];
            }
          });
        }

        if (Object.keys(updatedFields).length === 0) {
          console.log("No changes detected.");
          this.showToast("No changes to save");
          return;
        }

        const updatedUser = await updateUser(userId, updatedFields);
        
        // Save the current profile picture URL
        const currentProfilePictureUrl = this.shelter.profilePictureUrl;
        
        // Update only the fields that were changed
        Object.keys(updatedUser).forEach(key => {
          this.shelter[key] = updatedUser[key];
          this.initialShelterData[key] = updatedUser[key];
        });
        
        // Restore the profile picture URL if it wasn't included in the response
        if (!updatedUser.profilePictureUrl && currentProfilePictureUrl) {
          this.shelter.profilePictureUrl = currentProfilePictureUrl;
          this.initialShelterData.profilePictureUrl = currentProfilePictureUrl;
        }

        console.log("User updated successfully:", updatedUser);
        
        // Show success message based on the section updated
        if (section === 'account') {
          this.showToast("Account information updated successfully!");
        } else if (section === 'general') {
          this.showToast("General information updated successfully!");
        }
      } catch (error) {
        console.error("Failed to update user:", error);
        this.showToast(`Update failed: ${error.message || "Unknown error"}`, true);
      }
    },

    async handleProfilePictureUpload(event) {
      const file = event.target.files[0];
      if (!file || !this.shelter.id) return;

      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.showToast("Please upload a JPG or PNG image", true);
        return;
      }

      // 5MB limit (adjust as needed)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showToast("Image size must be less than 5MB", true);
        return;
      }

      try {
        await uploadProfilePicture(this.shelter.id, file);

        // Așteaptă 500ms înainte de a reîncărca poza
        setTimeout(async () => {
          this.shelter.profilePictureUrl = await fetchProfilePicture(this.shelter.id);
          this.$forceUpdate();

          this.showToast("Profile photo updated successfully!");
        }, 500);
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        this.showToast("Failed to upload profile picture", true);
      }
    },

    async removeProfilePicture() {
      if (!this.shelter.id) return;

      try {
        await deleteProfilePicture(this.shelter.id);
        this.shelter.profilePictureUrl = this.blankProfilePicture;
        this.showToast("Profile picture removed successfully!");
      } catch (error) {
        console.error("Failed to delete profile picture:", error);
        this.showToast("Failed to remove profile picture", true);
      }
    }
  },

  computed: {
    accountHasChanges() {
      const accountFields = ['username', 'email', 'phoneNumber', 'shelterType'];
      return accountFields.some(field => 
        this.shelter[field] !== this.initialShelterData[field]
      );
    },
    
    generalInfoHasChanges() {
      const generalInfoFields = ['county', 'city', 'fullAddress', 'zipCode', 'biography']; 
      return generalInfoFields.some(field => 
        this.shelter[field] !== this.initialShelterData[field]
      );
    }
  },
  
  watch: {
    shelter: {
      handler() {
        this.changesMade = JSON.stringify(this.shelter) !== JSON.stringify(this.initialShelterData);
      },
      deep: true,
    }
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