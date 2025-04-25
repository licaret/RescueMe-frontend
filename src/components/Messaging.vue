<template>
  <div class="flex h-screen bg-gray-100">
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
          <p class="text-sm mt-1">Start by messaging a shelter</p>
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
    
    <!-- Chat area -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Mobile toggle button for sidebar -->
      <div 
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
      </div>
      
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
          Select a conversation from the sidebar or start a new conversation by messaging a shelter
        </p>
      </div>
      
      <!-- Chat messages -->
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
            <!-- Show avatar only for first message or if sender changes -->
            <div 
              v-if="message.senderId !== currentUserId && 
                   (index === 0 || messages[index - 1].senderId !== message.senderId)"
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
              <p>{{ message.content }}</p>
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
        <div class="flex items-center space-x-2">
          <textarea
            v-model="newMessage"
            placeholder="Type your message..."
            class="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-32 resize-none"
            rows="1"
            @keydown.enter.prevent="sendMessage"
          ></textarea>
          
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim()"
            :class="[
              'p-2 rounded-full',
              newMessage.trim() 
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
  markConversationAsRead,
  getConversationMessages,
  getUserConversations,
  getConversationId
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
    
    // Filter conversations based on search
    const filteredConversations = computed(() => {
      if (!searchQuery.value) return conversations.value;
      
      const query = searchQuery.value.toLowerCase();
      return conversations.value.filter(conv => 
        conv.participantUsername.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
      );
    });
    
    const handleNewMessage = (message) => {
      console.log("📩 New message received in handleNewMessage:", message);
      
      // Dacă mesajul este pentru conversația curentă
      if (selectedConversationId.value === message.conversationId) {
        console.log("Adding message to current conversation");
        
        // Verifică duplicatele
        const messageExists = messages.value.some(m => 
          m.id === message.id || 
          (m.content === message.content && 
          m.senderId === message.senderId &&
          m.timestamp === message.timestamp)
        );
        
        if (!messageExists) {
          // Folosește assign pentru a forța reactivitatea
          messages.value = [...messages.value, message];
          // Folosește nextTick direct, nu Vue.nextTick
          nextTick(scrollToBottom);
          
          // Marchează ca citit dacă suntem destinatarul
          if (message.recipientId === currentUserId.value) {
            markConversationAsRead(message.conversationId, currentUserId.value);
          }
        }
      }
      
      // Actualizează lista de conversații
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
      
      // Find the conversation index
      const existingIndex = conversations.value.findIndex(
        conv => conv.conversationId === message.conversationId
      );
      
      if (existingIndex !== -1) {
        // Update existing conversation
        const updatedConversations = [...conversations.value];
        const existing = {...updatedConversations[existingIndex]};
        
        existing.lastMessage = message.content;
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
        updatedConversations.splice(existingIndex, 1);
        updatedConversations.unshift(existing);
        conversations.value = updatedConversations;
        
        // If this is the selected conversation, update that reference too
        if (selectedConversationId.value === message.conversationId) {
          selectedConversation.value = existing;
        }
      } else {
        // This is a new conversation we don't have yet
        fetchConversations();
      }
    };
    
    const fetchConversations = async () => {
      try {
        loading.value = true;
        
        // Verifică dacă există conversații în cache
        const cachedConversations = localStorage.getItem('cachedConversations');
        if (cachedConversations && conversations.value.length === 0) {
          try {
            // Afișează conversațiile din cache în timp ce încărcăm date noi
            conversations.value = JSON.parse(cachedConversations);
            loading.value = false;
          } catch (e) {
            console.error('Eroare la parsarea cache-ului de conversații:', e);
          }
        }
        
        // Încarcă date proaspete de la server
        const data = await getUserConversations(currentUserId.value);
        conversations.value = data;
        
        // Salvează în cache
        localStorage.setItem('cachedConversations', JSON.stringify(data));
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
      
      // Verifică cache
      const cacheKey = `messages_${conversation.conversationId}`;
      const cachedMessages = localStorage.getItem(cacheKey);
      
      // Afișează mesajele din cache imediat dacă există
      if (cachedMessages) {
        try {
          messages.value = JSON.parse(cachedMessages);
          // Continuă să încarci date proaspete în background
          fetchMessagesInBackground(conversation.conversationId);
        } catch (e) {
          console.error('Eroare la parsarea cache-ului de mesaje:', e);
          await fetchMessages(conversation.conversationId);
        }
      } else {
        // Niciun cache, încarcă normal
        await fetchMessages(conversation.conversationId);
      }
    };

    // Funcție nouă pentru încărcarea mesajelor în background
    const fetchMessagesInBackground = async (conversationId) => {
      try {
        const data = await getConversationMessages(conversationId, currentUserId.value);
        messages.value = data;
        
        // Actualizează cache-ul
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(data));
        
        // Marchează ca citite
        if (data.length > 0) {
          markConversationAsRead(conversationId, currentUserId.value);
          fetchConversations();
        }
        
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages in background:', error);
      }
    };
    
    // Send a new message
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedConversationId.value) return;
      
      const messageData = {
        senderId: currentUserId.value,
        recipientId: selectedConversation.value.participantId,
        content: newMessage.value.trim(),
        conversationId: selectedConversationId.value
      };
      
      try {
        // Optimistically add message to list
        const optimisticMessage = {
          ...messageData,
          id: `temp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
          senderUsername: localStorage.getItem('username') || 'You',
        };
        
        messages.value = [...messages.value, optimisticMessage];
        scrollToBottom();
        
        // Clear input
        newMessage.value = '';
        
        // Send message to API
        const response = await apiSendMessage(messageData);
        
        // Replace optimistic message with actual response
        const index = messages.value.findIndex(m => m.id === optimisticMessage.id);
        if (index !== -1) {
          const updatedMessages = [...messages.value];
          updatedMessages[index] = response;
          messages.value = updatedMessages;
        }
        
        // Update conversation list
        updateConversationWithMessage(response);
      } catch (error) {
        console.error('Error sending message:', error);
        // Could add error handling here, e.g. marking failed messages
      }
    };
    
    // Initialize chat with specific user if provided
    const initChat = async () => {
      if (initialRecipient.value.id) {
        try {
          const conversationId = await getConversationId(
            currentUserId.value, 
            parseInt(initialRecipient.value.id)
          );
          
          const existingConversation = conversations.value.find(
            c => c.conversationId === conversationId
          );
          
          if (existingConversation) {
            selectConversation(existingConversation);
          } else {
            // Create a temporary conversation object
            const tempConversation = {
              conversationId,
              participantId: parseInt(initialRecipient.value.id),
              participantUsername: initialRecipient.value.username || 'User',
              lastMessage: '',
              lastMessageTime: new Date().toISOString(),
              hasUnreadMessages: false,
              unreadCount: 0
            };
            
            // Add to conversations list
            conversations.value = [tempConversation, ...conversations.value];
            selectConversation(tempConversation);
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
        }
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
      
      connectToChat(
        currentUserId.value,
        () => {
          console.log('✅ Chat WebSocket connected successfully');
          
          // Store the callback removal functions
          messageCallback.value = onMessageReceived(handleNewMessage);
          readReceiptCallback.value = onReadReceipt(handleReadReceipt);
          
          // Fetch conversations
          fetchConversations().then(() => {
            if (initialRecipient.value.id || route.query.shelterId) {
              initChat();
            }
          });
        },
        (err) => console.error('❌ WebSocket error', err)
      );
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
      
      // Restabilește conversația selectată anterior, dacă există
      const lastConversationId = localStorage.getItem('lastConversationId');
      
      setTimeout(() => {
        setupChatConnection();
        
        // După încărcarea conversațiilor, restabilește selectarea
        fetchConversations().then(() => {
          if (initialRecipient.value.id || route.query.shelterId) {
            initChat();
          } else if (lastConversationId) {
            // Găsește și selectează ultima conversație deschisă
            const lastConversation = conversations.value.find(
              c => c.conversationId === lastConversationId
            );
            if (lastConversation) {
              selectConversation(lastConversation);
            }
          }
        });
      }, 200);
    });
    
    // Clean up on unmount
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      cleanupChatConnection();
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

    // Salvează conversația selectată la schimbare
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
      selectConversation,
      sendMessage,
      formatTime,
      scrollToBottom,
      fetchMessagesInBackground
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
</style>