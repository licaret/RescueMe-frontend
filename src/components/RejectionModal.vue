<template>
  <div v-if="show" class="fixed z-20 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="cancel">
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
                Reject Shelter
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to reject this shelter application? This action cannot be undone.
                </p>
                
                <div class="mt-4">
                  <label for="rejection-reason" class="block text-sm font-medium text-gray-700">
                    Rejection Reason
                  </label>
                  <select 
                    id="rejection-reason" 
                    v-model="selectedReason" 
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a reason</option>
                    <option value="INCOMPLETE_DOCUMENTS">Incomplete or invalid documents</option>
                    <option value="INVALID_INFORMATION">Incorrect or insufficient information</option>
                    <option value="FACILITY_REQUIREMENTS">Does not meet facility requirements</option>
                    <option value="DUPLICATE_ACCOUNT">Duplicate account</option>
                    <option value="POLICY_VIOLATION">Policy violations</option>
                    <option value="OTHER">Other reason</option>
                  </select>
                  
                  <div v-if="selectedReason === 'OTHER'" class="mt-3">
                    <label for="custom-reason" class="block text-sm font-medium text-gray-700">
                      Specify Reason
                    </label>
                    <textarea
                      id="custom-reason"
                      v-model="customReason"
                      rows="3"
                      class="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Enter rejection reason..."
                    ></textarea>
                  </div>
                  
                  <div v-if="selectedReason" class="mt-3">
                    <label for="additional-details" class="block text-sm font-medium text-gray-700">
                      Additional Details (optional)
                    </label>
                    <textarea
                      id="additional-details"
                      v-model="additionalDetails"
                      rows="3"
                      class="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add any additional details that might help the shelter understand the decision..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="confirm"
            :disabled="!selectedReason || (selectedReason === 'OTHER' && !customReason)"
          >
            Reject
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-3xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RejectionModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shelterId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      selectedReason: '',
      customReason: '',
      additionalDetails: ''
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.selectedReason = '';
        this.customReason = '';
        this.additionalDetails = '';
      }
    }
  },
  methods: {
    confirm() {
      if (!this.selectedReason || (this.selectedReason === 'OTHER' && !this.customReason)) {
        return;
      }
      
      const rejectionData = {
        reason: this.selectedReason,
        customReason: this.selectedReason === 'OTHER' ? this.customReason : null,
        details: this.additionalDetails
      };
      
      this.$emit('confirm', this.shelterId, rejectionData);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>