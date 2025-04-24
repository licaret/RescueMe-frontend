<template>
    <div>
      <button
        @click="openMessageModal"
        class="flex items-center text-sm px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
        </svg>
        {{ buttonText || 'Message Shelter' }}
      </button>
  
      <!-- Message Modal -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="showModal = false"></div>
        
        <!-- Modal Content -->
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-10">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-800">
                Message to {{ shelterName }}
              </h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div v-if="petInfo" class="bg-gray-50 p-3 rounded-lg mb-4 flex items-center">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 mr-3">
                <img 
                  v-if="petInfo.photoUrl" 
                  :src="petInfo.photoUrl" 
                  :alt="petInfo.name" 
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ petInfo.name }}</p>
                <p class="text-sm text-gray-600">{{ petInfo.breed || 'Pet' }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                v-model="messageText"
                rows="5"
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            
            <div v-if="error" class="mb-4 bg-red-50 text-red-700 p-3 rounded-lg">
              {{ error }}
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                @click="showModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="sendMessage"
                :disabled="sending || !messageText.trim()"
                :class="[
                  'px-4 py-2 rounded-lg text-white',
                  sending || !messageText.trim() 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                ]"
              >
                <span v-if="sending">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
                <span v-else>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { sendMessage, getConversationId } from '@/services/message_service';
  
  export default {
    name: 'MessageShelterButton',
    props: {
      shelterId: {
        type: [Number, String],
        required: true
      },
      shelterName: {
        type: String,
        default: 'Shelter'
      },
      petInfo: {
        type: Object,
        default: null
      },
      buttonText: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const router = useRouter();
      
      const showModal = ref(false);
      const messageText = ref('');
      const sending = ref(false);
      const error = ref('');
      
      const defaultMessageText = computed(() => {
        if (!props.petInfo) return '';
        
        return `Hello, I'm interested in adopting ${props.petInfo.name}. Could you please provide more information?`;
      });
      
      const openMessageModal = () => {
        const userId = localStorage.getItem('Id');
        
        if (!userId) {
          // Redirect to login if not logged in
          router.push('/login?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath));
          return;
        }
        
        showModal.value = true;
        if (!messageText.value && props.petInfo) {
          messageText.value = defaultMessageText.value;
        }
      };
      
      const sendMessage = async () => {
        if (!messageText.value.trim()) return;
        
        const userId = localStorage.getItem('Id');
        if (!userId) {
          error.value = 'You must be logged in to send messages.';
          return;
        }
        
        try {
          sending.value = true;
          error.value = '';
          
          // Get a conversation ID
          const conversationId = await getConversationId(
            parseInt(userId), 
            parseInt(props.shelterId)
          );
          
          // Prepare message data
          const messageData = {
            senderId: parseInt(userId),
            recipientId: parseInt(props.shelterId),
            content: messageText.value.trim(),
            conversationId: conversationId
          };
          
          // Send the message
          await sendMessage(messageData);
          
          // Close modal and reset form
          showModal.value = false;
          messageText.value = '';
          
          // Navigate to messages page
          router.push('/messages');
        } catch (err) {
          console.error('Error sending message:', err);
          error.value = 'Failed to send message. Please try again.';
        } finally {
          sending.value = false;
        }
      };
      
      return {
        showModal,
        messageText,
        sending,
        error,
        openMessageModal,
        sendMessage
      };
    }
  }
  </script>