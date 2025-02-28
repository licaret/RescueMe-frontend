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
            <div class="mb-6">
              <label class="block text-sm font-medium mb-1">
                Current password
              </label>
              <input 
                v-model="passwordData.currentPassword"
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
                v-model="passwordData.newPassword"
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
                v-model="passwordData.confirmPassword"
                type="password" 
                placeholder="Confirm new password" 
                class="w-full border rounded p-2"
              />
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
import { getUserById, updateUser } from "../services/user_service.js";
import { fetchProfilePicture, uploadProfilePicture, deleteProfilePicture } from "@/services/user_service.js";
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

      // Reîncărcare automată după 1 secundă pentru a evita cache-ul
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

    showToast(message) {
      // Clear any existing timeout
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      
      this.successMessage = message;
      this.showSuccessToast = true;
      
      // Auto-hide after 5 seconds
      this.toastTimeout = setTimeout(() => {
        this.showSuccessToast = false;
      }, 2000);
    },

    discardAccountChanges() {
      const accountFields = ['username', 'email', 'phoneNumber', 'shelterType'];
      accountFields.forEach(field => {
        this.shelter[field] = this.initialShelterData[field];
      });
    },
    
    discardGeneralInfoChanges() {
      const generalInfoFields = ['county', 'city']; 
      generalInfoFields.forEach(field => {
        this.shelter[field] = this.initialShelterData[field];
      });
      
      this.$nextTick(() => {
        this.fetchCities();
      });
    },

    async saveChanges(section) {
      try {
        const userId = localStorage.getItem("shelterId");
        if (!userId) throw new Error("User ID not found in local storage");

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
        this.showToast(`Update failed: ${error.message || "Unknown error"}`);
      }
    },

    async handleProfilePictureUpload(event) {
      const file = event.target.files[0];
      if (!file || !this.shelter.id) return;

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
        this.showToast("Failed to remove profile picture");
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