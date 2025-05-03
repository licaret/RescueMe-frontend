<template>
  <div class="flex h-screen">
    <!-- Sidebar with conversation list -->
    <div 
      :class="[
        'transition-all duration-300 bg-white border-r border-gray-200 flex flex-col',
        isMobileView && !showSidebar ? 'w-0 overflow-hidden' : 'w-full md:w-80'
      ]"
    >
      <!-- Sidebar header -->
      <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800">Messages</h2>
        <button 
          v-if="isMobileView"
          @click="showSidebar = false"
          class="md:hidden text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Search conversations -->
      <div class="p-4 border-b border-gray-200">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search conversations..." 
            class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <div class="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Conversation list -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
        
        <div v-else-if="conversations.length === 0" class="text-center p-6 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
          </svg>
          <p>No conversations yet</p>
          <!-- <p class="text-sm mt-1">Start by messaging a shelter</p> -->
        </div>
        
        <div v-else>
          <div 
            v-for="conversation in filteredConversations" 
            :key="conversation.conversationId"
            @click="selectConversation(conversation)"
            :class="[
              'p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors',
              selectedConversationId === conversation.conversationId ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
            ]"
          >
            <div class="flex items-center space-x-3">
              <!-- Profile picture -->
              <div class="relative">
                <div class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img 
                    v-if="conversation.participantProfilePicture" 
                    :src="'data:image/jpeg;base64,' + conversation.participantProfilePicture" 
                    alt="Profile"
                    class="h-full w-full object-cover"
                    @error="conversation.participantProfilePicture = null"
                  />
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <!-- Unread indicator -->
                <div 
                  v-if="conversation.hasUnreadMessages" 
                  class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                </div>
              </div>
              
              <!-- Conversation details -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ conversation.participantUsername }}
                  </h3>
                  <span class="text-xs text-gray-500">
                    {{ formatTime(conversation.lastMessageTime) }}
                  </span>
                </div>
                
                <p class="text-sm text-gray-500 truncate">
                  {{ conversation.lastMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chat area - takes full height of the screen -->
    <div class="flex-1 flex flex-col bg-white ">
      <!-- Mobile toggle button for sidebar -->
      <!-- <div 
        v-if="isMobileView && !showSidebar && selectedConversation" 
        class="md:hidden p-2 bg-gray-50 border-b border-gray-200"
      >
        <button 
          @click="showSidebar = true"
          class="flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All conversations
        </button>
      </div> -->
      
      <!-- Header -->
      <div v-if="selectedConversation" class="p-4 border-b border-gray-200 flex items-center bg-white shadow-sm">
        <button 
          v-if="isMobileView && !showSidebar"
          @click="showSidebar = true"
          class="md:hidden mr-3 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div class="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          <img 
            v-if="selectedConversation.participantProfilePicture" 
            :src="'data:image/jpeg;base64,' + selectedConversation.participantProfilePicture" 
            alt="Profile"
            class="h-full w-full object-cover"
            @error="selectedConversation.participantProfilePicture = null"
          />
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedConversation.participantUsername }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ selectedConversation.participantRole === 1 ? 'Adopter' : 'Shelter' }}
          </p>
        </div>
      </div>
      
      <!-- Empty state if no conversation selected -->
      <div v-if="!selectedConversation" class="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
        </svg>
        <h3 class="text-xl font-medium text-gray-700 mb-2">No conversation selected</h3>
        <p class="text-gray-500 text-center max-w-md">
          Select a conversation from the sidebar or start a new conversation
        </p>
      </div>
      
      <!-- Chat messages - takes all available space, only scrolls within message area -->
      <div 
        v-else
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
      >
        <div v-if="loadingMessages" class="flex justify-center items-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
        
        <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No messages yet</h3>
          <p class="text-gray-500 text-center max-w-md">
            Start the conversation by sending a message below
          </p>
        </div>
        
        <template v-else>
          <div 
            v-for="(message, index) in messages" 
            :key="message.id"
            :class="[
              'flex',
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- Show avatar -->
            <div 
              v-if="message.senderId !== currentUserId"
              class="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mr-2"
            >
              <img 
                v-if="message.senderProfilePicture" 
                :src="'data:image/jpeg;base64,' + message.senderProfilePicture" 
                alt="Profile"
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                {{ message.senderUsername ? message.senderUsername.charAt(0).toUpperCase() : '?' }}
              </div>
            </div>
            
            <div
              :class="[
                'max-w-3/4 px-4 py-2 rounded-2xl',
                message.senderId === currentUserId 
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              ]"
            >
              <!-- Text content -->
              <p v-if="message.content">{{ message.content }}</p>
              
              <!-- Attachments -->
              <div v-if="message.attachments && message.attachments.length > 0" class="mt-2 space-y-2">
                <!-- Images - clickable for full-screen view -->
                <div v-for="attachment in message.attachments.filter(a => a.contentType && a.contentType.startsWith('image/'))" 
                     :key="attachment.id" 
                     class="relative">
                     <img
                        v-if="attachment.hasThumbnail"
                        :src="getAttachmentThumbnailUrl(attachment.id)"
                        @click="openAttachment(attachment)"
                        class="max-w-full rounded max-h-40 border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer pointer-events-auto"
                        :alt="attachment.fileName"
                     />
                  <div v-else 
                       @click="openAttachment(attachment)"
                       class="flex items-center justify-center bg-gray-100 rounded p-3 cursor-pointer border border-gray-200 hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ attachment.fileName }}</span>
                  </div>
                </div>
                
                <!-- Files/Documents -->
                <div v-for="attachment in message.attachments.filter(a => !a.contentType || !a.contentType.startsWith('image/'))" 
                     :key="attachment.id" 
                     @click="openAttachment(attachment)"
                     class="flex items-center p-2 border rounded bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div class="flex-grow min-w-0">
                    <div class="text-sm font-medium truncate" :class="message.senderId === currentUserId ? 'text-indigo-400' : 'text-gray-700'">
                      {{ attachment.fileName }}
                    </div>
                    <div class="text-xs" :class="message.senderId === currentUserId ? 'text-indigo-400' : 'text-gray-500'">
                      {{ formatFileSize(attachment.fileSize) }}
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
              
              <!-- Timestamp and read status -->
              <div 
                :class="[
                  'text-xs mt-1 flex items-center space-x-1',
                  message.senderId === currentUserId ? 'text-indigo-100' : 'text-gray-400'
                ]"
              >
                <span>{{ formatTime(message.timestamp) }}</span>
                <span v-if="message.senderId === currentUserId">
                  <svg v-if="message.read" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
      
      <!-- Message input -->
      <div v-if="selectedConversation" class="border-t border-gray-200 bg-white p-4">
        <div class="mb-2" v-if="selectedFiles.length > 0">
          <div class="flex flex-wrap gap-2">
            <div v-for="(file, index) in selectedFiles" :key="index" class="relative bg-gray-100 rounded-lg p-2 flex items-center">
              <span class="text-xs truncate max-w-32">{{ file.name }}</span>
              <button @click="removeSelectedFile(index)" class="ml-2 text-gray-500 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <textarea
            v-model="newMessage"
            placeholder="Type your message..."
            class="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-32 resize-none"
            rows="1"
            @keydown.enter.prevent="sendMessage"
          ></textarea>
          
          <!-- File upload button -->
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            multiple 
            class="hidden" 
          />
          
          <button
            @click="$refs.fileInput.click()"
            class="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            title="Attach files"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <button
            @click="sendMessage"
            :disabled="!canSendMessage"
            :class="[
              'p-2 rounded-full',
              canSendMessage 
                ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Image preview modal with consistent dimensions -->
    <div v-if="previewAttachment && previewAttachment.contentType && previewAttachment.contentType.startsWith('image/')" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" 
        @click="previewAttachment = null">
      <div class="max-w-6xl max-h-full p-4" @click.stop>
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
          <!-- Image preview container with fixed height and width -->
          <div class="relative flex items-center justify-center" style="height: 70vh;">
            <img :src="getAttachmentDownloadUrl(previewAttachment.id)" 
              class="h-full w-full object-contain" 
              :alt="previewAttachment.fileName" />
            
            <!-- Close button -->
            <button @click.stop="previewAttachment = null" 
                    class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Image info and download button -->
          <div class="p-4 bg-white">
            <p class="font-medium">{{ previewAttachment.fileName }}</p>
            <div class="text-sm text-gray-500">{{ formatFileSize(previewAttachment.fileSize) }}</div>
            
            <div class="mt-4 flex justify-end">
              <!-- Download button -->
              <a :href="getAttachmentDownloadUrl(previewAttachment.id)" 
                :download="previewAttachment.fileName" 
                class="px-4 py-2 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 inline-flex items-center transition duration-200 ease-in-out"
                @click.stop>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save to device
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { 
  connectToChat,
  disconnectFromChat,
  onMessageReceived,
  onReadReceipt,
  sendMessage as apiSendMessage,
  sendMessageWithAttachments as apiSendMessageWithAttachments,
  markConversationAsRead,
  getConversationMessages,
  getUserConversations,
  getConversationId,
  getAttachmentThumbnailUrl,
  getAttachmentDownloadUrl
} from '@/services/message_service';

export default {
  name: 'Messaging',
  props: {
    initialRecipientId: {
      type: [Number, String],
      default: null
    },
    initialRecipientUsername: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const route = useRoute();
    
    // State
    const currentUserId = ref(null);
    const conversations = ref([]);
    const messages = ref([]);
    const selectedConversationId = ref(null);
    const selectedConversation = ref(null);
    const newMessage = ref('');
    const loading = ref(true);
    const loadingMessages = ref(false);
    const messagesContainer = ref(null);
    const searchQuery = ref('');
    const isMobileView = ref(window.innerWidth < 768);
    const showSidebar = ref(true);
    const messageCallback = ref(null);
    const readReceiptCallback = ref(null);
    const fileInput = ref(null);
    const selectedFiles = ref([]);
    const previewAttachment = ref(null);

    const initialRecipient = ref({
      id: props.initialRecipientId,
      username: props.initialRecipientUsername
    });
    
    // Get current user from localStorage
    const initUser = () => {
      const userId = localStorage.getItem('Id');
      if (userId) {
        currentUserId.value = parseInt(userId);
      } else {
        // Redirect to login if not logged in
        window.location.href = '/login';
      }
    };
    
    // Handle window resize for responsive layout
    const handleResize = () => {
      isMobileView.value = window.innerWidth < 768;
      if (!isMobileView.value) {
        showSidebar.value = true;
      }
    };
    
    // Set up WebSocket connection and listeners
    const setupChatConnection = () => {
  if (!currentUserId.value) return;
  
  console.log("Setting up chat connection for user:", currentUserId.value);
  
  return new Promise((resolve) => {
    connectToChat(
      currentUserId.value,
      async () => {
        console.log('✅ Chat WebSocket connected successfully');
        
        messageCallback.value = onMessageReceived(handleNewMessage);
        readReceiptCallback.value = onReadReceipt(handleReadReceipt);
        
        await fetchConversations();  // Așteaptă să se încarce conversațiile
        resolve(); // Rezolvăm promisiunea când conexiunea este stabilită
      },
      (err) => {
        console.error('❌ WebSocket error', err);
        resolve(); // Rezolvăm promisiunea chiar și în caz de eroare
      }
    );
  });
};

    
    // Cleanup WebSocket connection and listeners
    const cleanupChatConnection = () => {
      console.log("Cleaning up chat connection");
      
      // Remove callbacks
      if (messageCallback.value) {
        messageCallback.value();
        messageCallback.value = null;
      }
      
      if (readReceiptCallback.value) {
        readReceiptCallback.value();
        readReceiptCallback.value = null;
      }
    };
    
    onMounted(() => {
      initUser();
      window.addEventListener('resize', handleResize);
      
      // Adăugăm event listener pentru actualizarea conversațiilor
      window.addEventListener('refresh-conversations', handleRefreshConversations);
      
      setupChatConnection().then(() => {
        if (initialRecipient.value.id || route.query.shelterId) {
          initChat();
        }
      });
    });

    // Funcția pentru actualizarea conversațiilor
    const handleRefreshConversations = () => {
      console.log("🔄 Refresh conversations event received");
      fetchConversations();
    };
    
    // Clean up on unmount
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('refresh-conversations', handleRefreshConversations);
      cleanupChatConnection();
      disconnectFromChat();
    });
    
    // Watch for changes in selected conversation
    watch(selectedConversationId, (newId) => {
      if (newId) {
        const conversation = conversations.value.find(c => c.conversationId === newId);
        if (conversation) {
          selectedConversation.value = conversation;
        }
      } else {
        selectedConversation.value = null;
      }
    });
    
    // Watch for route query parameter changes
    watch(() => route.query.shelterId, (newShelterId) => {
      if (newShelterId && currentUserId.value) {
        initialRecipient.value.id = newShelterId;
        initialRecipient.value.username = route.query.shelterName || null;
        initChat();
      }
    });

    // Save selected conversation on change
    watch(selectedConversationId, (newId) => {
      if (newId) {
        localStorage.setItem('lastConversationId', newId);
        const conversation = conversations.value.find(c => c.conversationId === newId);
        if (conversation) {
          selectedConversation.value = conversation;
        }
      } else {
        selectedConversation.value = null;
      }
    });

    // Filter conversations based on search
    const filteredConversations = computed(() => {
      if (!searchQuery.value) return conversations.value;
      
      const query = searchQuery.value.toLowerCase();
      return conversations.value.filter(conv => 
        conv.participantUsername.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
      );
    });
    
    // Check if can send message (text or files)
    const canSendMessage = computed(() => {
      return newMessage.value.trim() !== '' || selectedFiles.value.length > 0;
    });
    
    const handleNewMessage = (message) => {
      console.log("📩 New message received in handleNewMessage:", message);
      
      // If the message is for the current conversation
      if (selectedConversationId.value === message.conversationId) {
        console.log("Adding message to current conversation");
        
        // Check for duplicates
        const messageExists = messages.value.some(m => 
          m.id === message.id || 
          (m.content === message.content && 
          m.senderId === message.senderId &&
          m.timestamp === message.timestamp)
        );
        
        if (!messageExists) {
          // Use assign to force reactivity
          messages.value = [...messages.value, message];
          // Use nextTick directly, not Vue.nextTick
          nextTick(scrollToBottom);
          
          // Mark as read if we are the recipient
          if (message.recipientId === currentUserId.value) {
            markConversationAsRead(message.conversationId, currentUserId.value);
          }
        }
      }
      
      // Update the conversation list
      updateConversationWithMessage(message);
    };
    
    // Handle read receipts
    const handleReadReceipt = (receipt) => {
      console.log("📬 Read receipt received:", receipt);
      
      // Update read status of messages in current conversation
      if (selectedConversationId.value === receipt.conversationId) {
        messages.value = messages.value.map(msg => {
          if (msg.senderId === currentUserId.value && !msg.read) {
            return { ...msg, read: true };
          }
          return msg;
        });
      }
      
      // Update conversation list to remove unread flags
      fetchConversations();
    };
    
    // Update or add a conversation with a new message
    const updateConversationWithMessage = (message) => {
  console.log("Updating conversation with message:", message);
  
  // Check if this is a new conversation that doesn't exist yet
  const existingConversationIndex = conversations.value.findIndex(
    conv => conv.conversationId === message.conversationId
  );
  
  // If it's a completely new conversation, fetch all conversations
  if (existingConversationIndex === -1) {
    console.log("New conversation detected, refreshing conversation list");
    fetchConversations();
    return;
  }
  
  // Find the conversation index
  const updatedConversations = [...conversations.value];
  const existing = {...updatedConversations[existingConversationIndex]};
  
  // Format message preview based on type
  let lastMessagePreview = message.content;
  if (message.type !== 'TEXT' && message.attachments && message.attachments.length > 0) {
    const attachmentCount = message.attachments.length;
    
    switch (message.type) {
      case 'IMAGE':
        lastMessagePreview = attachmentCount > 1 
          ? `📷 ${attachmentCount} images` 
          : '📷 Image';
        break;
      case 'DOCUMENT':
        lastMessagePreview = attachmentCount > 1 
          ? `📄 ${attachmentCount} documents` 
          : '📄 Document';
        break;
      case 'MIXED':
        lastMessagePreview = `📎 ${attachmentCount} attachments`;
        break;
    }
    
    if (message.content && message.content.trim() !== '') {
      lastMessagePreview = `${message.content} [${lastMessagePreview}]`;
    }
  }
  
  existing.lastMessage = lastMessagePreview;
  existing.lastMessageTime = message.timestamp;
  
  // Update unread count if current user is the recipient
  if (message.recipientId === currentUserId.value) {
    // Only increment if not currently viewing this conversation
    if (selectedConversationId.value !== message.conversationId) {
      existing.unreadCount = (existing.unreadCount || 0) + 1;
      existing.hasUnreadMessages = true;
    }
  }
  
  // Remove existing and add to the beginning for proper sorting
  updatedConversations.splice(existingConversationIndex, 1);
  updatedConversations.unshift(existing);
  conversations.value = updatedConversations;
  
  // If this is the selected conversation, update that reference too
  if (selectedConversationId.value === message.conversationId) {
    selectedConversation.value = existing;
  }
};
    
const fetchConversations = async () => {
  try {
    loading.value = true;
    
    // Check if there are conversations in cache
    const cachedConversations = localStorage.getItem('cachedConversations');
    if (cachedConversations && conversations.value.length === 0) {
      try {
        // Display conversations from cache while loading new data
        conversations.value = JSON.parse(cachedConversations);
        loading.value = false;
      } catch (e) {
        console.error('Error parsing conversation cache:', e);
      }
    }
    
    // Load fresh data from server
    const data = await getUserConversations(currentUserId.value);
    
    // Păstrăm selecția conversației curente
    const currentSelectedId = selectedConversationId.value;
    
    conversations.value = data;
    
    // Save to cache
    localStorage.setItem('cachedConversations', JSON.stringify(data));
    
    // Dacă aveam o conversație selectată, dar acum nu mai este în listă (e.g. după refresh)
    // și conversația temporară nu mai există, trebuie să găsim și să selectăm din nou
    if (currentSelectedId && !conversations.value.find(c => c.conversationId === currentSelectedId)) {
      const tempConversation = selectedConversation.value;
      if (tempConversation) {
        const newMatchingConversation = conversations.value.find(
          c => c.participantId === tempConversation.participantId
        );
        
        if (newMatchingConversation) {
          selectConversation(newMatchingConversation);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
  } finally {
    loading.value = false;
  }
};
    
    // Scroll to bottom of messages
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };
    
    // Format timestamp to a human-readable time
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isToday = date.toDateString() === now.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (isYesterday) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    };
    
    // Format file size to human-readable format
    const formatFileSize = (sizeInBytes) => {
      if (!sizeInBytes) return '0 B';
      
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = sizeInBytes;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    };
    
    // Fetch messages for the selected conversation
    const fetchMessages = async (conversationId) => {
      try {
        loadingMessages.value = true;
        const data = await getConversationMessages(conversationId, currentUserId.value);
        messages.value = data;
        
        // Mark conversation as read
        if (data.length > 0) {
          markConversationAsRead(conversationId, currentUserId.value);
          
          // Update conversation list to reflect read status
          fetchConversations();
        }
        
        // Scroll to bottom
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        loadingMessages.value = false;
      }
    };
    
    // Select a conversation
    const selectConversation = async (conversation) => {
      selectedConversationId.value = conversation.conversationId;
      selectedConversation.value = conversation;
      
      if (isMobileView.value) {
        showSidebar.value = false;
      }
      
      // Check cache
      const cacheKey = `messages_${conversation.conversationId}`;
      const cachedMessages = localStorage.getItem(cacheKey);
      
      // Display cached messages immediately if they exist
      if (cachedMessages) {
        try {
          messages.value = JSON.parse(cachedMessages);
          // Continue loading fresh data in the background
          fetchMessagesInBackground(conversation.conversationId);
        } catch (e) {
          console.error('Error parsing message cache:', e);
          await fetchMessages(conversation.conversationId);
        }
      } else {
        // No cache, load normally
        await fetchMessages(conversation.conversationId);
      }
    };

    // New function for loading messages in background
    const fetchMessagesInBackground = async (conversationId) => {
      try {
        const data = await getConversationMessages(conversationId, currentUserId.value);
        messages.value = data;
        
        // Update cache
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(data));
        
        // Mark as read
        if (data.length > 0) {
          markConversationAsRead(conversationId, currentUserId.value);
          fetchConversations();
        }
        
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages in background:', error);
      }
    };
    
    // Handle file selection
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files);
      
      if (files.length === 0) return;
      
      // Check total size (max 10MB)
      const totalSize = files.reduce((total, file) => total + file.size, 0);
      const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB
      
      if (totalSize > MAX_TOTAL_SIZE) {
        alert('Total file size cannot exceed 10MB');
        event.target.value = null; // Reset input
        return;
      }
      
      // Add selected files
      selectedFiles.value = [...selectedFiles.value, ...files];
      
      // Reset input to allow selecting the same files again
      event.target.value = null;
    };
    
    // Remove a selected file
    const removeSelectedFile = (index) => {
      const newFiles = [...selectedFiles.value];
      newFiles.splice(index, 1);
      selectedFiles.value = newFiles;
    };
    
    // Open attachment
    const openAttachment = (attachment) => {
      console.log('Opening attachment:', attachment);
      
      // Add defensive checks
      if (!attachment || !attachment.id) {
        console.error('Invalid attachment data:', attachment);
        return;
      }
      
      // For images, display in modal
      if (attachment.contentType && attachment.contentType.startsWith('image/')) {
        previewAttachment.value = {...attachment}; // Create a copy to avoid reference issues
      } else {
        // For documents, download directly
        const url = getAttachmentDownloadUrl(attachment.id);
        window.open(url, '_blank');
      }
    };
    
    // Send a new message
    const sendMessage = async () => {
  if (!canSendMessage.value || !selectedConversationId.value) return;
  
  try {
    // Build message data
    const messageData = {
      senderId: currentUserId.value,
      recipientId: selectedConversation.value.participantId,
      content: newMessage.value.trim(),
      conversationId: selectedConversationId.value,
      type: 'TEXT'
    };
    
    // Determine if we're sending a simple message or with attachments
    if (selectedFiles.value.length > 0) {
      // Display an optimistic message
      const optimisticMessage = {
        ...messageData,
        id: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        senderUsername: localStorage.getItem('username') || 'You',
        attachments: selectedFiles.value.map((file, index) => ({
          id: `temp-attachment-${index}`,
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
          hasThumbnail: file.type.startsWith('image/')
        })),
        type: determineMessageType(selectedFiles.value)
      };
      
      messages.value = [...messages.value, optimisticMessage];
      scrollToBottom();
      
      // Send message with attachments
      const response = await apiSendMessageWithAttachments(messageData, selectedFiles.value);
      
      // Replace optimistic message with real response
      const index = messages.value.findIndex(m => m.id === optimisticMessage.id);
      if (index !== -1) {
        const updatedMessages = [...messages.value];
        updatedMessages[index] = response;
        messages.value = updatedMessages;
      }
      
      // Update conversation list
      updateConversationWithMessage(response);
      
      // Refresh conversations to ensure the new one appears
      await fetchConversations();
      
      // Reset selected files
      selectedFiles.value = [];
    } else {
      // Send a simple text message
      const optimisticMessage = {
        ...messageData,
        id: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        senderUsername: localStorage.getItem('username') || 'You',
      };
      
      messages.value = [...messages.value, optimisticMessage];
      scrollToBottom();
      
      const response = await apiSendMessage(messageData);
      
      // Replace optimistic message with real response
      const index = messages.value.findIndex(m => m.id === optimisticMessage.id);
      if (index !== -1) {
        const updatedMessages = [...messages.value];
        updatedMessages[index] = response;
        messages.value = updatedMessages;
      }
      
      // Update conversation list
      updateConversationWithMessage(response);
      
      // Refresh conversations to ensure the new one appears
      await fetchConversations();
    }
    
    // Clear message input
    newMessage.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
    // Here we can add error handling, for example, marking failed messages
  }
};
    
    // Determine message type based on attachments
    const determineMessageType = (files) => {
      if (files.length === 0) return 'TEXT';
      
      const hasImages = files.some(file => file.type.startsWith('image/'));
      const hasDocs = files.some(file => !file.type.startsWith('image/'));
      
      if (hasImages && hasDocs) return 'MIXED';
      if (hasImages) return 'IMAGE';
      return 'DOCUMENT';
    };
    
    // Initialize chat with specific user if provided
    const initChat = async () => {
  // Asigură-te că userID-ul și ID-ul recipientului sunt disponibile
  if (!currentUserId.value) {
    console.error("Current user ID is not available");
    return;
  }
  
  const recipientId = initialRecipient.value.id || route.query.shelterId;
  if (!recipientId) {
    console.error("No recipient ID provided");
    return;
  }

  try {
    console.log("Initializing chat with recipient:", recipientId);
    
    // Încercăm să găsim o conversație existentă
    const existingConversation = conversations.value.find(
      c => c.participantId === parseInt(recipientId)
    );

    if (existingConversation) {
      console.log("Found existing conversation:", existingConversation);
      selectConversation(existingConversation);
      return;
    }

    // Dacă nu există, obținem/creăm un ID de conversație
    console.log("Creating new conversation with:", recipientId);
    const conversationId = await getConversationId(
      currentUserId.value, 
      parseInt(recipientId)
    );

    // Verificăm din nou conversațiile (ar putea fi actualizate între timp)
    const existingById = conversations.value.find(
      c => c.conversationId === conversationId
    );

    if (existingById) {
      console.log("Found conversation by ID:", existingById);
      selectConversation(existingById);
    } else {
      // Obținem profilul shelterului pentru poza de profil
      let shelterData = null;
      try {
        const response = await fetch(`http://localhost:8080/users/${recipientId}`);
        if (response.ok) {
          shelterData = await response.json();
        }
      } catch (err) {
        console.warn("Could not fetch shelter profile data:", err);
      }
      
      // Creăm o nouă conversație temporară
      console.log("Creating temporary conversation with ID:", conversationId);
      const recipientUsername = initialRecipient.value.username || 
                               route.query.shelterName || 
                               'User';
                               
      const tempConversation = {
        conversationId,
        participantId: parseInt(recipientId),
        participantUsername: recipientUsername,
        participantRole: 2, // Presupunem că e shelter
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        hasUnreadMessages: false,
        unreadCount: 0,
        participantProfilePicture: shelterData?.profilePicture || null
      };
      
      // Adăugăm conversația temporară la lista
      conversations.value = [tempConversation, ...conversations.value];
      selectConversation(tempConversation);
      
      // Actualizăm lista de conversații după ce am creat una nouă
      fetchConversations();
    }
  } catch (error) {
    console.error('Error initializing chat:', error);
  }
};

    
    return {
      currentUserId,
      conversations,
      messages,
      selectedConversationId,
      selectedConversation,
      filteredConversations,
      newMessage,
      loading,
      loadingMessages,
      messagesContainer,
      searchQuery,
      isMobileView,
      showSidebar,
      fileInput,
      selectedFiles,
      previewAttachment,
      canSendMessage,
      selectConversation,
      sendMessage,
      formatTime,
      formatFileSize,
      scrollToBottom,
      handleFileSelect,
      removeSelectedFile,
      openAttachment,
      getAttachmentThumbnailUrl,
      getAttachmentDownloadUrl,
      initChat,
      handleRefreshConversations
    };
  }
}
</script>

<style scoped>
.max-w-3\/4 {
  max-width: 75%;
}

/* Hide scrollbar but maintain functionality */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* Animation for new messages */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex.justify-end > div,
.flex.justify-start > div {
  animation: fadeIn 0.2s ease-out forwards;
}

/* File upload previews */
.max-w-32 {
  max-width: 8rem;
}

/* Add these styles to ensure your modal displays correctly */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

/* .modal-image {
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain;
} */

.object-contain {
  object-fit: contain;
}
</style>