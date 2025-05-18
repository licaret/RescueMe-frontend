<template>
  <div class="min-h-screen bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <div class="flex items-center justify-center mb-6">
          <div class="rounded-full bg-red-100 p-3">
            <svg class="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h2 class="text-center text-2xl font-bold text-gray-900 mb-6">Your Application Has Been Rejected</h2>
        
        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p class="font-medium">We're sorry, but your application to register as a shelter has been rejected.</p>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900">Rejection Reason:</h3>
          <p class="mt-1 text-gray-600">{{ formatRejectionReason(rejectionInfo.reason) }}</p>
          
          <div v-if="rejectionInfo.details" class="mt-4">
            <h3 class="text-lg font-medium text-gray-900">Additional Details:</h3>
            <p class="mt-1 text-gray-600">{{ rejectionInfo.details }}</p>
          </div>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p class="font-medium">What Can You Do Next?</p>
          <ul class="list-disc ml-5 mt-2">
            <li>Fix the issues mentioned in the rejection reason</li>
            <li>Prepare the correct and complete documentation</li>
            <li>Create a new account with the updated information</li>
          </ul>
        </div>
        
        <div class="mt-8">
            <button 
            @click="createNewAccount" 
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-3xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isDeletingAccount"
            >
            <svg v-if="isDeletingAccount" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isDeletingAccount ? 'Deleting Account...' : 'Create New Account' }}
            </button>
            
            <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ShelterRejectedPage',
  
  setup() {
    const router = useRouter()
    const rejectionInfo = ref({
      reason: '',
      details: ''
    })
    const isDeletingAccount = ref(false)
    const errorMessage = ref('')
    
    onMounted(async () => {
      const rejectionReason = localStorage.getItem('rejectionReason')
      const rejectionDetails = localStorage.getItem('rejectionDetails')
      
      if (rejectionReason) {
        rejectionInfo.value.reason = rejectionReason
      } else {
        rejectionInfo.value.reason = 'UNSPECIFIED'
      }
      
      if (rejectionDetails) {
        rejectionInfo.value.details = rejectionDetails
      }
    })
    
    const formatRejectionReason = (reason) => {
      const reasons = {
        'INCOMPLETE_DOCUMENTS': 'The provided documents are incomplete or invalid. Please ensure all required documents are complete and valid.',
        'INVALID_INFORMATION': 'The provided information is incorrect or insufficient. Please ensure all information is accurate and complete.',
        'FACILITY_REQUIREMENTS': 'The shelter does not meet the infrastructure requirements necessary to register on the platform.',
        'DUPLICATE_ACCOUNT': 'There is already an account associated with this shelter or these contact details.',
        'POLICY_VIOLATION': 'The application violates one or more of our policies.',
        'UNSPECIFIED': 'Your application does not meet our approval criteria.',
        'OTHER': rejectionInfo.value.details || 'Your application does not meet our approval criteria for other reasons.'
      }
      
      return reasons[reason] || reason
    }
    
    const createNewAccount = async () => {
        try {
            isDeletingAccount.value = true;
            errorMessage.value = '';
            
            const shelterId = localStorage.getItem('Id');
            const token = localStorage.getItem('token');
            
            if (!shelterId) {
            throw new Error('Shelter ID not found');
            }
            
            await fetch('http://localhost:8080/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
            });
            
            const response = await fetch('http://localhost:8080/api/v1/auth/delete-rejected-shelter', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ shelterId })
            });
            
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete account');
            }
            
            localStorage.clear();
            router.push('/signup');
        } catch (error) {
            console.error('Error deleting account:', error);
            errorMessage.value = `Unable to delete account: ${error.message}`;
            isDeletingAccount.value = false;
        }
        };
    
    return {
      rejectionInfo,
      formatRejectionReason,
      createNewAccount,
      isDeletingAccount,
      errorMessage
    }
  }
}
</script>