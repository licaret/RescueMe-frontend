<template>
  <Teleport to="body">
    <div 
      v-if="request" 
      class="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div 
        class="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all"
        @click.stop
      >
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Adoption Request Details</h2>
            <button 
              @click="$emit('close')" 
              class="text-gray-500 hover:text-gray-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Request Overview -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Pet Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Pet Information</h3>
              <div class="flex items-center space-x-4">
                <img 
                  v-if="request.pet?.photoUrl" 
                  :src="request.pet.photoUrl" 
                  :alt="request.pet.name" 
                  class="w-24 h-24 object-cover rounded-2xl border"
                />
                <div>
                  <div class="text-xl font-bold text-gray-800">{{ request.pet?.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ request.pet?.species }} • {{ request.pet?.breed }}
                  </div>
                  <div class="text-sm text-gray-600">{{ formatAge(request.pet?.age) }}</div>
                </div>
              </div>
            </div>

            <!-- Applicant Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Applicant Information</h3>
              <div class="space-y-2">
                <div>
                  <span class="text-sm text-gray-500">Name</span>
                  <div class="text-gray-800">{{ request.requestDetails?.contactInfo?.name || 'Not provided' }}</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Email</span>
                  <div class="text-gray-800">{{ request.requestDetails?.contactInfo?.email || 'Not provided' }}</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Phone</span>
                  <div class="text-gray-800">{{ request.requestDetails?.contactInfo?.phone || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Adoption Questionnaire -->
          <div class="space-y-6">
            <!-- Housing Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Housing Information</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Housing Type</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.housing?.type || 'Not provided' }}</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Ownership</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.housing?.ownership || 'Not provided' }}</div>
                </div>
                <div v-if="request.requestDetails?.housing?.ownership === 'rent'">
                  <span class="text-sm text-gray-500">Landlord Permission</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.housing?.landlordPermission || 'Not provided' }}</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Has Yard</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.housing?.hasYard || 'Not provided' }}</div>
                </div>
                <div v-if="request.requestDetails?.housing?.hasYard === 'yes'">
                  <span class="text-sm text-gray-500">Fenced Yard</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.housing?.fencedYard || 'Not provided' }}</div>
                </div>
              </div>
            </div>

            <!-- Household Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Household Information</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Household Members</span>
                  <div class="text-gray-800">{{ request.requestDetails?.household?.members || 'Not provided' }} person(s)</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Children in Home</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.household?.children?.has || 'Not provided' }}</div>
                </div>
                <div v-if="request.requestDetails?.household?.children?.has === 'yes'">
                  <span class="text-sm text-gray-500">Children's Ages</span>
                  <div class="text-gray-800">{{ request.requestDetails?.household?.children?.ages || 'Not provided' }}</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Other Pets</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.household?.otherPets?.has || 'Not provided' }}</div>
                </div>
                <div v-if="request.requestDetails?.household?.otherPets?.has === 'yes'" class="md:col-span-2">
                  <span class="text-sm text-gray-500">Current Pets</span>
                  <div class="text-gray-800">{{ request.requestDetails?.household?.otherPets?.description || 'Not provided' }}</div>
                </div>
              </div>
            </div>

            <!-- Experience & Expectations -->
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Experience & Expectations</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Pet Experience</span>
                  <div class="text-gray-800">
                    {{ 
                      request.requestDetails?.experience?.level === 'first' ? 'First-time pet owner' : 
                      request.requestDetails?.experience?.level === 'some' ? 'Some experience' :
                      request.requestDetails?.experience?.level === 'experienced' ? 'Experienced owner' :
                      'Not provided'
                    }}
                  </div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Activity Level</span>
                  <div class="text-gray-800 capitalize">{{ request.requestDetails?.experience?.activityLevel || 'Not provided' }}</div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Time Alone</span>
                  <div class="text-gray-800">{{ request.requestDetails?.experience?.timeAlone || 'Not provided' }}</div>
                </div>
              </div>
              <div v-if="request.requestDetails?.experience?.reason" class="mt-4">
                <span class="text-sm text-gray-500">Reason for Adoption</span>
                <div class="text-gray-800 bg-gray-50 p-3 rounded-lg mt-2">{{ request.requestDetails.experience.reason }}</div>
              </div>
            </div>

            <!-- Additional Information -->
            <div v-if="request.requestDetails?.additionalInfo">
              <h3 class="text-lg font-semibold text-gray-700 mb-4">Additional Information</h3>
              <div class="bg-gray-50 p-3 rounded-lg text-gray-800">{{ request.requestDetails.additionalInfo }}</div>
            </div>
          </div>

          <!-- Response Section -->
          <div v-if="request.status === 'PENDING'" class="mt-6">
            <label for="response-note" class="block text-sm font-medium text-gray-700 mb-1">Response Note (optional)</label>
            <textarea
              id="response-note"
              v-model="responseNoteLocal"
              rows="3"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write a message for the applicant..."
              @input="$emit('update:responseNote', responseNoteLocal)"
            ></textarea>
          </div>

          <div v-else-if="request.notes" class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Your Response</h3>
            <div class="bg-gray-50 p-3 rounded-md text-gray-800">{{ request.notes }}</div>
          </div>

          <!-- Modal Actions -->
          <div class="mt-6 flex justify-end space-x-3">
            <!-- For pending requests - option to approve -->
            <button 
              v-if="request.status === 'PENDING'"
              @click="$emit('approve')"
              class="px-4 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition"
              title="This will mark the pet status as PENDING"
            >
              Approve Request
            </button>
            
            <!-- For approved requests with pet in PENDING status - option to complete -->
            <button 
              v-if="request.status === 'APPROVED' && request.pet?.status === 'PENDING'"
              @click="$emit('complete')"
              class="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
              title="This will mark the pet as ADOPTED"
            >
              Complete Adoption
            </button>
            
            <!-- For pending requests - option to reject -->
            <button 
              v-if="request.status === 'PENDING'"
              @click="$emit('reject')"
              class="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition"
            >
              Reject
            </button>
            
            <!-- Close button -->
            <button 
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-3xl hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'AdoptionRequestDetailsForShelter',

  props: {
    request: {
      type: Object,
      default: null
    },
    responseNote: {
      type: String,
      default: ''
    }
  },

  emits: ['close', 'approve', 'reject', 'complete', 'update:responseNote'],

  setup(props) {
    
    const responseNoteLocal = ref(props.responseNote);
    
    watch(() => props.responseNote, (newValue) => {
      responseNoteLocal.value = newValue;
    });
    
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
    
    return {
      responseNoteLocal,
      formatAge
    };
  }
};
</script>